package com.wida.patient.backend.controller;

import com.sun.net.httpserver.HttpExchange;
import com.wida.patient.backend.db.DatabaseManager;
import com.wida.patient.backend.model.Notification;

import java.util.List;
import java.util.Map;

public class NotificationController extends BaseController {

    @Override
    protected void processRequest(HttpExchange exchange) throws Exception {
        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        if (path.endsWith("/mark-all-read") && "POST".equalsIgnoreCase(method)) {
            DatabaseManager.getInstance().markAllNotificationsRead();
            sendJson(exchange, 200, Map.of("success", true));
            return;
        }

        if (path.contains("/read") && "PATCH".equalsIgnoreCase(method)) {
            String sub = path.substring("/api/patient/notifications/".length());
            String id = sub.substring(0, sub.indexOf("/read"));
            boolean ok = DatabaseManager.getInstance().markNotificationRead(id);
            if (ok) {
                sendJson(exchange, 200, Map.of("success", true));
            } else {
                sendJson(exchange, 404, Map.of("error", "Notification not found"));
            }
            return;
        }

        if ("DELETE".equalsIgnoreCase(method)) {
            String suffix = getPathSuffix(exchange, "/api/patient/notifications");
            boolean ok = DatabaseManager.getInstance().deleteNotification(suffix);
            if (ok) {
                sendJson(exchange, 200, Map.of("success", true));
            } else {
                sendJson(exchange, 404, Map.of("error", "Notification not found"));
            }
            return;
        }

        if ("GET".equalsIgnoreCase(method)) {
            List<Notification> list = DatabaseManager.getInstance().getNotifications();
            sendJson(exchange, 200, list);
            return;
        }

        sendJson(exchange, 404, Map.of("error", "Notifications route not found: " + path));
    }
}
