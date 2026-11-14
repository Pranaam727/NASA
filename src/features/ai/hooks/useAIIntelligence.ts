import { useState, useEffect, useCallback, useMemo } from 'react';
import { useHealthAnalytics } from '@/features/analytics/hooks/useHealthAnalytics';
import { AIContextBuilder } from '../services/aiContextBuilder';
import { aiOrchestrator } from '../services/aiOrchestrator';
import { p08PersistenceService } from '@/services/p08Persistence';
import {
  GroundedAIContext,
  AIHealthSummary,
  AIAnomalyExplanation,
  AITrendInterpretation,
  ChatMessage,
  AISystemOverview,
  AIProviderMode,
  TimeRangeOption,
  CopilotOverview,
  HealthSituationBrief,
  ClinicalInvestigation,
  InvestigationReport,
  FollowUpChecklistItem,
  MultiMetricAnalysisResult,
  VitalParameter,
} from '../types/aiTypes';

export function useAIIntelligence(initialAstronautId: string = 'ASTRO-01') {
  const {
    astronauts,
    selectedAstronaut,
    selectedAstronautId,
    setSelectedAstronautId,
    latestVitals,
    latestRadiation,
    assessment,
    activeAlerts,
    systemWideActiveAlerts,
    isStreaming,
  } = useHealthAnalytics(initialAstronautId);

  const [timeRange, setTimeRange] = useState<TimeRangeOption>('24H');
  const [providerMode, setProviderModeState] = useState<AIProviderMode>('DETERMINISTIC_FALLBACK');
  const [summary, setSummary] = useState<AIHealthSummary | null>(null);
  const [trends, setTrends] = useState<AITrendInterpretation | null>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [anomalyExplanation, setAnomalyExplanation] = useState<AIAnomalyExplanation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  const [systemOverview, setSystemOverview] = useState<AISystemOverview>(() => aiOrchestrator.getSystemOverview());

  // Prompt 08 State
  const [copilotOverview, setCopilotOverview] = useState<CopilotOverview | null>(null);
  const [situationBrief, setSituationBrief] = useState<HealthSituationBrief | null>(null);
  const [investigations, setInvestigations] = useState<ClinicalInvestigation[]>([]);
  const [selectedInvestigation, setSelectedInvestigation] = useState<ClinicalInvestigation | null>(null);
  const [reports, setReports] = useState<InvestigationReport[]>([]);
  const [checklistItems, setChecklistItems] = useState<FollowUpChecklistItem[]>([]);
  const [multiMetricResult, setMultiMetricResult] = useState<MultiMetricAnalysisResult | null>(null);
  const [isLoadingCopilot, setIsLoadingCopilot] = useState<boolean>(false);

  // 1. Build Grounded Context
  const context: GroundedAIContext = useMemo(() => {
    return AIContextBuilder.buildContext(
      selectedAstronaut,
      assessment,
      latestVitals,
      latestRadiation,
      activeAlerts,
      timeRange
    );
  }, [selectedAstronaut, assessment, latestVitals, latestRadiation, activeAlerts, timeRange]);

  // Set provider mode in orchestrator
  const setProviderMode = useCallback((mode: AIProviderMode) => {
    aiOrchestrator.setProviderMode(mode);
    setProviderModeState(mode);
    setSystemOverview(aiOrchestrator.getSystemOverview());
  }, []);

  // 2. Fetch / Refresh Health Summary
  const refreshSummary = useCallback(async (force: boolean = false) => {
    setIsLoadingSummary(true);
    try {
      const res = await aiOrchestrator.getHealthSummary(context, force);
      setSummary(res);
      setSystemOverview(aiOrchestrator.getSystemOverview());
    } catch (err) {
      console.error('Error generating AI summary:', err);
    } finally {
      setIsLoadingSummary(false);
    }
  }, [context]);

  // 3. Fetch Trend Interpretations
  const refreshTrends = useCallback(async (force: boolean = false) => {
    try {
      const res = await aiOrchestrator.interpretTrends(context, force);
      setTrends(res);
      setSystemOverview(aiOrchestrator.getSystemOverview());
    } catch (err) {
      console.error('Error interpreting trends:', err);
    }
  }, [context]);

  // 4. Explain Selected Anomaly
  const explainAnomaly = useCallback(async (alertId: string) => {
    setSelectedAlertId(alertId);
    try {
      const res = await aiOrchestrator.explainAnomaly(alertId, context);
      setAnomalyExplanation(res);
      setSystemOverview(aiOrchestrator.getSystemOverview());
    } catch (err) {
      console.error('Error explaining anomaly:', err);
    }
  }, [context]);

  // 5. Ask Question
  const askQuestion = useCallback(async (query: string) => {
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toISOString(),
      provenance: providerMode,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoadingChat(true);

    try {
      const reply = await aiOrchestrator.askQuestion(query, context);
      setMessages((prev) => [...prev, reply]);
      setSystemOverview(aiOrchestrator.getSystemOverview());
    } catch (err) {
      console.error('Error getting chat response:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Error communicating with intelligence provider. Please check telemetry connection or try again.',
        timestamp: new Date().toISOString(),
        provenance: 'DETERMINISTIC_FALLBACK',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoadingChat(false);
    }
  }, [context, providerMode]);

  // Initial and reactive evaluation
  useEffect(() => {
    refreshSummary(false);
    refreshTrends(false);
  }, [refreshSummary, refreshTrends]);

  useEffect(() => {
    if (activeAlerts.length > 0) {
      const targetId = selectedAlertId && activeAlerts.some((a) => a.id === selectedAlertId)
        ? selectedAlertId
        : activeAlerts[0].id;
      if (targetId !== selectedAlertId) {
        setSelectedAlertId(targetId);
      }
      explainAnomaly(targetId);
    } else {
      setSelectedAlertId(null);
      setAnomalyExplanation(null);
    }
  }, [activeAlerts, explainAnomaly, selectedAlertId]);

  // Prompt 08: Load saved investigations, reports, checklist items
  const loadP08Data = useCallback(async () => {
    try {
      const invs = await p08PersistenceService.loadInvestigations(selectedAstronautId);
      setInvestigations(invs);
      if (invs.length > 0 && !selectedInvestigation) {
        setSelectedInvestigation(invs[0]);
      }
      const reps = await p08PersistenceService.loadReports();
      setReports(reps);
      const chks = await p08PersistenceService.loadChecklistItems();
      setChecklistItems(chks);
    } catch (e) {
      console.warn('Failed to load P08 data:', e);
    }
  }, [selectedAstronautId, selectedInvestigation]);

  useEffect(() => {
    loadP08Data();
  }, [loadP08Data]);

  // Prompt 08: Copilot Overview & Health Situation Brief
  const refreshCopilotOverview = useCallback(async (force: boolean = false) => {
    setIsLoadingCopilot(true);
    try {
      const res = await aiOrchestrator.generateCopilotOverview(context, force);
      setCopilotOverview(res);
      const brief = await aiOrchestrator.generateHealthSituationBrief(context, timeRange, force);
      setSituationBrief(brief);
    } catch (err) {
      console.error('Error generating Copilot Overview:', err);
    } finally {
      setIsLoadingCopilot(false);
    }
  }, [context, timeRange]);

  useEffect(() => {
    refreshCopilotOverview(false);
  }, [refreshCopilotOverview]);

  // Prompt 08: Create and Save Investigation
  const createInvestigation = useCallback(async (
    title: string,
    primaryMetric: VitalParameter,
    notes: string = '',
    relatedAlertIds: string[] = []
  ): Promise<ClinicalInvestigation> => {
    const newInv: ClinicalInvestigation = {
      investigationId: `INV-${Date.now()}`,
      title,
      astronautId: selectedAstronautId,
      missionId: context.missionId,
      primaryMetric,
      relatedAlertIds,
      timeRange,
      notes,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await p08PersistenceService.saveInvestigation(newInv);
    setInvestigations((prev) => [newInv, ...prev]);
    setSelectedInvestigation(newInv);

    // Automatically analyze investigation to create initial report & checklist suggestions
    try {
      const report = await aiOrchestrator.analyzeClinicalInvestigation(newInv, context);
      await p08PersistenceService.saveReport(report);
      setReports((prev) => [report, ...prev]);

      const suggestions = await aiOrchestrator.suggestFollowUpActions(newInv.investigationId, context);
      for (const item of suggestions) {
        await p08PersistenceService.saveChecklistItem(item);
      }
      setChecklistItems((prev) => [...suggestions, ...prev]);
    } catch (e) {
      console.warn('Failed auto-analysis for new investigation:', e);
    }

    return newInv;
  }, [selectedAstronautId, context, timeRange]);

  // Prompt 08: Multi-Metric Analysis
  const runMultiMetricAnalysis = useCallback(async (
    metrics: VitalParameter[],
    range: TimeRangeOption = timeRange
  ) => {
    try {
      const res = await aiOrchestrator.analyzeMultipleMetrics(metrics, range, context);
      setMultiMetricResult(res);
      return res;
    } catch (err) {
      console.error('Error running multi-metric analysis:', err);
      return null;
    }
  }, [context, timeRange]);

  // Prompt 08: Add / Update Checklist Item
  const toggleChecklistItem = useCallback(async (item: FollowUpChecklistItem) => {
    const updated: FollowUpChecklistItem = {
      ...item,
      status: item.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
    };
    await p08PersistenceService.saveChecklistItem(updated);
    setChecklistItems((prev) => prev.map((i) => (i.itemId === item.itemId ? updated : i)));
  }, []);

  const addChecklistItem = useCallback(async (
    investigationId: string,
    description: string,
    priority: FollowUpChecklistItem['priority'] = 'MEDIUM'
  ) => {
    const newItem: FollowUpChecklistItem = {
      itemId: `CHK-${Date.now()}`,
      investigationId,
      description,
      priority,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    await p08PersistenceService.saveChecklistItem(newItem);
    setChecklistItems((prev) => [newItem, ...prev]);
  }, []);

  return {
    astronauts,
    selectedAstronaut,
    selectedAstronautId,
    setSelectedAstronautId,
    timeRange,
    setTimeRange,
    context,
    summary,
    trends,
    anomalyExplanation,
    selectedAlertId,
    setSelectedAlertId,
    messages,
    isLoadingSummary,
    isLoadingChat,
    systemOverview,
    providerMode,
    setProviderMode,
    refreshSummary,
    refreshTrends,
    explainAnomaly,
    askQuestion,
    clearChat: () => setMessages([]),
    isStreaming,
    activeAlerts,
    systemWideActiveAlerts,
    assessment,

    // P08 Additions
    copilotOverview,
    situationBrief,
    investigations,
    selectedInvestigation,
    setSelectedInvestigation,
    reports,
    checklistItems,
    multiMetricResult,
    isLoadingCopilot,
    refreshCopilotOverview,
    createInvestigation,
    runMultiMetricAnalysis,
    toggleChecklistItem,
    addChecklistItem,
  };
}
