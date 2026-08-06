package com.incident_managment.main_incident_dashboard.models;

import java.util.List;

public class Postmortem {
    private String id;
    private String incidentId;
    private String title;
    private String author;
    private String summary;
    private String rootCause;
    private List<String> actionItems;
    private String severity;
    private String status; // DRAFT, IN_REVIEW, PUBLISHED
    private String createdAt;
    private String updatedAt;

    public Postmortem() {
    }

    public Postmortem(String id, String incidentId, String title, String author, String summary, String rootCause, List<String> actionItems, String severity, String status, String createdAt, String updatedAt) {
        this.id = id;
        this.incidentId = incidentId;
        this.title = title;
        this.author = author;
        this.summary = summary;
        this.rootCause = rootCause;
        this.actionItems = actionItems;
        this.severity = severity;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(String incidentId) {
        this.incidentId = incidentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getRootCause() {
        return rootCause;
    }

    public void setRootCause(String rootCause) {
        this.rootCause = rootCause;
    }

    public List<String> getActionItems() {
        return actionItems;
    }

    public void setActionItems(List<String> actionItems) {
        this.actionItems = actionItems;
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

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
