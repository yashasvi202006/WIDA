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
        gs1.ministry = "Ministry of Health & Family Welfare";
        gs1.coverage = "₹5,00,000 / family / year";
        gs1.eligibility = "Eligible via ABHA ID verification";
        gs1.status = "Active & Linked";
        gs1.abhaLinked = true;
        gs1.description = "World's largest government-funded healthcare assurance scheme for secondary and tertiary care hospitalization.";
        gs1.benefits = Arrays.asList(
                "Cashless hospitalization in 27,000+ empaneled hospitals across India",
                "Covers 3 days pre-hospitalization and 15 days post-hospitalization expenses",
                "Zero out-of-pocket expenses for critical procedures"
        );

        GovernmentScheme gs2 = new GovernmentScheme();
        gs2.id = "sch-02";
        gs2.name = "ABHA (Ayushman Bharat Health Account)";
        gs2.ministry = "National Health Authority (NHA)";
        gs2.coverage = "Digital Health ID & Unified EHR Integration";
        gs2.eligibility = "All Indian Citizens";
        gs2.status = "Active & Verified";
        gs2.abhaLinked = true;
        gs2.description = "Unique 14-digit digital identity that digitally unifies your electronic health records across healthcare providers.";
        gs2.benefits = Arrays.asList(
                "Paperless medical consultations and instant report sharing",
                "Full patient data consent control and revocation rights",
                "Compatible with NDHM (National Digital Health Mission)"
        );

        String sql = "INSERT OR REPLACE INTO government_schemes (id, name, status, data) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (GovernmentScheme gs : Arrays.asList(gs1, gs2)) {
                stmt.setString(1, gs.id);
                stmt.setString(2, gs.name);
                stmt.setString(3, gs.status);
                stmt.setString(4, JsonUtil.toCompactJson(gs));
                stmt.executeUpdate();
            }
        }
    }
}
