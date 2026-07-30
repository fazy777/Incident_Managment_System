import { auth } from "../firebase";
import { apiFetch } from "./apiClient";

/**
 * Diagnostic function to test connection between:
 * 1. Frontend <-> Firebase Web SDK
 * 2. Frontend <-> Spring Boot Backend
 * 3. Spring Boot Backend <-> External Firebase Project
 */
export async function checkSystemConnections() {
  const result = {
    frontendFirebaseReady: false,
    frontendProjectId: null,
    backendConnected: false,
    backendFirebaseStatus: null,
    error: null
  };

  // 1. Check Frontend Firebase SDK initialization
  try {
    if (auth && auth.app) {
      result.frontendFirebaseReady = true;
      result.frontendProjectId = auth.app.options.projectId;
    }
  } catch (err) {
    result.error = `Frontend Firebase Error: ${err.message}`;
  }

  // 2. Check Backend & Backend-Firebase Status
  try {
    const statusData = await apiFetch("/api/firebase-status");
    result.backendConnected = true;
    result.backendFirebaseStatus = statusData;
  } catch (err) {
    result.backendConnected = false;
    result.backendError = `Could not reach Spring Boot backend: ${err.message}. Make sure Spring Boot is running on port 8080.`;
  }

  return result;
}
