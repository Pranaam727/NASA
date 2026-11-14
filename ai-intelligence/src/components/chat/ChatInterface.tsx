import React, { useState, useRef, useEffect } from 'react';
import { useAstroCareAI } from '../../providers/ProviderContext';
import { AstronautHealthPayload, MissionContext, ChatMessage } from '../../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SuggestedPrompts } from './SuggestedPrompts';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Download,
  AlertCircle,
  RotateCcw,
  Activity,
  Orbit,
  HelpCircle,
  Lightbulb,
  MessageSquare
} from 'lucide-react';

interface ChatInterfaceProps {
  currentAstronaut: AstronautHealthPayload;
  missionContext: MissionContext;
  onOpenResearchDoc?: (docId: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentAstronaut,
  missionContext,
  onOpenResearchDoc
}) => {
  const { provider, mode } = useAstroCareAI();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `### Welcome to AstroCare Gemini AI Intelligence Assistant\n\nI am configured as your aerospace biomedical intelligence companion for **${currentAstronaut.astronautName}** (${currentAstronaut.callsign}) on **${missionContext.missionName}** (Flight Day ${missionContext.flightDay}/${missionContext.totalPlannedDays}).\n\nI can assist you with:\n- **Interpreting structured telemetry** across cardiovascular, musculoskeletal, radiation, sleep, and immune domains.\n- **Evaluating physiological trends** and distinguishing factual observations from clinical hypotheses.\n- **Grounding insights with verified NASA research** (Twin Study, SANS Evidence Books, Radiation Reports).\n- **Synthesizing multi-domain risk patterns** for Flight Surgeons and Biomedical Engineers (BMEs).\n\n*All outputs are strictly informational research aids, not formal medical diagnoses.*`,
      timestamp: new Date().toISOString(),
      suggestedQuestions: [
        'Explain the correlation between sleep debt and immune markers',
        'What are the primary indicators of SANS on orbit?',
        'Evaluate our cumulative radiation dose and GCR risk'
      ],
      metadata: {
        mode: mode,
        modelUsed: 'AstroCare Assistant'
      }
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [includeHealthContext, setIncludeHealthContext] = useState(true);
  const [includeMissionContext, setIncludeMissionContext] = useState(true);
  const [showPromptsDrawer, setShowPromptsDrawer] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || isLoading) return;

    setError(null);
    setInput('');

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
      healthContextIncluded: includeHealthContext,
      missionContextIncluded: includeMissionContext
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await provider.sendMessage(
        newHistory,
        {
          includeHealthContext,
          includeMissionContext
        },
        includeHealthContext ? currentAstronaut : undefined,
        includeMissionContext ? missionContext : undefined
      );

      setMessages((prev) => [...prev, response]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err?.message || 'Failed to generate AI response. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (messages.length === 0) return;
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.content);
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear current conversation session?')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: `Session cleared. Ready for new aerospace biomedical inquiries for **${currentAstronaut.astronautName}**.`,
          timestamp: new Date().toISOString(),
          suggestedQuestions: [
            'Analyze current cardiovascular telemetry',
            'Summarize NASA Twin Study findings',
            'Explain SANS optic disc edema mechanisms'
          ]
        }
      ]);
      setError(null);
    }
  };

  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      astronaut: currentAstronaut.astronautName,
      flightDay: missionContext.flightDay,
      mission: missionContext.missionName,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        citations: m.citations
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astrocare-chat-session-${currentAstronaut.callsign}-FD${missionContext.flightDay}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-175px)] min-h-[580px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      
      {/* Top Chat Bar */}
      <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">Biomedical Flight Assistant</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 font-mono text-[11px]">
            {currentAstronaut.astronautName} ({currentAstronaut.callsign})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Health context toggle */}
          <button
            onClick={() => setIncludeHealthContext(!includeHealthContext)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
              includeHealthContext
                ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
            title="Inject active astronaut telemetry into AI reasoning context"
          >
            <Activity className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Telemetry Context:</span> {includeHealthContext ? 'ON' : 'OFF'}
          </button>

          {/* Mission context toggle */}
          <button
            onClick={() => setIncludeMissionContext(!includeMissionContext)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
              includeMissionContext
                ? 'bg-purple-950/70 text-purple-300 border border-purple-500/30'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
            title="Inject flight day and environmental variables into AI context"
          >
            <Orbit className="w-3 h-3 text-purple-400" />
            <span className="hidden sm:inline">Mission Context:</span> {includeMissionContext ? 'ON' : 'OFF'}
          </button>

          {/* Prompts Drawer Button */}
          <button
            onClick={() => setShowPromptsDrawer(!showPromptsDrawer)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] border transition-all cursor-pointer ${
              showPromptsDrawer
                ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Suggested Prompts</span>
          </button>

          {/* Export & Clear buttons */}
          <button
            onClick={handleExport}
            title="Export conversation history to JSON"
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleClear}
            title="Clear conversation"
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Suggested Prompts Drawer Collapsible */}
      {showPromptsDrawer && (
        <div className="bg-slate-900/95 border-b border-slate-800 p-4 max-h-64 overflow-y-auto animate-in fade-in duration-200">
          <SuggestedPrompts
            onSelectPrompt={(p) => {
              setShowPromptsDrawer(false);
              handleSend(p);
            }}
          />
        </div>
      )}

      {/* Message Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-telemetry-grid">
        {messages.map((message) => {
          const isAssistant = message.role === 'assistant';

          return (
            <div
              key={message.id}
              className={`flex gap-3 max-w-4xl ${isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isAssistant
                    ? 'bg-cyan-950 border border-cyan-500/40 text-cyan-400 glow-cyan'
                    : 'bg-slate-800 border border-slate-700 text-slate-300'
                }`}
              >
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`flex-1 rounded-xl p-4 transition-all ${
                  isAssistant
                    ? 'bg-slate-900/90 border border-slate-800 shadow-lg text-slate-200'
                    : 'bg-blue-950/40 border border-blue-500/30 text-blue-100'
                }`}
              >
                {/* Header row inside bubble */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800/60 text-[11px] font-mono text-slate-400">
                  <span className="font-semibold text-slate-300">
                    {isAssistant ? 'AstroCare AI Intelligence' : 'Flight Surgeon / Researcher'}
                  </span>
                  <div className="flex items-center gap-2">
                    {message.metadata?.mode && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-950 border border-slate-800 text-cyan-400">
                        {message.metadata.mode}
                      </span>
                    )}
                    <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Markdown Rendered Content */}
                <MarkdownRenderer
                  content={message.content}
                  citations={message.citations}
                  onSelectCitation={onOpenResearchDoc}
                />

                {/* Suggested Questions below assistant turn */}
                {isAssistant && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
                  <div className="mt-3.5 pt-2.5 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Suggested Flight Surgeon Inquiries</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {message.suggestedQuestions.map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleSend(q)}
                          className="text-left text-xs text-slate-300 hover:text-cyan-300 bg-slate-950/80 hover:bg-slate-850 px-2.5 py-1 rounded-md border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
                        >
                          → {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex gap-3 max-w-4xl mr-auto animate-pulse">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex-1">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating multi-domain biomedical telemetry & NASA research databases...</span>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 bg-slate-800 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        )}

        {/* Error Banner with Retry */}
        {error && (
          <div className="bg-rose-950/50 border border-rose-500/40 rounded-xl p-4 flex items-start justify-between gap-3 text-xs text-rose-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-rose-300">AI Intelligence Error:</span> {error}
                <p className="text-slate-400 text-[11px] mt-1">
                  You can retry the request or switch to the Deterministic Mock Engine in the top bar.
                </p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 bg-rose-900/60 hover:bg-rose-800 px-3 py-1.5 rounded text-rose-100 font-medium cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-900/95 border-t border-slate-800 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          <div className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg p-2 focus-within:border-cyan-500/70 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask Gemini about ${currentAstronaut.astronautName}'s cardiovascular status, bone loss, radiation risk, or NASA research... (Shift+Enter for new line)`}
              rows={2}
              className="w-full bg-transparent text-slate-100 text-xs sm:text-sm placeholder-slate-500 resize-none focus:outline-none leading-relaxed"
            />
            <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[11px] text-slate-500 font-mono">
              <span className="hidden sm:inline">Press Enter to send, Shift+Enter for newline</span>
              <span className="text-cyan-400/80">Active model: {provider.name.includes('Mock') ? 'Mock BioSim' : 'Gemini 2.5 Flash'}</span>
            </div>
          </div>

          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="h-12 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg transition-all cursor-pointer shrink-0 glow-cyan"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Analyze</span>
          </button>
        </div>
      </div>

    </div>
  );
};
