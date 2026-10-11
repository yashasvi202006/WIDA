package com.wida.patient.backend.config;

import java.io.File;

public class DatabaseConfig {
    public static final int DEFAULT_PORT = 8080;
    public static final String DB_FILENAME = "patient.db";

    public static String getDbPath() {
        String customPath = System.getProperty("wida.db.path", System.getenv("WIDA_DB_PATH"));
        if (customPath != null && !customPath.trim().isEmpty()) {
            return customPath;
        }
        File backendDir = new File(System.getProperty("user.dir"));
        return new File(backendDir, DB_FILENAME).getAbsolutePath();
    }

    public static String getJdbcUrl() {
        return "jdbc:sqlite:" + getDbPath();
    }

    public static int getServerPort() {
        String portStr = System.getProperty("wida.server.port", System.getenv("PORT"));
        if (portStr != null) {
            try {
                return Integer.parseInt(portStr);
            } catch (NumberFormatException ignored) {}
        }
        return DEFAULT_PORT;
    }
}
