package com.incident_managment.main_incident_dashboard.models;

import java.time.LocalDateTime;

public class AuditLog {
    private String id;
    private String timestamp;
    private String actor;
    private String action;
    private String targetResource;
    private String clientIp;
    private String status;
    private String riskLevel;

    public AuditLog() {
    }

    public AuditLog(String id, String timestamp, String actor, String action, String targetResource, String clientIp, String status, String riskLevel) {
        this.id = id;
        this.timestamp = timestamp;
        this.actor = actor;
        this.action = action;
        this.targetResource = targetResource;
        this.clientIp = clientIp;
        this.status = status;
        this.riskLevel = riskLevel;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getTargetResource() {
        return targetResource;
    }

    public void setTargetResource(String targetResource) {
        this.targetResource = targetResource;
    }

    public String getClientIp() {
        return clientIp;
    }

    public void setClientIp(String clientIp) {
        this.clientIp = clientIp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}
