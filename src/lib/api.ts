
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is missing.");
}

export const apiFetch = async (
  path: string,
  options: RequestInit = {}
) => {
  const { data, error } = await authClient.token();
  console.log("Vendor token:", data?.token);

  if (error || !data?.token) {
    throw new Error(
      error?.message || "Unable to get authentication token."
    );
  }

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${data.token}`);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Something went wrong."
    );
  }

  return result;
};
