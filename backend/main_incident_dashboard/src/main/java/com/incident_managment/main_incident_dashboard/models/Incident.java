package com.incident_managment.main_incident_dashboard.models;

import java.time.LocalDateTime;

public class Incident {
    private String id;
    private String title;
    private String description;
    private String severity; // Critical, High, Medium, Low
    private String status;   // Investigate, In Progress, Mitigated, Resolved
    private String category; // Database, Security Breach, API Gateway, Infrastructure, Auth
    private String systemComponent;
    private String assignee;
    private String reporterName;
    private LocalDateTime createdAt;
    private LocalDateTime slaDeadline;

    public Incident() {
        this.createdAt = LocalDateTime.now();
    }

    public Incident(String id, String title, String description, String severity, String status, String category, String systemComponent, String assignee, String reporterName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.severity = severity;
        this.status = status;
        this.category = category;
        this.systemComponent = systemComponent;
        this.assignee = assignee;
        this.reporterName = reporterName;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSystemComponent() { return systemComponent; }
    public void setSystemComponent(String systemComponent) { this.systemComponent = systemComponent; }

    public String getAssignee() { return assignee; }
    public void setAssignee(String assignee) { this.assignee = assignee; }

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getSlaDeadline() { return slaDeadline; }
    public void setSlaDeadline(LocalDateTime slaDeadline) { this.slaDeadline = slaDeadline; }
}
