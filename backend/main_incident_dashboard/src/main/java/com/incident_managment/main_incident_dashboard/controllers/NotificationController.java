package com.incident_managment.main_incident_dashboard.controllers;

import com.incident_managment.main_incident_dashboard.models.Notification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final ConcurrentHashMap<String, Notification> notificationMap = new ConcurrentHashMap<>();

    public NotificationController() {
        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        Notification n1 = new Notification("NTF-3001", "oncall-tier1-pager@zonvex.pagerduty.com", "PAGERDUTY", "P1 ALERT: High DB Latency Spike detected on PostgreSQL Primary", "Critical", "DELIVERED", nowStr, "INC-8091");
        Notification n2 = new Notification("NTF-3002", "#secops-incidents", "SLACK", "ALERT DISPATCH: Incident INC-7720 assigned to Ayesha Khan", "High", "DELIVERED", nowStr, "INC-7720");
        Notification n3 = new Notification("NTF-3003", "+923001234567", "SMS", "URGENT: Executive Escalation initiated for INC-8091", "Critical", "DELIVERED", nowStr, "INC-8091");
        Notification n4 = new Notification("NTF-3004", "sre-leads@zonvex.com", "EMAIL", "Weekly SLA Performance Summary Report", "Low", "DELIVERED", nowStr, "N/A");

        notificationMap.put(n1.getId(), n1);
        notificationMap.put(n2.getId(), n2);
        notificationMap.put(n3.getId(), n3);
        notificationMap.put(n4.getId(), n4);
    }

    @GetMapping
    public List<Notification> getAllNotifications() {
        List<Notification> list = new ArrayList<>(notificationMap.values());
        list.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
        return list;
    }

    @PostMapping("/dispatch")
    public ResponseEntity<Notification> dispatchNotification(@RequestBody Notification notification) {
        if (notification.getId() == null || notification.getId().isEmpty()) {
            notification.setId("NTF-" + (3000 + (int)(Math.random() * 1000)));
        }
        if (notification.getTimestamp() == null || notification.getTimestamp().isEmpty()) {
            notification.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }
        if (notification.getStatus() == null || notification.getStatus().isEmpty()) {
            notification.setStatus("DELIVERED");
        }

        notificationMap.put(notification.getId(), notification);
        return ResponseEntity.ok(notification);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getNotificationStats() {
        Map<String, Object> stats = new HashMap<>();
        int total = notificationMap.size();

        Map<String, Long> byChannel = notificationMap.values().stream()
                .collect(Collectors.groupingBy(Notification::getChannel, Collectors.counting()));

        Map<String, Long> byStatus = notificationMap.values().stream()
                .collect(Collectors.groupingBy(Notification::getStatus, Collectors.counting()));

        stats.put("totalDispatched", total);
        stats.put("byChannel", byChannel);
        stats.put("byStatus", byStatus);
        stats.put("deliverySuccessRatePercent", 100.0);

        return ResponseEntity.ok(stats);
    }
}
