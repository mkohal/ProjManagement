const getApiOrigin = () => {
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

  try {
    return new URL(apiBaseUrl).origin;
  } catch {
    return "http://localhost:8000";
  }
};

export const resolveAssetUrl = (url) => {
  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${getApiOrigin()}${url}`;
  }

  return `${getApiOrigin()}/${url.replace(/^\/+/, "")}`;
};
