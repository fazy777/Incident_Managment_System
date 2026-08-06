package com.incident_managment.main_incident_dashboard.models;

public class Notification {
    private String id;
    private String recipient;
    private String channel; // SLACK, EMAIL, SMS, PAGERDUTY
    private String message;
    private String severity;
    private String status; // DELIVERED, PENDING, FAILED
    private String timestamp;
    private String incidentId;

    public Notification() {
    }

    public Notification(String id, String recipient, String channel, String message, String severity, String status, String timestamp, String incidentId) {
        this.id = id;
        this.recipient = recipient;
        this.channel = channel;
        this.message = message;
        this.severity = severity;
        this.status = status;
        this.timestamp = timestamp;
        this.incidentId = incidentId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(String incidentId) {
        this.incidentId = incidentId;
    }
}
