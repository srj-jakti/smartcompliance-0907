export type UserRole = "ca" | "employee" | "client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  firmId: string;
  firmName?: string;
  pan?: string;
  phone?: string;
  specialization?: string;
  empRole?: string; // manager, staff, intern
}

export function getUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("sc_user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setUser(user: AuthUser) {
  localStorage.setItem("sc_user", JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem("sc_user");
  window.location.href = "/login";
}

// ─── DEMO ACCOUNTS (multi-tenant) ─────────────────────────────────────────────
export const DEMO_ACCOUNTS: Array<AuthUser & { password: string }> = [
  // Firm 1 — CA
  { id: "ca1", name: "CA Rajesh Sharma", email: "ca@demo.in", password: "ca123", role: "ca", firmId: "firm1", firmName: "Sharma & Associates", phone: "9876543210" },
  // Firm 2 — CA (ISOLATED)
  { id: "ca2", name: "CA Priya Mehta", email: "ca2@demo.in", password: "ca123", role: "ca", firmId: "firm2", firmName: "PM Tax Consultants", phone: "9876543211" },
  // Firm 1 — Employees
  { id: "emp1", name: "Anita Singh", email: "emp1@demo.in", password: "emp123", role: "employee", firmId: "firm1", firmName: "Sharma & Associates", specialization: "gst", empRole: "staff" },
  { id: "emp2", name: "Mohit Verma", email: "emp2@demo.in", password: "emp123", role: "employee", firmId: "firm1", firmName: "Sharma & Associates", specialization: "itr", empRole: "manager" },
  { id: "emp3", name: "Rahul Kumar", email: "emp3@demo.in", password: "emp123", role: "employee", firmId: "firm1", firmName: "Sharma & Associates", specialization: "tds", empRole: "staff" },
  // Firm 1 — Clients
  { id: "cl1", name: "Rajesh Kumar", email: "client@demo.in", password: "client123", role: "client", firmId: "firm1", firmName: "Sharma & Associates", pan: "ABCPK1234D" },
  { id: "cl2", name: "TechVision Pvt Ltd", email: "tech@demo.in", password: "client123", role: "client", firmId: "firm1", firmName: "Sharma & Associates", pan: "CDETV9012F" },
];

export function redirectByRole(role: UserRole) {
  if (role === "ca") window.location.href = "/dashboard";
  else if (role === "employee") window.location.href = "/employee";
  else window.location.href = "/client";
}
