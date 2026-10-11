package com.wida.patient.backend.controller;

import com.sun.net.httpserver.HttpExchange;
import com.wida.patient.backend.db.DatabaseManager;
import com.wida.patient.backend.model.PharmacyOrder;
import com.wida.patient.backend.model.Prescription;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PrescriptionController extends BaseController {

    @Override
    protected void processRequest(HttpExchange exchange) throws Exception {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        // Order prescription: /api/patient/prescriptions/{id}/order
        if (path.contains("/order") && "POST".equalsIgnoreCase(method)) {
            String sub = path.substring("/api/patient/prescriptions/".length());
            String id = sub.substring(0, sub.indexOf("/order"));

            Prescription rx = DatabaseManager.getInstance().orderPrescription(id);
            if (rx != null) {
                List<PharmacyOrder> orders = DatabaseManager.getInstance().getPharmacyOrders();
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("prescription", rx);
                resp.put("orders", orders);
                sendJson(exchange, 200, resp);
            } else {
                sendJson(exchange, 404, Map.of("error", "Prescription not found with id: " + id));
            }
            return;
        }

        if ("GET".equalsIgnoreCase(method)) {
            List<Prescription> list = DatabaseManager.getInstance().getPrescriptions();
            sendJson(exchange, 200, list);
            return;
        }

        sendJson(exchange, 405, Map.of("error", "Method not allowed: " + method));
    }
}
