package com.wida.patient.backend.controller;

import com.sun.net.httpserver.HttpExchange;
import com.wida.patient.backend.db.DatabaseManager;
import com.wida.patient.backend.model.PatientProfile;
import com.wida.patient.backend.util.JsonUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AuthController extends BaseController {

    @Override
    protected void processRequest(HttpExchange exchange) throws Exception {
        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        if (path.endsWith("/login") && "POST".equalsIgnoreCase(method)) {
            String bodyStr = readRequestBody(exchange);
            Map<String, Object> body = JsonUtil.toMap(bodyStr);
            String emailOrAbha = (String) body.get("emailOrAbha");

            if (emailOrAbha == null || emailOrAbha.trim().isEmpty()) {
                sendJson(exchange, 400, Map.of("error", "Email, Mobile Number or ABHA ID is required"));
                return;
            }

            PatientProfile profile = DatabaseManager.getInstance().getProfile();
            Map<String, Object> resp = new HashMap<>();
            resp.put("token", "wida_jwt_java_" + System.currentTimeMillis() + "_pat");
            resp.put("user", profile);
            resp.put("message", "Authentication successful (Java Backend)");
            sendJson(exchange, 200, resp);
            return;
        }

        if (path.endsWith("/register") && "POST".equalsIgnoreCase(method)) {
            String bodyStr = readRequestBody(exchange);
            PatientProfile newProfile = JsonUtil.fromJson(bodyStr, PatientProfile.class);

            if (newProfile == null || newProfile.name == null || newProfile.phone == null) {
                sendJson(exchange, 400, Map.of("error", "Full Name and Phone Number are required"));
                return;
            }

            newProfile.id = "pat-" + System.currentTimeMillis();
            if (newProfile.abhaId == null || newProfile.abhaId.trim().isEmpty()) {
                newProfile.abhaId = "91-" + (1000 + (int)(Math.random() * 9000)) + "-" +
                        (1000 + (int)(Math.random() * 9000)) + "-" +
                        (1000 + (int)(Math.random() * 9000));
            }
            if (newProfile.avatarUrl == null) {
                newProfile.avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250";
            }

            PatientProfile saved = DatabaseManager.getInstance().updateProfile(newProfile);
            Map<String, Object> resp = new HashMap<>();
            resp.put("token", "wida_jwt_java_" + System.currentTimeMillis() + "_pat");
            resp.put("user", saved);
            resp.put("message", "Account successfully registered and saved to SQLite Database.");
            sendJson(exchange, 201, resp);
            return;
        }

        if (path.endsWith("/logout") && "POST".equalsIgnoreCase(method)) {
            sendJson(exchange, 200, Map.of("success", true, "message", "Logged out successfully"));
            return;
        }

        if (path.endsWith("/me") && "GET".equalsIgnoreCase(method)) {
            PatientProfile profile = DatabaseManager.getInstance().getProfile();
            sendJson(exchange, 200, Map.of("user", profile));
            return;
        }

        sendJson(exchange, 404, Map.of("error", "Auth route not found: " + path));
    }
}
