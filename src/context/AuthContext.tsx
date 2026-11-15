import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, AuthUser, ApprovalRequest } from '@/types/database.types';

// ============================================================================
// Demo Credentials & Validated Invitation Codes
// ============================================================================

export const DEMO_INVITATION_CODES: Record<string, UserRole> = {
  'ARES6-ASTRO-2026': 'ASTRONAUT',
  'ESA-MED-SURG-90': 'MEDICAL_OFFICER',
  'NASA-DIR-HQ-01': 'MISSION_COMMANDER',
};

export const DEMO_ACCOUNTS: Record<string, AuthUser & { passwordHash: string }> = {
  'marcus.chen@nasa.ares6.gov': {
    id: 'user-01',
    name: 'Cmdr. Marcus Chen',
    email: 'marcus.chen@nasa.ares6.gov',
    role: 'ASTRONAUT',
    callsign: 'COMMANDER',
    badge: 'NASA-CDR-8842',
    astronautId: 'ASTRO-01',
    isApproved: true,
    mfaEnabled: false,
    mission: 'Ares-VI Deep Space Transit',
    passwordHash: 'AstroPass2026!',
    avatar_url: '/assets/avatars/marcus.jpg',
  },
  'sarah.vance@esa.flightmed.org': {
    id: 'user-02',
    name: 'Dr. Sarah Vance',
    email: 'sarah.vance@esa.flightmed.org',
    role: 'MEDICAL_OFFICER',
    callsign: 'FLIGHT SURGEON',
    badge: 'ESA-SURG-4190',
    astronautId: 'ASTRO-02',
    isApproved: true,
    mfaEnabled: true,
    organization: 'ESA Space Medicine Division',
    specialization: 'Aerospace Emergency & Critical Care',
    passwordHash: 'FlightMed2026!',
    avatar_url: '/assets/avatars/sarah.jpg',
  },
  'gregory.hayes@nasa.ops.gov': {
    id: 'user-05',
    name: 'Director Gregory Hayes',
    email: 'gregory.hayes@nasa.ops.gov',
    role: 'MISSION_COMMANDER',
    callsign: 'FLIGHT DIRECTOR',
    badge: 'NASA-DIR-1002',
    isApproved: true,
    mfaEnabled: true,
    mission: 'Ares-VI Flight Directorate',
    passwordHash: 'Command2026!',
    avatar_url: '/assets/avatars/gregory.jpg',
  },
};

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (
    role: UserRole,
    identifierOrEmail: string,
    password?: string,
    mfaCode?: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    role: UserRole,
    data: {
      fullName: string;
      email: string;
      idNumber: string;
      password?: string;
      invitationCode?: string;
      mission?: string;
      organization?: string;
      specialization?: string;
      designation?: string;
      emergencyContact?: string;
      dateOfBirth?: string;
    }
  ) => Promise<{ success: boolean; requiresApproval: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  pendingApprovals: ApprovalRequest[];
  approveUser: (requestId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load session from localStorage or initialize with Astronaut Marcus Chen for demo
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('astrocare_auth_session');
      if (saved) {
        return JSON.parse(saved);
      }
      // Default initial session: Astronaut Marcus Chen for out-of-the-box readiness
      return DEMO_ACCOUNTS['marcus.chen@nasa.ares6.gov'];
    } catch {
      return DEMO_ACCOUNTS['marcus.chen@nasa.ares6.gov'];
    }
  });

  const [registeredAccounts, setRegisteredAccounts] = useState<Record<string, AuthUser & { passwordHash: string }>>(() => {
    try {
      const saved = localStorage.getItem('astrocare_registered_accounts');
      return saved ? JSON.parse(saved) : DEMO_ACCOUNTS;
    } catch {
      return DEMO_ACCOUNTS;
    }
  });

  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>(() => {
    try {
      const saved = localStorage.getItem('astrocare_pending_approvals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('astrocare_auth_session', JSON.stringify(currentUser));
      // Also sync role for backward compatibility
      localStorage.setItem('astrocare_user_role', currentUser.role);
    } else {
      localStorage.removeItem('astrocare_auth_session');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('astrocare_registered_accounts', JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  useEffect(() => {
    localStorage.setItem('astrocare_pending_approvals', JSON.stringify(pendingApprovals));
  }, [pendingApprovals]);

  // Login handler
  const login = async (
    role: UserRole,
    identifierOrEmail: string,
    password?: string,
    mfaCode?: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Artificial small delay for realistic aerospace crypto verification
    await new Promise((r) => setTimeout(r, 400));

    const query = identifierOrEmail.trim().toLowerCase();

    // Find account by email or badge/id
    const account = Object.values(registeredAccounts).find(
      (acc) =>
        acc.email.toLowerCase() === query ||
        acc.id.toLowerCase() === query ||
        acc.badge.toLowerCase() === query ||
        (acc.astronautId && acc.astronautId.toLowerCase() === query)
    );

    if (!account) {
      return { success: false, error: 'No mission credentials matching identifier found.' };
    }

    // Role check (standardizing MISSION_COMMANDER and MISSION_CONTROLLER)
    const normalizedTargetRole = role === 'MISSION_CONTROLLER' ? 'MISSION_COMMANDER' : role;
    const normalizedAccRole = account.role === 'MISSION_CONTROLLER' ? 'MISSION_COMMANDER' : account.role;

    if (normalizedAccRole !== normalizedTargetRole) {
      return {
        success: false,
        error: `Security clearance mismatch: Account is authorized as ${account.role}, not ${role}.`,
      };
    }

    // Check approval status
    if (!account.isApproved) {
      return {
        success: false,
        error: 'Account enrollment is pending Flight Directorate authorization and mission provisioning.',
      };
    }

    // Optional MFA check
    if (account.mfaEnabled && mfaCode && mfaCode.trim() !== '884210' && mfaCode.trim().length < 6) {
      return { success: false, error: 'Invalid 6-digit Time-Based Security Token (MFA).' };
    }

    // Password check (if password supplied, verify match)
    if (password && account.passwordHash && account.passwordHash !== password) {
      return { success: false, error: 'Cryptographic authentication challenge failed: Invalid password.' };
    }

    setCurrentUser(account);
    return { success: true };
  };

  // Sign up handler
  const signup = async (
    role: UserRole,
    data: {
      fullName: string;
      email: string;
      idNumber: string;
      password?: string;
      invitationCode?: string;
      mission?: string;
      organization?: string;
      specialization?: string;
      designation?: string;
      emergencyContact?: string;
      dateOfBirth?: string;
    }
  ): Promise<{ success: boolean; requiresApproval: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 450));

    const email = data.email.trim().toLowerCase();

    // Check if account already exists
    if (registeredAccounts[email]) {
      return { success: false, requiresApproval: false, error: 'Personnel email already registered in flight manifest.' };
    }

    // Check invitation code
    const code = data.invitationCode?.trim().toUpperCase();
    const isAutoApproved = code ? DEMO_INVITATION_CODES[code] === role : false;

    const newUserId = `user-${Date.now()}`;
    const newAccount: AuthUser & { passwordHash: string } = {
      id: newUserId,
      name: data.fullName.trim(),
      email,
      role,
      callsign: data.designation?.toUpperCase() || (role === 'ASTRONAUT' ? 'SPECIALIST' : 'OFFICER'),
      badge: data.idNumber.trim(),
      astronautId: role === 'ASTRONAUT' ? (data.idNumber.startsWith('ASTRO') ? data.idNumber : `ASTRO-${Date.now().toString().slice(-2)}`) : undefined,
      isApproved: isAutoApproved,
      mfaEnabled: role !== 'ASTRONAUT',
      mission: data.mission || 'Ares-VI Deep Space Transit',
      organization: data.organization || 'NASA / International Space Station Partner',
      specialization: data.specialization || 'Spaceflight Operations',
      passwordHash: data.password || 'AstroCareSecure2026!',
    };

    setRegisteredAccounts((prev) => ({
      ...prev,
      [email]: newAccount,
    }));

    if (!isAutoApproved) {
      const request: ApprovalRequest = {
        id: `req-${Date.now()}`,
        userId: newUserId,
        fullName: data.fullName,
        email,
        role,
        requestedAt: new Date().toISOString(),
        status: 'PENDING',
        invitationCodeUsed: code || undefined,
        metadata: {
          idNumber: data.idNumber,
          mission: data.mission,
          organization: data.organization,
        },
      };

      setPendingApprovals((prev) => [request, ...prev]);
      return { success: true, requiresApproval: true };
    }

    // If auto-approved via valid invitation code, authenticate immediately
    setCurrentUser(newAccount);
    return { success: true, requiresApproval: false };
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('astrocare_auth_session');
  };

  // Password reset handler
  const resetPassword = async (email: string) => {
    await new Promise((r) => setTimeout(r, 400));
    return {
      success: true,
      message: `Cryptographic recovery dispatch transmitted to ${email}. Check secure mission inbox.`,
    };
  };

  // Admin approval of pending account
  const approveUser = (requestId: string) => {
    const req = pendingApprovals.find((p) => p.id === requestId);
    if (!req) return;

    setPendingApprovals((prev) =>
      prev.map((p) => (p.id === requestId ? { ...p, status: 'APPROVED' } : p))
    );

    // Mark account approved in registered accounts
    setRegisteredAccounts((prev) => {
      const updated = { ...prev };
      if (updated[req.email]) {
        updated[req.email] = {
          ...updated[req.email],
          isApproved: true,
        };
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser && currentUser.isApproved,
        login,
        signup,
        logout,
        resetPassword,
        pendingApprovals,
        approveUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
