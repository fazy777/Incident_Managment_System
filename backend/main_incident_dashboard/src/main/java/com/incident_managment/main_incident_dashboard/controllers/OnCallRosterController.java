package com.incident_managment.main_incident_dashboard.controllers;

import com.incident_managment.main_incident_dashboard.models.EscalationRule;
import com.incident_managment.main_incident_dashboard.models.OnCallShift;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/on-call")
@CrossOrigin(origins = "*")
public class OnCallRosterController {

    private final ConcurrentHashMap<String, OnCallShift> shiftMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, EscalationRule> escalationMap = new ConcurrentHashMap<>();

    public OnCallRosterController() {
        LocalDateTime now = LocalDateTime.now();

        // Seed On-Call Duty Roster Shifts
        OnCallShift s1 = new OnCallShift("SHIFT-101", "Faizan Ali", "faizan@zonvex.com", "+92-300-1234567", "Primary On-Call (Tier 1)", 1, now.minusHours(4), now.plusHours(8), "ACTIVE", "SMS & Voice Pager");
        OnCallShift s2 = new OnCallShift("SHIFT-102", "Ayesha Khan", "ayesha@zonvex.com", "+92-300-7654321", "Secondary Backup (Tier 2)", 2, now.minusHours(4), now.plusHours(8), "ACTIVE", "Slack & Push Notification");
        OnCallShift s3 = new OnCallShift("SHIFT-103", "John Doe", "john.doe@zonvex.com", "+1-555-0192834", "Escalation Lead (Tier 3)", 3, now.minusHours(12), now.plusHours(12), "ACTIVE", "Email & SMS");
        OnCallShift s4 = new OnCallShift("SHIFT-104", "Sara Ahmed", "sara.ahmed@zonvex.com", "+92-301-9876543", "Primary On-Call (Night Shift)", 1, now.plusHours(8), now.plusHours(20), "SCHEDULED", "SMS & Voice Pager");

        shiftMap.put(s1.getId(), s1);
        shiftMap.put(s2.getId(), s2);
        shiftMap.put(s3.getId(), s3);
        shiftMap.put(s4.getId(), s4);

        // Seed Escalation Rules
        EscalationRule r1 = new EscalationRule("ESC-P1", "Critical (P1)", 5, "Primary On-Call (Tier 1)", "Secondary Backup (Tier 2)", 15, "Automated Multi-Channel Dispatch (SMS, Pager, Push)");
        EscalationRule r2 = new EscalationRule("ESC-P2", "High (P2)", 15, "Primary On-Call (Tier 1)", "Secondary Backup (Tier 2)", 30, "Slack & Voice Pager Notification");
        EscalationRule r3 = new EscalationRule("ESC-P3", "Medium (P3)", 30, "Primary On-Call (Tier 1)", "Team Lead", 60, "Email & Dashboard Notification");
        EscalationRule r4 = new EscalationRule("ESC-P4", "Low (P4)", 120, "Team Queue", "Service Owner", 240, "Standard Digest Notification");

        escalationMap.put(r1.getId(), r1);
        escalationMap.put(r2.getId(), r2);
        escalationMap.put(r3.getId(), r3);
        escalationMap.put(r4.getId(), r4);
    }

    @GetMapping("/shifts")
    public List<OnCallShift> getAllShifts() {
        return new ArrayList<>(shiftMap.values());
    }

    @GetMapping("/active")
    public List<OnCallShift> getActiveResponders() {
        return shiftMap.values().stream()
                .filter(shift -> "ACTIVE".equalsIgnoreCase(shift.getStatus()))
                .collect(Collectors.toList());
    }

    @PostMapping("/shifts")
    public ResponseEntity<OnCallShift> createShift(@RequestBody OnCallShift shift) {
        if (shift.getId() == null || shift.getId().isEmpty()) {
            shift.setId("SHIFT-" + (100 + (int)(Math.random() * 900)));
        }
        if (shift.getStartTime() == null) {
            shift.setStartTime(LocalDateTime.now());
        }
        if (shift.getEndTime() == null) {
            shift.setEndTime(LocalDateTime.now().plusHours(8));
        }
        if (shift.getStatus() == null) {
            shift.setStatus("SCHEDULED");
        }
        shiftMap.put(shift.getId(), shift);
        return ResponseEntity.ok(shift);
    }

    @PutMapping("/shifts/{id}/swap")
    public ResponseEntity<OnCallShift> swapShift(@PathVariable String id, @RequestParam String newEngineerName, @RequestParam String newEmail, @RequestParam String newPhone) {
        OnCallShift shift = shiftMap.get(id);
        if (shift != null) {
            shift.setEngineerName(newEngineerName);
            shift.setEmail(newEmail);
            shift.setPhone(newPhone);
            shift.setStatus("SWAPPED");
            return ResponseEntity.ok(shift);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/escalation-matrix")
    public List<EscalationRule> getEscalationMatrix() {
        return new ArrayList<>(escalationMap.values());
    }

    @PostMapping("/trigger-escalation")
    public ResponseEntity<Map<String, Object>> triggerEmergencyEscalation(@RequestParam String incidentId, @RequestParam String severity) {
        Map<String, Object> response = new HashMap<>();
        List<OnCallShift> activeShifts = getActiveResponders();
        
        Optional<OnCallShift> primary = activeShifts.stream()
                .filter(s -> s.getTierLevel() == 1)
                .findFirst();

        response.put("incidentId", incidentId);
        response.put("severity", severity);
        response.put("triggeredAt", LocalDateTime.now().toString());
        response.put("primaryResponder", primary.map(OnCallShift::getEngineerName).orElse("Unassigned"));
        response.put("contactPhone", primary.map(OnCallShift::getPhone).orElse("N/A"));
        response.put("notificationStatus", "ALERT_DISPATCHED_TO_PRIMARY");
        response.put("message", "Emergency escalation alert dispatched to active Tier 1 responder: " + primary.map(OnCallShift::getEngineerName).orElse("N/A"));

        return ResponseEntity.ok(response);
    }
}
