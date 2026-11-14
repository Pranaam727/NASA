import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/aiTypes';
import { DossierCard } from '@/components/common/DossierCard';
import { Send, Sparkles, User, Trash2, ArrowRight } from 'lucide-react';

interface AIConversationConsoleProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => void;
  onClearChat: () => void;
  isLoading?: boolean;
  astronautName: string;
  className?: string;
}

export const AIConversationConsole: React.FC<AIConversationConsoleProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isLoading = false,
  astronautName,
  className = '',
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Summarize the astronaut's current health status.",
    'What changed compared with their baseline?',
    'Explain the latest detected anomaly.',
    'Which metrics show the largest deviations?',
    'What observations should medical personnel review?',
    'What are the cross-metric physiological correlations?',
    'Recommend next clinical checklist priorities.',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <DossierCard
      title="CLINICAL COPILOT CONVERSATION"
      subtitle={`GROUNDED INTERROGATION // ${astronautName.toUpperCase()}`}
      className={className}
      badge={
        <div className="flex items-center space-x-2">
          {messages.length > 0 && (
            <button
              onClick={onClearChat}
              className="font-mono text-[9px] px-2 py-0.5 rounded-sm border border-astro-border-hairline text-astro-text-secondary hover:text-astro-status-critical hover:border-astro-status-critical/40 transition-colors flex items-center space-x-1"
            >
              <Trash2 className="w-2.5 h-2.5" />
              <span>Clear</span>
            </button>
          )}
          <span className="font-mono text-[9px] px-2 py-0.5 rounded-sm bg-astro-sage/10 text-astro-sage border border-astro-sage/30">
            EVIDENCE-GROUNDED
          </span>
        </div>
      }
    >
      <div className="flex flex-col h-[520px]">
        {/* Suggested Shortcut Pills */}
        <div className="pb-3 border-b border-astro-border-hairline/60">
          <span className="font-mono text-[9px] text-astro-text-secondary uppercase block mb-1.5">
            Suggested Operational Queries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(q)}
                disabled={isLoading}
                className="font-mono text-[10px] text-left px-2 py-1 bg-astro-bg-subtle hover:bg-astro-sage/10 border border-astro-border-hairline hover:border-astro-sage/30 rounded-sm text-astro-text-secondary hover:text-astro-text-primary transition-all disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 font-body text-xs pr-1">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-astro-text-secondary space-y-2">
              <Sparkles className="w-8 h-8 text-astro-sage/50" />
              <p className="font-mono text-xs font-bold text-astro-text-primary">
                AstroCare AI Clinical Assistant Ready
              </p>
              <p className="max-w-md text-[11px] leading-relaxed">
                Ask natural-language questions regarding {astronautName}'s current vital signs, baseline deviations, active anomaly mechanisms, or flight surgeon review directives.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center space-x-1.5 font-mono text-[9px] text-astro-text-secondary">
                    {isUser ? (
                      <>
                        <span>FLIGHT SURGEON</span>
                        <User className="w-3 h-3 text-astro-text-secondary" />
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-astro-sage" />
                        <span>ASTROCARE COPILOT</span>
                        <span className={`px-1.5 py-0.5 rounded-sm border uppercase font-bold text-[8px] ${
                          msg.provenance === 'DETERMINISTIC_FALLBACK'
                            ? 'bg-[#B89A58]/15 text-[#7A6643] border-[#B89A58]/40'
                            : 'bg-astro-status-healthy/15 text-astro-status-healthy border-astro-status-healthy/40'
                        }`}>
                          {msg.provenance === 'DETERMINISTIC_FALLBACK' ? 'DETERMINISTIC FALLBACK' : 'GEMINI PROXY'}
                        </span>
                      </>
                    )}
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>

                  <div
                    className={`max-w-[92%] p-3 rounded-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-astro-bg-primary border border-astro-border-hairline text-astro-text-primary'
                        : 'bg-astro-bg-subtle border border-astro-border-hairline text-astro-text-primary'
                    }`}
                  >
                    {msg.content}

                    {/* Citations block */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-astro-border-hairline/60 font-mono text-[9px] text-astro-text-secondary space-y-1">
                        <span className="font-bold text-astro-text-primary uppercase block">
                          Grounding Citations:
                        </span>
                        {msg.citations.map((c, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <span className="text-astro-sage font-bold">[{i + 1}]</span>
                            <span>{c.parameter}:</span>
                            <span className="text-astro-text-primary font-bold">{c.observedValue}</span>
                            <span>(Baseline: {c.baselineValue})</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggested follow-ups */}
                    {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-astro-border-hairline/40 space-y-1">
                        <span className="font-mono text-[9px] text-astro-text-secondary block">
                          Follow-up:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {msg.suggestedFollowUps.map((f, i) => (
                            <button
                              key={i}
                              onClick={() => onSendMessage(f)}
                              className="font-mono text-[9px] px-1.5 py-0.5 bg-astro-bg-primary hover:bg-astro-sage/10 border border-astro-border-hairline rounded-sm text-astro-sage flex items-center space-x-1"
                            >
                              <span>{f}</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          {isLoading && (
            <div className="flex items-center space-x-2 p-3 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm text-astro-text-secondary font-mono text-xs max-w-[60%]">
              <div className="w-3.5 h-3.5 border-2 border-astro-sage border-t-transparent rounded-full animate-spin" />
              <span>Analyzing clinical telemetry context...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="pt-3 border-t border-astro-border-hairline/60 flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${astronautName}'s telemetry, baseline deviations, or alerts...`}
            disabled={isLoading}
            className="flex-1 bg-astro-bg-primary border border-astro-border-hairline rounded-sm px-3 py-2 text-xs font-body text-astro-text-primary placeholder:text-astro-text-secondary/60 focus:outline-none focus:border-astro-sage"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-astro-bg-secondary hover:bg-astro-sage/20 border border-astro-border-hairline text-astro-text-primary font-mono text-xs font-bold rounded-sm flex items-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <span>Ask</span>
            <Send className="w-3 h-3 text-astro-sage" />
          </button>
        </form>
      </div>
    </DossierCard>
  );
};
