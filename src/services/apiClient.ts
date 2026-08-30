/**
 * Base API Client for Zoho Catalyst KSP Microservice & Data Store
 */

export const DEFAULT_DATASTORE_URL =
  "https://ksp-60075494775.development.catalystserverless.in/server/ksp_aio_function";

export const DEFAULT_AI_URL =
  "https://ksp-60075494775.development.catalystserverless.in/server/ksp_aio_function";

export const STORAGE_KEY_BASE_URL = "ksp_api_base_url";
export const STORAGE_KEY_AI_URL = "ksp_ai_base_url";

let currentBaseUrl: string | null = null;

export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    if (currentBaseUrl) return currentBaseUrl;
    const stored = localStorage.getItem(STORAGE_KEY_BASE_URL);
    if (stored && stored.trim()) {
      currentBaseUrl = stored.trim();
      return currentBaseUrl;
    }
    return process.env.NEXT_PUBLIC_API_URL || DEFAULT_DATASTORE_URL;
  }
  return process.env.NEXT_PUBLIC_API_URL || DEFAULT_DATASTORE_URL;
}

export function setBaseUrl(url: string): void {
  const cleanUrl = url.trim().replace(/\/$/, "");
  currentBaseUrl = cleanUrl;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_BASE_URL, cleanUrl);
  }
}

export function getAiUrl(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY_AI_URL);
    if (stored && stored.trim()) {
      return stored.trim();
    }
    return process.env.NEXT_PUBLIC_AI_URL || DEFAULT_AI_URL;
  }
  return process.env.NEXT_PUBLIC_AI_URL || DEFAULT_AI_URL;
}

export function setAiUrl(url: string): void {
  const cleanUrl = url.trim().replace(/\/$/, "");
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_AI_URL, cleanUrl);
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
  customBaseUrl?: string;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, timeoutMs = 15000, customBaseUrl, ...fetchOptions } = options;
  const baseUrl = (customBaseUrl || getBaseUrl()).replace(/\/$/, "");
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
