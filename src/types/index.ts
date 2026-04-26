// ─── Shared TypeScript types for SkillBridge ──────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  isBanned: boolean;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  tutorProfile?: TutorProfile | null;
}

export interface TutorProfile {
  id: string;
  userId: string;
  bio: string;
  subjects: string[];
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  experience: string;
  education: string;
  availability: AvailabilitySlot[];
  categoryId?: string;
  category?: Category;
}

export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  notes?: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  student?: User;
  tutor?: User & { tutorProfile?: TutorProfile };
  review?: Review;
}

export interface Review {
  id: string;
  studentId: string;
  tutorId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
  student?: User;
}

export interface Tutor extends User {
  tutorProfile: TutorProfile | null;
}
