package com.wida.patient.backend.controller;

import com.sun.net.httpserver.HttpExchange;
import com.wida.patient.backend.db.DatabaseManager;
import com.wida.patient.backend.model.WearableData;
import com.wida.patient.backend.model.WellnessMetric;

import java.util.List;
import java.util.Map;

public class WellnessController extends BaseController {

    @Override
    protected void processRequest(HttpExchange exchange) throws Exception {
        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        if (path.endsWith("/metrics") && "GET".equalsIgnoreCase(method)) {
            List<WellnessMetric> metrics = DatabaseManager.getInstance().getWellnessMetrics();
            sendJson(exchange, 200, metrics);
            return;
        }

        if (path.endsWith("/wearable") && "GET".equalsIgnoreCase(method)) {
            WearableData wearable = DatabaseManager.getInstance().getWearable();
            sendJson(exchange, 200, wearable);
            return;
        }

        sendJson(exchange, 404, Map.of("error", "Wellness route not found: " + path));
    }
}
