export const getApiBaseURL = () => {
  return import.meta.env.VITE_API_URL || "";
};

export const getAuthBaseURL = () => {
  const apiUrl = getApiBaseURL();
  if (!apiUrl) {
    return "/api/auth";
  }
  try {
    return new URL(apiUrl).origin + "/api/auth";
  } catch {
    return "/api/auth";
  }
};
