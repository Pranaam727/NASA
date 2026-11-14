import React, { useState, useRef, useEffect } from 'react';
import { AIMessage, AIProvenanceTag } from '../types';
import { DossierCard } from '@/components/common/DossierCard';
import { PrimaryButton, SecondaryButton } from '@/components/common/Buttons';
import { Send, RotateCcw, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
  messages: AIMessage[];
  isLoading: boolean;
  onSendMessage: (query: string) => Promise<void>;
  onClear: () => void;
  astronautCallsign: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClear,
  astronautCallsign,
}) => {
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput('');
    await onSendMessage(text);
  };

  const handleSuggestedClick = async (prompt: string) => {
    if (isLoading) return;
    await onSendMessage(prompt);
  };

  const tagBadgeStyle = (tag: AIProvenanceTag) => {
    switch (tag) {
      case 'RULE_ALERT':
        return 'bg-astro-status-critical/10 text-astro-status-critical border-astro-status-critical/30';
      case 'GROUNDED_MEASUREMENT':
        return 'bg-astro-status-healthy/10 text-astro-status-healthy border-astro-status-healthy/30';
      case 'PREDICTIVE_PROJECTION':
        return 'bg-[#4878D1]/10 text-[#4878D1] border-[#4878D1]/30';
      case 'CALCULATED_RISK':
        return 'bg-astro-status-caution/10 text-astro-status-caution border-astro-status-caution/30';
      case 'AI_INTERPRETATION':
      default:
        return 'bg-astro-bg-subtle text-astro-text-secondary border-astro-border-hairline';
    }
  };

  // Extract suggested follow-ups from the latest assistant message
  const lastMessage = messages[messages.length - 1];
  const suggestedQueries =
    lastMessage?.role === 'assistant' && lastMessage.suggestedFollowUps
      ? lastMessage.suggestedFollowUps
      : [];

  return (
    <DossierCard
      title="AEROSPACE CLINICAL INTELLIGENCE WORKBENCH"
      subtitle={`ACTIVE COPILOT CONTEXT: ${astronautCallsign} // GROUNDED IN AUTHORITATIVE TELEMETRY`}
      badge={
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[9px] px-2 py-0.5 rounded-sm bg-astro-status-sandstone/20 text-[#7A6643] border border-astro-status-sandstone/40">
            GEMINI-1.5 GROUNDED
          </span>
          <SecondaryButton size="sm" icon={RotateCcw} onClick={onClear}>
            RESET COPILOT
          </SecondaryButton>
        </div>
      }
    >
      <div className="flex flex-col h-[520px]">
        {/* Message Thread Scroll Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 font-body text-xs">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                {/* Header line with role and timestamp */}
                <div className="flex items-center space-x-2 font-mono text-[10px] text-astro-text-tertiary px-1">
                  {isUser ? (
                    <span className="font-semibold text-astro-text-primary">FLIGHT SURGEON</span>
                  ) : (
                    <div className="flex items-center space-x-1 font-semibold text-astro-text-primary">
                      <Sparkles className="w-3 h-3 text-astro-status-caution" />
                      <span>ASTROCARE INTELLIGENCE</span>
                    </div>
                  )}
                  <span>·</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>

                {/* Message Body Bubble */}
                <div
                  className={`p-3.5 rounded-sm max-w-[92%] leading-relaxed whitespace-pre-line border ${
                    isUser
                      ? 'bg-astro-text-primary text-astro-bg-primary border-astro-text-primary'
                      : 'bg-astro-bg-subtle/80 text-astro-text-primary border-astro-border-hairline shadow-xs'
                  }`}
                >
                  {msg.content}

                  {/* Citations / Evidence Tags if provided */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-astro-border-hairline/60 font-mono text-[10px]">
                      <span className="text-astro-text-tertiary font-bold uppercase block mb-1">
                        VERIFIED EVIDENCE CITATIONS ({msg.citations.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.citations.map((c, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded-sm bg-white border border-astro-border-hairline text-astro-text-secondary"
                            title={`${c.source} @ ${new Date(c.timestamp).toLocaleTimeString()}`}
                          >
                            <span className="font-bold text-astro-text-primary">{c.metric}:</span>{' '}
                            {c.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Provenance Tags */}
                  {!isUser && msg.provenanceTags && msg.provenanceTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1 font-mono text-[9px]">
                      {msg.provenanceTags.map((t, idx) => (
                        <span key={idx} className={`px-1.5 py-0.2 rounded-sm border ${tagBadgeStyle(t)}`}>
                          [{t.replace('_', ' ')}]
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing / Synthesis Indicator */}
          {isLoading && (
            <div className="flex items-center space-x-2 p-3 bg-astro-bg-subtle/50 border border-astro-border-hairline rounded-sm font-mono text-xs text-astro-text-secondary animate-pulse w-fit">
              <Sparkles className="w-3.5 h-3.5 text-astro-status-caution animate-spin" />
              <span>Analyzing grounded telemetry & synthesizing clinical intelligence...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries Chips */}
        {suggestedQueries.length > 0 && !isLoading && (
          <div className="pt-3 pb-1 border-t border-astro-border-hairline/60">
            <span className="font-mono text-[9px] uppercase font-bold text-astro-text-tertiary block mb-1.5">
              SUGGESTED CLINICAL QUERIES:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQueries.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestedClick(q)}
                  className="px-2.5 py-1 rounded-sm bg-astro-bg-subtle border border-astro-border-hairline hover:border-astro-border-strong hover:bg-white text-astro-text-primary font-mono text-[11px] transition-colors text-left"
                >
                  › {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="pt-2 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={`Ask AstroCare AI about ${astronautCallsign}'s telemetry, risk factors, or mission countermeasures...`}
            className="flex-1 bg-white border border-astro-border-hairline rounded-sm px-3 py-2 font-mono text-xs text-astro-text-primary outline-none focus:border-astro-border-focus disabled:opacity-50"
          />
          <PrimaryButton
            type="submit"
            disabled={isLoading || !input.trim()}
            icon={Send}
            size="md"
          >
            CONSULT
          </PrimaryButton>
        </form>

        {/* Medical Safety Disclaimer Strip */}
        <div className="pt-2 text-[9px] font-mono text-astro-text-tertiary text-center">
          AUTONOMOUS CLINICAL DECISION SUPPORT // NON-DIAGNOSTIC ADVISORY // LAYER 4 RISK SCORES ARE AUTHORITATIVE
        </div>
      </div>
    </DossierCard>
  );
};
