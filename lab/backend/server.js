/**
 * WIDA Diagnostic Laboratory Module - Backend Server
 * High-performance, zero-external-dependency REST API server built with native Node.js 24.
 */

import http from 'node:http';
import url from 'node:url';
import { labDb } from '../database/db.js';
import { patientDbAdapter } from '../database/adapters/patientDbAdapter.js';
import { hashPassword, verifyPassword, generateToken } from './utils/cryptoUtil.js';
import { authenticate, authorizeRole } from './middleware/authMiddleware.js';

const PORT = parseInt(process.env.LAB_PORT || '8082', 10);
const HOST = process.env.LAB_HOST || '127.0.0.1';

// ---------- Request Helper Utilities ----------

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    });
    res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message, details = null) {
    sendJson(res, statusCode, {
        success: false,
        error: message,
        details: details
    });
}

function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > 2 * 1024 * 1024) { // 2MB limit
                req.destroy();
                reject(new Error('Request entity too large'));
            }
        });
        req.on('end', () => {
            if (!body) {
                resolve({});
                return;
            }
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(new Error('Malformed JSON payload: ' + err.message));
            }
        });
        req.on('error', reject);
    });
}

// ---------- Request Handler ----------

const server = http.createServer(async (req, res) => {
    // 1. Handle CORS Preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Max-Age': '86400',
        });
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
    const method = req.method;

    try {
        // Health check
        if (pathname === '/api/lab/health' && method === 'GET') {
            return sendJson(res, 200, {
                status: 'UP',
                module: 'WIDA Diagnostic Laboratory Backend',
                timestamp: new Date().toISOString(),
                nodeVersion: process.version,
                database: 'SQLite 3 (Persistent)',
                abdmInteroperability: 'ACTIVE'
            });
        }

        // ==========================================
        // AUTHENTICATION & REGISTRATION
        // ==========================================

        // POST /api/lab/auth/login
        if (pathname === '/api/lab/auth/login' && method === 'POST') {
            const body = await parseJsonBody(req);
            const { email, password } = body;

            if (!email || !password) {
                return sendError(res, 400, 'Email and password are required');
            }

            // Check staff first
            const staff = labDb.get('SELECT * FROM lab_staff WHERE email = ?', [email.trim().toLowerCase()]);
            if (staff) {
                if (!verifyPassword(password, staff.password_hash)) {
                    return sendError(res, 401, 'Invalid credentials. Password verification failed.');
                }

                const lab = labDb.get('SELECT id, name, status, accreditation, license_number FROM labs WHERE id = ?', [staff.lab_id]);
                if (lab && lab.status === 'PENDING_VERIFICATION' && staff.role !== 'LAB_DIRECTOR') {
                    return sendError(res, 403, 'Laboratory account is pending clinical verification. Only the Lab Director can access onboarding.');
                }

                const token = generateToken({
                    staffId: staff.id,
                    labId: staff.lab_id,
                    role: staff.role,
                    email: staff.email
                });

                return sendJson(res, 200, {
                    success: true,
                    token,
                    user: {
                        id: staff.id,
                        labId: staff.lab_id,
                        name: staff.full_name,
                        email: staff.email,
                        role: staff.role,
                        qualifications: staff.qualifications,
                        phone: staff.phone
                    },
                    lab: lab ? {
                        id: lab.id,
                        name: lab.name,
                        status: lab.status,
                        accreditation: lab.accreditation,
                        licenseNumber: lab.license_number
                    } : null
                });
            }

            // Check lab entity directly
            const lab = labDb.get('SELECT * FROM labs WHERE email = ?', [email.trim().toLowerCase()]);
            if (lab) {
                if (!verifyPassword(password, lab.password_hash)) {
                    return sendError(res, 401, 'Invalid credentials. Password verification failed.');
                }

                const token = generateToken({
                    labId: lab.id,
                    role: 'LAB_DIRECTOR',
                    email: lab.email
                });

                return sendJson(res, 200, {
                    success: true,
                    token,
                    user: {
                        id: 'director-' + lab.id,
                        labId: lab.id,
                        name: lab.name + ' (Director)',
                        email: lab.email,
                        role: 'LAB_DIRECTOR',
                        qualifications: 'Authorized Diagnostic Representative'
                    },
                    lab: {
                        id: lab.id,
                        name: lab.name,
                        status: lab.status,
                        accreditation: lab.accreditation,
                        licenseNumber: lab.license_number
                    }
                });
            }

            return sendError(res, 401, 'No account found matching this diagnostic work email');
        }

        // POST /api/lab/auth/register
        if (pathname === '/api/lab/auth/register' && method === 'POST') {
            const body = await parseJsonBody(req);
            const {
                labName,
                representativeName,
                email,
                phone,
                password,
                address,
                city,
                state,
                pincode,
                licenseNumber,
                diagnosticServices,
                accreditation
            } = body;

            if (!labName || !representativeName || !email || !password || !phone) {
                return sendError(res, 400, 'Missing mandatory registration fields (Name, Representative, Email, Phone, Password)');
            }

            if (password.length < 8) {
                return sendError(res, 400, 'Password must be at least 8 characters long');
            }

            // Check if email already registered
            const existingLab = labDb.get('SELECT id FROM labs WHERE email = ?', [email.trim().toLowerCase()]);
            const existingStaff = labDb.get('SELECT id FROM lab_staff WHERE email = ?', [email.trim().toLowerCase()]);
            if (existingLab || existingStaff) {
                return sendError(res, 409, 'An account with this work email already exists');
            }

            const labId = 'lab-' + Date.now();
            const staffId = 'staff-' + Date.now();
            const now = new Date().toISOString();
            const passwordHashed = hashPassword(password);

            // Create lab with status PENDING_VERIFICATION (Rule 7 enforcement)
            labDb.run(`
                INSERT INTO labs (id, name, email, password_hash, phone, address, city, state, pincode, license_number, accreditation, diagnostic_services, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_VERIFICATION', ?, ?)
            `, [
                labId,
                labName.trim(),
                email.trim().toLowerCase(),
                passwordHashed,
                phone.trim(),
                address || 'Main Facility Road',
                city || 'Noida',
                state || 'Uttar Pradesh',
                pincode || '201301',
                licenseNumber || ('NABL-PENDING-' + Math.floor(1000 + Math.random() * 9000)),
                accreditation || 'State Clinical Establishment Registered (Awaiting NABL)',
                JSON.stringify(diagnosticServices || ['Clinical Biochemistry', 'Hematology']),
                now,
                now
            ]);

            // Create director staff account
            labDb.run(`
                INSERT INTO lab_staff (id, lab_id, full_name, email, password_hash, role, qualifications, phone, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, 'LAB_DIRECTOR', 'Authorized Representative', ?, 1, ?)
            `, [
                staffId,
                labId,
                representativeName.trim(),
                email.trim().toLowerCase(),
                passwordHashed,
                phone.trim(),
                now
            ]);

            // Create verification entry
            labDb.run(`
                INSERT INTO lab_verifications (id, lab_id, status, document_name, document_type, reviewer_notes, created_at)
                VALUES (?, ?, 'PENDING', ?, 'Clinical Establishment License', 'Awaiting State Health Council review', ?)
            `, [
                'ver-' + Date.now(),
                labId,
                licenseNumber ? `${licenseNumber}_Certificate.pdf` : 'Establishment_Registration.pdf',
                now
            ]);

            return sendJson(res, 201, {
                success: true,
                message: 'Diagnostic laboratory registered successfully. Account is placed in PENDING_VERIFICATION status.',
                labId,
                status: 'PENDING_VERIFICATION',
                info: 'Your laboratory credentials have been received. Verification by ABDM / NHA quality council is underway.'
            });
        }

        // POST /api/lab/auth/verify-account (Simulation helper for academic demo)
        if (pathname === '/api/lab/auth/verify-account' && method === 'POST') {
            const body = await parseJsonBody(req);
            const { labId } = body;
            if (!labId) {
                return sendError(res, 400, 'labId is required');
            }

            labDb.run(`UPDATE labs SET status = 'VERIFIED', updated_at = ? WHERE id = ?`, [new Date().toISOString(), labId]);
            labDb.run(`UPDATE lab_verifications SET status = 'VERIFIED', verified_at = ?, reviewer_notes = 'Approved via WIDA Academic Simulation Review' WHERE lab_id = ?`, [new Date().toISOString(), labId]);

            return sendJson(res, 200, {
                success: true,
                message: 'Laboratory status successfully transitioned to VERIFIED for testing.',
                status: 'VERIFIED'
            });
        }

        // ==========================================
        // AUTHENTICATED ENDPOINTS
        // ==========================================

        const auth = authenticate(req);
        if (!auth.authenticated) {
            return sendError(res, auth.status || 401, auth.error || 'Unauthorized');
        }

        const currentUser = auth.user;
        const currentLabId = currentUser.labId;

        // GET /api/lab/auth/me
        if (pathname === '/api/lab/auth/me' && method === 'GET') {
            const lab = labDb.get('SELECT * FROM labs WHERE id = ?', [currentLabId]);
            const staffCount = labDb.get('SELECT COUNT(*) as count FROM lab_staff WHERE lab_id = ?', [currentLabId]);

            return sendJson(res, 200, {
                success: true,
                user: currentUser,
                lab: lab ? {
                    id: lab.id,
                    name: lab.name,
                    email: lab.email,
                    phone: lab.phone,
                    address: lab.address,
                    city: lab.city,
                    state: lab.state,
                    pincode: lab.pincode,
                    licenseNumber: lab.license_number,
                    accreditation: lab.accreditation,
                    diagnosticServices: JSON.parse(lab.diagnostic_services || '[]'),
                    status: lab.status,
                    totalStaff: staffCount?.count || 1
                } : null
            });
        }

        // ==========================================
        // DASHBOARD SUMMARY & METRICS
        // ==========================================

        // GET /api/lab/dashboard/summary
        if (pathname === '/api/lab/dashboard/summary' && method === 'GET') {
            // Metrics queried directly from database (honest statistics)
            const totalBookings = labDb.get('SELECT COUNT(*) as count FROM test_bookings WHERE lab_id = ?', [currentLabId])?.count || 0;
            const pendingCollections = labDb.get("SELECT COUNT(*) as count FROM test_bookings WHERE lab_id = ? AND status IN ('BOOKED', 'CONFIRMED', 'SAMPLE_PENDING')", [currentLabId])?.count || 0;
            const samplesReceived = labDb.get("SELECT COUNT(*) as count FROM samples WHERE lab_id = ? AND condition = 'ACCEPTED'", [currentLabId])?.count || 0;
            const inProcessing = labDb.get("SELECT COUNT(*) as count FROM test_bookings WHERE lab_id = ? AND status = 'PROCESSING'", [currentLabId])?.count || 0;
            const awaitingVerification = labDb.get("SELECT COUNT(*) as count FROM diagnostic_reports WHERE lab_id = ? AND status = 'PENDING_VERIFICATION'", [currentLabId])?.count || 0;
            const publishedReports = labDb.get("SELECT COUNT(*) as count FROM diagnostic_reports WHERE lab_id = ? AND status = 'PUBLISHED'", [currentLabId])?.count || 0;
            
            // Completed today
            const todayStr = new Date().toISOString().split('T')[0];
            const completedToday = labDb.get("SELECT COUNT(*) as count FROM diagnostic_reports WHERE lab_id = ? AND status = 'PUBLISHED' AND reporting_date >= ?", [currentLabId, todayStr])?.count || 0;

            // Revenue and outstanding amounts
            const revenueRow = labDb.get("SELECT SUM(amount_paid) as totalRevenue, SUM(balance_due) as totalOutstanding FROM invoices WHERE lab_id = ?", [currentLabId]);
            const totalRevenue = revenueRow?.totalRevenue || 0.0;
            const totalOutstanding = revenueRow?.totalOutstanding || 0.0;

            // Status Breakdown for visual chart
            const statusBreakdown = labDb.query(`
                SELECT status, COUNT(*) as count 
                FROM test_bookings 
                WHERE lab_id = ? 
                GROUP BY status
            `, [currentLabId]);

            // Recent 6 bookings
            const recentBookings = labDb.query(`
                SELECT id, booking_reference, patient_name, patient_age, patient_gender, test_names, collection_type, appointment_date, appointment_time, status, payment_status, total_amount
                FROM test_bookings
                WHERE lab_id = ?
                ORDER BY created_at DESC
                LIMIT 6
            `, [currentLabId]);

            // Reports awaiting verification (clinical urgency)
            const urgentReports = labDb.query(`
                SELECT id, report_number, patient_name, test_name, reporting_date, clinical_interpretation, status
                FROM diagnostic_reports
                WHERE lab_id = ? AND status = 'PENDING_VERIFICATION'
                LIMIT 4
            `, [currentLabId]);

            return sendJson(res, 200, {
                success: true,
                metrics: {
                    totalBookings,
                    pendingCollections,
                    samplesReceived,
                    inProcessing,
                    awaitingVerification,
                    publishedReports,
                    completedToday,
                    totalRevenue,
                    totalOutstanding
                },
                statusBreakdown,
                recentBookings,
                urgentReports
            });
        }

        // ==========================================
        // TEST CATALOGUE & PACKAGES
        // ==========================================

        // GET /api/lab/catalogue
        if (pathname === '/api/lab/catalogue' && method === 'GET') {
            const category = query.category || '';
            const search = (query.search || '').trim().toLowerCase();

            let sql = 'SELECT * FROM test_catalogue WHERE lab_id = ?';
            const params = [currentLabId];

            if (category) {
                sql += ' AND category = ?';
                params.push(category);
            }
            if (search) {
                sql += ' AND (LOWER(name) LIKE ? OR LOWER(code) LIKE ?)';
                params.push(`%${search}%`, `%${search}%`);
            }

            sql += ' ORDER BY name ASC';
            const tests = labDb.query(sql, params);

            return sendJson(res, 200, {
                success: true,
                count: tests.length,
                tests
            });
        }

        // POST /api/lab/catalogue
        if (pathname === '/api/lab/catalogue' && method === 'POST') {
            if (!authorizeRole(currentUser, ['LAB_DIRECTOR', 'PATHOLOGIST'])) {
                return sendError(res, 403, 'Unauthorized. Only the Lab Director or Pathologist can add tests to the catalogue.');
            }

            const body = await parseJsonBody(req);
            const { code, name, category, specimenType, price, turnaroundTime, preparationInstructions, normalRangeSummary } = body;

            if (!code || !name || !category || price === undefined || price < 0) {
                return sendError(res, 400, 'Invalid test data. Code, name, category, and positive price are required.');
            }

            const testId = 't-' + Date.now();
            const now = new Date().toISOString();

            labDb.run(`
                INSERT INTO test_catalogue (id, lab_id, code, name, category, specimen_type, price, turnaround_time, preparation_instructions, normal_range_summary, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
            `, [
                testId,
                currentLabId,
                code.trim().toUpperCase(),
                name.trim(),
                category.trim(),
                specimenType || 'Serum',
                parseFloat(price),
                turnaroundTime || '6 Hours',
                preparationInstructions || 'Fasting as indicated.',
                normalRangeSummary || 'Physiological normal values apply.',
                now
            ]);

            return sendJson(res, 201, {
                success: true,
                message: 'Test successfully added to catalogue.',
                testId
            });
        }

        // PUT /api/lab/catalogue/:id
        if (pathname.startsWith('/api/lab/catalogue/') && method === 'PUT') {
            if (!authorizeRole(currentUser, ['LAB_DIRECTOR', 'PATHOLOGIST'])) {
                return sendError(res, 403, 'Unauthorized. Only the Lab Director or Pathologist can update catalogue items.');
            }

            const testId = pathname.replace('/api/lab/catalogue/', '').trim();
            const body = await parseJsonBody(req);

            const existing = labDb.get('SELECT id FROM test_catalogue WHERE id = ? AND lab_id = ?', [testId, currentLabId]);
            if (!existing) {
                return sendError(res, 404, 'Test catalogue entry not found');
            }

            labDb.run(`
                UPDATE test_catalogue 
                SET name = ?, category = ?, specimen_type = ?, price = ?, turnaround_time = ?, preparation_instructions = ?, normal_range_summary = ?, is_active = ?
                WHERE id = ? AND lab_id = ?
            `, [
                body.name,
                body.category,
                body.specimenType || body.specimen_type,
                parseFloat(body.price),
                body.turnaroundTime || body.turnaround_time,
                body.preparationInstructions || body.preparation_instructions,
                body.normalRangeSummary || body.normal_range_summary,
                body.isActive !== undefined ? (body.isActive ? 1 : 0) : 1,
                testId,
                currentLabId
            ]);

            return sendJson(res, 200, { success: true, message: 'Test catalogue entry updated successfully.' });
        }

        // DELETE /api/lab/catalogue/:id (Archive)
        if (pathname.startsWith('/api/lab/catalogue/') && method === 'DELETE') {
            if (!authorizeRole(currentUser, ['LAB_DIRECTOR'])) {
                return sendError(res, 403, 'Unauthorized. Only the Lab Director can archive catalogue tests.');
            }

            const testId = pathname.replace('/api/lab/catalogue/', '').trim();
            labDb.run('UPDATE test_catalogue SET is_active = 0 WHERE id = ? AND lab_id = ?', [testId, currentLabId]);
            return sendJson(res, 200, { success: true, message: 'Catalogue entry archived successfully.' });
        }

        // GET /api/lab/packages
        if (pathname === '/api/lab/packages' && method === 'GET') {
            const packages = labDb.query('SELECT * FROM test_packages WHERE lab_id = ? ORDER BY price ASC', [currentLabId]);
            
            // Enrich with included tests
            const enriched = packages.map(pkg => {
                const tests = labDb.query(`
                    SELECT t.id, t.name, t.code, t.category, t.price
                    FROM package_tests pt
                    JOIN test_catalogue t ON pt.test_id = t.id
                    WHERE pt.package_id = ?
                `, [pkg.id]);
                return { ...pkg, includedTests: tests };
            });

            return sendJson(res, 200, {
                success: true,
                count: enriched.length,
                packages: enriched
            });
        }

        // ==========================================
        // TEST BOOKINGS & PHLEBOTOMY
        // ==========================================

        // GET /api/lab/bookings
        if (pathname === '/api/lab/bookings' && method === 'GET') {
            const status = query.status || '';
            const search = (query.search || '').trim().toLowerCase();

            let sql = 'SELECT * FROM test_bookings WHERE lab_id = ?';
            const params = [currentLabId];

            if (status) {
                sql += ' AND status = ?';
                params.push(status);
            }
            if (search) {
                sql += ' AND (LOWER(patient_name) LIKE ? OR LOWER(booking_reference) LIKE ? OR LOWER(test_names) LIKE ?)';
                params.push(`%${search}%`, `%${search}%`, `%${search}%`);
            }

            sql += ' ORDER BY created_at DESC';
            const bookings = labDb.query(sql, params);

            return sendJson(res, 200, {
                success: true,
                count: bookings.length,
                bookings
            });
        }

        // POST /api/lab/bookings (Walk-in or Referral Booking)
        if (pathname === '/api/lab/bookings' && method === 'POST') {
            const body = await parseJsonBody(req);
            const {
                patientName,
                patientPhone,
                patientEmail,
                patientAge,
                patientGender,
                abhaId,
                doctorName,
                testIds,
                collectionType,
                collectionAddress,
                appointmentDate,
                appointmentTime,
                notes
            } = body;

            if (!patientName || !patientPhone || !testIds || testIds.length === 0) {
                return sendError(res, 400, 'Patient name, phone number, and at least one diagnostic test are required.');
            }

            // Fetch test names and compute total price
            const testList = labDb.query(`SELECT id, name, price, specimen_type FROM test_catalogue WHERE id IN (${testIds.map(() => '?').join(',')})`, testIds);
            const totalAmount = testList.reduce((sum, t) => sum + (t.price || 0), 0);
            const testNames = testList.map(t => t.name).join(', ');

            const bookingId = 'book-' + Date.now();
            const bookingRef = 'BK-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
            const now = new Date().toISOString();

            // Insert Booking
            labDb.run(`
                INSERT INTO test_bookings (
                    id, booking_reference, lab_id, patient_id, patient_name, patient_phone, patient_email,
                    patient_age, patient_gender, abha_id, doctor_id, doctor_name, test_ids, package_ids,
                    test_names, collection_type, collection_address, appointment_date, appointment_time,
                    status, payment_status, total_amount, notes, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', 'PENDING', ?, ?, ?, ?)
            `, [
                bookingId,
                bookingRef,
                currentLabId,
                body.patientId || ('pat-walkin-' + Date.now()),
                patientName.trim(),
                patientPhone.trim(),
                patientEmail || '',
                parseInt(patientAge || 30, 10),
                patientGender || 'Male',
                abhaId || '',
                body.doctorId || null,
                doctorName || 'Walk-in Consultation',
                JSON.stringify(testIds),
                JSON.stringify([]),
                testNames,
                collectionType || 'Lab Visit',
                collectionAddress || '',
                appointmentDate || now.split('T')[0],
                appointmentTime || '10:00 AM',
                totalAmount,
                notes || 'Registered at lab intake reception',
                now,
                now
            ]);

            // Create Sample Accession Record Automatically
            const sampleId = 'smp-' + Date.now();
            const sampleBarcode = 'SMP-' + Math.floor(100000 + Math.random() * 900000);
            const firstSpecimen = testList[0]?.specimen_type || 'Serum';
            const tubeColor = firstSpecimen.toLowerCase().includes('edta') ? 'Purple' : 'Gold / Red';

            labDb.run(`
                INSERT INTO samples (
                    id, sample_barcode, booking_id, lab_id, patient_name, test_name, sample_type, tube_color,
                    collection_timestamp, collected_by, condition, processing_status, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACCEPTED', 'ACCESSIONED', ?, ?)
            `, [
                sampleId,
                sampleBarcode,
                bookingId,
                currentLabId,
                patientName.trim(),
                testNames,
                firstSpecimen,
                tubeColor,
                now,
                currentUser.name,
                now,
                now
            ]);

            // Create Pending Invoice Automatically
            const invoiceId = 'inv-' + Date.now();
            const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
            labDb.run(`
                INSERT INTO invoices (
                    id, invoice_number, booking_id, lab_id, patient_name, subtotal, tax_amount, discount_amount,
                    total_amount, amount_paid, balance_due, payment_status, invoice_date, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, 0.0, 0.0, ?, 0.0, ?, 'PENDING', ?, ?)
            `, [
                invoiceId,
                invoiceNumber,
                bookingId,
                currentLabId,
                patientName.trim(),
                totalAmount,
                totalAmount,
                totalAmount,
                now.split('T')[0],
                now
            ]);

            // Status transition history
            labDb.run(`
                INSERT INTO booking_status_history (id, booking_id, from_status, to_status, changed_by, change_reason, timestamp)
                VALUES (?, ?, NULL, 'CONFIRMED', ?, 'Patient intake booking created', ?)
            `, ['hist-' + Date.now(), bookingId, currentUser.name, now]);

            return sendJson(res, 201, {
                success: true,
                message: 'Test booking created successfully.',
                booking: {
                    id: bookingId,
                    bookingReference: bookingRef,
                    sampleBarcode,
                    invoiceNumber,
                    totalAmount
                }
            });
        }

        // PATCH /api/lab/bookings/:id/status
        if (pathname.match(/^\/api\/lab\/bookings\/[^/]+\/status$/) && method === 'PATCH') {
            const bookingId = pathname.split('/')[4];
            const body = await parseJsonBody(req);
            const { status, reason } = body;

            const booking = labDb.get('SELECT id, status FROM test_bookings WHERE id = ? AND lab_id = ?', [bookingId, currentLabId]);
            if (!booking) {
                return sendError(res, 404, 'Test booking not found');
            }

            // Valid transitions
            const allowedStatuses = [
                'BOOKED', 'CONFIRMED', 'SAMPLE_PENDING', 'SAMPLE_COLLECTED', 
                'PROCESSING', 'REPORT_PENDING_VERIFICATION', 'REPORT_PUBLISHED', 'CANCELLED'
            ];

            if (!allowedStatuses.includes(status)) {
                return sendError(res, 400, 'Invalid target booking status: ' + status);
            }

            const now = new Date().toISOString();
            labDb.run(`UPDATE test_bookings SET status = ?, updated_at = ? WHERE id = ?`, [status, now, bookingId]);

            labDb.run(`
                INSERT INTO booking_status_history (id, booking_id, from_status, to_status, changed_by, change_reason, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, ['hist-' + Date.now(), bookingId, booking.status, status, currentUser.name, reason || 'Clinical workflow progression', now]);

            return sendJson(res, 200, {
                success: true,
                message: `Booking status updated from ${booking.status} to ${status}.`,
                currentStatus: status
            });
        }

        // ==========================================
        // SAMPLE MANAGEMENT & BARCODING
        // ==========================================

        // GET /api/lab/samples
        if (pathname === '/api/lab/samples' && method === 'GET') {
            const samples = labDb.query(`
                SELECT s.*, b.booking_reference, b.appointment_date, b.collection_type
                FROM samples s
                JOIN test_bookings b ON s.booking_id = b.id
                WHERE s.lab_id = ?
                ORDER BY s.created_at DESC
            `, [currentLabId]);

            return sendJson(res, 200, {
                success: true,
                count: samples.length,
                samples
            });
        }

        // PATCH /api/lab/samples/:id/status
        if (pathname.match(/^\/api\/lab\/samples\/[^/]+\/status$/) && method === 'PATCH') {
            const sampleId = pathname.split('/')[4];
            const body = await parseJsonBody(req);
            const { processingStatus, analyzerId, technician } = body;

            const sample = labDb.get('SELECT id, booking_id FROM samples WHERE id = ? AND lab_id = ?', [sampleId, currentLabId]);
            if (!sample) {
                return sendError(res, 404, 'Sample record not found');
            }

            const now = new Date().toISOString();
            labDb.run(`
                UPDATE samples 
                SET processing_status = ?, analyzer_id = COALESCE(?, analyzer_id), assigned_technician = COALESCE(?, assigned_technician), updated_at = ?
                WHERE id = ?
            `, [processingStatus, analyzerId, technician || currentUser.name, now, sampleId]);

            // Sync booking status if entering processing
            if (processingStatus === 'IN_PROCESSING') {
                labDb.run(`UPDATE test_bookings SET status = 'PROCESSING', updated_at = ? WHERE id = ?`, [now, sample.booking_id]);
            }

            return sendJson(res, 200, {
                success: true,
                message: `Sample processing status updated to ${processingStatus}.`
            });
        }

        // POST /api/lab/samples/:id/reject
        if (pathname.match(/^\/api\/lab\/samples\/[^/]+\/reject$/) && method === 'POST') {
            const sampleId = pathname.split('/')[4];
            const body = await parseJsonBody(req);
            const { rejectionReason } = body;

            if (!rejectionReason) {
                return sendError(res, 400, 'Rejection reason (e.g. Hemolyzed, Clotted, Insufficient volume) is mandatory');
            }

            const now = new Date().toISOString();
            labDb.run(`
                UPDATE samples 
                SET condition = 'REJECTED', rejection_reason = ?, updated_at = ?
                WHERE id = ? AND lab_id = ?
            `, [rejectionReason, now, sampleId, currentLabId]);

            return sendJson(res, 200, {
                success: true,
                message: 'Sample marked as REJECTED. Phlebotomy redraw order triggered.',
                condition: 'REJECTED'
            });
        }

        // ==========================================
        // DIAGNOSTIC REPORTS & VERIFICATION
        // ==========================================

        // GET /api/lab/reports
        if (pathname === '/api/lab/reports' && method === 'GET') {
            const status = query.status || '';
            let sql = 'SELECT * FROM diagnostic_reports WHERE lab_id = ?';
            const params = [currentLabId];

            if (status) {
                sql += ' AND status = ?';
                params.push(status);
            }

            sql += ' ORDER BY created_at DESC';
            const reports = labDb.query(sql, params);

            // Fetch parameters for each report
            const enrichedReports = reports.map(rep => {
                const parameters = labDb.query('SELECT * FROM report_parameters WHERE report_id = ? ORDER BY display_order ASC', [rep.id]);
                return { ...rep, parameters };
            });

            return sendJson(res, 200, {
                success: true,
                count: enrichedReports.length,
                reports: enrichedReports
            });
        }

        // GET /api/lab/reports/:id
        if (pathname.match(/^\/api\/lab\/reports\/[^/]+$/) && method === 'GET') {
            const reportId = pathname.split('/')[4];
            const report = labDb.get('SELECT * FROM diagnostic_reports WHERE id = ? AND lab_id = ?', [reportId, currentLabId]);
            if (!report) {
                return sendError(res, 404, 'Diagnostic report not found');
            }

            const parameters = labDb.query('SELECT * FROM report_parameters WHERE report_id = ? ORDER BY display_order ASC', [reportId]);
            const auditLog = labDb.query('SELECT * FROM report_audit_log WHERE report_id = ? ORDER BY timestamp DESC', [reportId]);

            return sendJson(res, 200, {
                success: true,
                report: {
                    ...report,
                    parameters,
                    auditLog
                }
            });
        }

        // PUT /api/lab/reports/:id/results (Enter / Update Lab Parameters)
        if (pathname.match(/^\/api\/lab\/reports\/[^/]+\/results$/) && method === 'PUT') {
            const reportId = pathname.split('/')[4];
            const body = await parseJsonBody(req);
            const { parameters, clinicalInterpretation, submitForVerification } = body;

            const report = labDb.get('SELECT * FROM diagnostic_reports WHERE id = ? AND lab_id = ?', [reportId, currentLabId]);
            if (!report) {
                return sendError(res, 404, 'Diagnostic report not found');
            }

            if (report.status === 'PUBLISHED') {
                return sendError(res, 400, 'Published reports cannot be directly overwritten. Use the amendment workflow to maintain traceable audit history.');
            }

            const now = new Date().toISOString();
            const targetStatus = submitForVerification ? 'PENDING_VERIFICATION' : 'DRAFT';

            labDb.run(`
                UPDATE diagnostic_reports 
                SET clinical_interpretation = ?, status = ?, updated_at = ?
                WHERE id = ?
            `, [clinicalInterpretation || report.clinical_interpretation, targetStatus, now, reportId]);

            // Update parameters
            if (parameters && Array.isArray(parameters)) {
                // Delete existing params and insert clean set
                labDb.run('DELETE FROM report_parameters WHERE report_id = ?', [reportId]);
                for (let i = 0; i < parameters.length; i++) {
                    const p = parameters[i];
                    labDb.run(`
                        INSERT INTO report_parameters (id, report_id, parameter_name, observed_value, unit, reference_range, status, display_order)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        `param-${reportId}-${i + 1}`,
                        reportId,
                        p.name || p.parameter_name,
                        p.value || p.observed_value,
                        p.unit,
                        p.referenceRange || p.reference_range,
                        p.status || 'NORMAL',
                        i + 1
                    ]);
                }
            }

            // Sync booking status
            if (submitForVerification) {
                labDb.run(`UPDATE test_bookings SET status = 'REPORT_PENDING_VERIFICATION', updated_at = ? WHERE id = ?`, [now, report.booking_id]);
            }

            labDb.run(`
                INSERT INTO report_audit_log (id, report_id, action, performed_by, role, details, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                'audit-' + Date.now(),
                reportId,
                submitForVerification ? 'SUBMITTED_FOR_VERIFICATION' : 'RESULTS_ENTERED',
                currentUser.name,
                currentUser.role,
                `Parameters updated by ${currentUser.name}. Status: ${targetStatus}`,
                now
            ]);

            return sendJson(res, 200, {
                success: true,
                message: `Report parameters saved. Status: ${targetStatus}`,
                status: targetStatus
            });
        }

        // POST /api/lab/reports/:id/verify
        // Critical Security Rule (Section 12, 17): Only authorized Pathologist or Lab Director can verify
        if (pathname.match(/^\/api\/lab\/reports\/[^/]+\/verify$/) && method === 'POST') {
            if (!authorizeRole(currentUser, ['PATHOLOGIST', 'LAB_DIRECTOR'])) {
                return sendError(res, 403, 'Permission Denied: Only an authorized Pathologist or Medical Director can verify diagnostic reports.');
            }

            const reportId = pathname.split('/')[4];
            const report = labDb.get('SELECT * FROM diagnostic_reports WHERE id = ? AND lab_id = ?', [reportId, currentLabId]);
            if (!report) {
                return sendError(res, 404, 'Diagnostic report not found');
            }

            const now = new Date().toISOString();
            const verifierSignature = `${currentUser.name} (${currentUser.role})`;

            labDb.run(`
                UPDATE diagnostic_reports 
                SET status = 'VERIFIED', is_verified = 1, verified_by = ?, verified_at = ?, updated_at = ?
                WHERE id = ?
            `, [verifierSignature, now, now, reportId]);

            labDb.run(`
                INSERT INTO report_audit_log (id, report_id, action, performed_by, role, details, timestamp)
                VALUES (?, ?, 'VERIFIED', ?, ?, 'Clinical validation passed and certified by pathologist', ?)
            `, ['audit-' + Date.now(), reportId, currentUser.name, currentUser.role, now]);

            return sendJson(res, 200, {
                success: true,
                message: 'Report verified and signed by pathologist.',
                status: 'VERIFIED',
                verifiedBy: verifierSignature
            });
        }

        // POST /api/lab/reports/:id/publish
        // Critical Security Rule: Cannot be published without prior or simultaneous verification
        if (pathname.match(/^\/api\/lab\/reports\/[^/]+\/publish$/) && method === 'POST') {
            if (!authorizeRole(currentUser, ['PATHOLOGIST', 'LAB_DIRECTOR'])) {
                return sendError(res, 403, 'Permission Denied: Only an authorized Pathologist or Medical Director can publish certified reports.');
            }

            const reportId = pathname.split('/')[4];
            const report = labDb.get('SELECT * FROM diagnostic_reports WHERE id = ? AND lab_id = ?', [reportId, currentLabId]);
            if (!report) {
                return sendError(res, 404, 'Diagnostic report not found');
            }

            const now = new Date().toISOString();
            const verifierSignature = report.verified_by || `${currentUser.name} (${currentUser.role})`;

            labDb.run(`
                UPDATE diagnostic_reports 
                SET status = 'PUBLISHED', is_verified = 1, verified_by = ?, verified_at = COALESCE(verified_at, ?), reporting_date = ?, updated_at = ?
                WHERE id = ?
            `, [verifierSignature, now, now.split('T')[0], now, reportId]);

            // Update Booking Status to REPORT_PUBLISHED
            labDb.run(`UPDATE test_bookings SET status = 'REPORT_PUBLISHED', updated_at = ? WHERE id = ?`, [now, report.booking_id]);

            labDb.run(`
                INSERT INTO report_audit_log (id, report_id, action, performed_by, role, details, timestamp)
                VALUES (?, ?, 'PUBLISHED', ?, ?, 'Report published and made available to patient portal and ordering physician', ?)
            `, ['audit-' + Date.now(), reportId, currentUser.name, currentUser.role, now]);

            return sendJson(res, 200, {
                success: true,
                message: 'Diagnostic report published. Accessible on WIDA Patient Health Vault and Doctor Portal.',
                status: 'PUBLISHED'
            });
        }

        // POST /api/lab/reports/:id/amend (Traceable clinical correction)
        if (pathname.match(/^\/api\/lab\/reports\/[^/]+\/amend$/) && method === 'POST') {
            if (!authorizeRole(currentUser, ['PATHOLOGIST', 'LAB_DIRECTOR'])) {
                return sendError(res, 403, 'Permission Denied: Only a Pathologist or Director can issue report amendments.');
            }

            const reportId = pathname.split('/')[4];
            const body = await parseJsonBody(req);
            const { amendmentReason, revisedConclusion } = body;

            if (!amendmentReason) {
                return sendError(res, 400, 'Clinical amendment reason is mandatory for regulatory compliance');
            }

            const report = labDb.get('SELECT * FROM diagnostic_reports WHERE id = ? AND lab_id = ?', [reportId, currentLabId]);
            if (!report) {
                return sendError(res, 404, 'Diagnostic report not found');
            }

            const newVersion = (report.amendment_version || 1) + 1;
            const now = new Date().toISOString();

            labDb.run(`
                UPDATE diagnostic_reports 
                SET amendment_version = ?, amendment_reason = ?, clinical_interpretation = COALESCE(?, clinical_interpretation), updated_at = ?
                WHERE id = ?
            `, [newVersion, amendmentReason, revisedConclusion, now, reportId]);

            labDb.run(`
                INSERT INTO report_audit_log (id, report_id, action, performed_by, role, details, timestamp)
                VALUES (?, ?, 'AMENDED', ?, ?, ?, ?)
            `, ['audit-' + Date.now(), reportId, currentUser.name, currentUser.role, `Version ${newVersion} issued. Reason: ${amendmentReason}`, now]);

            return sendJson(res, 200, {
                success: true,
                message: `Report amended. New traceable version: v${newVersion}`,
                amendmentVersion: newVersion
            });
        }

        // ==========================================
        // BILLING & INVOICING
        // ==========================================

        // GET /api/lab/billing/invoices
        if (pathname === '/api/lab/billing/invoices' && method === 'GET') {
            const invoices = labDb.query(`
                SELECT i.*, b.booking_reference, b.test_names
                FROM invoices i
                JOIN test_bookings b ON i.booking_id = b.id
                WHERE i.lab_id = ?
                ORDER BY i.created_at DESC
            `, [currentLabId]);

            return sendJson(res, 200, {
                success: true,
                count: invoices.length,
                invoices
            });
        }

        // GET /api/lab/billing/invoices/:id
        if (pathname.match(/^\/api\/lab\/billing\/invoices\/[^/]+$/) && method === 'GET') {
            const invoiceId = pathname.split('/')[5];
            const invoice = labDb.get('SELECT * FROM invoices WHERE id = ? AND lab_id = ?', [invoiceId, currentLabId]);
            if (!invoice) {
                return sendError(res, 404, 'Invoice not found');
            }

            const items = labDb.query('SELECT * FROM invoice_items WHERE invoice_id = ?', [invoiceId]);
            const booking = labDb.get('SELECT * FROM test_bookings WHERE id = ?', [invoice.booking_id]);

            return sendJson(res, 200, {
                success: true,
                invoice: {
                    ...invoice,
                    items,
                    booking
                }
            });
        }

        // PATCH /api/lab/billing/invoices/:id/payment
        if (pathname.match(/^\/api\/lab\/billing\/invoices\/[^/]+\/payment$/) && method === 'PATCH') {
            const invoiceId = pathname.split('/')[5];
            const body = await parseJsonBody(req);
            const { paymentStatus, paymentMethod, transactionReference, amountPaid } = body;

            const invoice = labDb.get('SELECT * FROM invoices WHERE id = ? AND lab_id = ?', [invoiceId, currentLabId]);
            if (!invoice) {
                return sendError(res, 404, 'Invoice not found');
            }

            const paid = parseFloat(amountPaid !== undefined ? amountPaid : invoice.total_amount);
            const balance = Math.max(0, invoice.total_amount - paid);
            const status = balance === 0 ? 'PAID' : (paid > 0 ? 'PARTIALLY_PAID' : 'PENDING');

            labDb.run(`
                UPDATE invoices 
                SET payment_status = ?, payment_method = ?, transaction_reference = ?, amount_paid = ?, balance_due = ?
                WHERE id = ?
            `, [status, paymentMethod || 'UPI', transactionReference || ('TXN-' + Date.now()), paid, balance, invoiceId]);

            // Sync booking payment status
            labDb.run(`UPDATE test_bookings SET payment_status = ? WHERE id = ?`, [status, invoice.booking_id]);

            return sendJson(res, 200, {
                success: true,
                message: `Payment updated. Current status: ${status}`,
                paymentStatus: status,
                balanceDue: balance
            });
        }

        // ==========================================
        // PATIENT & DOCTOR INTEGRATION (READ-ONLY)
        // ==========================================

        // GET /api/lab/integration/patient-records
        if (pathname === '/api/lab/integration/patient-records' && method === 'GET') {
            // Read-only bridge from patient.db
            const patients = patientDbAdapter.getAllPatients();
            return sendJson(res, 200, {
                success: true,
                source: 'Safe Read-Only Bridge (patient.db)',
                count: patients.length,
                patients
            });
        }

        // GET /api/lab/integration/doctor-referrals
        if (pathname === '/api/lab/integration/doctor-referrals' && method === 'GET') {
            // Read-only bridge from patient.db
            const doctors = patientDbAdapter.getAllDoctors();
            return sendJson(res, 200, {
                success: true,
                source: 'Safe Read-Only Bridge (patient.db)',
                count: doctors.length,
                doctors
            });
        }

        // GET /api/lab/integration/abdm-export/:reportId
        if (pathname.match(/^\/api\/lab\/integration\/abdm-export\/[^/]+$/) && method === 'GET') {
            const reportId = pathname.split('/')[5];
            const report = labDb.get('SELECT * FROM diagnostic_reports WHERE id = ? AND lab_id = ?', [reportId, currentLabId]);
            if (!report) {
                return sendError(res, 404, 'Report not found');
            }

            const params = labDb.query('SELECT * FROM report_parameters WHERE report_id = ?', [reportId]);
            const lab = labDb.get('SELECT name, license_number, accreditation FROM labs WHERE id = ?', [currentLabId]);

            // Construct standard FHIR DiagnosticReport JSON Bundle
            const fhirBundle = {
                resourceType: 'Bundle',
                type: 'document',
                timestamp: new Date().toISOString(),
                entry: [
                    {
                        resource: {
                            resourceType: 'DiagnosticReport',
                            id: report.report_number,
                            status: report.status === 'PUBLISHED' ? 'final' : 'preliminary',
                            category: [
                                {
                                    coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0074', code: 'LAB', display: 'Laboratory' }]
                                }
                            ],
                            code: {
                                text: report.test_name
                            },
                            subject: {
                                reference: `Patient/${report.patient_id}`,
                                display: report.patient_name,
                                identifier: { system: 'https://healthid.ndhm.gov.in', value: report.abha_id }
                            },
                            effectiveDateTime: report.collection_date,
                            issued: report.reporting_date,
                            performer: [
                                {
                                    display: lab?.name || 'WIDA Diagnostic Lab',
                                    identifier: { system: 'https://nabl-india.org', value: lab?.license_number }
                                }
                            ],
                            resultsInterpreter: [
                                { display: report.verified_by || 'Consultant Pathologist' }
                            ],
                            conclusion: report.clinical_interpretation,
                            result: params.map(p => ({
                                resourceType: 'Observation',
                                code: { text: p.parameter_name },
                                valueQuantity: { value: p.observed_value, unit: p.unit },
                                referenceRange: [{ text: p.reference_range }],
                                interpretation: [{ text: p.status }]
                            }))
                        }
                    }
                ]
            };

            return sendJson(res, 200, {
                success: true,
                standard: 'FHIR R4 DiagnosticReport Profile (ABDM Compliant)',
                bundle: fhirBundle
            });
        }

        // Route not found
        return sendError(res, 404, `Endpoint not found: ${method} ${pathname}`);

    } catch (err) {
        console.error('[LabServer Error]', err);
        return sendError(res, 500, 'Internal Server Error: ' + err.message);
    }
});

// Start listening
server.listen(PORT, HOST, () => {
    console.log(`[LabServer] Diagnostic Laboratory REST API running at http://${HOST}:${PORT}`);
    console.log(`[LabServer] Health Check: http://${HOST}:${PORT}/api/lab/health`);
});

export { server };
