package com.incident_managment.main_incident_dashboard.controllers;

import com.incident_managment.main_incident_dashboard.models.SystemHealth;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/system-health")
@CrossOrigin(origins = "*")
public class SystemHealthController {

    private final ConcurrentHashMap<String, SystemHealth> healthMap = new ConcurrentHashMap<>();

    public SystemHealthController() {
        // Seed default microservice health records
        healthMap.put("SVC-01", new SystemHealth("SVC-01", "Auth & OAuth2 Gateway", "Authentication", "Operational", 24.5, 34.2, 52.1, 99.99));
        healthMap.put("SVC-02", new SystemHealth("SVC-02", "Core PostgreSQL Cluster", "Database", "Degraded Performance", 185.0, 88.4, 79.5, 99.85));
        healthMap.put("SVC-03", new SystemHealth("SVC-03", "Kafka Message Bus", "Messaging Queue", "Operational", 12.1, 28.0, 41.3, 100.0));
        healthMap.put("SVC-04", new SystemHealth("SVC-04", "Payment Processing API", "Integrations", "Operational", 45.2, 19.8, 38.6, 99.95));
        healthMap.put("SVC-05", new SystemHealth("SVC-05", "S3 Storage & Backup Vault", "Storage", "Operational", 18.3, 14.2, 29.0, 99.99));
        healthMap.put("SVC-06", new SystemHealth("SVC-06", "Elasticsearch Analytics Node", "Logging", "Partial Outage", 420.0, 94.1, 91.8, 98.50));
    }

    @GetMapping
    public List<SystemHealth> getSystemHealth() {
        return new ArrayList<>(healthMap.values());
    }

    @PostMapping("/{id}/ping")
    public ResponseEntity<SystemHealth> pingService(@PathVariable String id) {
        SystemHealth service = healthMap.get(id);
        if (service != null) {
            service.setLatencyMs(15 + Math.random() * 25);
            service.setLastPing(java.time.LocalDateTime.now());
            return ResponseEntity.ok(service);
        }
        return ResponseEntity.notFound().build();
    }
}
