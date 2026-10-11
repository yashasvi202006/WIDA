package com.wida.patient.backend.controller;

import com.sun.net.httpserver.HttpExchange;
import com.wida.patient.backend.db.DatabaseManager;
import com.wida.patient.backend.model.ConsentPermission;

import java.util.List;
import java.util.Map;

public class ConsentController extends BaseController {

    @Override
    protected void processRequest(HttpExchange exchange) throws Exception {
        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        if (path.contains("/toggle") && "PATCH".equalsIgnoreCase(method)) {
            String sub = path.substring("/api/patient/privacy/consent/".length());
            String id = sub.substring(0, sub.indexOf("/toggle"));
            ConsentPermission cp = DatabaseManager.getInstance().toggleConsent(id);
            if (cp != null) {
                sendJson(exchange, 200, cp);
            } else {
                sendJson(exchange, 404, Map.of("error", "Consent entry not found with id: " + id));
            }
            return;
        }

        if ("GET".equalsIgnoreCase(method)) {
            List<ConsentPermission> list = DatabaseManager.getInstance().getConsentPermissions();
            sendJson(exchange, 200, list);
            return;
        }

        sendJson(exchange, 404, Map.of("error", "Consent route not found: " + path));
    }
}
