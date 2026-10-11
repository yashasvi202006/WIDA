package com.wida.patient.backend.controller;

import com.sun.net.httpserver.HttpExchange;
import com.wida.patient.backend.db.DatabaseManager;
import com.wida.patient.backend.model.PatientProfile;
import com.wida.patient.backend.util.JsonUtil;

import java.util.Map;

public class ProfileController extends BaseController {

    @Override
    protected void processRequest(HttpExchange exchange) throws Exception {
        String method = exchange.getRequestMethod();

        if ("GET".equalsIgnoreCase(method)) {
            PatientProfile profile = DatabaseManager.getInstance().getProfile();
            if (profile != null) {
                sendJson(exchange, 200, profile);
            } else {
                sendJson(exchange, 404, Map.of("error", "Profile not found"));
            }
            return;
        }

        if ("PUT".equalsIgnoreCase(method)) {
            String bodyStr = readRequestBody(exchange);
            PatientProfile updates = JsonUtil.fromJson(bodyStr, PatientProfile.class);
            if (updates != null) {
                PatientProfile current = DatabaseManager.getInstance().getProfile();
                if (current != null && (updates.id == null || updates.id.isEmpty())) {
                    updates.id = current.id;
                }
                PatientProfile saved = DatabaseManager.getInstance().updateProfile(updates);
                sendJson(exchange, 200, saved);
                return;
            }
            sendJson(exchange, 400, Map.of("error", "Invalid profile body"));
            return;
        }

        sendJson(exchange, 405, Map.of("error", "Method not allowed: " + method));
    }
}
