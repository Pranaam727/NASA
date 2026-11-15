import React, { useEffect, useRef } from 'react';

interface ECGWaveformProps {
  bpm?: number;
  color?: string;
  height?: number;
  className?: string;
}

export const ECGWaveform: React.FC<ECGWaveformProps> = ({
  bpm = 72,
  color = '#00D9FF',
  height = 80,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let x = 0;
    const points: number[] = [];
    const maxPoints = Math.floor(canvas.width);

    // Fill initial baseline
    for (let i = 0; i < maxPoints; i++) {
      points.push(height / 2);
    }

    const beatInterval = Math.floor((60 / bpm) * 60); // frames per heartbeat at 60fps
    let frameInBeat = 0;

    const render = () => {
      animId = requestAnimationFrame(render);

      // Advance beat
      frameInBeat = (frameInBeat + 1) % beatInterval;

      // P-Q-R-S-T synthesis
      let y = height / 2;
      const progress = frameInBeat / beatInterval;

      if (progress > 0.15 && progress < 0.22) {
        // P-wave (atrial depolarization)
        y -= Math.sin(((progress - 0.15) / 0.07) * Math.PI) * (height * 0.12);
      } else if (progress >= 0.25 && progress < 0.28) {
        // Q-wave (septal depolarization)
        y += ((progress - 0.25) / 0.03) * (height * 0.15);
      } else if (progress >= 0.28 && progress < 0.33) {
        // R-wave (ventricular depolarization peak)
        y -= Math.sin(((progress - 0.28) / 0.05) * Math.PI) * (height * 0.44);
      } else if (progress >= 0.33 && progress < 0.36) {
        // S-wave (late ventricular depolarization)
        y += Math.sin(((progress - 0.33) / 0.03) * Math.PI) * (height * 0.18);
      } else if (progress > 0.42 && progress < 0.55) {
        // T-wave (ventricular repolarization)
        y -= Math.sin(((progress - 0.42) / 0.13) * Math.PI) * (height * 0.18);
      }

      // Add slight physiological micro-noise
      y += (Math.random() - 0.5) * 1.5;

      points[x] = y;
      x = (x + 1) % maxPoints;

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 16;
      for (let gx = 0; gx < canvas.width; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, canvas.height);
        ctx.stroke();
      }
      for (let gy = 0; gy < canvas.height; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(canvas.width, gy);
        ctx.stroke();
      }

      // Waveform line
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < maxPoints; i++) {
        const px = i;
        const py = points[i];
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          // Erase trail gap just ahead of the sweep head
          const distToHead = (i - x + maxPoints) % maxPoints;
          if (distToHead < 12) {
            ctx.stroke();
            ctx.beginPath();
          } else {
            ctx.lineTo(px, py);
          }
        }
      }
      ctx.stroke();

      // Sweep head dot
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#00D9FF';
      ctx.beginPath();
      ctx.arc(x, points[x], 3, 0, Math.PI * 2);
      ctx.fill();
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [bpm, color, height]);

  return (
    <div className={`relative overflow-hidden rounded bg-black/40 border border-cyan-500/20 ${className}`}>
      <canvas
        ref={canvasRef}
        width={340}
        height={height}
        className="w-full h-full block"
      />
      <div className="absolute top-1 right-2 pointer-events-none text-[10px] font-mono text-cyan-400/70">
        50Hz LEAD-II // LIVE
      </div>
    </div>
  );
};
