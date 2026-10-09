package com.wida.patient.backend.model;

import java.util.List;

public class ConsentPermission {
    public String id;
    public String providerName;
    public String providerType;
    public String accessLevel;
    public String grantedOn;
    public String expiresOn;
    public String status; // 'Active' | 'Revoked' | 'Expired'
    public List<String> dataCategories;
}
