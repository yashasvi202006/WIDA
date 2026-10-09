package com.wida.patient.backend.controller;

import com.sun.net.httpserver.HttpExchange;
import com.wida.patient.backend.db.DatabaseManager;
import com.wida.patient.backend.model.PatientProfile;
import com.wida.patient.backend.util.JsonUtil;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AiCareController extends BaseController {

    @Override
    protected void processRequest(HttpExchange exchange) throws Exception {
        String method = exchange.getRequestMethod();

        if ("POST".equalsIgnoreCase(method)) {
            String bodyStr = readRequestBody(exchange);
            Map<String, Object> body = JsonUtil.toMap(bodyStr);
            String message = (String) body.get("message");
            String query = message != null ? message.toLowerCase() : "";

            PatientProfile profile = DatabaseManager.getInstance().getProfile();
            String patientContext = (profile != null && profile.chronicConditions != null && !profile.chronicConditions.isEmpty())
                    ? profile.chronicConditions.get(0)
                    : "Hypertension";

            String reply = "Thank you for sharing your symptoms. Based on your health profile (" +
                    patientContext + "), it is advisable to monitor your vital signs daily and stay hydrated. If symptoms persist or worsen, connect with your verified doctor promptly.";

            List<String> recs = Arrays.asList(
                    "Log today’s blood pressure in Wellness tab",
                    "Check medication compliance in Reminders",
                    "Schedule follow-up consultation with Dr. Sharma"
            );

            if (query.contains("headache") || query.contains("migraine") || query.contains("dizziness")) {
                reply = "Headaches or dizziness can indicate blood pressure fluctuations or dehydration. Given your active prescription for hypertension, please take a BP reading now. If systolic BP exceeds 140 mmHg, contact Dr. Sharma immediately.";
                recs = Arrays.asList(
                        "Check current BP with digital cuff",
                        "Avoid sudden postural changes",
                        "Consult Dr. Sharma via Telehealth"
                );
            } else if (query.contains("fever") || query.contains("cold") || query.contains("cough") || query.contains("throat")) {
                reply = "For mild upper respiratory symptoms or fever, ensure plenty of warm fluids, rest, and isolate if necessary. If temperature exceeds 101°F or persists over 48 hours, consult a general physician.";
                recs = Arrays.asList(
                        "Monitor temperature twice daily",
                        "Stay well hydrated with warm liquids",
                        "Book General Physician consultation"
                );
            } else if (query.contains("doctor") || query.contains("appointment") || query.contains("book")) {
                reply = "You can schedule consultations directly with board-certified specialists in the Doctors tab. Dr. Sharma (Cardiologist) has available slots today.";
                recs = Arrays.asList(
                        "Browse Doctor directory",
                        "Select Telehealth or In-person slot",
                        "Prepare questions for consultation"
                );
            } else if (query.contains("medicine") || query.contains("pill") || query.contains("refill") || query.contains("prescription")) {
                reply = "Your active prescription includes Telmisartan 40mg and Atorvastatin 10mg. You can order direct door-step refills through the Pharmacy tab.";
                recs = Arrays.asList(
                        "View Active Prescriptions",
                        "Order 30-day refill from HealthPlus",
                        "Set pill reminder alerts"
                );
            }

            Map<String, Object> resp = new HashMap<>();
            resp.put("id", "ai-msg-" + System.currentTimeMillis());
            resp.put("sender", "ai");
            resp.put("text", reply);
            resp.put("timestamp", "Just now");
            resp.put("recommendations", recs);

            sendJson(exchange, 200, resp);
            return;
        }

        sendJson(exchange, 405, Map.of("error", "Method not allowed: " + method));
    }
}
