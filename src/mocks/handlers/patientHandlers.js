// WIDA Patient Module - MSW REST Handlers
import { http, HttpResponse, delay } from 'msw';
import { patientMockDb } from '../db/patientMockDb';
// Configurable network latency simulation (in ms)
export const NETWORK_LATENCY_MS = 250;
export const patientHandlers = [
    // -------------------------------------------------------------
    // System & Health Endpoints
    // -------------------------------------------------------------
    http.get('/api/system/health', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json({
            status: 'ok',
            engine: 'Mock Service Worker (MSW v3)',
            module: 'WIDA Patient Platform',
            version: '1.0.0',
            timestamp: new Date().toISOString()
        });
    }),
    http.post('/api/system/reset-db', async () => {
        await delay(NETWORK_LATENCY_MS);
        patientMockDb.reset();
        return HttpResponse.json({ success: true, message: 'Patient Mock DB reset to initial seed data.' });
    }),
    // -------------------------------------------------------------
    // Authentication & Session
    // -------------------------------------------------------------
    http.post('/api/patient/auth/login', async ({ request }) => {
        await delay(NETWORK_LATENCY_MS);
        const body = (await request.json().catch(() => ({})));
        if (!body.emailOrAbha) {
            return HttpResponse.json({ error: 'Email, Mobile Number or ABHA ID is required' }, { status: 400 });
        }
        const profile = patientMockDb.getProfile();
        return HttpResponse.json({
            token: `wida_jwt_${Date.now()}_pat`,
            user: profile,
            message: 'Authentication successful'
        });
    }),
    http.post('/api/patient/auth/register', async ({ request }) => {
        await delay(NETWORK_LATENCY_MS);
        const body = (await request.json().catch(() => ({})));
        if (!body.name || !body.phone) {
            return HttpResponse.json({ error: 'Full Name and Phone Number are required' }, { status: 400 });
        }
        const newProfile = {
            id: `pat-${Date.now()}`,
            abhaId: body.abhaId || `${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
            name: body.name,
            email: body.email || 'patient@wida.health',
            phone: body.phone,
            dob: body.dob || '2000-01-01',
            gender: body.gender || 'Male',
            address: body.address || 'New Delhi, India',
            avatarUrl: body.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            bloodGroup: body.bloodGroup || 'O+',
            height: body.height || '175 cm',
            weight: body.weight || '70 kg',
            bmi: body.bmi || '22.8 (Normal)',
            emergencyContact: body.emergencyContact || {
                name: 'Emergency Contact',
                relationship: 'Family',
                phone: '+91 99999 88888'
            },
            allergies: body.allergies || ['None known'],
            chronicConditions: body.chronicConditions || ['None'],
            currentMedications: body.currentMedications || [],
            lifestyle: body.lifestyle || {
                smoking: 'Non-smoker',
                alcohol: 'No',
                activityLevel: 'Active'
            }
        };
        patientMockDb.updateProfile(newProfile);
        return HttpResponse.json({
            token: `wida_jwt_${Date.now()}_pat`,
            user: newProfile,
            message: 'Account successfully created and linked with ABHA'
        }, { status: 201 });
    }),
    http.post('/api/patient/auth/logout', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json({ success: true, message: 'Logged out successfully' });
    }),
    http.get('/api/patient/auth/me', async () => {
        await delay(NETWORK_LATENCY_MS);
        const profile = patientMockDb.getProfile();
        return HttpResponse.json({ user: profile });
    }),
    // -------------------------------------------------------------
    // Profile
    // -------------------------------------------------------------
    http.get('/api/patient/profile', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getProfile());
    }),
    http.put('/api/patient/profile', async ({ request }) => {
        await delay(NETWORK_LATENCY_MS);
        const updates = (await request.json().catch(() => ({})));
        const updated = patientMockDb.updateProfile(updates);
        return HttpResponse.json(updated);
    }),
    // -------------------------------------------------------------
    // Doctors Directory
    // -------------------------------------------------------------
    http.get('/api/patient/doctors', async ({ request }) => {
        await delay(NETWORK_LATENCY_MS);
        const url = new URL(request.url);
        const search = url.searchParams.get('search')?.toLowerCase();
        const system = url.searchParams.get('system');
        const specialty = url.searchParams.get('specialty');
        let docs = patientMockDb.getDoctors();
        if (search) {
            docs = docs.filter((d) => d.name.toLowerCase().includes(search) ||
                d.specialization.toLowerCase().includes(search) ||
                d.hospital.toLowerCase().includes(search));
        }
        if (system && system !== 'All') {
            docs = docs.filter((d) => d.medicineSystem === system);
        }
        if (specialty && specialty !== 'All') {
            docs = docs.filter((d) => d.specialization.toLowerCase().includes(specialty.toLowerCase()));
        }
        return HttpResponse.json(docs);
    }),
    http.get('/api/patient/doctors/:id', async ({ params }) => {
        await delay(NETWORK_LATENCY_MS);
        const { id } = params;
        const doc = patientMockDb.getDoctorById(id);
        if (!doc) {
            return HttpResponse.json({ error: 'Doctor not found' }, { status: 404 });
        }
        return HttpResponse.json(doc);
    }),
    // -------------------------------------------------------------
    // Appointments
    // -------------------------------------------------------------
    http.get('/api/patient/appointments', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getAppointments());
    }),
    http.post('/api/patient/appointments', async ({ request }) => {
        await delay(NETWORK_LATENCY_MS);
        const body = (await request.json().catch(() => ({})));
        if (!body.doctorId || !body.date || !body.time) {
            return HttpResponse.json({ error: 'Missing appointment scheduling parameters' }, { status: 400 });
        }
        const newApt = patientMockDb.bookAppointment(body);
        return HttpResponse.json(newApt, { status: 201 });
    }),
    http.patch('/api/patient/appointments/:id/cancel', async ({ params }) => {
        await delay(NETWORK_LATENCY_MS);
        const { id } = params;
        const cancelled = patientMockDb.cancelAppointment(id);
        if (!cancelled) {
            return HttpResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }
        return HttpResponse.json(cancelled);
    }),
    // -------------------------------------------------------------
    // Prescriptions & E-Pharmacy Orders
    // -------------------------------------------------------------
    http.get('/api/patient/prescriptions', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getPrescriptions());
    }),
    http.post('/api/patient/prescriptions/:id/order', async ({ params }) => {
        await delay(NETWORK_LATENCY_MS);
        const { id } = params;
        const rx = patientMockDb.orderPrescription(id);
        if (!rx) {
            return HttpResponse.json({ error: 'Prescription not found' }, { status: 404 });
        }
        return HttpResponse.json({
            success: true,
            prescription: rx,
            orders: patientMockDb.getPharmacyOrders()
        });
    }),
    http.get('/api/patient/pharmacy/orders', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getPharmacyOrders());
    }),
    // -------------------------------------------------------------
    // Diagnostics, Labs & Reports
    // -------------------------------------------------------------
    http.get('/api/patient/diagnostics/tests', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getTests());
    }),
    http.get('/api/patient/diagnostics/labs', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getLabs());
    }),
    http.get('/api/patient/diagnostics/reports', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getReports());
    }),
    http.get('/api/patient/diagnostics/bookings', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getLabBookings());
    }),
    http.post('/api/patient/diagnostics/book', async ({ request }) => {
        await delay(NETWORK_LATENCY_MS);
        const body = (await request.json().catch(() => ({})));
        if (!body.testId || !body.date) {
            return HttpResponse.json({ error: 'Missing lab test booking fields' }, { status: 400 });
        }
        const booking = patientMockDb.bookLabTest(body);
        return HttpResponse.json(booking, { status: 201 });
    }),
    http.post('/api/patient/diagnostics/bookings/:id/ready', async ({ params }) => {
        await delay(NETWORK_LATENCY_MS);
        const { id } = params;
        const updated = patientMockDb.markReportReady(id);
        if (!updated) {
            return HttpResponse.json({ error: 'Lab booking not found' }, { status: 404 });
        }
        return HttpResponse.json(updated);
    }),
    // -------------------------------------------------------------
    // Care Journey & Health Timeline
    // -------------------------------------------------------------
    http.get('/api/patient/care-journey', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getCareJourney());
    }),
    // -------------------------------------------------------------
    // Wellness & Wearables
    // -------------------------------------------------------------
    http.get('/api/patient/wellness/metrics', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getWellnessMetrics());
    }),
    http.get('/api/patient/wellness/wearable', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getWearable());
    }),
    // -------------------------------------------------------------
    // Emergency SOS
    // -------------------------------------------------------------
    http.get('/api/patient/emergency/active', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getActiveEmergency());
    }),
    http.post('/api/patient/emergency/sos', async ({ request }) => {
        await delay(NETWORK_LATENCY_MS);
        const body = (await request.json().catch(() => ({})));
        const loc = body.location || 'Current GPS Location (Sector 62, Noida)';
        const req = patientMockDb.triggerEmergencySos(loc);
        return HttpResponse.json(req, { status: 201 });
    }),
    http.patch('/api/patient/emergency/:id/status', async ({ params, request }) => {
        await delay(NETWORK_LATENCY_MS);
        const { id } = params;
        const body = (await request.json().catch(() => ({})));
        const updated = patientMockDb.updateEmergencyStatus(id, body.status);
        if (!updated) {
            return HttpResponse.json({ error: 'Active emergency request not found' }, { status: 404 });
        }
        return HttpResponse.json(updated);
    }),
    http.post('/api/patient/emergency/:id/deactivate', async ({ params }) => {
        await delay(NETWORK_LATENCY_MS);
        const { id } = params;
        const ok = patientMockDb.deactivateEmergency(id);
        return HttpResponse.json({ success: ok, message: 'Emergency SOS deactivated' });
    }),
    // -------------------------------------------------------------
    // Notifications
    // -------------------------------------------------------------
    http.get('/api/patient/notifications', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getNotifications());
    }),
    http.patch('/api/patient/notifications/:id/read', async ({ params }) => {
        await delay(NETWORK_LATENCY_MS);
        const { id } = params;
        const ok = patientMockDb.markNotificationRead(id);
        if (!ok) {
            return HttpResponse.json({ error: 'Notification not found' }, { status: 404 });
        }
        return HttpResponse.json({ success: true });
    }),
    http.post('/api/patient/notifications/mark-all-read', async () => {
        await delay(NETWORK_LATENCY_MS);
        patientMockDb.markAllNotificationsRead();
        return HttpResponse.json({ success: true });
    }),
    http.delete('/api/patient/notifications/:id', async ({ params }) => {
        await delay(NETWORK_LATENCY_MS);
        const { id } = params;
        const ok = patientMockDb.deleteNotification(id);
        if (!ok) {
            return HttpResponse.json({ error: 'Notification not found' }, { status: 404 });
        }
        return HttpResponse.json({ success: true });
    }),
    // -------------------------------------------------------------
    // Reminders
    // -------------------------------------------------------------
    http.get('/api/patient/reminders', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getReminders());
    }),
    http.post('/api/patient/reminders', async ({ request }) => {
        await delay(NETWORK_LATENCY_MS);
        const body = await request.json();
        const created = patientMockDb.addReminder(body);
        return HttpResponse.json(created, { status: 201 });
    }),
    http.patch('/api/patient/reminders/:id/status', async ({ params, request }) => {
        await delay(NETWORK_LATENCY_MS);
        const { id } = params;
        const body = (await request.json().catch(() => ({})));
        const updated = patientMockDb.updateReminderStatus(id, body.status);
        if (!updated) {
            return HttpResponse.json({ error: 'Reminder not found' }, { status: 404 });
        }
        return HttpResponse.json(updated);
    }),
    http.delete('/api/patient/reminders/:id', async ({ params }) => {
        await delay(NETWORK_LATENCY_MS);
        const { id } = params;
        const ok = patientMockDb.deleteReminder(id);
        if (!ok) {
            return HttpResponse.json({ error: 'Reminder not found' }, { status: 404 });
        }
        return HttpResponse.json({ success: true });
    }),
    // -------------------------------------------------------------
    // Consent & Privacy
    // -------------------------------------------------------------
    http.get('/api/patient/privacy/consent', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getConsent());
    }),
    http.patch('/api/patient/privacy/consent/:id/toggle', async ({ params }) => {
        await delay(NETWORK_LATENCY_MS);
        const { id } = params;
        const updated = patientMockDb.toggleConsent(id);
        if (!updated) {
            return HttpResponse.json({ error: 'Consent entry not found' }, { status: 404 });
        }
        return HttpResponse.json(updated);
    }),
    // -------------------------------------------------------------
    // Medical Vault
    // -------------------------------------------------------------
    http.get('/api/patient/vault/documents', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getDocuments());
    }),
    http.post('/api/patient/vault/upload', async ({ request }) => {
        await delay(NETWORK_LATENCY_MS);
        const body = (await request.json().catch(() => ({})));
        const doc = patientMockDb.uploadDocument({
            title: body.title || 'Uploaded Medical Record',
            category: body.category || 'Medical Reports',
            fileSize: body.fileSize || '1.2 MB',
            uploader: body.uploader || 'Self Upload',
            sharingStatus: body.sharingStatus || 'Private',
            fileType: body.fileType || 'pdf'
        });
        return HttpResponse.json(doc, { status: 201 });
    }),
    // -------------------------------------------------------------
    // Government Schemes & Benefits
    // -------------------------------------------------------------
    http.get('/api/patient/schemes', async () => {
        await delay(NETWORK_LATENCY_MS);
        return HttpResponse.json(patientMockDb.getSchemes());
    }),
    // -------------------------------------------------------------
    // AI Clinical Care Assistant
    // -------------------------------------------------------------
    http.post('/api/patient/ai/chat', async ({ request }) => {
        await delay(NETWORK_LATENCY_MS * 2); // Slightly higher latency for AI feel
        const body = (await request.json().catch(() => ({})));
        const query = (body.message || '').toLowerCase();
        let reply = 'Thank you for sharing your symptoms. Based on your medical profile (Telmisartan 40mg for Mild Hypertension), it is recommended to monitor your morning blood pressure and stay hydrated. If you experience persistent chest heaviness or dizziness, consult your cardiologist promptly.';
        if (query.includes('headache') || query.includes('migraine')) {
            reply =
                'Headaches can be caused by dehydration, tension, or blood pressure changes. Since you have a history of mild hypertension, check your BP reading today. If BP is above 140/90 mmHg or pain is severe, connect with Dr. Sharma.';
        }
        else if (query.includes('fever') || query.includes('cold') || query.includes('cough')) {
            reply =
                'For mild fever and respiratory symptoms, ensure plenty of warm fluids, rest, and check temperature twice daily. If temperature exceeds 101°F or lasts more than 48 hours, schedule a general physician consultation.';
        }
        else if (query.includes('appointment') || query.includes('doctor')) {
            reply =
                'You can easily book a consultation directly from the Doctors tab. Dr. Sharma (Cardiologist) and Dr. Priya Mehta (Dermatologist) have open slots this week.';
        }
        return HttpResponse.json({
            id: `ai-msg-${Date.now()}`,
            sender: 'ai',
            text: reply,
            timestamp: 'Just now',
            recommendations: [
                'Log today’s blood pressure in Wellness tab',
                'Check upcoming medication reminders',
                'Book follow-up with Dr. Sharma'
            ]
        });
    })
];
