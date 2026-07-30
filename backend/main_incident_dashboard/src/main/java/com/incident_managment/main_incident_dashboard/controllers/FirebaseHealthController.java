package com.incident_managment.main_incident_dashboard.controllers;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/firebase-status")
@CrossOrigin(origins = "*")
public class FirebaseHealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getFirebaseStatus() {
        Map<String, Object> status = new HashMap<>();

        try {
            boolean isInitialized = !FirebaseApp.getApps().isEmpty();
            status.put("firebaseAppInitialized", isInitialized);

            if (isInitialized) {
                FirebaseApp app = FirebaseApp.getInstance();
                status.put("appName", app.getName());
                status.put("projectId", app.getOptions().getProjectId());

                // Check FirebaseAuth service instance
                FirebaseAuth auth = FirebaseAuth.getInstance(app);
                status.put("firebaseAuthReady", auth != null);
                status.put("connectionStatus", "CONNECTED");
                status.put("message", "Spring Boot backend is successfully connected to Firebase project: " + app.getOptions().getProjectId());
            } else {
                status.put("connectionStatus", "DISCONNECTED");
                status.put("message", "FirebaseApp is not initialized.");
            }

            return ResponseEntity.ok(status);
        } catch (Exception e) {
            status.put("connectionStatus", "ERROR");
            status.put("error", e.getMessage());
            return ResponseEntity.status(500).body(status);
        }
    }
}
