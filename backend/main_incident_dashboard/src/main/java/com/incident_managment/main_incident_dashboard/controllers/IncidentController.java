package com.incident_managment.main_incident_dashboard.controllers;

import com.incident_managment.main_incident_dashboard.models.Incident;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*")
public class IncidentController {

    private final ConcurrentHashMap<String, Incident> incidentMap = new ConcurrentHashMap<>();

    public IncidentController() {
        // Seed initial data
        Incident sample1 = new Incident("INC-8091", "Primary DB Latency Spike & Deadlock", "High lock contention on database cluster.", "Critical", "Investigate", "Database", "PostgreSQL Primary", "Faizan Ali", "SecOps Automated Monitor");
        Incident sample2 = new Incident("INC-7720", "Auth Token Verification Failure", "OAuth2 service returning 500 status.", "High", "In Progress", "Security Breach", "Auth Microservice", "Ayesha Khan", "SRE Sentinel");
        incidentMap.put(sample1.getId(), sample1);
        incidentMap.put(sample2.getId(), sample2);
    }

    @GetMapping
    public List<Incident> getAllIncidents() {
        return new ArrayList<>(incidentMap.values());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incident> getIncidentById(@PathVariable String id) {
        Incident incident = incidentMap.get(id);
        if (incident != null) {
            return ResponseEntity.ok(incident);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Incident> createIncident(@RequestBody Incident incident) {
        if (incident.getId() == null || incident.getId().isEmpty()) {
            incident.setId("INC-" + (1000 + (int)(Math.random() * 9000)));
        }
        incidentMap.put(incident.getId(), incident);
        return ResponseEntity.ok(incident);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Incident> updateIncidentStatus(@PathVariable String id, @RequestParam String status) {
        Incident incident = incidentMap.get(id);
        if (incident != null) {
            incident.setStatus(status);
            return ResponseEntity.ok(incident);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable String id) {
        if (incidentMap.remove(id) != null) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
