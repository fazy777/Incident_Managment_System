import { auth } from "../firebase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Utility function to send authenticated HTTP requests to Spring Boot backend.
 * Automatically attaches Firebase ID Token in the Authorization header.
 * 
 * @param {string} endpoint - API path (e.g. '/api/incidents')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 */
export async function apiFetch(endpoint, options = {}) {
  const user = auth.currentUser;
  let headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  if (user) {
    try {
      // Force refresh if token is expired (optional: pass true)
      const token = await user.getIdToken();
      headers["Authorization"] = `Bearer ${token}`;
    } catch (err) {
      console.error("Failed to retrieve Firebase ID token:", err);
    }
  } else {
    console.warn("No active Firebase user logged in. Request sent without Auth token.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error [${response.status}]: ${errorText || response.statusText}`);
  }

  // Handle empty response (e.g. HTTP 204 or DELETE 200 with no content)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return null;
}
