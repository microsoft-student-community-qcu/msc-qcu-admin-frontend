import { getApiBaseURL } from "@/utils/env";
import type {
  ForgotPasswordResponse,
  ValidateResetTokenResponse,
  ResetPasswordResponse,
  ChangePasswordResponse,
} from "../types/authTypes";

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

export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const apiBase = getApiBaseURL();
  const res = await fetch(`${apiBase}/auth/admin/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const json = await res.json();
  if (!res.ok && res.status !== 400) {
    throw new Error(json.message || "Failed to process request");
  }

  return json;
}

export async function validateResetToken(token: string): Promise<ValidateResetTokenResponse> {
  const apiBase = getApiBaseURL();
  const res = await fetch(`${apiBase}/auth/validate-reset-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  const json = await res.json();
  return json;
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<ResetPasswordResponse> {
  const apiBase = getApiBaseURL();
  const res = await fetch(`${apiBase}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, newPassword }),
  });

  const json = await res.json();
  if (!res.ok && !json.errors) {
    throw new Error(json.message || "Failed to reset password");
  }

  return json;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<ChangePasswordResponse> {
  const apiBase = getApiBaseURL();
  const res = await fetch(`${apiBase}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currentPassword, newPassword }),
    credentials: "include",
  });

  const json = await res.json();
  if (!res.ok && !json.errors) {
    throw new Error(json.message || "Failed to change password");
  }

  return json;
}
