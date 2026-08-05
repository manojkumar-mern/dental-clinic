/**
 * Centralized API base URL for all frontend fetch calls.
 * Set NEXT_PUBLIC_API_URL in your .env.local file.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Returns the authorization header object using the admin token from cookies.
 * Used for all protected admin fetch calls.
 */
export function getAuthHeaders() {
  if (typeof document === "undefined") return {};
  const token = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("adminToken="))
    ?.split("=")[1];
  return token ? { Authorization: `Bearer ${token}` } : {};
}
