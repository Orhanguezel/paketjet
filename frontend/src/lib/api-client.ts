const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

    if (!res.ok) {
      let code = "request_failed";
      try {
        const body = await res.json();
        code = body?.error?.message ?? code;
      } catch {}

      if (res.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("paketjet-auth");
        if (!window.location.pathname.startsWith("/giris")) {
          window.location.href = "/giris?expired=true";
        }
      }

      throw new ApiError(res.status, code, `${res.status} ${code}`);
    }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const apiGet = <T>(path: string, options?: RequestInit) =>
  request<T>(path, { ...options, method: "GET" });

export const apiPost = <T>(path: string, body?: unknown, options?: RequestInit) =>
  request<T>(path, {
    ...options,
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

export const apiPatch = <T>(path: string, body?: unknown, options?: RequestInit) =>
  request<T>(path, {
    ...options,
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

export const apiPut = <T>(path: string, body?: unknown, options?: RequestInit) =>
  request<T>(path, {
    ...options,
    method: "PUT",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

export const apiDelete = <T>(path: string, options?: RequestInit) =>
  request<T>(path, { ...options, method: "DELETE" });

export { ApiError };
