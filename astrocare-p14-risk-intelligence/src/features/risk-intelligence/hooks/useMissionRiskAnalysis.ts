import { useState, useMemo } from 'react';
import { MissionProfile, MissionAssessmentReport } from '../types/mission.types';
import { RiskAnalysisService } from '../services/riskAnalysisService';
import { PRESET_MISSION_PROFILES } from '../data/missionProfiles';

export function useMissionRiskAnalysis() {
  const presets = useMemo(() => RiskAnalysisService.getPresetMissions(), []);
  
  const [selectedPresetId, setSelectedPresetId] = useState<string>(presets[0].id);
  const [activeMission, setActiveMission] = useState<MissionProfile>({ ...presets[0] });
  
  // Side-by-side comparison state
  const [comparisonMission, setComparisonMission] = useState<MissionProfile>({ ...presets[2] }); // Mars preset by default
  const [isComparing, setIsComparing] = useState(false);

  const report = useMemo<MissionAssessmentReport>(() => {
    return RiskAnalysisService.analyzeMission(activeMission);
  }, [activeMission]);

  const comparisonReport = useMemo(() => {
    if (!isComparing) return null;
    return RiskAnalysisService.compareMissions(activeMission, comparisonMission);
  }, [activeMission, comparisonMission, isComparing]);

  const selectPreset = (presetId: string) => {
    const found = presets.find(p => p.id === presetId);
    if (found) {
      setSelectedPresetId(presetId);
      setActiveMission({ ...found });
    }
  };

  const updateMissionParam = (updater: Partial<MissionProfile> | ((prev: MissionProfile) => MissionProfile)) => {
    setActiveMission(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return { ...next, isHypothetical: true };
    });
  };

  const updateComparisonParam = (updater: Partial<MissionProfile> | ((prev: MissionProfile) => MissionProfile)) => {
    setComparisonMission(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return { ...next, isHypothetical: true };
    });
  };

  return {
    presets,
    selectedPresetId,
    activeMission,
    comparisonMission,
    isComparing,
    setIsComparing,
    report,
    comparisonReport,
    selectPreset,
    updateMissionParam,
    updateComparisonParam,
    setComparisonMission
  };
}
