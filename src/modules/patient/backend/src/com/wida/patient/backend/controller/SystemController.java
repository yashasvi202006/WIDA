package com.wida.patient.backend.controller;

import com.sun.net.httpserver.HttpExchange;
import com.wida.patient.backend.db.DatabaseManager;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class SystemController extends BaseController {

    @Override
    protected void processRequest(HttpExchange exchange) throws Exception {
        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        if (path.endsWith("/health") && "GET".equalsIgnoreCase(method)) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("status", "ok");
            resp.put("engine", "Java 21 Enterprise Server");
            resp.put("database", "SQLite Relational Database (Connected: patient.db)");
            resp.put("module", "WIDA Patient Platform Backend (Java)");
            resp.put("version", "1.0.0");
            resp.put("timestamp", Instant.now().toString());
            sendJson(exchange, 200, resp);
            return;
        }

        if (path.endsWith("/reset-db") && "POST".equalsIgnoreCase(method)) {
            DatabaseManager.getInstance().resetDatabase();
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("message", "SQLite Patient Database reset and re-seeded successfully.");
            sendJson(exchange, 200, resp);
            return;
        }

        sendJson(exchange, 404, Map.of("error", "Endpoint not found: " + path));
    }
}
