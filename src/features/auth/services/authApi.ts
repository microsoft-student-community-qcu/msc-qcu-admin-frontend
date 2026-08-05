import { getApiBaseURL } from "@/utils/env";

export async function login(email: string, password: string): Promise<any> {
  const apiBase = getApiBaseURL();
  const res = await fetch(`${apiBase}/auth/admin/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
    credentials: "include",
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Invalid credentials");
  }

  return json;
}
