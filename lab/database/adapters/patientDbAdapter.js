/**
 * Safe Read-Only Adapter for WIDA patient.db
 * Allows the Diagnostic Lab Module to query verified patient profiles,
 * doctor referrals, and diagnostic orders WITHOUT modifying patient.db.
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to pre-existing patient.db
const PATIENT_DB_PATH = path.resolve(__dirname, '../../../src/modules/patient/backend/patient.db');

class PatientDbAdapter {
    constructor() {
        this.db = null;
        this.initConnection();
    }

    initConnection() {
        try {
            if (fs.existsSync(PATIENT_DB_PATH)) {
                // Open in STRICT READ-ONLY mode
                this.db = new DatabaseSync(PATIENT_DB_PATH, { readOnly: true });
                console.log('[PatientDbAdapter] Connected to patient.db in READ-ONLY mode.');
            } else {
                console.warn('[PatientDbAdapter] patient.db not found at', PATIENT_DB_PATH);
            }
        } catch (err) {
            console.error('[PatientDbAdapter] Could not connect to patient.db in read-only mode:', err.message);
            this.db = null;
        }
    }

    getPatient(patientId) {
        if (!this.db) return null;
        try {
            const query = this.db.prepare('SELECT id, data FROM patient_profile WHERE id = ?');
            const row = query.get(patientId);
            if (row && row.data) {
                return JSON.parse(row.data);
            }
            return null;
        } catch (err) {
            console.error('[PatientDbAdapter] getPatient error:', err.message);
            return null;
        }
    }

    getAllPatients() {
        if (!this.db) return [];
        try {
            const query = this.db.prepare('SELECT id, data FROM patient_profile');
            const rows = query.all();
            return rows.map(r => {
                try {
                    return JSON.parse(r.data);
                } catch {
                    return { id: r.id };
                }
            });
        } catch (err) {
            console.error('[PatientDbAdapter] getAllPatients error:', err.message);
            return [];
        }
    }

    getAllDoctors() {
        if (!this.db) return [];
        try {
            const query = this.db.prepare('SELECT id, name, specialization, hospital, medicine_system, rating, experience, consultation_fee, data FROM doctors');
            const rows = query.all();
            return rows.map(r => {
                try {
                    const parsed = JSON.parse(r.data);
                    return { ...parsed, id: r.id, name: r.name, specialization: r.specialization, hospital: r.hospital };
                } catch {
                    return { id: r.id, name: r.name, specialization: r.specialization, hospital: r.hospital };
                }
            });
        } catch (err) {
            console.error('[PatientDbAdapter] getAllDoctors error:', err.message);
            return [];
        }
    }

    getDoctorById(doctorId) {
        if (!this.db) return null;
        try {
            const query = this.db.prepare('SELECT id, data FROM doctors WHERE id = ?');
            const row = query.get(doctorId);
            if (row && row.data) {
                return JSON.parse(row.data);
            }
            return null;
        } catch (err) {
            console.error('[PatientDbAdapter] getDoctorById error:', err.message);
            return null;
        }
    }

    getPatientDiagnosticTests() {
        if (!this.db) return [];
        try {
            const query = this.db.prepare('SELECT id, name, category, price, data FROM diagnostic_tests');
            const rows = query.all();
            return rows.map(r => {
                try {
                    const parsed = JSON.parse(r.data);
                    return { ...parsed, id: r.id, name: r.name, category: r.category, price: r.price };
                } catch {
                    return { id: r.id, name: r.name, category: r.category, price: r.price };
                }
            });
        } catch (err) {
            console.error('[PatientDbAdapter] getPatientDiagnosticTests error:', err.message);
            return [];
        }
    }

    getExistingLabBookings() {
        if (!this.db) return [];
        try {
            const query = this.db.prepare('SELECT id, test_id, status, data FROM lab_bookings');
            const rows = query.all();
            return rows.map(r => {
                try {
                    return JSON.parse(r.data);
                } catch {
                    return { id: r.id, testId: r.test_id, status: r.status };
                }
            });
        } catch (err) {
            console.error('[PatientDbAdapter] getExistingLabBookings error:', err.message);
            return [];
        }
    }

    getExistingLabReports() {
        if (!this.db) return [];
        try {
            const query = this.db.prepare('SELECT id, test_id, status, data FROM lab_reports');
            const rows = query.all();
            return rows.map(r => {
                try {
                    return JSON.parse(r.data);
                } catch {
                    return { id: r.id, testId: r.test_id, status: r.status };
                }
            });
        } catch (err) {
            console.error('[PatientDbAdapter] getExistingLabReports error:', err.message);
            return [];
        }
    }
}

export const patientDbAdapter = new PatientDbAdapter();
