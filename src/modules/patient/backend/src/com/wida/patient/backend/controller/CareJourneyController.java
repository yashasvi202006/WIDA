package com.wida.patient.backend.controller;

import com.sun.net.httpserver.HttpExchange;
import com.wida.patient.backend.db.DatabaseManager;
import com.wida.patient.backend.model.CareJourneyStep;

import java.util.List;
import java.util.Map;

public class CareJourneyController extends BaseController {

    @Override
    protected void processRequest(HttpExchange exchange) throws Exception {
        String method = exchange.getRequestMethod();

        if ("GET".equalsIgnoreCase(method)) {
            List<CareJourneyStep> steps = DatabaseManager.getInstance().getCareJourney();
            sendJson(exchange, 200, steps);
            return;
        }

        sendJson(exchange, 405, Map.of("error", "Method not allowed: " + method));
    }
}
