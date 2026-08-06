import { apiFetch } from "./apiClient";

export async function getAllPostmortems() {
  try {
    return await apiFetch("/api/postmortems");
  } catch (err) {
    console.warn("Failed to fetch postmortems from backend API:", err);
    return [];
  }
}

export async function getPostmortemById(id) {
  return await apiFetch(`/api/postmortems/${id}`);
}

export async function createPostmortem(postmortemData) {
  return await apiFetch("/api/postmortems", {
    method: "POST",
    body: JSON.stringify(postmortemData)
  });
}

export async function updatePostmortem(id, postmortemData) {
  return await apiFetch(`/api/postmortems/${id}`, {
    method: "PUT",
    body: JSON.stringify(postmortemData)
  });
}

export async function deletePostmortem(id) {
  return await apiFetch(`/api/postmortems/${id}`, {
    method: "DELETE"
  });
}
