/**
 * ASTROCARE AI HEALTH ASSISTANT REACT HOOK
 * Coordinates conversational interaction, grounded context compilation,
 * predictive insights generation, and report persistence.
 */

import { useState, useCallback, useMemo } from 'react';
import { useHealthAnalytics } from '@/features/analytics/hooks/useHealthAnalytics';
import { compileGroundedContext } from '../grounding';
import { geminiService } from '../services/geminiService';
import { generatePredictiveInsights, explainActiveRisks } from '../knowledgeEngine';
import { reportService } from '@/services/dataProvider';
import { ReportType } from '@/types/database.types';
import {
  AIMessage,
  GroundedContextDocument,
  MissionHealthReportDraft,
  PredictiveInsight,
} from '../types';

export function useAIHealthAssistant(initialAstronautId?: string) {
  const {
    astronautId,
    currentAstronaut,
    baseline,
    latestVitals,
    latestRadiation,
    deviations,
    riskAssessment,
    allAlerts,
    setAstronaut,
    isSimulating,
  } = useHealthAnalytics(initialAstronautId);

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content:
        'AstroCare Autonomous Aerospace Clinical Copilot online. Ready to evaluate physiological telemetry, explain deterministic risk indices, and synthesize mission health briefings. Select a suggested prompt below or enter a custom clinical query.',
      timestamp: new Date().toISOString(),
      provenanceTags: ['AI_INTERPRETATION'],
      suggestedFollowUps: [
        'Analyze current cardiovascular and hypoxia risk factors.',
        'Explain active alerts and recommend immediate countermeasures.',
        'Generate daily flight surgeon briefing.',
        'Evaluate cumulative radiation dosage and space weather trends.',
      ],
    },
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeReport, setActiveReport] = useState<MissionHealthReportDraft | null>(null);

  // Compile real-time grounded context document
  const groundedContext: GroundedContextDocument = useMemo(() => {
    return compileGroundedContext(
      baseline,
      latestVitals,
      latestRadiation,
      deviations,
      riskAssessment,
      allAlerts
    );
  }, [baseline, latestVitals, latestRadiation, deviations, riskAssessment, allAlerts]);

  // Compute live predictive deterioration insights
  const predictiveInsights: PredictiveInsight[] = useMemo(() => {
    return generatePredictiveInsights(groundedContext);
  }, [groundedContext]);

  // Compute live clinical risk explanation
  const riskExplanation: string = useMemo(() => {
    return explainActiveRisks(groundedContext);
  }, [groundedContext]);

  // Send a message to the copilot
  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim()) return;

      const userMessage: AIMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: userText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const responseMessage = await geminiService.queryCopilot(userText, groundedContext);
        setMessages((prev) => [...prev, responseMessage]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: `⚠️ **COMMUNICATION ERROR:** Unable to complete intelligence synthesis: ${err instanceof Error ? err.message : 'Unknown error'}`,
            timestamp: new Date().toISOString(),
            provenanceTags: ['RULE_ALERT'],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [groundedContext]
  );

  // Generate and persist a structured Mission Health Report
  const generateMissionReport = useCallback(
    async (reportType: ReportType): Promise<MissionHealthReportDraft> => {
      setIsLoading(true);
      try {
        const report = await geminiService.generateReport(reportType, groundedContext);
        setActiveReport(report);

        // Persist to report service (Demo / Supabase)
        await reportService.createAIRecord({
          astronaut_id: groundedContext.astronautId,
          mission_id: groundedContext.missionCode,
          report_type: reportType,
          prompt_context_summary: groundedContext.baselineSummary,
          ai_response_markdown: report.markdownContent,
          model_version: 'Gemini-1.5-Aerospace-Grounded',
          disclaimer_acknowledged: true,
          citations_json: report.citations,
        });

        return report;
      } finally {
        setIsLoading(false);
      }
    },
    [groundedContext]
  );

  const clearConversation = useCallback(() => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: `AstroCare Copilot conversation cleared. Current clinical context aligned with subject: **${groundedContext.callsign}** (${groundedContext.fullName}).`,
        timestamp: new Date().toISOString(),
        provenanceTags: ['AI_INTERPRETATION'],
        suggestedFollowUps: [
          'Analyze current cardiovascular and hypoxia risk factors.',
          'Explain active alerts and recommend immediate countermeasures.',
          'Generate daily flight surgeon briefing.',
        ],
      },
    ]);
  }, [groundedContext]);

  return {
    astronautId,
    currentAstronaut,
    groundedContext,
    messages,
    isLoading,
    predictiveInsights,
    riskExplanation,
    activeReport,
    setAstronaut,
    sendMessage,
    generateMissionReport,
    clearConversation,
    isSimulating,
  };
}
