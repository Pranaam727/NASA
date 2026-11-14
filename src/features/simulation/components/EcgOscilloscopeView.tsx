import React, { useRef, useEffect } from 'react';
import { simulationEngine } from '../engine/SimulationEngine';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';

interface EcgOscilloscopeViewProps {
  currentHeartRate: number;
  isRunning: boolean;
}

export const EcgOscilloscopeView: React.FC<EcgOscilloscopeViewProps> = ({
  currentHeartRate,
  isRunning,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bufferRef = useRef<number[]>(new Array(400).fill(0));
  const pointerRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Subscribe to high-frequency 50Hz ECG samples
    const unsub = simulationEngine.onEcgSample((sample) => {
      const idx = pointerRef.current % bufferRef.current.length;
      bufferRef.current[idx] = sample;
      pointerRef.current = (pointerRef.current + 1) % bufferRef.current.length;
    });

    return () => unsub();
  }, []);

  // Continuous Canvas Sweep Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;

    const render = () => {
      if (!active) return;

      const width = canvas.width;
      const height = canvas.height;
      const buffer = bufferRef.current;
      const currentHead = pointerRef.current;

      // 1. Dark CRT Monitor Background
      ctx.fillStyle = '#141714';
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle Medical Oscilloscope Grid (10mm x 10mm gridlines)
      ctx.strokeStyle = '#1D241D';
      ctx.lineWidth = 1;

      const gridStep = 25;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Midline isoelectric reference
      const midY = height / 2;
      ctx.strokeStyle = '#263026';
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      // 3. Render ECG Waveform Strip
      ctx.strokeStyle = '#5E9B62'; // Calibrated clinical phosphor green
      ctx.lineWidth = 1.75;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const pointStep = width / buffer.length;
      const verticalGain = height * 0.35; // millivolts to pixels

      ctx.beginPath();
      for (let i = 0; i < buffer.length; i++) {
        // Leave a 12-sample erase gap right ahead of the sweep pointer
        const distFromHead = (i - currentHead + buffer.length) % buffer.length;
        if (distFromHead > 0 && distFromHead < 12) {
          continue;
        }

        const x = i * pointStep;
        const mv = buffer[i];
        const y = midY - mv * verticalGain;

        if (i === 0 || distFromHead === 12) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // 4. Moving Sweep Indicator Bar
      const sweepX = currentHead * pointStep;
      ctx.strokeStyle = '#7CB580';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sweepX, 0);
      ctx.lineTo(sweepX, height);
      ctx.stroke();

      if (isRunning) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isRunning]);

  return (
    <DossierCard
      title="REAL-TIME ECG WAVEFORM OSCILLOSCOPE // LEAD-II CHANNEL"
      subtitle="50Hz SYNTHETIC P-QRS-T DIPOLE GENERATOR // SWEEP SPEED 25 mm/s"
      badge={
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold text-astro-text-primary">
            {currentHeartRate} <span className="font-normal text-astro-text-secondary">BPM</span>
          </span>
          <StatusIndicator status="NOMINAL" label={isRunning ? '50Hz SWEEP' : 'SWEEP PAUSED'} size="sm" />
        </div>
      }
      noPadding
    >
      <div className="relative bg-[#141714] p-2">
        <canvas
          ref={canvasRef}
          width={800}
          height={160}
          className="w-full h-40 block rounded-none cursor-crosshair"
        />

        {/* Oscilloscope Header Overlay */}
        <div className="absolute top-3 left-4 flex items-center space-x-4 font-mono text-[9px] text-[#5E9B62]/80 pointer-events-none select-none">
          <span>GAIN: 10 mm/mV</span>
          <span>FILTER: 0.05-150 Hz</span>
          <span>PACE: AUTO</span>
          <span>DSP: KALMAN ACTIVE</span>
        </div>

        {/* Calibration Pulse Indicator */}
        <div className="absolute bottom-3 right-4 font-mono text-[9px] text-[#5E9B62]/80 pointer-events-none select-none">
          <span>1.0 mV CALIBRATION MARK</span>
        </div>
      </div>
    </DossierCard>
  );
};
