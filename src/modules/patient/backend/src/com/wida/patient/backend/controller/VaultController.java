package com.wida.patient.backend.controller;

import com.sun.net.httpserver.HttpExchange;
import com.wida.patient.backend.db.DatabaseManager;
import com.wida.patient.backend.model.MedicalDocument;
import com.wida.patient.backend.util.JsonUtil;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

public class VaultController extends BaseController {

    @Override
    protected void processRequest(HttpExchange exchange) throws Exception {
        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        if (path.endsWith("/documents") && "GET".equalsIgnoreCase(method)) {
            List<MedicalDocument> docs = DatabaseManager.getInstance().getMedicalDocuments();
            sendJson(exchange, 200, docs);
            return;
        }

        if (path.endsWith("/upload") && "POST".equalsIgnoreCase(method)) {
            String bodyStr = readRequestBody(exchange);
            MedicalDocument doc = JsonUtil.fromJson(bodyStr, MedicalDocument.class);
            if (doc == null || doc.title == null) {
                doc = new MedicalDocument();
                doc.title = "Uploaded Medical Document";
            }

            doc.id = "doc-" + System.currentTimeMillis();
            if (doc.date == null) {
                doc.date = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
            }
            if (doc.fileSize == null) doc.fileSize = "1.2 MB";
            if (doc.uploader == null) doc.uploader = "Self Upload";
            if (doc.sharingStatus == null) doc.sharingStatus = "Private Vault";
            if (doc.fileType == null) doc.fileType = "pdf";
            if (doc.category == null) doc.category = "Medical Reports";

            MedicalDocument created = DatabaseManager.getInstance().createMedicalDocument(doc);
            sendJson(exchange, 201, created);
            return;
        }

        sendJson(exchange, 404, Map.of("error", "Vault route not found: " + path));
    }
}
