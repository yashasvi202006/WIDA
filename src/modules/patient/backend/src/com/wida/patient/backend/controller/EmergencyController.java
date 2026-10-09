package com.wida.patient.backend.controller;

import com.sun.net.httpserver.HttpExchange;
import com.wida.patient.backend.db.DatabaseManager;
import com.wida.patient.backend.model.EmergencyRequest;
import com.wida.patient.backend.model.PatientProfile;
import com.wida.patient.backend.util.JsonUtil;

import java.time.Instant;
import java.util.Map;

public class EmergencyController extends BaseController {

    @Override
    protected void processRequest(HttpExchange exchange) throws Exception {
        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        if (path.endsWith("/active") && "GET".equalsIgnoreCase(method)) {
            EmergencyRequest req = DatabaseManager.getInstance().getActiveEmergency();
            sendJson(exchange, 200, req);
            return;
        }

        if (path.endsWith("/sos") && "POST".equalsIgnoreCase(method)) {
            String bodyStr = readRequestBody(exchange);
            Map<String, Object> body = JsonUtil.toMap(bodyStr);
            String location = (String) body.get("location");
            if (location == null || location.trim().isEmpty()) {
                location = "Current GPS Location (Sector 62, Noida)";
            }

            PatientProfile profile = DatabaseManager.getInstance().getProfile();

            EmergencyRequest req = new EmergencyRequest();
            req.id = "sos-" + System.currentTimeMillis();
            req.patientId = profile != null ? profile.id : "pat-001";
            req.timestamp = Instant.now().toString();
            req.location = location;
            req.status = "Ambulance Dispatched";
            req.ambulanceNumber = "DL 1C AB 4492 (Cardiac ALS Unit)";
            req.hospitalName = "Fortis Escorts Heart Emergency";
            req.etaMinutes = 7;
            req.paramedicContact = "+91 98100 11223";

            req.criticalDetailsShared = new EmergencyRequest.CriticalDetails();
            if (profile != null) {
                req.criticalDetailsShared.bloodGroup = profile.bloodGroup;
                req.criticalDetailsShared.allergies = profile.allergies;
                req.criticalDetailsShared.chronicConditions = profile.chronicConditions;
                req.criticalDetailsShared.emergencyContact = profile.emergencyContact != null ? profile.emergencyContact.phone : "+91 99999 88888";
            }

            EmergencyRequest saved = DatabaseManager.getInstance().createEmergency(req);
            sendJson(exchange, 201, saved);
            return;
        }

        if (path.contains("/emergency/") && path.endsWith("/status") && "PATCH".equalsIgnoreCase(method)) {
            String sub = path.substring(path.indexOf("/emergency/") + "/emergency/".length());
            String id = sub.substring(0, sub.indexOf("/status"));
            String bodyStr = readRequestBody(exchange);
            Map<String, Object> body = JsonUtil.toMap(bodyStr);
            String status = (String) body.get("status");

            EmergencyRequest updated = DatabaseManager.getInstance().updateEmergencyStatus(id, status);
            if (updated != null) {
                sendJson(exchange, 200, updated);
            } else {
                sendJson(exchange, 404, Map.of("error", "Emergency request not found with id: " + id));
            }
            return;
        }

        sendJson(exchange, 404, Map.of("error", "Emergency route not found: " + path));
    }
}
