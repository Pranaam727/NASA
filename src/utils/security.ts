import { UserRole } from '@/types/database.types';

/**
 * Client-Side Authorization Helpers
 * Mirrors PostgreSQL Row Level Security (RLS) policies for deterministic UI gating.
 * (Note: True authorization is enforced in PostgreSQL via RLS).
 */

export const canAccessPrivateJournal = (
  astronautProfileId: string,
  currentUserId: string,
  currentUserRole: UserRole,
  isConsentedForMedicalOfficer: boolean
): boolean => {
  // 1. Author astronaut always has full access to their own journal
  if (astronautProfileId === currentUserId) {
    return true;
  }

  // 2. Flight Surgeon / Medical Officer can ONLY access if explicitly consented
  if (currentUserRole === 'MEDICAL_OFFICER' && isConsentedForMedicalOfficer) {
    return true;
  }

  // 3. Mission Controllers and unauthorized personnel are strictly denied access
  return false;
};

export const canModifyMedicalRecord = (currentUserRole: UserRole): boolean => {
  return currentUserRole === 'MEDICAL_OFFICER';
};

export const canManageAlerts = (currentUserRole: UserRole): boolean => {
  return currentUserRole === 'MEDICAL_OFFICER' || currentUserRole === 'MISSION_CONTROLLER';
};

export const canControlSimulation = (currentUserRole: UserRole): boolean => {
  return currentUserRole === 'MEDICAL_OFFICER' || currentUserRole === 'MISSION_CONTROLLER';
};
