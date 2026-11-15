import React from 'react';
import { AstronautProfile } from '../types';
import { AnomalyDetectionPanel } from '../components/digital-twin/AnomalyDetectionPanel';
import { useAnomalyDetection } from '../hooks/useAnomalyDetection';
import { Badge } from '../components/common/Badge';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';

interface AnomalyDetectionPageProps {
  activeProfile: AstronautProfile;
}

export const AnomalyDetectionPage: React.FC<AnomalyDetectionPageProps> = ({
  activeProfile,
}) => {
  const { anomalies, config, updateStatus, updateDetectionConfig } = useAnomalyDetection(
    activeProfile?.id
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Explainable Anomaly Detection Center
            </h1>
            <Badge variant="cyan">ANALYTICAL RULE ENGINE</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time biometric departure monitoring, z-score outlier identification, and flight surgeon review workflow for {activeProfile?.displayName}.
          </p>
        </div>
      </div>

      <DisclaimerNotice />

      <AnomalyDetectionPanel
        anomalies={anomalies}
        config={config}
        onUpdateStatus={updateStatus}
        onUpdateConfig={updateDetectionConfig}
      />
    </div>
  );
};
