package com.incident_managment.main_incident_dashboard.models;

import java.time.LocalDateTime;

public class SystemHealth {
    private String serviceId;
    private String serviceName;
    private String category;
    private String status; // Operational, Degraded Performance, Partial Outage, Major Outage
    private double latencyMs;
    private double cpuUsagePercent;
    private double memoryUsagePercent;
    private double uptimePercent;
    private LocalDateTime lastPing;

    public SystemHealth() {
        this.lastPing = LocalDateTime.now();
    }

    public SystemHealth(String serviceId, String serviceName, String category, String status, double latencyMs, double cpuUsagePercent, double memoryUsagePercent, double uptimePercent) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.category = category;
        this.status = status;
        this.latencyMs = latencyMs;
        this.cpuUsagePercent = cpuUsagePercent;
        this.memoryUsagePercent = memoryUsagePercent;
        this.uptimePercent = uptimePercent;
        this.lastPing = LocalDateTime.now();
    }

    // Getters and Setters
    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getLatencyMs() { return latencyMs; }
    public void setLatencyMs(double latencyMs) { this.latencyMs = latencyMs; }

    public double getCpuUsagePercent() { return cpuUsagePercent; }
    public void setCpuUsagePercent(double cpuUsagePercent) { this.cpuUsagePercent = cpuUsagePercent; }

    public double getMemoryUsagePercent() { return memoryUsagePercent; }
    public void setMemoryUsagePercent(double memoryUsagePercent) { this.memoryUsagePercent = memoryUsagePercent; }

    public double getUptimePercent() { return uptimePercent; }
    public void setUptimePercent(double uptimePercent) { this.uptimePercent = uptimePercent; }

    public LocalDateTime getLastPing() { return lastPing; }
    public void setLastPing(LocalDateTime lastPing) { this.lastPing = lastPing; }
}
