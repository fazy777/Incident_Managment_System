package com.incident_managment.main_incident_dashboard.models;

public class EscalationRule {
    private String id;
    private String severity;
    private int responseWindowMinutes;
    private String primaryContactRole;
    private String secondaryContactRole;
    private int executiveEscalationMinutes;
    private String autoTriggerPolicy;

    public EscalationRule() {
    }

    public EscalationRule(String id, String severity, int responseWindowMinutes, String primaryContactRole, String secondaryContactRole, int executiveEscalationMinutes, String autoTriggerPolicy) {
        this.id = id;
        this.severity = severity;
        this.responseWindowMinutes = responseWindowMinutes;
        this.primaryContactRole = primaryContactRole;
        this.secondaryContactRole = secondaryContactRole;
        this.executiveEscalationMinutes = executiveEscalationMinutes;
        this.autoTriggerPolicy = autoTriggerPolicy;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public int getResponseWindowMinutes() {
        return responseWindowMinutes;
    }

    public void setResponseWindowMinutes(int responseWindowMinutes) {
        this.responseWindowMinutes = responseWindowMinutes;
    }

    public String getPrimaryContactRole() {
        return primaryContactRole;
    }

    public void setPrimaryContactRole(String primaryContactRole) {
        this.primaryContactRole = primaryContactRole;
    }

    public String getSecondaryContactRole() {
        return secondaryContactRole;
    }

    public void setSecondaryContactRole(String secondaryContactRole) {
        this.secondaryContactRole = secondaryContactRole;
    }

    public int getExecutiveEscalationMinutes() {
        return executiveEscalationMinutes;
    }

    public void setExecutiveEscalationMinutes(int executiveEscalationMinutes) {
        this.executiveEscalationMinutes = executiveEscalationMinutes;
    }

    public String getAutoTriggerPolicy() {
        return autoTriggerPolicy;
    }

    public void setAutoTriggerPolicy(String autoTriggerPolicy) {
        this.autoTriggerPolicy = autoTriggerPolicy;
    }
}
