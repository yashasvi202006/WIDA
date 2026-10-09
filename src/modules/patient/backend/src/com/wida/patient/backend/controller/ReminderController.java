package com.wida.patient.backend.controller;

import com.sun.net.httpserver.HttpExchange;
import com.wida.patient.backend.db.DatabaseManager;
import com.wida.patient.backend.model.Reminder;
import com.wida.patient.backend.util.JsonUtil;

import java.util.List;
import java.util.Map;

public class ReminderController extends BaseController {

    @Override
    protected void processRequest(HttpExchange exchange) throws Exception {
        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        if (path.contains("/status") && "PATCH".equalsIgnoreCase(method)) {
            String sub = path.substring("/api/patient/reminders/".length());
            String id = sub.substring(0, sub.indexOf("/status"));
            String bodyStr = readRequestBody(exchange);
            Map<String, Object> body = JsonUtil.toMap(bodyStr);
            String status = (String) body.get("status");

            Reminder updated = DatabaseManager.getInstance().updateReminderStatus(id, status);
            if (updated != null) {
                sendJson(exchange, 200, updated);
            } else {
                sendJson(exchange, 404, Map.of("error", "Reminder not found with id: " + id));
            }
            return;
        }

        if ("GET".equalsIgnoreCase(method)) {
            List<Reminder> list = DatabaseManager.getInstance().getReminders();
            sendJson(exchange, 200, list);
            return;
        }

        if ("POST".equalsIgnoreCase(method)) {
            String bodyStr = readRequestBody(exchange);
            Reminder r = JsonUtil.fromJson(bodyStr, Reminder.class);
            if (r == null || r.title == null) {
                sendJson(exchange, 400, Map.of("error", "Reminder title is required"));
                return;
            }

            r.id = "rem-" + System.currentTimeMillis();
            if (r.status == null) r.status = "Upcoming";
            if (r.priority == null) r.priority = "medium";
            if (r.repeat == null) r.repeat = "Daily";

            Reminder created = DatabaseManager.getInstance().createReminder(r);
            sendJson(exchange, 201, created);
            return;
        }

        if ("DELETE".equalsIgnoreCase(method)) {
            String id = getPathSuffix(exchange, "/api/patient/reminders");
            boolean ok = DatabaseManager.getInstance().deleteReminder(id);
            if (ok) {
                sendJson(exchange, 200, Map.of("success", true));
            } else {
                sendJson(exchange, 404, Map.of("error", "Reminder not found with id: " + id));
            }
            return;
        }

        sendJson(exchange, 404, Map.of("error", "Reminders route not found: " + path));
    }
}
