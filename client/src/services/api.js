import { supabase } from "../lib/supabase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  let response;
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Cannot reach the MysteryRoom API. Make sure the backend is running on port 5000.");
  }

  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (!response.ok) {
    throw new Error(data.message || `API request failed (${response.status})`);
  }
  return data;
}

export const mysteryAPI = {
  list: () => request("/mysteries"),
  delete: (id) => request(`/mysteries/${id}`, { method: "DELETE" }),
  create: (premise, difficulty) =>
    request("/mysteries", { method: "POST", body: JSON.stringify({ premise, difficulty }) }),
  get: (id) => request(`/mysteries/${id}`),
  discoverClue: (id, clueId) =>
    request(`/mysteries/${id}/clues/${encodeURIComponent(clueId)}/discover`, { method: "POST" }),
  revealHint: (id) => request(`/mysteries/${id}/hints/reveal`, { method: "POST" }),
  accuse: (id, suspectId) =>
    request(`/mysteries/${id}/accuse`, { method: "POST", body: JSON.stringify({ suspectId }) }),
};
