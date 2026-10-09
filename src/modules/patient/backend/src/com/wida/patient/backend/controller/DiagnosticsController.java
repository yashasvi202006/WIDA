package com.wida.patient.backend.controller;

import com.sun.net.httpserver.HttpExchange;
import com.wida.patient.backend.db.DatabaseManager;
import com.wida.patient.backend.model.*;
import com.wida.patient.backend.util.JsonUtil;

import java.util.List;
import java.util.Map;

public class DiagnosticsController extends BaseController {

    @Override
    protected void processRequest(HttpExchange exchange) throws Exception {
        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        if (path.endsWith("/tests") && "GET".equalsIgnoreCase(method)) {
            List<DiagnosticTest> tests = DatabaseManager.getInstance().getDiagnosticTests();
            sendJson(exchange, 200, tests);
            return;
        }

        if (path.endsWith("/labs") && "GET".equalsIgnoreCase(method)) {
            List<Lab> labs = DatabaseManager.getInstance().getLabs();
            sendJson(exchange, 200, labs);
            return;
        }

        if (path.endsWith("/reports") && "GET".equalsIgnoreCase(method)) {
            List<LabReport> reports = DatabaseManager.getInstance().getLabReports();
            sendJson(exchange, 200, reports);
            return;
        }

        if (path.endsWith("/bookings") && "GET".equalsIgnoreCase(method)) {
            List<LabBooking> bookings = DatabaseManager.getInstance().getLabBookings();
            sendJson(exchange, 200, bookings);
            return;
        }

        if (path.endsWith("/book") && "POST".equalsIgnoreCase(method)) {
            String bodyStr = readRequestBody(exchange);
            LabBooking booking = JsonUtil.fromJson(bodyStr, LabBooking.class);
            if (booking == null || booking.testId == null || booking.date == null) {
                sendJson(exchange, 400, Map.of("error", "Missing lab test booking fields"));
                return;
            }

            booking.id = "book-" + System.currentTimeMillis();
            if (booking.status == null) booking.status = "Booked";
            if (booking.collectionType == null) booking.collectionType = "Home Sample Collection";

            LabBooking created = DatabaseManager.getInstance().createLabBooking(booking);
            sendJson(exchange, 201, created);
            return;
        }

        if (path.contains("/bookings/") && path.endsWith("/ready") && "POST".equalsIgnoreCase(method)) {
            String sub = path.substring(path.indexOf("/bookings/") + "/bookings/".length());
            String id = sub.substring(0, sub.indexOf("/ready"));
            LabBooking updated = DatabaseManager.getInstance().markReportReady(id);
            if (updated != null) {
                sendJson(exchange, 200, updated);
            } else {
                sendJson(exchange, 404, Map.of("error", "Lab booking not found with id: " + id));
            }
            return;
        }

        sendJson(exchange, 404, Map.of("error", "Diagnostics route not found: " + path));
    }
}
