package com.incident_managment.main_incident_dashboard.controllers;

import com.incident_managment.main_incident_dashboard.models.Postmortem;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/postmortems")
@CrossOrigin(origins = "*")
public class PostmortemController {

    private final ConcurrentHashMap<String, Postmortem> postmortemMap = new ConcurrentHashMap<>();

    public PostmortemController() {
        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        Postmortem pm1 = new Postmortem(
                "PM-5001",
                "INC-8091",
                "Postmortem: Primary DB Latency Spike & Lock Contention",
                "Faizan Ali (Principal SRE)",
                "Unindexed query executed during high-concurrency backup window caused cascading row lock escalation on PostgreSQL primary cluster.",
                "Missing compound index on (`tenant_id`, `created_at`) combined with unthrottled analytics batch query.",
                Arrays.asList(
                        "Deploy index `idx_tenant_created` to production cluster",
                        "Configure statement timeout of 5s on read-replica pool",
                        "Implement automated lock contention alert in Grafana"
                ),
                "Critical",
                "PUBLISHED",
                nowStr,
                nowStr
        );

        Postmortem pm2 = new Postmortem(
                "PM-5002",
                "INC-7720",
                "Postmortem: Auth Token Verification Service 500 Outage",
                "Ayesha Khan (SecOps Lead)",
                "JWT verification key rotation mismatch led to temporary validation failures across OAuth2 API gateways.",
                "JWKS endpoint cache TTL expired before updated public keys were propagated to all edge nodes.",
                Arrays.asList(
                        "Extend JWKS cache grace period to 24 hours",
                        "Automate dual-key signing during key rotation windows",
                        "Update canary deployment checks for auth service"
                ),
                "High",
                "IN_REVIEW",
                nowStr,
                nowStr
        );

        postmortemMap.put(pm1.getId(), pm1);
        postmortemMap.put(pm2.getId(), pm2);
    }

    @GetMapping
    public List<Postmortem> getAllPostmortems() {
        return new ArrayList<>(postmortemMap.values());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Postmortem> getPostmortemById(@PathVariable String id) {
        Postmortem pm = postmortemMap.get(id);
        if (pm != null) {
            return ResponseEntity.ok(pm);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/incident/{incidentId}")
    public List<Postmortem> getPostmortemsByIncidentId(@PathVariable String incidentId) {
        return postmortemMap.values().stream()
                .filter(pm -> incidentId.equalsIgnoreCase(pm.getIncidentId()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Postmortem> createPostmortem(@RequestBody Postmortem postmortem) {
        if (postmortem.getId() == null || postmortem.getId().isEmpty()) {
            postmortem.setId("PM-" + (5000 + (int) (Math.random() * 1000)));
        }
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        if (postmortem.getCreatedAt() == null || postmortem.getCreatedAt().isEmpty()) {
            postmortem.setCreatedAt(timestamp);
        }
        postmortem.setUpdatedAt(timestamp);

        if (postmortem.getStatus() == null || postmortem.getStatus().isEmpty()) {
            postmortem.setStatus("DRAFT");
        }

        postmortemMap.put(postmortem.getId(), postmortem);
        return ResponseEntity.ok(postmortem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Postmortem> updatePostmortem(@PathVariable String id, @RequestBody Postmortem updated) {
        Postmortem existing = postmortemMap.get(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
        if (updated.getSummary() != null) existing.setSummary(updated.getSummary());
        if (updated.getRootCause() != null) existing.setRootCause(updated.getRootCause());
        if (updated.getActionItems() != null) existing.setActionItems(updated.getActionItems());
        if (updated.getSeverity() != null) existing.setSeverity(updated.getSeverity());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());

        existing.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        return ResponseEntity.ok(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePostmortem(@PathVariable String id) {
        if (postmortemMap.remove(id) != null) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
