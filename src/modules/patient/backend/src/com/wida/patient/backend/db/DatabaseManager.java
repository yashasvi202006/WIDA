package com.wida.patient.backend.db;

import com.wida.patient.backend.config.DatabaseConfig;
import com.wida.patient.backend.model.*;
import com.wida.patient.backend.util.JsonUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Enterprise SQLite Database Manager for WIDA Patient Platform.
 * Handles schema initialization, connection pooling, and relational queries.
 */
public class DatabaseManager {
    private static DatabaseManager instance;

    static {
        try {
            Class.forName("org.sqlite.JDBC");
        } catch (ClassNotFoundException e) {
            System.err.println("[WIDA DB] Warning: org.sqlite.JDBC driver not found on classpath: " + e.getMessage());
        }
    }

    public static synchronized DatabaseManager getInstance() {
        if (instance == null) {
            instance = new DatabaseManager();
            instance.init();
        }
        return instance;
    }

    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DatabaseConfig.getJdbcUrl());
    }

    private void init() {
        System.out.println("[WIDA DB] Initializing SQLite database connection: " + DatabaseConfig.getJdbcUrl());
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            // Enable WAL mode for high concurrency
            stmt.execute("PRAGMA journal_mode=WAL;");

            // 1. Patient Profile
            stmt.execute("CREATE TABLE IF NOT EXISTS patient_profile (" +
                    "id TEXT PRIMARY KEY, " +
                    "data TEXT NOT NULL);");

            // 2. Doctors
            stmt.execute("CREATE TABLE IF NOT EXISTS doctors (" +
                    "id TEXT PRIMARY KEY, " +
                    "name TEXT, " +
                    "specialization TEXT, " +
                    "hospital TEXT, " +
                    "medicine_system TEXT, " +
                    "rating REAL, " +
                    "experience INTEGER, " +
                    "consultation_fee REAL, " +
                    "data TEXT NOT NULL);");

            // 3. Appointments
            stmt.execute("CREATE TABLE IF NOT EXISTS appointments (" +
                    "id TEXT PRIMARY KEY, " +
                    "doctor_id TEXT, " +
                    "date TEXT, " +
                    "time TEXT, " +
                    "status TEXT, " +
                    "data TEXT NOT NULL);");

            // 4. Prescriptions
            stmt.execute("CREATE TABLE IF NOT EXISTS prescriptions (" +
                    "id TEXT PRIMARY KEY, " +
                    "doctor_id TEXT, " +
                    "status TEXT, " +
                    "data TEXT NOT NULL);");

            // 5. Pharmacy Orders
            stmt.execute("CREATE TABLE IF NOT EXISTS pharmacy_orders (" +
                    "id TEXT PRIMARY KEY, " +
                    "prescription_id TEXT, " +
                    "status TEXT, " +
                    "data TEXT NOT NULL);");

            // 6. Diagnostic Tests
            stmt.execute("CREATE TABLE IF NOT EXISTS diagnostic_tests (" +
                    "id TEXT PRIMARY KEY, " +
                    "name TEXT, " +
                    "category TEXT, " +
                    "price REAL, " +
                    "data TEXT NOT NULL);");

            // 7. Labs
            stmt.execute("CREATE TABLE IF NOT EXISTS labs (" +
                    "id TEXT PRIMARY KEY, " +
                    "name TEXT, " +
                    "rating REAL, " +
                    "data TEXT NOT NULL);");

            // 8. Lab Reports
            stmt.execute("CREATE TABLE IF NOT EXISTS lab_reports (" +
                    "id TEXT PRIMARY KEY, " +
                    "test_id TEXT, " +
                    "status TEXT, " +
                    "data TEXT NOT NULL);");

            // 9. Lab Bookings
            stmt.execute("CREATE TABLE IF NOT EXISTS lab_bookings (" +
                    "id TEXT PRIMARY KEY, " +
                    "test_id TEXT, " +
                    "status TEXT, " +
                    "data TEXT NOT NULL);");

            // 10. Care Journey
            stmt.execute("CREATE TABLE IF NOT EXISTS care_journey (" +
                    "id TEXT PRIMARY KEY, " +
                    "status TEXT, " +
                    "data TEXT NOT NULL);");

            // 11. Wellness Metrics
            stmt.execute("CREATE TABLE IF NOT EXISTS wellness_metrics (" +
                    "id TEXT PRIMARY KEY, " +
                    "name TEXT, " +
                    "status TEXT, " +
                    "data TEXT NOT NULL);");

            // 12. Wearable
            stmt.execute("CREATE TABLE IF NOT EXISTS wearable (" +
                    "id TEXT PRIMARY KEY, " +
                    "data TEXT NOT NULL);");

            // 13. Emergency Requests
            stmt.execute("CREATE TABLE IF NOT EXISTS emergency_requests (" +
                    "id TEXT PRIMARY KEY, " +
                    "status TEXT, " +
                    "timestamp TEXT, " +
                    "data TEXT NOT NULL);");

            // 14. Notifications
            stmt.execute("CREATE TABLE IF NOT EXISTS notifications (" +
                    "id TEXT PRIMARY KEY, " +
                    "type TEXT, " +
                    "is_read INTEGER, " +
                    "timestamp TEXT, " +
                    "data TEXT NOT NULL);");

            // 15. Reminders
            stmt.execute("CREATE TABLE IF NOT EXISTS reminders (" +
                    "id TEXT PRIMARY KEY, " +
                    "type TEXT, " +
                    "status TEXT, " +
                    "date TEXT, " +
                    "time TEXT, " +
                    "data TEXT NOT NULL);");

            // 16. Consent Permissions
            stmt.execute("CREATE TABLE IF NOT EXISTS consent_permissions (" +
                    "id TEXT PRIMARY KEY, " +
                    "provider_name TEXT, " +
                    "status TEXT, " +
                    "data TEXT NOT NULL);");

            // 17. Medical Documents
            stmt.execute("CREATE TABLE IF NOT EXISTS medical_documents (" +
                    "id TEXT PRIMARY KEY, " +
                    "title TEXT, " +
                    "category TEXT, " +
                    "date TEXT, " +
                    "data TEXT NOT NULL);");

            // 18. Government Schemes
            stmt.execute("CREATE TABLE IF NOT EXISTS government_schemes (" +
                    "id TEXT PRIMARY KEY, " +
                    "name TEXT, " +
                    "status TEXT, " +
                    "data TEXT NOT NULL);");

            // Check if profile exists, if not seed database
            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM patient_profile");
            if (rs.next() && rs.getInt(1) == 0) {
                System.out.println("[WIDA DB] Fresh database detected. Seeding initial healthcare data...");
                DatabaseSeeder.seed(conn);
                System.out.println("[WIDA DB] Database seeded successfully.");
            } else {
                System.out.println("[WIDA DB] Existing relational database tables verified.");
            }

        } catch (SQLException e) {
            System.err.println("[WIDA DB] Initialization error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public synchronized void resetDatabase() throws SQLException {
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            String[] tables = {
                    "patient_profile", "doctors", "appointments", "prescriptions", "pharmacy_orders",
                    "diagnostic_tests", "labs", "lab_reports", "lab_bookings", "care_journey",
                    "wellness_metrics", "wearable", "emergency_requests", "notifications",
                    "reminders", "consent_permissions", "medical_documents", "government_schemes"
            };
            for (String t : tables) {
                stmt.execute("DELETE FROM " + t);
            }
            DatabaseSeeder.seed(conn);
        }
    }

    // --- Profile ---
    public PatientProfile getProfile() {
        String sql = "SELECT data FROM patient_profile LIMIT 1";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return JsonUtil.fromJson(rs.getString("data"), PatientProfile.class);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public PatientProfile updateProfile(PatientProfile profile) {
        String sql = "INSERT OR REPLACE INTO patient_profile (id, data) VALUES (?, ?)";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, profile.id);
            stmt.setString(2, JsonUtil.toCompactJson(profile));
            stmt.executeUpdate();
            return profile;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return profile;
    }

    // --- Doctors ---
    public List<Doctor> getDoctors(String search, String system, String specialty) {
        List<Doctor> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT data FROM doctors WHERE 1=1 ");
        List<Object> params = new ArrayList<>();

        if (search != null && !search.trim().isEmpty()) {
            sql.append("AND (LOWER(name) LIKE ? OR LOWER(specialization) LIKE ? OR LOWER(hospital) LIKE ?) ");
            String term = "%" + search.toLowerCase().trim() + "%";
            params.add(term);
            params.add(term);
            params.add(term);
        }
        if (system != null && !system.trim().isEmpty() && !"All".equalsIgnoreCase(system)) {
            sql.append("AND medicine_system = ? ");
            params.add(system);
        }
        if (specialty != null && !specialty.trim().isEmpty() && !"All".equalsIgnoreCase(specialty)) {
            sql.append("AND LOWER(specialization) LIKE ? ");
            params.add("%" + specialty.toLowerCase().trim() + "%");
        }
        sql.append("ORDER BY rating DESC");

        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                stmt.setObject(i + 1, params.get(i));
            }
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(JsonUtil.fromJson(rs.getString("data"), Doctor.class));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Doctor getDoctorById(String id) {
        String sql = "SELECT data FROM doctors WHERE id = ?";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return JsonUtil.fromJson(rs.getString("data"), Doctor.class);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // --- Appointments ---
    public List<Appointment> getAppointments() {
        List<Appointment> list = new ArrayList<>();
        String sql = "SELECT data FROM appointments ORDER BY date ASC";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(JsonUtil.fromJson(rs.getString("data"), Appointment.class));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Appointment createAppointment(Appointment apt) {
        String sql = "INSERT INTO appointments (id, doctor_id, date, time, status, data) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, apt.id);
            stmt.setString(2, apt.doctorId);
            stmt.setString(3, apt.date);
            stmt.setString(4, apt.time);
            stmt.setString(5, apt.status);
            stmt.setString(6, JsonUtil.toCompactJson(apt));
            stmt.executeUpdate();
            return apt;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return apt;
    }

    public Appointment cancelAppointment(String id) {
        String sqlSelect = "SELECT data FROM appointments WHERE id = ?";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sqlSelect)) {
            stmt.setString(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Appointment apt = JsonUtil.fromJson(rs.getString("data"), Appointment.class);
                    apt.status = "Cancelled";
                    String sqlUpdate = "UPDATE appointments SET status = 'Cancelled', data = ? WHERE id = ?";
                    try (PreparedStatement uStmt = conn.prepareStatement(sqlUpdate)) {
                        uStmt.setString(1, JsonUtil.toCompactJson(apt));
                        uStmt.setString(2, id);
                        uStmt.executeUpdate();
                    }
                    return apt;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // --- Prescriptions ---
    public List<Prescription> getPrescriptions() {
        List<Prescription> list = new ArrayList<>();
        String sql = "SELECT data FROM prescriptions ORDER BY date DESC";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(JsonUtil.fromJson(rs.getString("data"), Prescription.class));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Prescription orderPrescription(String id) {
        String sql = "SELECT data FROM prescriptions WHERE id = ?";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Prescription rx = JsonUtil.fromJson(rs.getString("data"), Prescription.class);
                    rx.isSentToPharmacy = true;
                    String sqlUp = "UPDATE prescriptions SET data = ? WHERE id = ?";
                    try (PreparedStatement uStmt = conn.prepareStatement(sqlUp)) {
                        uStmt.setString(1, JsonUtil.toCompactJson(rx));
                        uStmt.setString(2, id);
                        uStmt.executeUpdate();
                    }

                    // Also create a PharmacyOrder entry
                    PharmacyOrder order = new PharmacyOrder();
                    order.id = "ord-" + System.currentTimeMillis();
                    order.prescriptionId = rx.id;
                    order.pharmacyName = "HealthPlus E-Pharmacy Hub";
                    order.date = "Today";
                    order.medicines = new ArrayList<>();
                    double total = 0;
                    if (rx.medicines != null) {
                        for (Prescription.Medicine m : rx.medicines) {
                            double price = m.price != null ? m.price : 120.0;
                            order.medicines.add(new PharmacyOrder.OrderItem(m.name, (m.quantity != null ? m.quantity : 1) + " units", price));
                            total += price;
                        }
                    }
                    order.totalAmount = total > 0 ? total : 250.0;
                    order.status = "Processing";
                    order.deliveryType = "Home Delivery";
                    order.estimatedReadyTime = "Tomorrow by 11:00 AM";

                    createPharmacyOrder(order);
                    return rx;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // --- Pharmacy Orders ---
    public List<PharmacyOrder> getPharmacyOrders() {
        List<PharmacyOrder> list = new ArrayList<>();
        String sql = "SELECT data FROM pharmacy_orders ORDER BY id DESC";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(JsonUtil.fromJson(rs.getString("data"), PharmacyOrder.class));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public PharmacyOrder createPharmacyOrder(PharmacyOrder order) {
        String sql = "INSERT INTO pharmacy_orders (id, prescription_id, status, data) VALUES (?, ?, ?, ?)";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, order.id);
            stmt.setString(2, order.prescriptionId);
            stmt.setString(3, order.status);
            stmt.setString(4, JsonUtil.toCompactJson(order));
            stmt.executeUpdate();
            return order;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return order;
    }

    // --- Diagnostics ---
    public List<DiagnosticTest> getDiagnosticTests() {
        List<DiagnosticTest> list = new ArrayList<>();
        String sql = "SELECT data FROM diagnostic_tests";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(JsonUtil.fromJson(rs.getString("data"), DiagnosticTest.class));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<Lab> getLabs() {
        List<Lab> list = new ArrayList<>();
        String sql = "SELECT data FROM labs";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(JsonUtil.fromJson(rs.getString("data"), Lab.class));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<LabReport> getLabReports() {
        List<LabReport> list = new ArrayList<>();
        String sql = "SELECT data FROM lab_reports ORDER BY date DESC";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(JsonUtil.fromJson(rs.getString("data"), LabReport.class));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<LabBooking> getLabBookings() {
        List<LabBooking> list = new ArrayList<>();
        String sql = "SELECT data FROM lab_bookings ORDER BY id DESC";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(JsonUtil.fromJson(rs.getString("data"), LabBooking.class));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public LabBooking createLabBooking(LabBooking booking) {
        String sql = "INSERT INTO lab_bookings (id, test_id, status, data) VALUES (?, ?, ?, ?)";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, booking.id);
            stmt.setString(2, booking.testId);
            stmt.setString(3, booking.status);
            stmt.setString(4, JsonUtil.toCompactJson(booking));
            stmt.executeUpdate();
            return booking;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return booking;
    }

    public LabBooking markReportReady(String id) {
        String sql = "SELECT data FROM lab_bookings WHERE id = ?";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    LabBooking b = JsonUtil.fromJson(rs.getString("data"), LabBooking.class);
                    b.status = "Report Ready";
                    String sqlUp = "UPDATE lab_bookings SET status = 'Report Ready', data = ? WHERE id = ?";
                    try (PreparedStatement uStmt = conn.prepareStatement(sqlUp)) {
                        uStmt.setString(1, JsonUtil.toCompactJson(b));
                        uStmt.setString(2, id);
                        uStmt.executeUpdate();
                    }
                    return b;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // --- Care Journey ---
    public List<CareJourneyStep> getCareJourney() {
        List<CareJourneyStep> list = new ArrayList<>();
        String sql = "SELECT data FROM care_journey";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(JsonUtil.fromJson(rs.getString("data"), CareJourneyStep.class));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    // --- Wellness & Wearable ---
    public List<WellnessMetric> getWellnessMetrics() {
        List<WellnessMetric> list = new ArrayList<>();
        String sql = "SELECT data FROM wellness_metrics";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(JsonUtil.fromJson(rs.getString("data"), WellnessMetric.class));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public WearableData getWearable() {
        String sql = "SELECT data FROM wearable LIMIT 1";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return JsonUtil.fromJson(rs.getString("data"), WearableData.class);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // --- Emergency SOS ---
    public EmergencyRequest getActiveEmergency() {
        String sql = "SELECT data FROM emergency_requests WHERE status NOT IN ('Arrived', 'Resolved', 'Cancelled', 'Deactivated') ORDER BY timestamp DESC LIMIT 1";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return JsonUtil.fromJson(rs.getString("data"), EmergencyRequest.class);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public EmergencyRequest createEmergency(EmergencyRequest req) {
        String sql = "INSERT INTO emergency_requests (id, status, timestamp, data) VALUES (?, ?, ?, ?)";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, req.id);
            stmt.setString(2, req.status);
            stmt.setString(3, req.timestamp);
            stmt.setString(4, JsonUtil.toCompactJson(req));
            stmt.executeUpdate();
            return req;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return req;
    }

    public EmergencyRequest updateEmergencyStatus(String id, String status) {
        String sql = "SELECT data FROM emergency_requests WHERE id = ?";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    EmergencyRequest req = JsonUtil.fromJson(rs.getString("data"), EmergencyRequest.class);
                    req.status = status;
                    String up = "UPDATE emergency_requests SET status = ?, data = ? WHERE id = ?";
                    try (PreparedStatement uStmt = conn.prepareStatement(up)) {
                        uStmt.setString(1, status);
                        uStmt.setString(2, JsonUtil.toCompactJson(req));
                        uStmt.setString(3, id);
                        uStmt.executeUpdate();
                    }
                    return req;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean deactivateEmergency(String id) {
        String sql = "UPDATE emergency_requests SET status = 'Deactivated' WHERE id = ?";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            int rows = stmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // --- Notifications ---
    public List<Notification> getNotifications() {
        List<Notification> list = new ArrayList<>();
        String sql = "SELECT data FROM notifications ORDER BY timestamp DESC";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(JsonUtil.fromJson(rs.getString("data"), Notification.class));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean markNotificationRead(String id) {
        String sql = "SELECT data FROM notifications WHERE id = ?";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Notification n = JsonUtil.fromJson(rs.getString("data"), Notification.class);
                    n.isRead = true;
                    String up = "UPDATE notifications SET is_read = 1, data = ? WHERE id = ?";
                    try (PreparedStatement uStmt = conn.prepareStatement(up)) {
                        uStmt.setString(1, JsonUtil.toCompactJson(n));
                        uStmt.setString(2, id);
                        uStmt.executeUpdate();
                    }
                    return true;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public void markAllNotificationsRead() {
        try (Connection conn = getConnection()) {
            List<Notification> list = getNotifications();
            for (Notification n : list) {
                n.isRead = true;
                String up = "UPDATE notifications SET is_read = 1, data = ? WHERE id = ?";
                try (PreparedStatement uStmt = conn.prepareStatement(up)) {
                    uStmt.setString(1, JsonUtil.toCompactJson(n));
                    uStmt.setString(2, n.id);
                    uStmt.executeUpdate();
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public boolean deleteNotification(String id) {
        String sql = "DELETE FROM notifications WHERE id = ?";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // --- Reminders ---
    public List<Reminder> getReminders() {
        List<Reminder> list = new ArrayList<>();
        String sql = "SELECT data FROM reminders";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(JsonUtil.fromJson(rs.getString("data"), Reminder.class));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Reminder createReminder(Reminder r) {
        String sql = "INSERT INTO reminders (id, type, status, date, time, data) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, r.id);
            stmt.setString(2, r.type);
            stmt.setString(3, r.status);
            stmt.setString(4, r.date);
            stmt.setString(5, r.time);
            stmt.setString(6, JsonUtil.toCompactJson(r));
            stmt.executeUpdate();
            return r;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return r;
    }

    public Reminder updateReminderStatus(String id, String status) {
        String sql = "SELECT data FROM reminders WHERE id = ?";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Reminder r = JsonUtil.fromJson(rs.getString("data"), Reminder.class);
                    r.status = status;
                    String up = "UPDATE reminders SET status = ?, data = ? WHERE id = ?";
                    try (PreparedStatement uStmt = conn.prepareStatement(up)) {
                        uStmt.setString(1, status);
                        uStmt.setString(2, JsonUtil.toCompactJson(r));
                        uStmt.setString(3, id);
                        uStmt.executeUpdate();
                    }
                    return r;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean deleteReminder(String id) {
        String sql = "DELETE FROM reminders WHERE id = ?";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // --- Consent ---
    public List<ConsentPermission> getConsentPermissions() {
        List<ConsentPermission> list = new ArrayList<>();
        String sql = "SELECT data FROM consent_permissions";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(JsonUtil.fromJson(rs.getString("data"), ConsentPermission.class));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public ConsentPermission toggleConsent(String id) {
        String sql = "SELECT data FROM consent_permissions WHERE id = ?";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    ConsentPermission cp = JsonUtil.fromJson(rs.getString("data"), ConsentPermission.class);
                    cp.status = "Active".equalsIgnoreCase(cp.status) ? "Revoked" : "Active";
                    String up = "UPDATE consent_permissions SET status = ?, data = ? WHERE id = ?";
                    try (PreparedStatement uStmt = conn.prepareStatement(up)) {
                        uStmt.setString(1, cp.status);
                        uStmt.setString(2, JsonUtil.toCompactJson(cp));
                        uStmt.setString(3, id);
                        uStmt.executeUpdate();
                    }
                    return cp;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // --- Medical Vault ---
    public List<MedicalDocument> getMedicalDocuments() {
        List<MedicalDocument> list = new ArrayList<>();
        String sql = "SELECT data FROM medical_documents ORDER BY date DESC";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(JsonUtil.fromJson(rs.getString("data"), MedicalDocument.class));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public MedicalDocument createMedicalDocument(MedicalDocument doc) {
        String sql = "INSERT INTO medical_documents (id, title, category, date, data) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, doc.id);
            stmt.setString(2, doc.title);
            stmt.setString(3, doc.category);
            stmt.setString(4, doc.date);
            stmt.setString(5, JsonUtil.toCompactJson(doc));
            stmt.executeUpdate();
            return doc;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return doc;
    }

    // --- Government Schemes ---
    public List<GovernmentScheme> getGovernmentSchemes() {
        List<GovernmentScheme> list = new ArrayList<>();
        String sql = "SELECT data FROM government_schemes";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(JsonUtil.fromJson(rs.getString("data"), GovernmentScheme.class));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
}
