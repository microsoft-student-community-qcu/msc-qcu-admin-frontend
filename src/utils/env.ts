export const getApiBaseURL = () => {
  return import.meta.env.VITE_API_URL;
};

export const getAuthBaseURL = () => {
  const apiUrl = getApiBaseURL();
  try {
    return new URL(apiUrl).origin + "/api/auth";
  } catch {
    return "/api/auth";
  }
};
