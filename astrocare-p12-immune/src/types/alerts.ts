export type AlertSeverity = 'NORMAL' | 'INFORMATIONAL' | 'WARNING' | 'CRITICAL';

export type AlertCategory =
  | 'CYTOKINE_SURGE'
  | 'LEUKOCYTE_DYSREGULATION'
  | 'INFLAMMATORY_SPIKE'
  | 'VIRAL_REACTIVATION_RISK'
  | 'SAMPLE_WORKFLOW_DELAY'
  | 'STALE_MEASUREMENT'
  | 'BASELINE_DEVIATION';

export interface ImmuneAlert {
  id: string;
  astronautId: string;
  missionId: string;
  category: AlertCategory;
  severity: AlertSeverity;
  analyte: string;
  observedValue: number | string;
  threshold: number | string;
  unit: string;
  timestamp: string;
  source: string;
  explanation: string;
  recommendedFollowUp: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

/**
 * Generic AstroCare Alert Contract for Master Application Integration
 */
export interface MasterAstroCareAlert {
  alertId: string;
  originModule: 'P12_IMMUNE_INTELLIGENCE';
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  title: string;
  message: string;
  timestamp: string;
  entityId: string;
  acknowledged: boolean;
  metadata: {
    analyte: string;
    observedValue: number | string;
    threshold: number | string;
    unit: string;
    category: string;
    recommendedFollowUp: string;
  };
}
