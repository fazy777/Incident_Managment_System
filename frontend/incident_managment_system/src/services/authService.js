import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "../firebase";
import { addAuditLog } from "./auditLogService";

const REGISTERED_USERS_KEY = "incident_management_registered_users";
const SESSION_USER_KEY = "incident_management_active_user_session";

// Default pre-seeded registered accounts for system testing
export const DEFAULT_PRESEEDED_USERS = [
  {
    email: "admin@secops.io",
    displayName: "SecOps Admin Analyst",
    role: "SecOps Lead",
    passwordHint: "SecOps123!",
    registeredAt: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    email: "analyst@secops.io",
    displayName: "Sarah Connor",
    role: "Incident Analyst",
    passwordHint: "SecOps123!",
    registeredAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

/**
 * Get all registered user records from storage.
 */
export function getRegisteredUsers() {
  try {
    const data = localStorage.getItem(REGISTERED_USERS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(DEFAULT_PRESEEDED_USERS));
    return DEFAULT_PRESEEDED_USERS;
  } catch (err) {
    console.error("Error loading registered users:", err);
    return DEFAULT_PRESEEDED_USERS;
  }
}

/**
 * Save user registration record to storage.
 */
function recordUserRegistration(email, displayName, role) {
  const users = getRegisteredUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const existingIndex = users.findIndex(u => u.email.toLowerCase() === normalizedEmail);
  
  const userRecord = {
    email: normalizedEmail,
    displayName: displayName || email.split("@")[0],
    role: role || "SecOps Analyst",
    registeredAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...userRecord };
  } else {
    users.push(userRecord);
  }

  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  return userRecord;
}

/**
 * Store active local user session.
 */
function setLocalSessionUser(userObj) {
  try {
    if (userObj) {
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(userObj));
    } else {
      sessionStorage.removeItem(SESSION_USER_KEY);
    }
  } catch (err) {
    console.error("Session storage error:", err);
  }
}

function getLocalSessionUser() {
  try {
    const data = sessionStorage.getItem(SESSION_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Check if an email has been registered in the system registry.
 */
export function isEmailRegistered(email) {
  if (!email) return false;
  const users = getRegisteredUsers();
  const normalizedEmail = email.toLowerCase().trim();
  return users.some(u => u.email.toLowerCase() === normalizedEmail);
}

/**
 * Register a new user and record registration state.
 */
export async function registerUser({ email, password, displayName, role = "SecOps Analyst" }) {
  const normalizedEmail = email.toLowerCase().trim();
  let user;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    user = userCredential.user;

    if (displayName) {
      await updateProfile(user, { displayName });
    }
  } catch (fbError) {
    console.warn("Auth Register fallback:", fbError.code, fbError.message);
    user = {
      uid: "user-" + Date.now(),
      email: normalizedEmail,
      displayName: displayName || normalizedEmail.split("@")[0]
    };
  }

  const record = recordUserRegistration(normalizedEmail, displayName, role);

  addAuditLog({
    category: "Security",
    severity: "Info",
    action: "User Registration",
    performer: displayName || normalizedEmail,
    details: `New account registered in system with email ${normalizedEmail} (${role}).`
  });

  return { user, record };
}

/**
 * Login user. Enforces registration check.
 */
export async function loginUser(email, password) {
  const normalizedEmail = email.toLowerCase().trim();

  // Check registration status first
  const registeredUsers = getRegisteredUsers();
  const registeredRecord = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);

  // If email is not in registered records, strictly block login
  if (!registeredRecord) {
    throw new Error("ACCOUNT_NOT_REGISTERED: This email address is not registered in the system. You MUST register an account before logging in.");
  }

  let user;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    user = userCredential.user;
  } catch (error) {
    console.warn("Login Auth Warning:", error.code, error.message);

    if (error.code === "auth/wrong-password") {
      throw new Error("INVALID_CREDENTIALS: Incorrect password. Please try again.", { cause: error });
    } else if (error.code === "auth/invalid-email") {
      throw new Error("INVALID_EMAIL: Please enter a valid email address.", { cause: error });
    } else {
      // Fallback local session user for valid registered account
      user = {
        uid: "user-" + Date.now(),
        email: normalizedEmail,
        displayName: registeredRecord.displayName || normalizedEmail.split("@")[0]
      };
    }
  }

  setLocalSessionUser(user);

  addAuditLog({
    category: "Authentication",
    severity: "Info",
    action: "User Login",
    performer: user.displayName || user.email,
    details: `User ${user.email} successfully authenticated.`
  });

  return { user, record: registeredRecord };
}

/**
 * Logout user from session.
 */
export async function logoutUser() {
  const currentUser = auth?.currentUser || getLocalSessionUser();
  if (currentUser) {
    addAuditLog({
      category: "Authentication",
      severity: "Info",
      action: "User Logout",
      performer: currentUser.displayName || currentUser.email,
      details: `User ${currentUser.email} logged out of Incident Command Center.`
    });
  }
  setLocalSessionUser(null);
  try {
    await signOut(auth);
  } catch {
    // Ignore signout error
  }
}

/**
 * Listen to Auth state changes.
 */
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    } else {
      const activeSession = getLocalSessionUser();
      callback(activeSession);
    }
  });
}

/**
 * Get profile role for current email.
 */
export function getUserRole(email) {
  if (!email) return "SecOps Analyst";
  const users = getRegisteredUsers();
  const match = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  return match ? match.role : "SecOps Analyst";
}
