export const getApiBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("stsamscqcuadminrel")) {
      return "https://func-msc-qcu-backend-rel.azurewebsites.net/api/v1";
    }
    if (host.includes("stsamscqcuadmindev")) {
      return "https://func-msc-qcu-backend-dev.azurewebsites.net/api/v1";
    }
    if (host.includes("stsamscqcuadmin")) {
      return "https://func-msc-qcu-backend.azurewebsites.net/api/v1";
    }
  }
  return "";
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
