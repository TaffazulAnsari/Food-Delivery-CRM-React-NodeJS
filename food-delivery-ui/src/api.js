
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://food-delivery-crm-react-nodejs.onrender.com";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("foodCrmToken");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
}

export const loginUser = (email, password) =>
  apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerUser = (name, email, password) =>
  apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const getAvailableEnquiries = () =>
  apiRequest("/api/enquiries/public");

export const getMyLeads = () =>
  apiRequest("/api/enquiries/my-leads");

export const claimLead = (id) =>
  apiRequest(`/api/enquiries/${id}/claim`, {
    method: "PATCH",
  });
