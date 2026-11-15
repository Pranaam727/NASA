// AstroCare P11 — Landing Page

import React from 'react';
import { Link } from 'react-router-dom';
import { Satellite, Activity, Moon, Clock, Heart, Brain, Users, BookOpen, ExternalLink, Sparkles } from 'lucide-react';

const modules = [
  { icon: Activity, label: 'Wellness Dashboard', desc: 'Overall astronaut wellness status and key metrics', href: '/wellness', color: '#3b82f6' },
  { icon: Moon, label: 'Sleep Analytics', desc: 'Sleep duration, efficiency and schedule analysis', href: '/wellness/sleep', color: '#8b5cf6' },
  { icon: Clock, label: 'Circadian Rhythm', desc: '24-hour schedule alignment and circadian monitoring', href: '/wellness/circadian', color: '#14b8a6' },
  { icon: Heart, label: 'Mental Wellness', desc: 'Mood, stress and wellbeing check-ins', href: '/wellness/mental', color: '#ec4899' },
  { icon: Brain, label: 'Cognitive Performance', desc: 'Reaction time, attention and memory tests', href: '/wellness/cognitive', color: '#f59e0b' },
  { icon: Users, label: 'Team Cohesion', desc: 'Crew dynamics, isolation and communication', href: '/wellness/team', color: '#22c55e' },
  { icon: Sparkles, label: 'Recommendations', desc: 'Rule-based operational countermeasures', href: '/wellness/recommendations', color: '#38bdf8' },
  { icon: BookOpen, label: 'NASA Research', desc: 'Human Research Program evidence and sources', href: '/wellness/research', color: '#f59e0b' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#e8edf5] flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 w-16 h-16 rounded-2xl bg-[#1e3a5f] flex items-center justify-center mx-auto">
          <Satellite className="w-8 h-8 text-[#3b82f6]" />
        </div>

        <div className="mb-2">
          <span className="text-xs font-medium text-[#3b82f6] uppercase tracking-widest">
            AstroCare · Module P11
          </span>
        </div>

        <h1 className="text-4xl font-bold text-[#e8edf5] mb-3 leading-tight">
          Astronaut Wellness &<br />Health Intelligence
        </h1>

        <p className="text-[#8fa3be] max-w-lg mb-2 text-base leading-relaxed">
          Sleep analytics, circadian rhythm monitoring, mental wellness check-ins,
          cognitive performance assessments, and team cohesion tracking — informed
          by NASA Human Research Program evidence.
        </p>

        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#3d2600] border border-[#5a3a00] px-4 py-1.5">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          <span className="text-xs text-[#f59e0b] font-medium">
            Demonstration Module — All data is simulated
          </span>
        </div>

        <Link
          to="/wellness"
          className="inline-flex items-center gap-2 bg-[#1e3a5f] text-[#3b82f6] border border-[#2a4a7a] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#2a4a7a] transition-colors"
        >
          <Activity className="w-4 h-4" />
          Open Wellness Dashboard
        </Link>
      </div>

      {/* Module Grid */}
      <div className="max-w-4xl mx-auto px-6 pb-16 w-full">
        <p className="text-xs text-[#4a6080] uppercase tracking-wider mb-4 text-center">Module Overview</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {modules.map((m) => (
            <Link
              key={m.href}
              to={m.href}
              className="group flex flex-col gap-2 p-4 rounded-xl border border-[#1e2a3a] bg-[#131924] hover:bg-[#19202f] hover:border-[#2a3a52] transition-colors"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${m.color}18`, border: `1px solid ${m.color}30` }}
              >
                <m.icon className="w-4 h-4" style={{ color: m.color }} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#e8edf5] group-hover:text-white">{m.label}</p>
                <p className="text-xs text-[#4a6080] mt-0.5 leading-snug">{m.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1e2a3a] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-xs text-[#4a6080]">
            AstroCare P11 · Astronaut Wellness Intelligence · Research Demonstration Module
          </p>
          <a
            href="https://www.nasa.gov/hrp/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[#4a6080] hover:text-[#8fa3be] transition-colors"
          >
            NASA HRP <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
