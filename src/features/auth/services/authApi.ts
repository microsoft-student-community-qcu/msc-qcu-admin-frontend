import { getAuthBaseURL } from "@/utils/env";

export async function login(email: string, password: string): Promise<any> {
  const authBase = getAuthBaseURL();
  const res = await fetch(`${authBase}/sign-in/email`, {
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
