import React, { useState } from 'react';
import { MissionScenario } from '../types';
import { MissionScenarioEditor } from '../components/digital-twin/MissionScenarioEditor';
import { missionScenarioService } from '../services/missionScenarioService';
import { Badge } from '../components/common/Badge';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';

export const MissionSimulatorPage: React.FC = () => {
  const [scenarios, setScenarios] = useState<MissionScenario[]>(missionScenarioService.getAll());
  const [activeScenarioId, setActiveScenarioId] = useState<string>(scenarios[0]?.id || 'scen-001');

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Hypothetical Mission Scenario Simulator
            </h1>
            <Badge variant="cyan">COUNTERMEASURE EFFECTIVENESS</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate astronaut physiological deconditioning and countermeasure mitigation across Low Earth Orbit, Lunar Gateway, Mars Transit, and Ground Analogs.
          </p>
        </div>
      </div>

      <DisclaimerNotice />

      <MissionScenarioEditor
        scenarios={scenarios}
        activeScenario={activeScenario}
        onSelectScenario={setActiveScenarioId}
        onRunSimulation={(id) => missionScenarioService.runSimulation(id)}
      />
    </div>
  );
};
