# AstroCare AI Intelligence Module Integration Guide
**Module Identifier:** `ai-intelligence`  
**Target Platform:** AstroCare Aerospace Biomedical Intelligence Platform  
**Architecture:** React 19 + TypeScript + Vite + Node/Express Gemini Proxy Backend  

---

## 1. Executive Overview

The `ai-intelligence` module provides an aerospace biomedical decision support assistant powered by Google's Gemini API. Designed specifically for long-duration spaceflight operations (ISS, Lunar Gateway, Artemis, and Mars Transit), it interprets multi-domain astronaut telemetry, identifies pathophysiological trends, grounds claims in verified NASA Human Research Program (HRP) publications, and generates flight surgeon risk patterns.

### Core Architectural Guarantees
- **Zero Client-Side Key Exposure:** Gemini API keys are never included in client bundles. All requests traverse a secure backend proxy (`server/index.ts`).
- **Autonomous Mock Mode Fallback:** If `GEMINI_API_KEY` is omitted or network connectivity is severed, the module automatically operates using a high-fidelity deterministic spaceflight simulator without downtime.
- **Provider Abstraction Layer:** Master platform architects can substitute or extend the AI provider using the standard `IAIProvider` interface.
- **NASA Clinical Safety Guardrails:** Strictly separates factual telemetry observations from clinical hypotheses, includes mandatory non-diagnostic disclaimers, and never fabricates citations or missing measurements.

---

## 2. Directory Structure

```text
ai-intelligence/
├── server/
│   └── index.ts                 # Secure Node.js / Express proxy for Gemini API (@google/genai)
├── src/
│   ├── index.ts                 # Public module exports for AstroCare platform integration
│   ├── App.tsx                  # Standalone interactive workstation
│   ├── main.tsx                 # Vite application mount
│   ├── types/
│   │   └── index.ts             # Health domains, telemetry, mission context, and chat types
│   ├── providers/
│   │   ├── types.ts             # IAIProvider interface & ProviderStatus definitions
│   │   ├── MockAIProvider.ts    # Deterministic high-fidelity space medicine simulation engine
│   │   ├── GeminiBackendProvider.ts # Client connector to the secure backend proxy
│   │   └── ProviderContext.tsx  # React Context & useAstroCareAI() hook
│   ├── data/
│   │   ├── nasaResearchDocs.ts  # Verified NASA HRP Evidence Books & NTRS publications
│   │   └── astronautProfiles.ts # Default astronaut baseline telemetry & mission scenarios
│   ├── components/
│   │   ├── AstroCareIntelligenceModule.tsx # Master embeddable module component
│   │   ├── chat/                # ChatInterface, MarkdownRenderer, SuggestedPrompts
│   │   ├── health/              # HealthDataInterpretationView, ObservationsVsHypothesesPanel
│   │   ├── research/            # ResearchAssistantView (NTRS search & Terminology Explainer)
│   │   ├── mission/             # MissionContextBar (phase timeline & environmental sliders)
│   │   ├── insights/            # AIInsightsDashboard (Risk Matrix & Flight Surgeon Queries)
│   │   ├── common/              # SafetyBanner, Header, DataOriginBadge
│   │   └── integration/         # IntegrationGuideModal
│   └── tests/
│       └── providers.test.ts    # Vitest suite verifying providers, safety guardrails & NTRS grounding
├── .env.example                 # Configuration blueprint
├── vite.config.ts               # Vite configuration with Tailwind v4 & proxy forwarding
└── package.json                 # Scripts and dependencies
```

---

## 3. Quick Start & Execution

### Prerequisites
- Node.js >= 18.0.0 (tested on v24.14.1)
- npm >= 9.0.0

### Step 1: Install Dependencies
```bash
cd ai-intelligence
npm install
```

### Step 2: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` (optional):
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```
> **Note:** If `GEMINI_API_KEY` is left blank or omitted, the application starts in **Mock Simulation Mode** out of the box with complete, domain-accurate aerospace biomedical intelligence.

### Step 3: Run Development Environment
Starts both the backend proxy server and the Vite frontend concurrently:
```bash
npm run dev
```
- Frontend UI: `http://localhost:5173`
- Backend API Proxy: `http://localhost:3001`

### Step 4: Run Test Suite
Executes unit and integration tests verifying provider abstraction, telemetry analysis, citation grounding, and safety rules:
```bash
npm test
```

### Step 5: Production Build
Validates TypeScript compilation and generates optimized production assets:
```bash
npm run build
```

---

## 4. Integration into AstroCare Master Platform

The module can be integrated into the master AstroCare platform via **Direct React Component Import** or as an **Independent Micro-Frontend**.

### Option A: Direct React Import

Install or link the `ai-intelligence` package:
```bash
npm install /path/to/ai-intelligence
```

Mount inside your application:
```tsx
import React from 'react';
import { 
  AstroCareIntelligenceModule, 
  ProviderContextProvider 
} from 'ai-intelligence';

export function AerospaceMedicalDashboard() {
  return (
    <ProviderContextProvider
      initialConfig={{
        providerType: 'gemini-proxy',
        apiBaseUrl: 'http://localhost:3001', // Or your backend proxy URL
        modelName: 'gemini-2.5-flash'
      }}
    >
      <AstroCareIntelligenceModule
        initialAstronautId="AST-084-SC"
        onAlertGenerated={(alert) => {
          console.log('[AstroCare Alert]', alert);
        }}
      />
    </ProviderContextProvider>
  );
}
```

### Option B: Provider Abstraction Customization

To plug in a custom internal AI gateway (e.g. enterprise Azure OpenAI, custom LLM gateway, or on-premise medical model), implement the `IAIProvider` interface:

```typescript
import { IAIProvider, ProviderStatus, ChatMessage, AstronautHealthPayload, MissionContext } from 'ai-intelligence';

export class CustomAstroCareProvider implements IAIProvider {
  readonly id = 'custom-provider';
  readonly name = 'Enterprise Health Gateway';

  async getStatus(): Promise<ProviderStatus> {
    return {
      name: this.name,
      mode: 'custom-proxy',
      isAvailable: true,
      model: 'Custom-BioMed-v1'
    };
  }

  async sendMessage(messages: ChatMessage[], options, healthContext, missionContext): Promise<ChatMessage> {
    // Custom enterprise routing logic...
  }

  async interpretHealthData(healthPayload, missionContext) {
    // Custom interpretation pipeline...
  }

  async summarizeResearch(docId, query) {
    // Custom RAG summarization...
  }

  async generateBiomedicalInsights(healthPayload, missionContext) {
    // Custom cross-domain risk synthesis...
  }
}
```

---

## 5. Backend Proxy API Reference

All endpoints accept JSON payloads and return structured responses:

| Method | Endpoint | Description | Payload / Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health-check` | Check status of proxy and Gemini configuration | None |
| `POST` | `/api/chat` | Send conversational chat turns with context | `{ messages, healthContext, missionContext, model }` |
| `POST` | `/api/interpret-health` | Structured evaluation of telemetry | `{ healthPayload, missionContext }` |
| `POST` | `/api/research-summary` | Summarize verified NASA research | `{ docId, docTitle, abstract, query }` |

---

## 6. Safety, Reliability & Grounding Standards

1. **Informational Disclaimer:** Every view and generated response prominently states that AI output represents informational decision support and does not constitute clinical diagnosis.
2. **Observations vs Hypotheses:** Factual sensor measurements (`observations`) are strictly segregated from etiological inferences (`hypotheses`).
3. **No Fabricated Citations:** References strictly map to legitimate NASA Technical Report Server (NTRS) records and Human Research Program Evidence Books.
4. **Missing Data Protection:** Missing sensor telemetry channels are flagged explicitly and never hallucinated.
5. **Data Origin Transparency:** Visual badges distinguish synthetic test datasets (`SYNTHETIC TELEMETRY`) from verified NASA empirical datasets (`NASA HRP GROUND TRUTH`).
