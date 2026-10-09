package com.wida.patient.backend;

import com.sun.net.httpserver.HttpServer;
import com.wida.patient.backend.config.DatabaseConfig;
import com.wida.patient.backend.controller.*;
import com.wida.patient.backend.db.DatabaseManager;

import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

/**
 * Main application entry point for WIDA Patient Module Java Backend.
 * Uses high-performance Java 21 Virtual Threads and SQLite relational database.
 */
public class PatientBackendServer {

    public static void main(String[] args) {
        int port = DatabaseConfig.getServerPort();

        System.out.println("========================================================================");
        System.out.println("   WIDA PATIENT MODULE - JAVA ENTERPRISE BACKEND & DATABASE SERVER     ");
        System.out.println("========================================================================");
        System.out.println("[WIDA] Starting Java Backend on port: " + port);

        try {
            // 1. Initialize SQLite Database & Relational Schema
            DatabaseManager dbManager = DatabaseManager.getInstance();

            // 2. Start HTTP Server
            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

            // 3. Register HTTP REST Controllers
            server.createContext("/api/system", new SystemController());
            server.createContext("/api/patient/auth", new AuthController());
            server.createContext("/api/patient/profile", new ProfileController());
            server.createContext("/api/patient/doctors", new DoctorController());
            server.createContext("/api/patient/appointments", new AppointmentController());
            server.createContext("/api/patient/prescriptions", new PrescriptionController());
            server.createContext("/api/patient/pharmacy", new PharmacyController());
            server.createContext("/api/patient/diagnostics", new DiagnosticsController());
            server.createContext("/api/patient/care-journey", new CareJourneyController());
            server.createContext("/api/patient/wellness", new WellnessController());
            server.createContext("/api/patient/emergency", new EmergencyController());
            server.createContext("/api/patient/notifications", new NotificationController());
            server.createContext("/api/patient/reminders", new ReminderController());
            server.createContext("/api/patient/privacy/consent", new ConsentController());
            server.createContext("/api/patient/vault", new VaultController());
            server.createContext("/api/patient/schemes", new SchemeController());
            server.createContext("/api/patient/ai", new AiCareController());

            // 4. Set Virtual Thread Executor for high concurrency (Java 21)
            server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());

            server.start();

            System.out.println("[WIDA] Java Backend Server successfully started!");
            System.out.println("[WIDA] Server URL:       http://localhost:" + port);
            System.out.println("[WIDA] Health Check:     http://localhost:" + port + "/api/system/health");
            System.out.println("[WIDA] Database:         " + DatabaseConfig.getDbPath());
            System.out.println("[WIDA] Relational Engine: SQLite 3 (JDBC Driver Active)");
            System.out.println("[WIDA] Concurrency:      Java 21 Virtual Threads Enabled");
            System.out.println("========================================================================");

        } catch (Exception e) {
            System.err.println("[WIDA] Fatal error starting Java backend server: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}
