package com.wida.patient.backend.controller;

import com.sun.net.httpserver.HttpExchange;
import com.wida.patient.backend.db.DatabaseManager;
import com.wida.patient.backend.model.Doctor;

import java.util.List;
import java.util.Map;

public class DoctorController extends BaseController {

    @Override
    protected void processRequest(HttpExchange exchange) throws Exception {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        if (!"GET".equalsIgnoreCase(method)) {
            sendJson(exchange, 405, Map.of("error", "Method not allowed: " + method));
            return;
        }

        String suffix = getPathSuffix(exchange, "/api/patient/doctors");

        if (suffix.isEmpty()) {
            Map<String, String> q = getQueryParams(exchange);
            String search = q.get("search");
            String system = q.get("system");
            String specialty = q.get("specialty");

            List<Doctor> doctors = DatabaseManager.getInstance().getDoctors(search, system, specialty);
            sendJson(exchange, 200, doctors);
            return;
        }

        // doctor by ID
        Doctor doc = DatabaseManager.getInstance().getDoctorById(suffix);
        if (doc != null) {
            sendJson(exchange, 200, doc);
        } else {
            sendJson(exchange, 404, Map.of("error", "Doctor not found with id: " + suffix));
        }
    }
}
