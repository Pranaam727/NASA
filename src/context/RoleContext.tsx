import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Astronaut } from '@/types/database.types';
import { SEED_ASTRONAUTS } from '@/data/seedData';

export interface RoleUser {
  id: string;
  name: string;
  callsign: string;
  role: UserRole;
  astronautId?: string;
  badge: string;
}

export const ROLE_PROFILES: Record<UserRole, RoleUser> = {
  ASTRONAUT: {
    id: 'user-01',
    name: 'Cmdr. Marcus Chen',
    callsign: 'COMMANDER',
    role: 'ASTRONAUT',
    astronautId: 'ASTRO-01',
    badge: 'NASA-CDR-8842',
  },
  MEDICAL_OFFICER: {
    id: 'user-02',
    name: 'Dr. Sarah Vance',
    callsign: 'FLIGHT SURGEON',
    role: 'MEDICAL_OFFICER',
    astronautId: 'ASTRO-02',
    badge: 'ESA-SURG-4190',
  },
  MISSION_CONTROLLER: {
    id: 'user-05',
    name: 'Director Gregory Hayes',
    callsign: 'MISSION FLIGHT DIRECTOR',
    role: 'MISSION_CONTROLLER',
    badge: 'NASA-DIR-1002',
  },
  MISSION_COMMANDER: {
    id: 'user-05',
    name: 'Director Gregory Hayes',
    callsign: 'MISSION FLIGHT DIRECTOR',
    role: 'MISSION_COMMANDER',
    badge: 'NASA-DIR-1002',
  },
};

interface RoleContextType {
  currentRole: UserRole;
  currentUser: RoleUser;
  selectedAstronautId: string;
  selectedAstronaut: Astronaut;
  availableAstronauts: Astronaut[];
  setRole: (role: UserRole) => void;
  setSelectedAstronautId: (id: string) => void;
  canViewPsychologicalJournal: (targetAstronautId: string) => boolean;
  canAcknowledgeAlerts: boolean;
  canUploadLabRecords: boolean;
  canModifyProtocols: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('astrocare_user_role');
    return (saved as UserRole) || 'ASTRONAUT';
  });

  const [selectedAstronautId, setSelectedAstronautId] = useState<string>('ASTRO-01');

  useEffect(() => {
    localStorage.setItem('astrocare_user_role', currentRole);
    // If switched to astronaut, sync default selected astronaut
    if (currentRole === 'ASTRONAUT') {
      setSelectedAstronautId(ROLE_PROFILES.ASTRONAUT.astronautId || 'ASTRO-01');
    }
  }, [currentRole]);

  const currentUser = ROLE_PROFILES[currentRole];
  const availableAstronauts = SEED_ASTRONAUTS;
  const selectedAstronaut =
    availableAstronauts.find((a) => a.id === selectedAstronautId) || availableAstronauts[0];

  const canViewPsychologicalJournal = (targetAstronautId: string) => {
    if (currentRole === 'ASTRONAUT') {
      // Astronauts can only view their own private journal
      return selectedAstronautId === targetAstronautId;
    }
    if (currentRole === 'MEDICAL_OFFICER') {
      // Flight Surgeons have authorized medical review permissions
      return true;
    }
    // Mission Commanders do not have access to private psychological journal entries
    return false;
  };

  const canAcknowledgeAlerts = currentRole === 'MEDICAL_OFFICER' || currentRole === 'ASTRONAUT';
  const canUploadLabRecords = currentRole === 'MEDICAL_OFFICER';
  const canModifyProtocols =
    currentRole === 'MEDICAL_OFFICER' ||
    currentRole === 'MISSION_CONTROLLER' ||
    currentRole === 'MISSION_COMMANDER';

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        currentUser,
        selectedAstronautId,
        selectedAstronaut,
        availableAstronauts,
        setRole: setCurrentRole,
        setSelectedAstronautId,
        canViewPsychologicalJournal,
        canAcknowledgeAlerts,
        canUploadLabRecords,
        canModifyProtocols,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return ctx;
};
