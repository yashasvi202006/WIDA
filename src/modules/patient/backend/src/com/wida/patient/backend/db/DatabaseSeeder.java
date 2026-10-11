package com.wida.patient.backend.db;

import com.wida.patient.backend.model.*;
import com.wida.patient.backend.util.JsonUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class DatabaseSeeder {

    public static void seed(Connection conn) throws SQLException {
        seedProfile(conn);
        seedDoctors(conn);
        seedAppointments(conn);
        seedPrescriptions(conn);
        seedPharmacyOrders(conn);
        seedDiagnosticTests(conn);
        seedLabs(conn);
        seedLabReports(conn);
        seedLabBookings(conn);
        seedCareJourney(conn);
        seedWellnessMetrics(conn);
        seedWearable(conn);
        seedNotifications(conn);
        seedReminders(conn);
        seedConsentPermissions(conn);
        seedMedicalDocuments(conn);
        seedGovernmentSchemes(conn);
    }

    private static void seedProfile(Connection conn) throws SQLException {
        PatientProfile p = new PatientProfile();
        p.id = "pat-001";
        p.abhaId = "91-4521-8902-3341";
        p.name = "Yashasvi Saini";
        p.email = "yashasvi.saini@wida.health";
        p.phone = "+91 98765 43210";
        p.dob = "2002-06-15";
        p.gender = "Male";
        p.address = "B-402, Green Avenue, Sector 62, Noida, UP, India";
        p.avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250";
        p.bloodGroup = "B+";
        p.height = "178 cm";
        p.weight = "71 kg";
        p.bmi = "22.4 (Normal)";
        p.emergencyContact = new PatientProfile.EmergencyContact("Rajendra Saini", "Father", "+91 98111 22334");
        p.allergies = Arrays.asList("Penicillin", "Sulfa drugs");
        p.chronicConditions = Collections.singletonList("Mild Essential Hypertension");
        p.currentMedications = Arrays.asList("Telmisartan 40mg (OD)", "Atorvastatin 10mg (HS)");
        p.lifestyle = new PatientProfile.Lifestyle("Non-smoker", "Occasional", "Moderate (Gym 4x/week)");

        String sql = "INSERT OR REPLACE INTO patient_profile (id, data) VALUES (?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, p.id);
            stmt.setString(2, JsonUtil.toCompactJson(p));
            stmt.executeUpdate();
        }
    }

    private static void seedDoctors(Connection conn) throws SQLException {
        List<Doctor> docs = new ArrayList<>();

        Doctor d1 = new Doctor();
        d1.id = "doc-001";
        d1.name = "Dr. Sharma";
        d1.photo = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300";
        d1.verified = true;
        d1.specialization = "Cardiologist";
        d1.experience = 16;
        d1.rating = 4.9;
        d1.patientsCount = 3420;
        d1.consultationFee = 900.0;
        d1.location = "Sector 62, Noida";
        d1.hospital = "Fortis Escorts Heart Institute";
        d1.availability = "Today, 4:00 PM - 7:30 PM";
        d1.medicineSystem = "Allopathy";
        d1.about = "Senior interventional cardiologist with extensive expertise in preventive cardiology and hypertension management.";
        d1.education = Arrays.asList("MBBS - AIIMS New Delhi", "MD (Medicine) - AIIMS", "DM (Cardiology) - GB Pant");
        d1.languages = Arrays.asList("English", "Hindi");
        d1.achievements = Arrays.asList("Gold Medalist - Cardiology AIIMS", "10,000+ Successful Procedures");
        d1.availableSlots = Arrays.asList("04:00 PM", "04:30 PM", "05:00 PM", "06:00 PM", "06:30 PM");
        docs.add(d1);

        Doctor d2 = new Doctor();
        d2.id = "doc-002";
        d2.name = "Dr. Priya Mehta";
        d2.photo = "https://images.unsplash.com/photo-1594824813579-082496a0f0cb?auto=format&fit=crop&q=80&w=300";
        d2.verified = true;
        d2.specialization = "Dermatologist";
        d2.experience = 11;
        d2.rating = 4.8;
        d2.patientsCount = 2150;
        d2.consultationFee = 700.0;
        d2.location = "Sector 18, Noida";
        d2.hospital = "Kailash Super Specialty Hospital";
        d2.availability = "Tomorrow, 10:00 AM - 2:00 PM";
        d2.medicineSystem = "Allopathy";
        d2.about = "Clinical & aesthetic dermatologist specializing in allergic dermatomycoses, acne, and hair restoration therapies.";
        d2.education = Arrays.asList("MBBS - Lady Hardinge", "MD (Dermatology) - Maulana Azad Medical College");
        d2.languages = Arrays.asList("English", "Hindi", "Punjabi");
        d2.achievements = Arrays.asList("Published 24+ International Clinical Papers");
        d2.availableSlots = Arrays.asList("10:00 AM", "10:30 AM", "11:30 AM", "01:00 PM");
        docs.add(d2);

        Doctor d3 = new Doctor();
        d3.id = "doc-003";
        d3.name = "Dr. Sneha Kulkarni";
        d3.photo = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300";
        d3.verified = true;
        d3.specialization = "Ayurvedic Physician";
        d3.experience = 14;
        d3.rating = 4.9;
        d3.patientsCount = 2890;
        d3.consultationFee = 500.0;
        d3.location = "Sector 50, Noida";
        d3.hospital = "National Institute of Ayurveda Ayush Clinic";
        d3.availability = "Today, 11:00 AM - 3:00 PM";
        d3.medicineSystem = "Ayurveda";
        d3.about = "Gold Medalist BAMS physician integrating classical Panchakarma with modern evidence-based wellness regimens.";
        d3.education = Arrays.asList("BAMS - Gujarat Ayurved University", "MD (Ayurveda Panchakarma) - NIA Jaipur");
        d3.languages = Arrays.asList("English", "Hindi", "Marathi");
        d3.achievements = Arrays.asList("Ministry of AYUSH Excellence Award 2023");
        d3.availableSlots = Arrays.asList("11:00 AM", "11:30 AM", "12:00 PM", "02:00 PM");
        docs.add(d3);

        String sql = "INSERT OR REPLACE INTO doctors (id, name, specialization, hospital, medicine_system, rating, experience, consultation_fee, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (Doctor d : docs) {
                stmt.setString(1, d.id);
                stmt.setString(2, d.name);
                stmt.setString(3, d.specialization);
                stmt.setString(4, d.hospital);
                stmt.setString(5, d.medicineSystem);
                stmt.setDouble(6, d.rating);
                stmt.setInt(7, d.experience);
                stmt.setDouble(8, d.consultationFee);
                stmt.setString(9, JsonUtil.toCompactJson(d));
                stmt.executeUpdate();
            }
        }
    }

    private static void seedAppointments(Connection conn) throws SQLException {
        Appointment apt1 = new Appointment();
        apt1.id = "apt-101";
        apt1.doctorId = "doc-001";
        apt1.doctorName = "Dr. Sharma";
        apt1.doctorSpecialization = "Cardiologist";
        apt1.doctorAvatar = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300";
        apt1.date = "2026-10-14";
        apt1.time = "05:00 PM";
        apt1.type = "Online";
        apt1.status = "Confirmed";
        apt1.reason = "Quarterly Blood Pressure & ECG Evaluation";
        apt1.fee = 900.0;
        apt1.joinUrl = "https://telehealth.wida.health/room/apt-101-sharma";
        apt1.location = "WIDA Telehealth Room";
        apt1.doctorRemarks = "Please keep recent blood pressure logs handy.";

        Appointment apt2 = new Appointment();
        apt2.id = "apt-102";
        apt2.doctorId = "doc-002";
        apt2.doctorName = "Dr. Priya Mehta";
        apt2.doctorSpecialization = "Dermatologist";
        apt2.doctorAvatar = "https://images.unsplash.com/photo-1594824813579-082496a0f0cb?auto=format&fit=crop&q=80&w=300";
        apt2.date = "2026-10-20";
        apt2.time = "11:30 AM";
        apt2.type = "In-person";
        apt2.status = "Confirmed";
        apt2.reason = "Skin rash and seasonal allergen checkup";
        apt2.fee = 700.0;
        apt2.location = "Kailash Hospital, OPD Room 204";

        String sql = "INSERT OR REPLACE INTO appointments (id, doctor_id, date, time, status, data) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (Appointment a : Arrays.asList(apt1, apt2)) {
                stmt.setString(1, a.id);
                stmt.setString(2, a.doctorId);
                stmt.setString(3, a.date);
                stmt.setString(4, a.time);
                stmt.setString(5, a.status);
                stmt.setString(6, JsonUtil.toCompactJson(a));
                stmt.executeUpdate();
            }
        }
    }

    private static void seedPrescriptions(Connection conn) throws SQLException {
        Prescription rx = new Prescription();
        rx.id = "rx-901";
        rx.doctorId = "doc-001";
        rx.doctorName = "Dr. Sharma";
        rx.doctorSpecialization = "Cardiologist";
        rx.date = "2026-09-12";
        rx.expiryDate = "2026-12-12";
        rx.status = "Active";
        rx.diagnosis = "Mild Essential Hypertension - Stage 1";
        rx.instructions = "Take medication after breakfast with warm water. Exercise 30 minutes daily.";
        rx.dispensedBy = "Apollo Pharmacy Sector 62";
        rx.isSentToPharmacy = true;

        Prescription.Medicine m1 = new Prescription.Medicine();
        m1.id = "med-01";
        m1.name = "Telmisartan 40mg";
        m1.dosage = "40 mg";
        m1.frequency = "Once daily (Morning)";
        m1.duration = "90 Days";
        m1.instructions = "Take after breakfast";
        m1.timing = Collections.singletonList("Morning");
        m1.price = 145.0;
        m1.quantity = 30;

        Prescription.Medicine m2 = new Prescription.Medicine();
        m2.id = "med-02";
        m2.name = "Atorvastatin 10mg";
        m2.dosage = "10 mg";
        m2.frequency = "Once daily (Bedtime)";
        m2.duration = "90 Days";
        m2.instructions = "Take at night before sleep";
        m2.timing = Collections.singletonList("Night");
        m2.price = 195.0;
        m2.quantity = 30;

        rx.medicines = Arrays.asList(m1, m2);

        String sql = "INSERT OR REPLACE INTO prescriptions (id, doctor_id, status, data) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, rx.id);
            stmt.setString(2, rx.doctorId);
            stmt.setString(3, rx.status);
            stmt.setString(4, JsonUtil.toCompactJson(rx));
            stmt.executeUpdate();
        }
    }

    private static void seedPharmacyOrders(Connection conn) throws SQLException {
        PharmacyOrder po = new PharmacyOrder();
        po.id = "ord-501";
        po.prescriptionId = "rx-901";
        po.pharmacyName = "HealthPlus E-Pharmacy Hub";
        po.date = "2026-10-05";
        po.medicines = Arrays.asList(
                new PharmacyOrder.OrderItem("Telmisartan 40mg (Strip of 15)", "2 Strips", 290.0),
                new PharmacyOrder.OrderItem("Atorvastatin 10mg (Strip of 15)", "2 Strips", 390.0)
        );
        po.totalAmount = 680.0;
        po.status = "Ready";
        po.deliveryType = "Home Delivery";
        po.estimatedReadyTime = "Delivered Today by 02:00 PM";

        String sql = "INSERT OR REPLACE INTO pharmacy_orders (id, prescription_id, status, data) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, po.id);
            stmt.setString(2, po.prescriptionId);
            stmt.setString(3, po.status);
            stmt.setString(4, JsonUtil.toCompactJson(po));
            stmt.executeUpdate();
        }
    }

    private static void seedDiagnosticTests(Connection conn) throws SQLException {
        DiagnosticTest t1 = new DiagnosticTest();
        t1.id = "t-01";
        t1.name = "Complete Blood Count (CBC)";
        t1.category = "Blood";
        t1.description = "Measures overall health and detects wide range of disorders including anemia and infection.";
        t1.price = 399.0;
        t1.preparation = "No fasting required.";
        t1.turnaroundTime = "6 Hours";
        t1.sampleType = "Blood";
        t1.popular = true;
        t1.recommendedFor = Arrays.asList("Fever", "Fatigue", "General Health");

        DiagnosticTest t2 = new DiagnosticTest();
        t2.id = "t-02";
        t2.name = "Lipid Profile (Cholesterol Panel)";
        t2.category = "Cardiology";
        t2.description = "Complete lipid panel including Total Cholesterol, HDL, LDL, VLDL, and Triglycerides.";
        t2.price = 650.0;
        t2.preparation = "10-12 hours overnight fasting required.";
        t2.turnaroundTime = "12 Hours";
        t2.sampleType = "Blood";
        t2.popular = true;
        t2.recommendedFor = Arrays.asList("Hypertension", "Cardiovascular Check", "Weight Management");

        String sql = "INSERT OR REPLACE INTO diagnostic_tests (id, name, category, price, data) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (DiagnosticTest t : Arrays.asList(t1, t2)) {
                stmt.setString(1, t.id);
                stmt.setString(2, t.name);
                stmt.setString(3, t.category);
                stmt.setDouble(4, t.price);
                stmt.setString(5, JsonUtil.toCompactJson(t));
                stmt.executeUpdate();
            }
        }
    }

    private static void seedLabs(Connection conn) throws SQLException {
        Lab l1 = new Lab();
        l1.id = "lab-01";
        l1.name = "HealthFirst Diagnostics, Sector 62";
        l1.address = "Plot B-12, Sector 62, Noida";
        l1.rating = 4.8;
        l1.accreditation = "NABL & CAP Accredited";
        l1.phone = "+91 120 4455667";
        l1.availableSlots = Arrays.asList("07:30 AM", "08:30 AM", "09:30 AM", "11:00 AM");

        String sql = "INSERT OR REPLACE INTO labs (id, name, rating, data) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, l1.id);
            stmt.setString(2, l1.name);
            stmt.setDouble(3, l1.rating);
            stmt.setString(4, JsonUtil.toCompactJson(l1));
            stmt.executeUpdate();
        }
    }

    private static void seedLabReports(Connection conn) throws SQLException {
        LabReport r = new LabReport();
        r.id = "rep-301";
        r.testId = "t-02";
        r.testName = "Lipid Profile Panel";
        r.labName = "HealthFirst Diagnostics";
        r.date = "2026-09-20";
        r.doctorName = "Dr. Sharma";
        r.status = "Ready";
        r.parameters = Arrays.asList(
                new LabReport.LabParameter("Total Cholesterol", "182", "mg/dL", "< 200", "Normal"),
                new LabReport.LabParameter("HDL (Good) Cholesterol", "52", "mg/dL", "> 40", "Normal"),
                new LabReport.LabParameter("LDL (Bad) Cholesterol", "108", "mg/dL", "< 100", "Elevated"),
                new LabReport.LabParameter("Triglycerides", "142", "mg/dL", "< 150", "Normal")
        );
        r.overallConclusion = "Lipid profile shows mild LDL borderline elevation. Well managed with current low-dose statin therapy.";
        r.doctorNotes = "Continue Atorvastatin 10mg. Maintain low-sodium, high-fiber Mediterranean style diet.";
        r.pdfUrl = "/reports/rep-301-lipid.pdf";
        r.isVerified = true;

        String sql = "INSERT OR REPLACE INTO lab_reports (id, test_id, status, data) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, r.id);
            stmt.setString(2, r.testId);
            stmt.setString(3, r.status);
            stmt.setString(4, JsonUtil.toCompactJson(r));
            stmt.executeUpdate();
        }
    }

    private static void seedLabBookings(Connection conn) throws SQLException {
        LabBooking b = new LabBooking();
        b.id = "book-01";
        b.testId = "t-01";
        b.testName = "Complete Blood Count (CBC)";
        b.labId = "lab-01";
        b.labName = "HealthFirst Diagnostics, Sector 62";
        b.date = "Tomorrow, 08:30 AM";
        b.time = "08:30 AM";
        b.collectionType = "Home Sample Collection";
        b.status = "Booked";
        b.price = 399.0;

        String sql = "INSERT OR REPLACE INTO lab_bookings (id, test_id, status, data) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, b.id);
            stmt.setString(2, b.testId);
            stmt.setString(3, b.status);
            stmt.setString(4, JsonUtil.toCompactJson(b));
            stmt.executeUpdate();
        }
    }

    private static void seedCareJourney(Connection conn) throws SQLException {
        CareJourneyStep s1 = new CareJourneyStep();
        s1.id = "step-1";
        s1.title = "Hypertension Assessment";
        s1.subtitle = "Consultation & Initial Evaluation";
        s1.date = "12 Sep 2026";
        s1.provider = "Dr. Sharma (Cardiology)";
        s1.status = "completed";
        s1.icon = "UserCheck";
        s1.routeLink = "appointments";
        s1.details = "Diagnosed with Mild Essential Hypertension. Prescription initiated.";

        CareJourneyStep s2 = new CareJourneyStep();
        s2.id = "step-2";
        s2.title = "Follow-up Diagnostic Panel";
        s2.subtitle = "Lipid & Renal Profile";
        s2.date = "20 Sep 2026";
        s2.provider = "HealthFirst Diagnostics";
        s2.status = "completed";
        s2.icon = "FlaskConical";
        s2.routeLink = "diagnostics";
        s2.details = "Reports analyzed and linked to ABHA vault.";

        CareJourneyStep s3 = new CareJourneyStep();
        s3.id = "step-3";
        s3.title = "Quarterly Cardiology Review";
        s3.subtitle = "Scheduled Telehealth Session";
        s3.date = "14 Oct 2026";
        s3.provider = "Dr. Sharma";
        s3.status = "in_progress";
        s3.icon = "Calendar";
        s3.routeLink = "appointments";
        s3.details = "Upcoming checkup to monitor drug response and ambulatory blood pressure.";

        String sql = "INSERT OR REPLACE INTO care_journey (id, status, data) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (CareJourneyStep s : Arrays.asList(s1, s2, s3)) {
                stmt.setString(1, s.id);
                stmt.setString(2, s.status);
                stmt.setString(3, JsonUtil.toCompactJson(s));
                stmt.executeUpdate();
            }
        }
    }

    private static void seedWellnessMetrics(Connection conn) throws SQLException {
        WellnessMetric m1 = new WellnessMetric();
        m1.id = "wm-01";
        m1.name = "Blood Pressure";
        m1.value = "118/76";
        m1.unit = "mmHg";
        m1.status = "Optimal";
        m1.trend = "-4% vs last week";
        m1.trendDirection = "down";
        m1.lastUpdated = "Today, 07:45 AM";
        m1.target = "< 120/80 mmHg";

        WellnessMetric m2 = new WellnessMetric();
        m2.id = "wm-02";
        m2.name = "Heart Rate";
        m2.value = 68;
        m2.unit = "bpm";
        m2.status = "Normal";
        m2.trend = "Resting stable";
        m2.trendDirection = "stable";
        m2.lastUpdated = "10 min ago";
        m2.target = "60-100 bpm";

        WellnessMetric m3 = new WellnessMetric();
        m3.id = "wm-03";
        m3.name = "Daily Steps";
        m3.value = 8450;
        m3.unit = "steps";
        m3.status = "Optimal";
        m3.trend = "+12% vs yesterday";
        m3.trendDirection = "up";
        m3.lastUpdated = "Just now";
        m3.target = "10,000 steps";

        String sql = "INSERT OR REPLACE INTO wellness_metrics (id, name, status, data) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (WellnessMetric m : Arrays.asList(m1, m2, m3)) {
                stmt.setString(1, m.id);
                stmt.setString(2, m.name);
                stmt.setString(3, m.status);
                stmt.setString(4, JsonUtil.toCompactJson(m));
                stmt.executeUpdate();
            }
        }
    }

    private static void seedWearable(Connection conn) throws SQLException {
        WearableData w = new WearableData();
        w.id = "wear-001";
        w.name = "Apple Watch Series 9";
        w.model = "A2980 Cellular";
        w.status = "Connected";
        w.battery = "84%";
        w.lastSynced = "5 minutes ago";
        w.metrics = new WearableData.Metrics();
        w.metrics.steps = 8450;
        w.metrics.heartRate = 68;
        w.metrics.sleepHours = 7.5;
        w.metrics.calories = 490;

        String sql = "INSERT OR REPLACE INTO wearable (id, data) VALUES (?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, w.id);
            stmt.setString(2, JsonUtil.toCompactJson(w));
            stmt.executeUpdate();
        }
    }

    private static void seedNotifications(Connection conn) throws SQLException {
        Notification n1 = new Notification();
        n1.id = "notif-01";
        n1.type = "appointment";
        n1.title = "Appointment Reminder";
        n1.message = "Telehealth consultation with Dr. Sharma is scheduled for Oct 14 at 05:00 PM.";
        n1.timestamp = "10 mins ago";
        n1.isRead = false;
        n1.priority = "high";
        n1.relatedId = "apt-101";
        n1.actionUrl = "appointments";

        Notification n2 = new Notification();
        n2.id = "notif-02";
        n2.type = "medicine";
        n2.title = "Medication Due: Telmisartan";
        n2.message = "Time for your morning dose of Telmisartan 40mg after breakfast.";
        n2.timestamp = "2 hours ago";
        n2.isRead = true;
        n2.priority = "medium";
        n2.relatedId = "rx-901";
        n2.actionUrl = "prescriptions";

        String sql = "INSERT OR REPLACE INTO notifications (id, type, is_read, timestamp, data) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (Notification n : Arrays.asList(n1, n2)) {
                stmt.setString(1, n.id);
                stmt.setString(2, n.type);
                stmt.setInt(3, n.isRead ? 1 : 0);
                stmt.setString(4, n.timestamp);
                stmt.setString(5, JsonUtil.toCompactJson(n));
                stmt.executeUpdate();
            }
        }
    }

    private static void seedReminders(Connection conn) throws SQLException {
        Reminder r1 = new Reminder();
        r1.id = "rem-01";
        r1.type = "Medicine";
        r1.title = "Telmisartan 40mg";
        r1.description = "Take 1 tablet after breakfast";
        r1.date = "Daily";
        r1.time = "08:30 AM";
        r1.repeat = "Daily";
        r1.status = "Upcoming";
        r1.priority = "high";
        r1.dosage = "40 mg";
        r1.instructions = "With warm water";

        Reminder r2 = new Reminder();
        r2.id = "rem-02";
        r2.type = "Medicine";
        r2.title = "Atorvastatin 10mg";
        r2.description = "Take 1 tablet at bedtime";
        r2.date = "Daily";
        r2.time = "10:00 PM";
        r2.repeat = "Daily";
        r2.status = "Upcoming";
        r2.priority = "medium";
        r2.dosage = "10 mg";
        r2.instructions = "Before sleeping";

        String sql = "INSERT OR REPLACE INTO reminders (id, type, status, date, time, data) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (Reminder r : Arrays.asList(r1, r2)) {
                stmt.setString(1, r.id);
                stmt.setString(2, r.type);
                stmt.setString(3, r.status);
                stmt.setString(4, r.date);
                stmt.setString(5, r.time);
                stmt.setString(6, JsonUtil.toCompactJson(r));
                stmt.executeUpdate();
            }
        }
    }

    private static void seedConsentPermissions(Connection conn) throws SQLException {
        ConsentPermission cp1 = new ConsentPermission();
        cp1.id = "cp-01";
        cp1.providerName = "Fortis Escorts Heart Institute (Dr. Sharma)";
        cp1.providerType = "Hospital / Clinic";
        cp1.accessLevel = "Full Medical Records (EHR)";
        cp1.grantedOn = "12 Sep 2026";
        cp1.expiresOn = "12 Sep 2027";
        cp1.status = "Active";
        cp1.dataCategories = Arrays.asList("Diagnostic Reports", "Prescriptions", "Vital Signs");

        ConsentPermission cp2 = new ConsentPermission();
        cp2.id = "cp-02";
        cp2.providerName = "HealthPlus E-Pharmacy";
        cp2.providerType = "Pharmacy Partner";
        cp2.accessLevel = "Prescription Only";
        cp2.grantedOn = "15 Sep 2026";
        cp2.expiresOn = "15 Mar 2027";
        cp2.status = "Active";
        cp2.dataCategories = Collections.singletonList("Prescriptions");

        String sql = "INSERT OR REPLACE INTO consent_permissions (id, provider_name, status, data) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (ConsentPermission cp : Arrays.asList(cp1, cp2)) {
                stmt.setString(1, cp.id);
                stmt.setString(2, cp.providerName);
                stmt.setString(3, cp.status);
                stmt.setString(4, JsonUtil.toCompactJson(cp));
                stmt.executeUpdate();
            }
        }
    }

    private static void seedMedicalDocuments(Connection conn) throws SQLException {
        MedicalDocument doc1 = new MedicalDocument();
        doc1.id = "doc-v1";
        doc1.title = "Lipid Profile Official Report";
        doc1.category = "Diagnostic Reports";
        doc1.date = "20 Sep 2026";
        doc1.fileSize = "1.4 MB";
        doc1.uploader = "HealthFirst Diagnostics";
        doc1.sharingStatus = "Shared with Care Team";
        doc1.fileType = "pdf";

        MedicalDocument doc2 = new MedicalDocument();
        doc2.id = "doc-v2";
        doc2.title = "Cardiology OPD Prescription - Sep 2026";
        doc2.category = "Prescriptions";
        doc2.date = "12 Sep 2026";
        doc2.fileSize = "820 KB";
        doc2.uploader = "Dr. Sharma";
        doc2.sharingStatus = "Private Vault";
        doc2.fileType = "pdf";

        String sql = "INSERT OR REPLACE INTO medical_documents (id, title, category, date, data) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (MedicalDocument doc : Arrays.asList(doc1, doc2)) {
                stmt.setString(1, doc.id);
                stmt.setString(2, doc.title);
                stmt.setString(3, doc.category);
                stmt.setString(4, doc.date);
                stmt.setString(5, JsonUtil.toCompactJson(doc));
                stmt.executeUpdate();
            }
        }
    }

    private static void seedGovernmentSchemes(Connection conn) throws SQLException {
        GovernmentScheme gs1 = new GovernmentScheme();
        gs1.id = "sch-01";
        gs1.name = "Ayushman Bharat PM-JAY";
        gs1.shortName = "PM-JAY";
        gs1.ministry = "National Health Authority & MoHFW";
        gs1.category = "Hospital Care";
        gs1.coverage = "₹5,00,000 / family / year";
        gs1.coverageAmount = "₹5,00,000 per family/year";
        gs1.eligibility = "Eligible via SECC criteria and ABHA ID";
        gs1.status = "Active & Linked";
        gs1.abhaLinked = true;
        gs1.officialSource = "https://pmjay.gov.in";
        gs1.description = "World's largest government-funded healthcare assurance scheme for secondary and tertiary care hospitalization.";
        gs1.tagline = "Cashless secondary and tertiary hospital care up to ₹5 Lakh per family per year.";
        gs1.benefits = Arrays.asList(
                "Cashless hospitalization in 29,000+ empaneled hospitals across India",
                "Covers 1,949 treatment packages including oncology, cardiac, and neurosurgery",
                "Covers 3 days pre-hospitalization and 15 days post-hospitalization expenses"
        );
        gs1.requiredDocuments = Arrays.asList("Aadhaar Card", "Ration Card", "PMJAY Family ID");

        GovernmentScheme gs2 = new GovernmentScheme();
        gs2.id = "sch-02";
        gs2.name = "ABHA (Ayushman Bharat Health Account)";
        gs2.shortName = "ABHA";
        gs2.ministry = "National Health Authority (NHA)";
        gs2.category = "Digital Health";
        gs2.coverage = "Digital Health ID & Unified EHR Integration";
        gs2.coverageAmount = "Universal Digital Healthcare Account";
        gs2.eligibility = "All Indian Citizens";
        gs2.status = "Active & Verified";
        gs2.abhaLinked = true;
        gs2.officialSource = "https://abdm.gov.in";
        gs2.description = "Unique 14-digit digital identity that digitally unifies your electronic health records across healthcare providers.";
        gs2.tagline = "Store, access, and securely share digital health records across registered providers nationwide.";
        gs2.benefits = Arrays.asList(
                "Paperless medical consultations and instant report sharing",
                "Full patient data consent control and revocation rights",
                "Compatible with NDHM (National Digital Health Mission)"
        );
        gs2.requiredDocuments = Arrays.asList("Aadhaar Card or Driving License", "Mobile OTP");

        GovernmentScheme gs3 = new GovernmentScheme();
        gs3.id = "sch-03";
        gs3.name = "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)";
        gs3.shortName = "Jan Aushadhi";
        gs3.ministry = "Department of Pharmaceuticals";
        gs3.category = "Affordable Medicines";
        gs3.coverage = "50% to 90% Subsidized Generic Medicines";
        gs3.coverageAmount = "Up to 90% discount on 1,965+ generic drugs & surgicals";
        gs3.eligibility = "All Indian Citizens (No income limit)";
        gs3.status = "Available";
        gs3.abhaLinked = false;
        gs3.officialSource = "https://janaushadhi.gov.in";
        gs3.description = "Quality generic medicines at affordable prices through 10,000+ Jan Aushadhi Kendras.";
        gs3.tagline = "Quality medicines for all at 50% to 90% lower prices than branded equivalents.";
        gs3.benefits = Arrays.asList(
                "High quality WHO-GMP compliant generic medicines",
                "Suvidha biodegradable sanitary napkins at ₹1 per pad",
                "Jan Aushadhi Sugam mobile app for outlet locator and medicine search"
        );
        gs3.requiredDocuments = Arrays.asList("Doctor Prescription (Rx)");

        GovernmentScheme gs4 = new GovernmentScheme();
        gs4.id = "sch-04";
        gs4.name = "eSanjeevani - National Teleconsultation Service";
        gs4.shortName = "eSanjeevani";
        gs4.ministry = "MoHFW & C-DAC";
        gs4.category = "Teleconsultation";
        gs4.coverage = "100% Free Nationwide Doctor Video Consultations";
        gs4.coverageAmount = "Free Online Doctor & Specialist Consultations";
        gs4.eligibility = "All Indian Citizens with Internet Access";
        gs4.status = "Available";
        gs4.abhaLinked = true;
        gs4.officialSource = "https://esanjeevani.mohfw.gov.in";
        gs4.description = "National telemedicine service connecting patients directly to registered government physicians and specialists.";
        gs4.tagline = "Free doctor video consultations from home with digital verifiable prescriptions.";
        gs4.benefits = Arrays.asList(
                "Direct real-time video consultation with medical specialists",
                "Verifiable digitally signed e-Prescription delivered to phone",
                "Zero travel expense or hospital waiting time"
        );
        gs4.requiredDocuments = Arrays.asList("Mobile Number for OTP", "Optional ABHA ID");

        GovernmentScheme gs5 = new GovernmentScheme();
        gs5.id = "sch-05";
        gs5.name = "Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)";
        gs5.shortName = "PMSMA";
        gs5.ministry = "Ministry of Health & Family Welfare";
        gs5.category = "Maternal & Child Health";
        gs5.coverage = "Free Comprehensive Antenatal Care on 9th of Every Month";
        gs5.coverageAmount = "100% Free Antenatal Consultations & Lab Tests";
        gs5.eligibility = "All Pregnant Women in 2nd and 3rd Trimester";
        gs5.status = "Available";
        gs5.abhaLinked = false;
        gs5.officialSource = "https://pmsma.mohfw.gov.in";
        gs5.description = "Comprehensive and quality antenatal care provided free of cost to all pregnant women on the 9th of every month.";
        gs5.tagline = "Assured, free antenatal checkup by specialists on the 9th day of each month.";
        gs5.benefits = Arrays.asList(
                "Free ultrasound, hemoglobin, and urine diagnostics",
                "Specialist OB-GYN consultations at public health centres",
                "Early identification and care for High-Risk Pregnancies (HRP)"
        );
        gs5.requiredDocuments = Arrays.asList("Mother & Child Protection (MCP) Card", "Aadhaar Card");

        GovernmentScheme gs6 = new GovernmentScheme();
        gs6.id = "sch-06";
        gs6.name = "Janani Shishu Suraksha Karyakram (JSSK)";
        gs6.shortName = "JSSK";
        gs6.ministry = "National Health Mission (NHM)";
        gs6.category = "Maternal & Child Health";
        gs6.coverage = "Zero Out-of-Pocket Expenses for Delivery and Sick Infants";
        gs6.coverageAmount = "100% Cashless Institutional Delivery & Sick Neonatal Care";
        gs6.eligibility = "All Pregnant Women delivering in public health facilities and sick infants up to 1 year";
        gs6.status = "Available";
        gs6.abhaLinked = false;
        gs6.officialSource = "https://nhm.gov.in";
        gs6.description = "Entitles all pregnant women delivering in public institutions to absolutely free and zero out-of-pocket expenses.";
        gs6.tagline = "Free delivery, C-sections, drugs, diagnostics, blood, and transport for mother and infant.";
        gs6.benefits = Arrays.asList(
                "Free normal and caesarean section institutional deliveries",
                "Free diagnostics, drugs, consumables, and blood transfusions",
                "Free transport from home to facility and drop-back home"
        );
        gs6.requiredDocuments = Arrays.asList("Identity Proof (Aadhaar / Voter ID)", "MCP Card");

        GovernmentScheme gs7 = new GovernmentScheme();
        gs7.id = "sch-07";
        gs7.name = "Ni-kshay Poshan Yojana (NTEP)";
        gs7.shortName = "Ni-kshay";
        gs7.ministry = "Central TB Division, MoHFW";
        gs7.category = "Chronic Disease & Nutrition";
        gs7.coverage = "₹500/Month DBT Nutritional Support + 100% Free TB Treatment";
        gs7.coverageAmount = "₹500 / month Direct Cash Assistance + Free Meds";
        gs7.eligibility = "All notified Tuberculosis Patients on Ni-kshay Portal";
        gs7.status = "Available";
        gs7.abhaLinked = true;
        gs7.officialSource = "https://nikshay.in";
        gs7.description = "Direct Benefit Transfer scheme providing financial nutritional assistance and free anti-TB therapy.";
        gs7.tagline = "Monthly financial nutrition support and comprehensive free diagnostic testing for TB patients.";
        gs7.benefits = Arrays.asList(
                "Direct ₹500/month bank transfer for the entire treatment course",
                "Free fixed-dose combination anti-TB medications",
                "Free GeneXpert / CBNAAT molecular testing"
        );
        gs7.requiredDocuments = Arrays.asList("Aadhaar Card", "Bank Account Details", "TB Notification ID");

        GovernmentScheme gs8 = new GovernmentScheme();
        gs8.id = "sch-08";
        gs8.name = "Rashtriya Bal Swasthya Karyakram (RBSK)";
        gs8.shortName = "RBSK";
        gs8.ministry = "Ministry of Health & Family Welfare";
        gs8.category = "Maternal & Child Health";
        gs8.coverage = "Free Screening and Treatment for Children (0-18 Years)";
        gs8.coverageAmount = "Free Screening, Surgeries & Early Intervention";
        gs8.eligibility = "All Children aged 0 to 18 years in Anganwadis and Schools";
        gs8.status = "Available";
        gs8.abhaLinked = false;
        gs8.officialSource = "https://rbsk.gov.in";
        gs8.description = "Child health screening and early intervention services covering 4Ds: Defects, Diseases, Deficiencies, Delays.";
        gs8.tagline = "Early child health screening and free surgical interventions from birth to 18 years.";
        gs8.benefits = Arrays.asList(
                "Free screening for 32 health conditions including congenital defects",
                "Free tertiary surgical treatments (cardiac, cleft lip/palate, club foot)",
                "Free assistive hearing devices and prescription spectacles"
        );
        gs8.requiredDocuments = Arrays.asList("School / Anganwadi ID or Birth Certificate", "Aadhaar Card");

        GovernmentScheme gs9 = new GovernmentScheme();
        gs9.id = "sch-09";
        gs9.name = "Central Government Health Scheme (CGHS)";
        gs9.shortName = "CGHS";
        gs9.ministry = "Ministry of Health & Family Welfare";
        gs9.category = "Employee & Pensioner Care";
        gs9.coverage = "Comprehensive Healthcare for Central Employees & Pensioners";
        gs9.coverageAmount = "Full Cashless Hospitalization & Subsidized Care";
        gs9.eligibility = "Central Government Employees, Pensioners, and Dependents";
        gs9.status = "Available";
        gs9.abhaLinked = true;
        gs9.officialSource = "https://cghs.nic.in";
        gs9.description = "Comprehensive healthcare network for central government employees and pensioners across 80+ cities.";
        gs9.tagline = "Comprehensive cashless health network for central civil servants and pensioners.";
        gs9.benefits = Arrays.asList(
                "Cashless inpatient care at empaneled private hospitals",
                "Consultation across Allopathy, Ayurveda, Yoga, Unani, and Homeopathy",
                "Subsidized plastic wellness cards with online booking"
        );
        gs9.requiredDocuments = Arrays.asList("CGHS Beneficiary Card", "PPO / Employee ID", "Aadhaar Card");

        GovernmentScheme gs10 = new GovernmentScheme();
        gs10.id = "sch-10";
        gs10.name = "Employees' State Insurance Scheme (ESIC)";
        gs10.shortName = "ESIC";
        gs10.ministry = "Ministry of Labour and Employment";
        gs10.category = "Employee & Pensioner Care";
        gs10.coverage = "Full Medical Care + Cash Sickness & Maternity Benefits";
        gs10.coverageAmount = "Complete Family Healthcare + Cash Wage Security";
        gs10.eligibility = "Employees earning up to ₹21,000/month in covered establishments";
        gs10.status = "Available";
        gs10.abhaLinked = false;
        gs10.officialSource = "https://www.esic.gov.in";
        gs10.description = "Integrated social security and healthcare scheme protecting employees against sickness, maternity, and disablement.";
        gs10.tagline = "Full medical care for family and cash sickness/maternity benefits for insured workers.";
        gs10.benefits = Arrays.asList(
                "Comprehensive medical care in ESIC dispensaries and model hospitals",
                "70% daily wage cash benefit during certified sickness",
                "100% wage maternity benefit for 26 weeks for female employees"
        );
        gs10.requiredDocuments = Arrays.asList("ESIC Pehchan Smart Card / IP Number", "Aadhaar Card", "Bank Account Details");

        GovernmentScheme gs11 = new GovernmentScheme();
        gs11.id = "sch-11";
        gs11.name = "National Tele Mental Health Programme (Tele-MANAS)";
        gs11.shortName = "Tele-MANAS";
        gs11.ministry = "Ministry of Health and Family Welfare & NIMHANS";
        gs11.category = "Mental Health";
        gs11.coverage = "24x7 Nationwide Tele-Mental Health Counseling & Psychiatry";
        gs11.coverageAmount = "100% Free 24x7 Counseling & Psychiatric Referral";
        gs11.eligibility = "All Indian citizens experiencing distress, anxiety, or emotional health concerns";
        gs11.status = "Available";
        gs11.abhaLinked = true;
        gs11.officialSource = "https://telemanas.mohfw.gov.in";
        gs11.description = "24x7 free national tele-mental health helpline across all States & UTs in 20+ regional languages.";
        gs11.tagline = "24x7 free national tele-mental health helpline and psychological counseling service across all States & UTs in 20+ regional languages.";
        gs11.benefits = Arrays.asList(
                "Immediate connection to certified clinical psychologists via toll-free 14416 / 1800-891-4416",
                "Tiered referral to NIMHANS and regional tertiary mental health institutes",
                "Confidential digital follow-ups and e-prescriptions in 20+ scheduled Indian languages"
        );
        gs11.requiredDocuments = Arrays.asList("No documentation required - Instant, anonymous dial-in service");

        GovernmentScheme gs12 = new GovernmentScheme();
        gs12.id = "sch-12";
        gs12.name = "National Policy for Rare Diseases (NPRD) & Rare Diseases Portal";
        gs12.shortName = "NPRD Rare Disease Support";
        gs12.ministry = "Ministry of Health and Family Welfare";
        gs12.category = "Specialized & Rare Diseases";
        gs12.coverage = "Financial assistance up to ₹50 Lakh for rare genetic disorders";
        gs12.coverageAmount = "Up to ₹50,00,000 per patient (One-time grant)";
        gs12.eligibility = "Patients diagnosed with rare diseases treated at notified Centers of Excellence (CoEs)";
        gs12.status = "Available";
        gs12.abhaLinked = true;
        gs12.officialSource = "https://rarediseases.mohfw.gov.in";
        gs12.description = "One-time financial grant up to ₹50 Lakh for enzyme replacement therapies and rare disease management.";
        gs12.tagline = "Financial support up to ₹50 Lakh per patient for life-saving treatment of rare disorders at designated Centers of Excellence.";
        gs12.benefits = Arrays.asList(
                "Direct financial assistance up to ₹50 Lakh for high-cost enzyme replacement therapies",
                "National crowdfunding portal linking verified cases with CSR donors",
                "Access to specialized rare disease clinical boards across 12 apex medical centers"
        );
        gs12.requiredDocuments = Arrays.asList("Diagnostic Genetic / Biochemical Report from CoE", "Aadhaar Card", "Treating Physician Recommendation Form");

        GovernmentScheme gs13 = new GovernmentScheme();
        gs13.id = "sch-13";
        gs13.name = "Pradhan Mantri National Dialysis Programme (PMNDP)";
        gs13.shortName = "PMNDP Dialysis";
        gs13.ministry = "National Health Mission (NHM), MoHFW";
        gs13.category = "Chronic Disease & Critical Care";
        gs13.coverage = "100% Free Hemodialysis and Peritoneal Dialysis for BPL patients";
        gs13.coverageAmount = "100% Free Dialysis for BPL Patients / Subsidized for Non-BPL";
        gs13.eligibility = "End-Stage Renal Disease (ESRD) and chronic kidney failure patients";
        gs13.status = "Available";
        gs13.abhaLinked = true;
        gs13.officialSource = "https://pmndp.mohfw.gov.in";
        gs13.description = "100% free hemodialysis and peritoneal dialysis in all District Hospitals under One Nation-One Dialysis.";
        gs13.tagline = "100% free hemodialysis and peritoneal dialysis in all District Hospitals nationwide under One Nation-One Dialysis portability.";
        gs13.benefits = Arrays.asList(
                "100% cashless hemodialysis sessions including dialyzers, tubing, and heparin",
                "Support for Automated and Peritoneal Dialysis (CAPD) for home management",
                "National renal registry with One Nation-One Dialysis portability across all States"
        );
        gs13.requiredDocuments = Arrays.asList("Nephrologist Prescription / ESRD Diagnosis", "BPL Ration Card or Income Certificate", "Aadhaar Card", "ABHA ID");

        GovernmentScheme gs14 = new GovernmentScheme();
        gs14.id = "sch-14";
        gs14.name = "U-WIN Digital Platform & Universal Immunization Programme (UIP)";
        gs14.shortName = "U-WIN Vaccination";
        gs14.ministry = "Ministry of Health and Family Welfare";
        gs14.category = "Maternal & Child Health";
        gs14.coverage = "Nationwide digital immunization registry and universal vaccination";
        gs14.coverageAmount = "100% Free Complete National Immunization Schedule";
        gs14.eligibility = "All pregnant women and children from birth up to 5 years (and catch-up to 16)";
        gs14.status = "Available";
        gs14.abhaLinked = true;
        gs14.officialSource = "https://uwin.mohfw.gov.in";
        gs14.description = "Universal digital tracking and verifiable vaccination certificates for 12 preventable diseases.";
        gs14.tagline = "Universal digital immunization registry and vaccination tracking for pregnant mothers and all children from birth to age 5.";
        gs14.benefits = Arrays.asList(
                "100% free vaccination against 12 preventable diseases (Polio, Measles-Rubella, Hepatitis B, PCV, etc.)",
                "Instant QR-coded digital vaccination certificates linked directly to ABHA ID",
                "Automated SMS reminders for upcoming vaccine milestones and slot bookings"
        );
        gs14.requiredDocuments = Arrays.asList("Parent/Guardian Mobile Number", "Aadhaar Card of Parent", "Child Birth Certificate or MCP Card");

        GovernmentScheme gs15 = new GovernmentScheme();
        gs15.id = "sch-15";
        gs15.name = "Rashtriya Arogya Nidhi (RAN) & Health Minister’s Cancer Patient Fund";
        gs15.shortName = "Rashtriya Arogya Nidhi";
        gs15.ministry = "Ministry of Health and Family Welfare";
        gs15.category = "Hospital Care";
        gs15.coverage = "One-time financial assistance up to ₹15 Lakh for BPL patients";
        gs15.coverageAmount = "Up to ₹15,00,000 Direct Financial Assistance";
        gs15.eligibility = "BPL patients receiving treatment for life-threatening diseases in designated government hospitals";
        gs15.status = "Available";
        gs15.abhaLinked = true;
        gs15.officialSource = "https://mohfw.gov.in/schemes/schemes-programmes/rashtriya-arogya-nidhi";
        gs15.description = "Direct financial assistance up to ₹15 Lakh for oncology, cardiac surgery, and transplants.";
        gs15.tagline = "Direct financial aid up to ₹15 Lakh for BPL patients battling life-threatening illnesses and cancer in government superspecialty hospitals.";
        gs15.benefits = Arrays.asList(
                "Direct fund transfer to hospital revolving fund for oncology and organ transplants",
                "Health Minister’s Cancer Patient Fund providing up to ₹5 Lakh for specialized drugs",
                "Emergency fast-track approval via the Medical Superintendent of the treating institute"
        );
        gs15.requiredDocuments = Arrays.asList("Application Form endorsed by Medical Superintendent", "BPL Ration Card / Income Certificate", "Aadhaar Card", "Diagnostic Reports");

        GovernmentScheme gs16 = new GovernmentScheme();
        gs16.id = "sch-16";
        gs16.name = "National Sickle Cell Anemia Elimination Mission (NSCAEM)";
        gs16.shortName = "Sickle Cell Mission";
        gs16.ministry = "Ministry of Health and Family Welfare & Ministry of Tribal Affairs";
        gs16.category = "Chronic Disease & Critical Care";
        gs16.coverage = "Universal screening of 7 Crore citizens with genetic status cards";
        gs16.coverageAmount = "100% Free Screening, Counseling, & Disease Management";
        gs16.eligibility = "Individuals aged 0-40 years in 17 high-prevalence States (tribal & vulnerable groups)";
        gs16.status = "Available";
        gs16.abhaLinked = true;
        gs16.officialSource = "https://sickle.nhm.gov.in";
        gs16.description = "Universal screening and color-coded cards to eliminate sickle cell disease by 2047.";
        gs16.tagline = "Mission to eliminate Sickle Cell Disease by 2047: universal screening of 7 Crore citizens with color-coded genetic status cards.";
        gs16.benefits = Arrays.asList(
                "Free point-of-care solubility testing and confirmatory HPLC electrophoresis diagnosis",
                "Official color-coded Sickle Cell Status Cards (Trait / Disease / Normal) linked to ABHA ID",
                "Lifelong free supply of Hydroxyurea, Folic Acid, and pneumococcal prophylaxis vaccines"
        );
        gs16.requiredDocuments = Arrays.asList("Aadhaar Card", "ABHA Number");

        GovernmentScheme gs17 = new GovernmentScheme();
        gs17.id = "sch-17";
        gs17.name = "National Programme for Prevention & Control of NCDs (NP-NCD)";
        gs17.shortName = "NP-NCD Screening";
        gs17.ministry = "National Health Systems Resource Centre (NHSRC), MoHFW";
        gs17.category = "Chronic Disease & Critical Care";
        gs17.coverage = "Universal screening and free lifelong treatment for Hypertension, Diabetes, and Cancers";
        gs17.coverageAmount = "100% Free Universal Health Screening & NCD Medications";
        gs17.eligibility = "All Indian citizens aged 30 years and older";
        gs17.status = "Available";
        gs17.abhaLinked = true;
        gs17.officialSource = "https://ncd.nhm.gov.in";
        gs17.description = "Population-based screening for hypertension, diabetes, oral, breast, and cervical cancers.";
        gs17.tagline = "Universal screening and free lifelong treatment for Hypertension, Diabetes, and Oral, Breast, and Cervical cancers.";
        gs17.benefits = Arrays.asList(
                "Annual non-communicable disease risk assessment (CBAC) by frontline healthcare workers",
                "Free blood pressure and blood sugar tests with digital longitudinal tracking on the NCD portal",
                "Free screening for oral, breast, and cervical cancers and free essential chronic medications"
        );
        gs17.requiredDocuments = Arrays.asList("Aadhaar Card or Mobile Number", "ABHA ID");

        GovernmentScheme gs18 = new GovernmentScheme();
        gs18.id = "sch-18";
        gs18.name = "National Organ and Tissue Transplant Organisation (NOTTO)";
        gs18.shortName = "NOTTO Organ Registry";
        gs18.ministry = "Directorate General of Health Services (DGHS), MoHFW";
        gs18.category = "Critical Care & Organ Donation";
        gs18.coverage = "Apex national registry for organ allocation and donor pledge cards";
        gs18.coverageAmount = "Universal National Organ Allocation & Donor Registry";
        gs18.eligibility = "Citizens aged 18+ pledging organ donation and registered transplant recipients";
        gs18.status = "Available";
        gs18.abhaLinked = true;
        gs18.officialSource = "https://notto.mohfw.gov.in";
        gs18.description = "Apex national registry for organ allocation transparency and instant donor pledge cards.";
        gs18.tagline = "Apex national registry for deceased & living organ donation, transparent waitlists, and instant donor pledge cards.";
        gs18.benefits = Arrays.asList(
                "Instant issuance of official Government of India Organ Donor Pledge Card linked with ABHA ID",
                "Transparent computerized national waiting list and organ allocation protocol under the THOTA Act",
                "24x7 National Organ Transplant Toll-Free Helpline: 1800-11-4770"
        );
        gs18.requiredDocuments = Arrays.asList("Aadhaar Card", "Active Mobile Number for OTP", "Two Next-of-Kin Contact Details");

        GovernmentScheme gs19 = new GovernmentScheme();
        gs19.id = "sch-19";
        gs19.name = "National Viral Hepatitis Control Program (NVHCP)";
        gs19.shortName = "NVHCP Hepatitis Care";
        gs19.ministry = "National Health Mission (NHM), MoHFW";
        gs19.category = "Chronic Disease & Critical Care";
        gs19.coverage = "100% free viral load testing and curative treatment for Hepatitis B & C";
        gs19.coverageAmount = "100% Free Diagnostics & Curative Treatment Regimens";
        gs19.eligibility = "All citizens diagnosed with or suspected of having Hepatitis B or Hepatitis C";
        gs19.status = "Available";
        gs19.abhaLinked = true;
        gs19.officialSource = "https://nvhcp.mohfw.gov.in";
        gs19.description = "100% free viral load testing and curative oral DAA therapy for Hepatitis C and management for Hepatitis B.";
        gs19.tagline = "100% free viral load testing and curative oral therapy for Hepatitis C and lifelong management for Hepatitis B across India.";
        gs19.benefits = Arrays.asList(
                "Free molecular testing (quantitative HCV RNA & HBV DNA viral load assays)",
                "100% free 12-week curative Direct-Acting Antiviral (DAA) treatment regimen for Hepatitis C",
                "Lifelong free antiviral therapy for chronic Hepatitis B patients and toll-free helpline: 1800-11-6666"
        );
        gs19.requiredDocuments = Arrays.asList("Photo ID (Aadhaar or Voter ID)", "Prescription / Screening Report from Government Hospital");

        GovernmentScheme gs20 = new GovernmentScheme();
        gs20.id = "sch-20";
        gs20.name = "Pradhan Mantri Ayushman Bharat Health Infrastructure Mission (PM-ABHIM)";
        gs20.shortName = "PM-ABHIM Infrastructure";
        gs20.ministry = "Ministry of Health and Family Welfare";
        gs20.category = "Healthcare Infrastructure";
        gs20.coverage = "₹64,180 Crore Pan-India public healthcare infrastructure modernisation";
        gs20.coverageAmount = "₹64,180 Crore Nationwide Health Infrastructure Outlay";
        gs20.eligibility = "Universal public healthcare infrastructure catering to all citizens";
        gs20.status = "Available";
        gs20.abhaLinked = true;
        gs20.officialSource = "https://pmabhim.mohfw.gov.in";
        gs20.description = "Pan-India mission establishing Critical Care Hospital Blocks and Integrated Public Health Labs across every district.";
        gs20.tagline = "₹64,180 Crore national health mission establishing 24x7 Critical Care Hospital Blocks and Integrated Public Health Labs across every district.";
        gs20.benefits = Arrays.asList(
                "Establishing 50/100-bedded 24x7 Critical Care Hospital Blocks in all 730 districts for ICU preparedness",
                "Integrated Public Health Labs (IPHL) in all districts for rapid diagnostics and surveillance",
                "Modern biosafety level labs (BSL-3) and National Institutes for One Health"
        );
        gs20.requiredDocuments = Arrays.asList("Public Infrastructure Scheme - No individual registration needed");

        String sql = "INSERT OR REPLACE INTO government_schemes (id, name, status, data) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (GovernmentScheme gs : Arrays.asList(gs1, gs2, gs3, gs4, gs5, gs6, gs7, gs8, gs9, gs10, gs11, gs12, gs13, gs14, gs15, gs16, gs17, gs18, gs19, gs20)) {
                stmt.setString(1, gs.id);
                stmt.setString(2, gs.name);
                stmt.setString(3, gs.status);
                stmt.setString(4, JsonUtil.toCompactJson(gs));
                stmt.executeUpdate();
            }
        }
    }
}
