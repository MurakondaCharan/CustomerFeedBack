import { UserProfile } from "../types";

export interface StoredUser extends UserProfile {
  password: string; // Stored securely in client storage for local simulation
  createdAt: string;
}

const STORAGE_USERS_KEY = "feedback_ai_registered_users";
const STORAGE_TOKEN_KEY = "feedback_ai_auth_token";
const STORAGE_CURRENT_USER_KEY = "feedback_ai_current_user";

// Pre-seeded default users for evaluation / demo
const SEED_USERS: StoredUser[] = [
  {
    name: "Rahul Sharma",
    email: "rahul.sharma@enterprise-demo.com",
    password: "password123",
    role: "Head of Customer Experience",
    company: "Global Commerce Ltd.",
    createdAt: "2026-01-15T08:00:00.000Z",
  },
  {
    name: "Demo Executive",
    email: "demo@feedbackai.io",
    password: "password123",
    role: "Analytics Director",
    company: "Acme Enterprises",
    createdAt: "2026-02-01T09:30:00.000Z",
  },
];

/**
 * Initialize user store if empty
 */
function initStorage(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed: StoredUser[] = JSON.parse(raw);
    // Ensure seed users are always present
    let updated = false;
    for (const seed of SEED_USERS) {
      if (!parsed.some((u) => u.email.toLowerCase() === seed.email.toLowerCase())) {
        parsed.push(seed);
        updated = true;
      }
    }
    if (updated) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return SEED_USERS;
  }
}

/**
 * Get all registered users
 */
export function getRegisteredUsers(): StoredUser[] {
  return initStorage();
}

/**
 * Register a new user
 * Returns { success: boolean; error?: string }
 */
export function registerUser(params: {
  name: string;
  email: string;
  password: string;
  role?: string;
  company?: string;
}): { success: boolean; error?: string } {
  const users = initStorage();
  const normalizedEmail = params.email.trim().toLowerCase();

  // Validation
  if (!params.name.trim()) {
    return { success: false, error: "Please enter your full name." };
  }
  if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (!params.password || params.password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }

  // Check existing
  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return {
      success: false,
      error: "An account with this email already exists. Please log in.",
    };
  }

  const newUser: StoredUser = {
    name: params.name.trim(),
    email: normalizedEmail,
    password: params.password,
    role: params.role?.trim() || "Customer Experience Lead",
    company: params.company?.trim() || "Enterprise Customer",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save user to localStorage", err);
  }

  return { success: true };
}

/**
 * Authenticate login credentials
 * Returns { success: boolean; user?: UserProfile; token?: string; error?: string }
 */
export function authenticateUser(
  email: string,
  password: string
): { success: boolean; user?: UserProfile; token?: string; error?: string } {
  const users = initStorage();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return {
      success: false,
      error: "Invalid email or password. Please try again.",
    };
  }

  const matched = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!matched) {
    return {
      success: false,
      error: "Invalid email or password. Please try again.",
    };
  }

  const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const userProfile: UserProfile = {
    name: matched.name,
    email: matched.email,
    role: matched.role,
    company: matched.company,
  };

  return {
    success: true,
    user: userProfile,
    token,
  };
}

/**
 * Save active session
 */
export function setSession(token: string, user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error("Failed to save session", err);
  }
}

/**
 * Retrieve active session if available
 */
export function getSession(): { token: string; user: UserProfile } | null {
  try {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const userRaw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!token || !userRaw) return null;
    const user = JSON.parse(userRaw) as UserProfile;
    return { token, user };
  } catch {
    return null;
  }
}

/**
 * Destroy active session
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  } catch (err) {
    console.error("Failed to clear session", err);
  }
}
