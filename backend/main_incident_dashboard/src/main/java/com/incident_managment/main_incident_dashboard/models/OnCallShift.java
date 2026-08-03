package com.incident_managment.main_incident_dashboard.models;

import java.time.LocalDateTime;

public class OnCallShift {
    private String id;
    private String engineerName;
    private String email;
    private String phone;
    private String role;
    private int tierLevel;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private String notificationPreference;

    public OnCallShift() {
    }

    public OnCallShift(String id, String engineerName, String email, String phone, String role, int tierLevel, LocalDateTime startTime, LocalDateTime endTime, String status, String notificationPreference) {
        this.id = id;
        this.engineerName = engineerName;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.tierLevel = tierLevel;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.notificationPreference = notificationPreference;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEngineerName() {
        return engineerName;
    }

    public void setEngineerName(String engineerName) {
        this.engineerName = engineerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getTierLevel() {
        return tierLevel;
    }

    public void setTierLevel(int tierLevel) {
        this.tierLevel = tierLevel;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotificationPreference() {
        return notificationPreference;
    }

    public void setNotificationPreference(String notificationPreference) {
        this.notificationPreference = notificationPreference;
    }
}
