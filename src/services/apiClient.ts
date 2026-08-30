/**
 * Base API Client for Zoho Catalyst KSP Microservice
 */

const DEFAULT_BASE_URL = "https://ksp-60075494775.development.catalystserverless.in/server/ksp_aio_function";

export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: use env variable if available, else default to live Catalyst function
    return process.env.NEXT_PUBLIC_API_URL || DEFAULT_BASE_URL;
  }
  // Server-side
  return process.env.NEXT_PUBLIC_API_URL || DEFAULT_BASE_URL;
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, timeoutMs = 15000, ...fetchOptions } = options;
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  let url = `${baseUrl}${normalizedEndpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...fetchOptions.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`API Error [${response.status}]: ${errorText || response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`API request timed out after ${timeoutMs}ms: ${url}`);
    }
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
}
