import React from 'react';
import { Wind, Gauge, Droplets, Thermometer } from 'lucide-react';

interface TelemetryItem {
  label: string;
  value: string | number;
  unit: string;
  status: 'NOMINAL' | 'CAUTION' | 'CRITICAL';
  nominalRange: string;
  isSimulated?: boolean;
}

interface MissionTelemetryProps {
  items?: TelemetryItem[];
  className?: string;
}

export const MissionTelemetry: React.FC<MissionTelemetryProps> = ({
  items,
  className = '',
}) => {
  const defaultItems: TelemetryItem[] = [
    {
      label: 'Cabin Total Pressure',
      value: '101.3',
      unit: 'kPa',
      status: 'NOMINAL',
      nominalRange: '99.3–102.7 kPa',
      isSimulated: false,
    },
    {
      label: 'Oxygen Partial Pressure (pO2)',
      value: '21.1',
      unit: 'kPa',
      status: 'NOMINAL',
      nominalRange: '19.5–23.1 kPa',
      isSimulated: false,
    },
    {
      label: 'Carbon Dioxide (pCO2)',
      value: '0.38',
      unit: 'kPa',
      status: 'NOMINAL',
      nominalRange: '<0.53 kPa (4 mmHg)',
      isSimulated: false,
    },
    {
      label: 'Relative Humidity',
      value: '46.2',
      unit: '%',
      status: 'NOMINAL',
      nominalRange: '40–60%',
      isSimulated: true,
    },
    {
      label: 'Habitat Air Temp',
      value: '22.4',
      unit: '°C',
      status: 'NOMINAL',
      nominalRange: '20.0–24.0°C',
      isSimulated: false,
    },
  ];

  const telemetryList = items || defaultItems;

  const iconMap: Record<string, React.ElementType> = {
    Pressure: Gauge,
    Oxygen: Wind,
    Carbon: Wind,
    Humidity: Droplets,
    Temp: Thermometer,
  };

  const getIcon = (label: string) => {
    for (const key of Object.keys(iconMap)) {
      if (label.includes(key)) return iconMap[key];
    }
    return Gauge;
  };

  return (
    <div
      className={`p-6 rounded-2xl bg-[#FFFFFF] border border-[#DCD8CD] shadow-subtle space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[#DCD8CD] pb-3">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#888882] block">
            ENVIRONMENTAL CONTROL & LIFE SUPPORT SYSTEM
          </span>
          <h4 className="font-display font-bold text-base text-[#111111]">
            ECLSS CABIN BIOSPHERE
          </h4>
        </div>
        <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-[#75D8DC]/20 border border-[#75D8DC]/40 text-[#111111] font-bold">
          BIOSPHERE NOMINAL
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {telemetryList.map((item, idx) => {
          const Icon = getIcon(item.label);
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#F2F0EA]/60 border border-[#DCD8CD] flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between text-[#888882] font-mono text-[10px]">
                <div className="flex items-center space-x-1.5 truncate">
                  <Icon className="w-3.5 h-3.5 text-[#111111]" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.isSimulated && (
                  <span className="text-[8px] bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#DCD8CD] text-[#888882]">
                    SIM
                  </span>
                )}
              </div>

              <div className="flex items-baseline space-x-1">
                <span className="font-display font-bold text-2xl text-[#111111] tabular-nums">
                  {item.value}
                </span>
                <span className="font-mono text-xs text-[#888882]">{item.unit}</span>
              </div>

              <div className="font-mono text-[9px] text-[#888882] pt-1 border-t border-[#DCD8CD]/60 flex items-center justify-between">
                <span>BAND: {item.nominalRange}</span>
                <span className="text-[#75D8DC] font-bold">● SAFE</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
