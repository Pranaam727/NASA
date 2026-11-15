import { AstronautProfile, CreateAstronautProfileInput } from '../types';
import { DEMO_ASTRONAUTS } from '../data/demoAstronauts';
import { safeStorage } from '../utils/safeStorage';

const STORAGE_KEY = 'astrocare_p17_astronaut_profiles';

class AstronautProfileService {
  private getStored(): AstronautProfile[] {
    try {
      const data = safeStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read astronaut profiles, using demo data.', e);
    }
    this.save(DEMO_ASTRONAUTS);
    return DEMO_ASTRONAUTS;
  }

  private save(profiles: AstronautProfile[]): void {
    try {
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.error('Failed to save astronaut profiles', e);
    }
  }

  public getAll(): AstronautProfile[] {
    return this.getStored();
  }

  public getById(id: string): AstronautProfile | undefined {
    return this.getStored().find((p) => p.id === id);
  }

  public create(input: CreateAstronautProfileInput): AstronautProfile {
    const profiles = this.getStored();
    const newProfile: AstronautProfile = {
      id: `astro-${Date.now().toString().slice(-4)}`,
      displayName: input.displayName,
      codeName: input.codeName,
      role: input.role,
      missionId: input.missionId,
      missionName: input.missionName,
      missionType: input.missionType,
      missionPhase: input.missionPhase,
      missionDay: input.missionDay,
      missionDurationDays: input.missionDurationDays,
      age: input.age,
      biologicalSex: input.biologicalSex || 'Undisclosed',
      heightCm: input.heightCm,
      weightKg: input.weightKg,
      isSynthetic: true,
      notes: input.notes || 'Synthetic demonstration profile.',
      baselineMeasurements: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    profiles.push(newProfile);
    this.save(profiles);
    return newProfile;
  }

  public update(id: string, updates: Partial<AstronautProfile>): AstronautProfile | null {
    const profiles = this.getStored();
    const index = profiles.findIndex((p) => p.id === id);
    if (index === -1) return null;

    profiles[index] = {
      ...profiles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save(profiles);
    return profiles[index];
  }

  public delete(id: string): boolean {
    const profiles = this.getStored();
    const filtered = profiles.filter((p) => p.id !== id);
    if (filtered.length === profiles.length) return false;
    this.save(filtered);
    return true;
  }

  public resetToDemo(): AstronautProfile[] {
    this.save(DEMO_ASTRONAUTS);
    return DEMO_ASTRONAUTS;
  }
}

export const astronautProfileService = new AstronautProfileService();
