import type {
  User,
  Tutor,
  TutorProfile,
  AvailabilitySlot,
  Category,
  Booking,
  Review,
} from "@/types";

// Re-export for convenience so existing imports from @/lib/api still work
export type {
  User,
  Tutor,
  TutorProfile,
  AvailabilitySlot,
  Category,
  Booking,
  Review,
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API error");
  return data;
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  register: (body: { name: string; email: string; password: string; role: "STUDENT" | "TUTOR" }) =>
    apiFetch<{ success: boolean; token: string; data: User }>("/auth/register", {
      method: "POST", body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    apiFetch<{ success: boolean; token: string; data: User }>("/auth/login", {
      method: "POST", body: JSON.stringify(body),
    }),

  me: () => apiFetch<{ success: boolean; data: User }>("/auth/me"),
};

// ─── Tutors ─────────────────────────────────────────────────────────────────
export const tutorsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<{ success: boolean; data: Tutor[] }>(`/tutors${query}`);
  },

  getById: (id: string) =>
    apiFetch<{ success: boolean; data: Tutor }>(`/tutors/${id}`),

  updateProfile: (body: Partial<TutorProfile>) =>
    apiFetch<{ success: boolean; data: TutorProfile }>("/tutor/profile", {
      method: "PUT", body: JSON.stringify(body),
    }),

  updateAvailability: (body: { availability: AvailabilitySlot[] }) =>
    apiFetch<{ success: boolean; data: TutorProfile }>("/tutor/availability", {
      method: "PUT", body: JSON.stringify(body),
    }),
};

// ─── Categories ──────────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => apiFetch<{ success: boolean; data: Category[] }>("/categories"),
};

// ─── Bookings ────────────────────────────────────────────────────────────────
export const bookingsApi = {
  create: (body: {
    tutorId: string; date: string; startTime: string;
    endTime: string; subject: string; notes?: string;
  }) =>
    apiFetch<{ success: boolean; data: Booking }>("/bookings", {
      method: "POST", body: JSON.stringify(body),
    }),

  getAll: () => apiFetch<{ success: boolean; data: Booking[] }>("/bookings"),

  getById: (id: string) =>
    apiFetch<{ success: boolean; data: Booking }>(`/bookings/${id}`),
};

// ─── Reviews ─────────────────────────────────────────────────────────────────
export const reviewsApi = {
  create: (body: { tutorId: string; bookingId: string; rating: number; comment: string }) =>
    apiFetch<{ success: boolean; data: Review }>("/reviews", {
      method: "POST", body: JSON.stringify(body),
    }),
};

// ─── Admin ───────────────────────────────────────────────────────────────────
export const adminApi = {
  getUsers: () =>
    apiFetch<{ success: boolean; data: User[] }>("/admin/users"),

  updateUser: (id: string, body: { isBanned: boolean }) =>
    apiFetch<{ success: boolean; data: User }>(`/admin/users/${id}`, {
      method: "PATCH", body: JSON.stringify(body),
    }),

  getBookings: () =>
    apiFetch<{ success: boolean; data: Booking[] }>("/admin/bookings"),

  getCategories: () =>
    apiFetch<{ success: boolean; data: Category[] }>("/admin/categories"),

  createCategory: (body: { name: string; description?: string }) =>
    apiFetch<{ success: boolean; data: Category }>("/admin/categories", {
      method: "POST", body: JSON.stringify(body),
    }),

  deleteCategory: (id: string) =>
    apiFetch<{ success: boolean }>(`/admin/categories/${id}`, { method: "DELETE" }),
};
