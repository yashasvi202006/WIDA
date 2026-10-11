package com.wida.patient.backend.controller;

import com.sun.net.httpserver.HttpExchange;
import com.wida.patient.backend.db.DatabaseManager;
import com.wida.patient.backend.model.Appointment;
import com.wida.patient.backend.util.JsonUtil;

import java.util.List;
import java.util.Map;

public class AppointmentController extends BaseController {

    @Override
    protected void processRequest(HttpExchange exchange) throws Exception {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        // Cancel appointment endpoint: /api/patient/appointments/{id}/cancel
        if (path.contains("/cancel") && "PATCH".equalsIgnoreCase(method)) {
            String sub = path.substring("/api/patient/appointments/".length());
            String id = sub.substring(0, sub.indexOf("/cancel"));
            Appointment cancelled = DatabaseManager.getInstance().cancelAppointment(id);
            if (cancelled != null) {
                sendJson(exchange, 200, cancelled);
            } else {
                sendJson(exchange, 404, Map.of("error", "Appointment not found with id: " + id));
            }
            return;
        }

        if ("GET".equalsIgnoreCase(method)) {
            List<Appointment> list = DatabaseManager.getInstance().getAppointments();
            sendJson(exchange, 200, list);
            return;
        }

        if ("POST".equalsIgnoreCase(method)) {
            String bodyStr = readRequestBody(exchange);
            Appointment apt = JsonUtil.fromJson(bodyStr, Appointment.class);

            if (apt == null || apt.doctorId == null || apt.date == null || apt.time == null) {
                sendJson(exchange, 400, Map.of("error", "Missing required appointment scheduling parameters"));
                return;
            }

            apt.id = "apt-" + System.currentTimeMillis();
            if (apt.status == null) apt.status = "Confirmed";
            if (apt.joinUrl == null && "Online".equalsIgnoreCase(apt.type)) {
                apt.joinUrl = "https://telehealth.wida.health/room/" + apt.id;
            }

            Appointment created = DatabaseManager.getInstance().createAppointment(apt);
            sendJson(exchange, 201, created);
            return;
        }

        sendJson(exchange, 405, Map.of("error", "Method not allowed: " + method));
    }
}
