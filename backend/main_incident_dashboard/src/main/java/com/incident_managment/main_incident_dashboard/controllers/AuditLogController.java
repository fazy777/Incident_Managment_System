package com.incident_managment.main_incident_dashboard.controllers;

import com.incident_managment.main_incident_dashboard.models.AuditLog;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin(origins = "*")
public class AuditLogController {

    private final ConcurrentHashMap<String, AuditLog> auditLogMap = new ConcurrentHashMap<>();

    public AuditLogController() {
        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        AuditLog log1 = new AuditLog("LOG-9001", nowStr, "faizan@zonvex.com", "INCIDENT_STATUS_CHANGE", "Incident INC-8091", "192.168.1.10", "SUCCESS", "LOW");
        AuditLog log2 = new AuditLog("LOG-9002", nowStr, "ayesha@zonvex.com", "SHIFT_SWAP_REQUEST", "Shift SHIFT-102", "192.168.1.15", "SUCCESS", "MEDIUM");
        AuditLog log3 = new AuditLog("LOG-9003", nowStr, "SYSTEM_AUTO_MONITOR", "SLA_BREACH_WARNING", "Incident INC-7720", "127.0.0.1", "ALERT", "HIGH");
        AuditLog log4 = new AuditLog("LOG-9004", nowStr, "admin@zonvex.com", "FIREBASE_AUTH_RECONFIG", "Firebase Admin SDK", "10.0.0.4", "SUCCESS", "HIGH");

        auditLogMap.put(log1.getId(), log1);
        auditLogMap.put(log2.getId(), log2);
        auditLogMap.put(log3.getId(), log3);
        auditLogMap.put(log4.getId(), log4);
    }

    @GetMapping
    public List<AuditLog> getAllAuditLogs() {
        List<AuditLog> logs = new ArrayList<>(auditLogMap.values());
        logs.sort((a, b) -> b.getId().compareTo(a.getId()));
        return logs;
    }

    @PostMapping
    public ResponseEntity<AuditLog> createAuditLog(@RequestBody AuditLog log) {
        if (log.getId() == null || log.getId().isEmpty()) {
            log.setId("LOG-" + (9000 + (int)(Math.random() * 1000)));
        }
        if (log.getTimestamp() == null || log.getTimestamp().isEmpty()) {
            log.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }
        auditLogMap.put(log.getId(), log);
        return ResponseEntity.ok(log);
    }
}
