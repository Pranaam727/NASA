import {
  ClinicalInvestigation,
  InvestigationReport,
  FollowUpChecklistItem,
} from '@/features/ai/types/aiTypes';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

const INVESTIGATIONS_KEY = 'astrocare_p08_investigations';
const REPORTS_KEY = 'astrocare_p08_reports';
const CHECKLIST_KEY = 'astrocare_p08_checklist';

class P08PersistenceService {
  private useSupabase = isSupabaseConfigured();
  private memoryFallback: Map<string, string> = new Map();

  // ------------------- LocalStorage Helpers -------------------
  private getLocal<T>(key: string): T[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = window.localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
      }
      const mem = this.memoryFallback.get(key);
      return mem ? JSON.parse(mem) : [];
    } catch {
      return [];
    }
  }

  private setLocal<T>(key: string, items: T[]): void {
    try {
      const serialized = JSON.stringify(items);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, serialized);
      } else {
        this.memoryFallback.set(key, serialized);
      }
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  // ------------------- Investigations -------------------
  public async saveInvestigation(investigation: ClinicalInvestigation): Promise<ClinicalInvestigation> {
    if (this.useSupabase) {
      try {
        const { data, error } = await supabase
          .from('clinical_investigations')
          .upsert({
            id: investigation.investigationId,
            astronaut_id: investigation.astronautId,
            mission_id: investigation.missionId,
            title: investigation.title,
            primary_metric: investigation.primaryMetric,
            related_alert_ids: investigation.relatedAlertIds,
            time_range: investigation.timeRange,
            notes: investigation.notes,
            status: investigation.status,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (!error && data) return investigation;
      } catch (err) {
        console.warn('Supabase investigation save failed, falling back to localStorage:', err);
      }
    }

    // LocalStorage Fallback
    const items = this.getLocal<ClinicalInvestigation>(INVESTIGATIONS_KEY);
    const index = items.findIndex((i) => i.investigationId === investigation.investigationId);
    if (index >= 0) {
      items[index] = { ...investigation, updatedAt: new Date().toISOString() };
    } else {
      items.unshift(investigation);
    }
    this.setLocal(INVESTIGATIONS_KEY, items);
    return investigation;
  }

  public async loadInvestigations(astronautId?: string): Promise<ClinicalInvestigation[]> {
    if (this.useSupabase) {
      try {
        let query = supabase.from('clinical_investigations').select('*');
        if (astronautId) query = query.eq('astronaut_id', astronautId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            investigationId: d.id,
            title: d.title,
            astronautId: d.astronaut_id,
            missionId: d.mission_id,
            primaryMetric: d.primary_metric,
            relatedAlertIds: d.related_alert_ids || [],
            timeRange: d.time_range,
            notes: d.notes,
            status: d.status,
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase investigation load failed, falling back to localStorage:', err);
      }
    }

    const items = this.getLocal<ClinicalInvestigation>(INVESTIGATIONS_KEY);
    if (astronautId) {
      return items.filter((i) => i.astronautId === astronautId);
    }
    return items;
  }

  // ------------------- Reports -------------------
  public async saveReport(report: InvestigationReport): Promise<InvestigationReport> {
    if (this.useSupabase) {
      try {
        const { error } = await supabase
          .from('investigation_reports')
          .upsert({
            id: report.reportId,
            investigation_id: report.investigationId,
            astronaut_id: report.astronautId,
            mission_id: report.missionId,
            primary_observation: report.primaryObservation,
            anomaly_severity: report.anomalySeverity,
            supporting_metrics: report.supportingMetrics,
            baseline_comparisons: report.baselineComparisons,
            ai_interpretation: report.aiInterpretation,
            possible_contributing_factors: report.possibleContributingFactors,
            missing_information: report.missingInformation,
            recommended_monitoring_actions: report.recommendedMonitoringActions,
            human_review_notes: report.humanReviewNotes,
            provider_mode: report.providerMode,
            created_at: report.createdAt,
          });

        if (!error) return report;
      } catch (err) {
        console.warn('Supabase report save failed, falling back to localStorage:', err);
      }
    }

    const items = this.getLocal<InvestigationReport>(REPORTS_KEY);
    const index = items.findIndex((r) => r.reportId === report.reportId);
    if (index >= 0) {
      items[index] = report;
    } else {
      items.unshift(report);
    }
    this.setLocal(REPORTS_KEY, items);
    return report;
  }

  public async loadReports(investigationId?: string): Promise<InvestigationReport[]> {
    if (this.useSupabase) {
      try {
        let query = supabase.from('investigation_reports').select('*');
        if (investigationId) query = query.eq('investigation_id', investigationId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            reportId: d.id,
            investigationId: d.investigation_id,
            astronautId: d.astronaut_id,
            missionId: d.mission_id,
            createdAt: d.created_at,
            primaryObservation: d.primary_observation,
            anomalySeverity: d.anomaly_severity,
            supportingMetrics: d.supporting_metrics || [],
            baselineComparisons: d.baseline_comparisons || [],
            aiInterpretation: d.ai_interpretation,
            possibleContributingFactors: d.possible_contributing_factors || [],
            missingInformation: d.missing_information || [],
            recommendedMonitoringActions: d.recommended_monitoring_actions || [],
            humanReviewNotes: d.human_review_notes || [],
            providerMode: d.provider_mode || 'DETERMINISTIC_FALLBACK',
          }));
        }
      } catch (err) {
        console.warn('Supabase reports load failed, falling back to localStorage:', err);
      }
    }

    const items = this.getLocal<InvestigationReport>(REPORTS_KEY);
    if (investigationId) {
      return items.filter((r) => r.investigationId === investigationId);
    }
    return items;
  }

  // ------------------- Follow-up Checklist -------------------
  public async saveChecklistItem(item: FollowUpChecklistItem): Promise<FollowUpChecklistItem> {
    if (this.useSupabase) {
      try {
        const { error } = await supabase
          .from('follow_up_checklist_items')
          .upsert({
            id: item.itemId,
            investigation_id: item.investigationId,
            description: item.description,
            priority: item.priority,
            status: item.status,
            notes: item.notes,
            due_date: item.dueDate,
          });

        if (!error) return item;
      } catch (err) {
        console.warn('Supabase checklist save failed, falling back to localStorage:', err);
      }
    }

    const items = this.getLocal<FollowUpChecklistItem>(CHECKLIST_KEY);
    const index = items.findIndex((i) => i.itemId === item.itemId);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.unshift(item);
    }
    this.setLocal(CHECKLIST_KEY, items);
    return item;
  }

  public async loadChecklistItems(investigationId?: string): Promise<FollowUpChecklistItem[]> {
    if (this.useSupabase) {
      try {
        let query = supabase.from('follow_up_checklist_items').select('*');
        if (investigationId) query = query.eq('investigation_id', investigationId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            itemId: d.id,
            investigationId: d.investigation_id,
            description: d.description,
            priority: d.priority,
            createdAt: d.created_at,
            dueDate: d.due_date,
            status: d.status,
            notes: d.notes,
          }));
        }
      } catch (err) {
        console.warn('Supabase checklist load failed, falling back to localStorage:', err);
      }
    }

    const items = this.getLocal<FollowUpChecklistItem>(CHECKLIST_KEY);
    if (investigationId) {
      return items.filter((i) => i.investigationId === investigationId);
    }
    return items;
  }
}

export const p08PersistenceService = new P08PersistenceService();
