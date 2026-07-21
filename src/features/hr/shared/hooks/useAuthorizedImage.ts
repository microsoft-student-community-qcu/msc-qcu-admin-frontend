import { useEffect, useState } from "react";
import { fetchAuthorizedImage } from "../services/applicantApi";

/**
 * Loads a protected image (served through the authenticated backend endpoint)
 * and exposes it as an object URL for use in <img src>. A plain <img> cannot
 * attach the Authorization header, so the blob is fetched with credentials
 * first. The object URL is revoked automatically on cleanup.
 */
export function useAuthorizedImage(imageUrl: string | undefined): {
  objectUrl: string | undefined;
  loading: boolean;
  error: boolean;
} {
  const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setObjectUrl(undefined);
      setLoading(false);
      setError(false);
      return;
    }

    let cancelled = false;
    let createdUrl: string | undefined;

    setLoading(true);
    setError(false);
    setObjectUrl(undefined);

    fetchAuthorizedImage(imageUrl)
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        createdUrl = url;
        setObjectUrl(url);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [imageUrl]);

  return { objectUrl, loading, error };
}
