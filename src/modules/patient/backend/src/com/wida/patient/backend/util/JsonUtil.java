package com.wida.patient.backend.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * High-performance JSON utility wrapper using Google Gson.
 */
public class JsonUtil {
    private static final Gson GSON = new GsonBuilder()
            .setPrettyPrinting()
            .serializeNulls()
            .disableHtmlEscaping()
            .create();

    private static final Gson COMPACT_GSON = new GsonBuilder()
            .serializeNulls()
            .disableHtmlEscaping()
            .create();

    public static String toJson(Object object) {
        if (object == null) return "null";
        return GSON.toJson(object);
    }

    public static String toCompactJson(Object object) {
        if (object == null) return "null";
        return COMPACT_GSON.toJson(object);
    }

    public static <T> T fromJson(String json, Class<T> clazz) {
        if (json == null || json.trim().isEmpty()) return null;
        return GSON.fromJson(json, clazz);
    }

    public static <T> T fromJson(String json, Type type) {
        if (json == null || json.trim().isEmpty()) return null;
        return GSON.fromJson(json, type);
    }

    public static List<String> toStringList(String json) {
        if (json == null || json.trim().isEmpty()) return Collections.emptyList();
        Type type = new TypeToken<List<String>>() {}.getType();
        return GSON.fromJson(json, type);
    }

    @SuppressWarnings("unchecked")
    public static Map<String, Object> toMap(String json) {
        if (json == null || json.trim().isEmpty()) return Collections.emptyMap();
        Type type = new TypeToken<Map<String, Object>>() {}.getType();
        return GSON.fromJson(json, type);
    }
}
