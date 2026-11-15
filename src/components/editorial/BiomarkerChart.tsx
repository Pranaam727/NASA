import React from 'react';

interface BiomarkerEntry {
  code: string;
  name: string;
  value: number;
  unit: string;
  refMin: number;
  refMax: number;
  status: 'NOMINAL' | 'ELEVATED' | 'CRITICAL';
  assayDate: string;
}

interface BiomarkerChartProps {
  entries?: BiomarkerEntry[];
  className?: string;
}

export const BiomarkerChart: React.FC<BiomarkerChartProps> = ({
  entries,
  className = '',
}) => {
  const defaultEntries: BiomarkerEntry[] = [
    {
      code: 'IL-6',
      name: 'Interleukin-6 (Inflammatory)',
      value: 3.4,
      unit: 'pg/mL',
      refMin: 0.0,
      refMax: 5.0,
      status: 'NOMINAL',
      assayDate: 'Sol 140',
    },
    {
      code: 'TNF-α',
      name: 'Tumor Necrosis Factor-α',
      value: 6.8,
      unit: 'pg/mL',
      refMin: 0.0,
      refMax: 8.1,
      status: 'NOMINAL',
      assayDate: 'Sol 140',
    },
    {
      code: 'hs-CRP',
      name: 'High-Sensitivity CRP',
      value: 1.8,
      unit: 'mg/L',
      refMin: 0.0,
      refMax: 3.0,
      status: 'NOMINAL',
      assayDate: 'Sol 140',
    },
    {
      code: 'GLU',
      name: 'Fasting Blood Glucose',
      value: 92.0,
      unit: 'mg/dL',
      refMin: 70.0,
      refMax: 99.0,
      status: 'NOMINAL',
      assayDate: 'Sol 141',
    },
    {
      code: '8-OHdG',
      name: '8-Hydroxydeoxyguanosine (DNA Damage)',
      value: 4.1,
      unit: 'ng/mg Cr',
      refMin: 0.0,
      refMax: 5.5,
      status: 'NOMINAL',
      assayDate: 'Sol 138',
    },
  ];

  const list = entries || defaultEntries;

  return (
    <div
      className={`p-6 rounded-2xl bg-[#FFFFFF] border border-[#DCD8CD] shadow-subtle space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[#DCD8CD] pb-3">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#888882] block">
            IN-FLIGHT BIOMARKER LABORATORY (WET LAB // BIO-ANALYZER)
          </span>
          <h4 className="font-display font-bold text-lg text-[#111111]">
            ONBOARD CLINICAL ASSAYS
          </h4>
        </div>
        <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-[#75D8DC]/20 border border-[#75D8DC]/40 text-[#111111] font-bold">
          ASSAYS STABLE
        </span>
      </div>

      <div className="space-y-3">
        {list.map((b) => {
          const maxScale = b.refMax * 1.35;
          const pct = Math.min(100, Math.max(0, (b.value / maxScale) * 100));
          const refMaxPct = (b.refMax / maxScale) * 100;
          const refMinPct = (b.refMin / maxScale) * 100;

          return (
            <div
              key={b.code}
              className="p-3.5 rounded-xl bg-[#F2F0EA]/60 border border-[#DCD8CD] space-y-2"
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="font-bold text-[#111111]">{b.code}</span>
                  <span className="text-[#888882] ml-2 text-[10px] hidden sm:inline">
                    {b.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold tabular-nums text-[#111111]">
                    {b.value} {b.unit}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#75D8DC]/20 text-[#111111] font-bold">
                    {b.status}
                  </span>
                </div>
              </div>

              {/* Range bar */}
              <div className="relative w-full h-2 rounded-full bg-[#DCD8CD] overflow-hidden">
                {/* Nominal zone */}
                <div
                  className="absolute top-0 bottom-0 bg-[#FFFFFF] border-x border-[#888882]"
                  style={{ left: `${refMinPct}%`, width: `${refMaxPct - refMinPct}%` }}
                />
                {/* Value needle */}
                <div
                  className="absolute top-0 bottom-0 w-2 rounded-full bg-[#111111] -ml-1 transition-all duration-500"
                  style={{ left: `${pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between font-mono text-[9px] text-[#888882]">
                <span>
                  REF RANGE: {b.refMin} – {b.refMax} {b.unit}
                </span>
                <span>ASSAY: {b.assayDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
