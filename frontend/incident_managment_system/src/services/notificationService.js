import { apiFetch } from "./apiClient";

export async function getAllNotifications() {
  try {
    return await apiFetch("/api/notifications");
  } catch (err) {
    console.warn("Failed to fetch notifications from backend API:", err);
    return [];
  }
}

export async function dispatchNotification(notificationData) {
  return await apiFetch("/api/notifications/dispatch", {
    method: "POST",
    body: JSON.stringify(notificationData)
  });
}

export async function getNotificationStats() {
  try {
    return await apiFetch("/api/notifications/stats");
  } catch (err) {
    console.warn("Failed to fetch notification stats:", err);
    return null;
  }
}
