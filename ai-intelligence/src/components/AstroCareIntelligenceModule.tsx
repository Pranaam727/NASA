import React, { useState } from 'react';
import { SafetyBanner } from './common/SafetyBanner';
import { Header } from './common/Header';
import { MissionContextBar } from './mission/MissionContextBar';
import { ChatInterface } from './chat/ChatInterface';
import { HealthDataInterpretationView } from './health/HealthDataInterpretationView';
import { ResearchAssistantView } from './research/ResearchAssistantView';
import { AIInsightsDashboard } from './insights/AIInsightsDashboard';
import { IntegrationGuideModal } from './integration/IntegrationGuideModal';
import { DEFAULT_ASTRONAUT_PROFILES } from '../data/astronautProfiles';
import { AstronautHealthPayload, MissionContext } from '../types';
import {
  MessageSquare,
  Activity,
  BookOpen,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export type ActiveModuleTab = 'chat' | 'health-data' | 'research' | 'insights';

export interface AstroCareIntelligenceModuleProps {
  initialAstronautId?: string;
  className?: string;
  onAlertGenerated?: (alert: any) => void;
}

export const AstroCareIntelligenceModule: React.FC<AstroCareIntelligenceModuleProps> = ({
  initialAstronautId,
  className = ''
}) => {
  // State for active astronaut profile and mission context
  const initialProfile = DEFAULT_ASTRONAUT_PROFILES.find(
    p => p.astronaut.astronautId === initialAstronautId
  ) || DEFAULT_ASTRONAUT_PROFILES[0];

  const [currentAstronaut, setCurrentAstronaut] = useState<AstronautHealthPayload>(initialProfile.astronaut);
  const [missionContext, setMissionContext] = useState<MissionContext>(initialProfile.missionContext);
  const [activeTab, setActiveTab] = useState<ActiveModuleTab>('chat');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [selectedResearchDocId, setSelectedResearchDocId] = useState<string | null>(null);

  const handleSelectAstronaut = (profile: { astronaut: AstronautHealthPayload; missionContext: MissionContext }) => {
    setCurrentAstronaut(profile.astronaut);
    setMissionContext(profile.missionContext);
  };

  const handleOpenResearchDoc = (docId: string) => {
    setSelectedResearchDocId(docId);
    setActiveTab('research');
  };

  return (
    <div className={`min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black ${className}`}>
      
      {/* 1. NASA Clinical Advisory / Safety Banner */}
      <SafetyBanner />

      {/* 2. Top Header with Module Branding, Mode Switcher, and Profile Selector */}
      <Header
        currentAstronaut={currentAstronaut}
        missionContext={missionContext}
        onSelectAstronaut={handleSelectAstronaut}
        onOpenIntegrationGuide={() => setIsGuideOpen(true)}
      />

      {/* 3. Main Operational Container */}
      <main className="max-w-7xl mx-auto px-4 py-5 w-full flex-1 space-y-5">
        
        {/* Mission Context & Environmental Bar */}
        <MissionContextBar
          missionContext={missionContext}
          onUpdateMissionContext={setMissionContext}
        />

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-md glow-cyan'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Assistant (Chat & Q&A)</span>
            </button>

            <button
              onClick={() => setActiveTab('health-data')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'health-data'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-md glow-cyan'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Health Data Interpretation</span>
            </button>

            <button
              onClick={() => setActiveTab('research')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'research'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-md glow-cyan'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>NASA Research Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'insights'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-md glow-cyan'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Insights & Risk Matrix</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-500 font-mono text-[11px]">
            <Info className="w-3.5 h-3.5 text-cyan-500/70" />
            <span>Telemetry linked to NASA HRP baseline models</span>
          </div>
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'chat' && (
          <ChatInterface
            currentAstronaut={currentAstronaut}
            missionContext={missionContext}
            onOpenResearchDoc={handleOpenResearchDoc}
          />
        )}

        {activeTab === 'health-data' && (
          <HealthDataInterpretationView
            currentAstronaut={currentAstronaut}
            missionContext={missionContext}
            onUpdateAstronaut={setCurrentAstronaut}
            onOpenResearchDoc={handleOpenResearchDoc}
          />
        )}

        {activeTab === 'research' && (
          <ResearchAssistantView
            initialSelectedDocId={selectedResearchDocId}
            onCloseSelectedDoc={() => setSelectedResearchDocId(null)}
          />
        )}

        {activeTab === 'insights' && (
          <AIInsightsDashboard
            currentAstronaut={currentAstronaut}
            missionContext={missionContext}
          />
        )}

      </main>

      {/* Integration Guide Modal */}
      <IntegrationGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer Bar */}
      <footer className="bg-slate-950 border-t border-slate-850 py-3 px-4 text-center text-xs text-slate-500 font-mono mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>AstroCare Biomedical Platform • Module <strong className="text-cyan-400">ai-intelligence</strong></span>
          <span>Powered by Google Gemini API & NASA Human Research Program Data</span>
          <span>Informational Decision Support Only</span>
        </div>
      </footer>

    </div>
  );
};
