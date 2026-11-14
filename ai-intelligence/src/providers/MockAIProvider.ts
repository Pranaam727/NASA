import {
  IAIProvider,
  ProviderRequestOptions,
  ProviderStatus
} from './types';
import {
  AstronautHealthPayload,
  MissionContext,
  ChatMessage,
  HealthInterpretationResult,
  AIInsightsResult,
  ResearchCitation
} from '../types';
import { NASA_RESEARCH_DATABASE, SCIENTIFIC_GLOSSARY } from '../data/nasaResearchDocs';

export class MockAIProvider implements IAIProvider {
  readonly id = 'mock-provider';
  readonly name = 'AstroCare Deterministic Biomedical Simulator (Offline Mock)';

  async getStatus(): Promise<ProviderStatus> {
    return {
      name: this.name,
      mode: 'mock-simulation',
      isAvailable: true,
      model: 'AstroCare-BioSim-v2.5',
      latencyMs: 120,
      message: 'Running in high-fidelity aerospace biomedical simulation mode. No external API key required.'
    };
  }

  async sendMessage(
    messages: ChatMessage[],
    _options?: ProviderRequestOptions,
    healthContext?: AstronautHealthPayload,
    missionContext?: MissionContext
  ): Promise<ChatMessage> {
    // Artificial slight latency to simulate realistic reasoning
    await new Promise((r) => setTimeout(r, 650));

    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    const query = lastUserMessage?.content.toLowerCase() || '';

    let content = '';
    const citations: ResearchCitation[] = [];
    const observations: string[] = [];
    const hypotheses: string[] = [];
    const suggestedQuestions: string[] = [];

    // Check for explicit terminology definition queries (e.g., "what is SANS", "define cephalad")
    const isDefinitionQuery = query.startsWith('what is') || query.startsWith('define') || query.includes('definition of') || query.includes('terminology');
    if (isDefinitionQuery) {
      for (const [key, termObj] of Object.entries(SCIENTIFIC_GLOSSARY)) {
        if (query.includes(key.toLowerCase()) || query.includes(termObj.term.toLowerCase())) {
          observations.push(`Terminology: ${termObj.term} referenced in operational flight documents.`);
          hypotheses.push(`Pathophysiological relevance: ${termObj.aerospaceSignificance}`);

          content = `### Scientific Terminology Analysis: **${termObj.term}**\n\n` +
            `> [!NOTE] Aerospace Biomedical Definition\n` +
            `> ${termObj.definition}\n\n` +
            `#### Observations (Clinical Presentation)\n` +
            `- Characteristic presentation across ${termObj.relatedDomains.join(', ')} systems during microgravity exposure.\n\n` +
            `#### Hypotheses (Pathophysiological Mechanisms)\n` +
            `- ${termObj.aerospaceSignificance}\n\n` +
            `**Related Physiological Domains:** ${termObj.relatedDomains.map(d => `\`${d}\``).join(', ')}`;

          if (termObj.term.includes('SANS')) {
            const doc = NASA_RESEARCH_DATABASE.find(d => d.id === 'nasa-hrp-sans-2021');
            if (doc) {
              citations.push({
                docId: doc.id,
                title: doc.title,
                ntrsId: doc.ntrsId,
                authors: doc.authors.slice(0, 3).join(', ') + ' et al.',
                year: doc.year,
                excerpt: 'Cephalad venous congestion and optic disc edema in long-duration microgravity.'
              });
            }
          }
          break;
        }
      }
    }

    // Check for cardiovascular / fluid shift queries
    if (!content && (query.includes('cardio') || query.includes('heart') || query.includes('hrv') || query.includes('blood pressure') || query.includes('sans') || query.includes('fluid'))) {
      const sansDoc = NASA_RESEARCH_DATABASE.find(d => d.id === 'nasa-hrp-sans-2021');
      const twinDoc = NASA_RESEARCH_DATABASE.find(d => d.id === 'nasa-twin-study-2019');

      observations.push('Resting blood pressure and cranial venous pressure show headward elevation.');
      observations.push('HRV (rMSSD) exhibits persistent vagal suppression relative to pre-flight baseline.');
      
      hypotheses.push('Cephalad fluid shift combined with cabin ambient CO2 levels (>2.5 mmHg) may alter cerebral venous outflow and elevate optic nerve sheath diameter (ONSD).');
      hypotheses.push('Decreased intravascular plasma volume (spaceflight microgravity anemia/hypovolemia) triggers compensatory sympathetic tone.');

      content = `### Cardiovascular & Hemodynamic Evaluation\n\n` +
        `#### 1. Telemetry Observations (Factual Measurements)\n` +
        `- **Cephalad Fluid Redistribution:** Absence of hydrostatic gradient has shifted ~1.5–2.0 L of interstitial and vascular volume headward.\n` +
        `- **Autonomic Tone:** Depressed HRV rMSSD reflects diminished parasympathetic cardiovagal modulation.\n` +
        `- **Mission Context Correlation:** Flight Day ${missionContext?.flightDay || 142} in ${missionContext?.targetDestination || 'LEO'}.\n\n` +
        `#### 2. Physiological Hypotheses (Etiological Considerations)\n` +
        `*Hypothesis A (Hemodynamic Shift):* Persistent headward venous pressure impedes retinal venous drainage, which may correlate with subclinical optic disc margin blurring.\n` +
        `*Hypothesis B (Neurovascular Adaptation):* Elevation of cabin CO2 (${missionContext?.environmental.cabinCo2Ppm || 3200} ppm) causes mild cerebral vasodilation, compounding venous congestion.\n\n` +
        `#### 3. Recommended Actions for Flight Surgeon\n` +
        `- Execute optical coherence tomography (OCT) fundoscopy protocol within 72 hours.\n` +
        `- Verify compliance with daily 20 mmHg Lower Body Negative Pressure (LBNP) countermeasure sessions.`;

      if (sansDoc) {
        citations.push({
          docId: sansDoc.id,
          title: sansDoc.title,
          ntrsId: sansDoc.ntrsId,
          authors: sansDoc.authors[0] + ' et al.',
          year: sansDoc.year,
          excerpt: 'Evidence report on cephalad venous engorgement and choroidal folding.'
        });
      }
      if (twinDoc) {
        citations.push({
          docId: twinDoc.id,
          title: twinDoc.title,
          ntrsId: twinDoc.ntrsId,
          authors: twinDoc.authors[0] + ' et al.',
          year: twinDoc.year,
          excerpt: 'Subclinical vascular stiffening during 340-day spaceflight.'
        });
      }

      suggestedQuestions.push('What are the optic nerve sheath diameter (ONSD) trends?');
      suggestedQuestions.push('Would increasing LBNP exposure mitigate cephalad vascular congestion?');
      suggestedQuestions.push('How does current cabin CO2 correlate with headache reporting?');
    }

    // Check for radiation queries
    else if (!content && (query.includes('radiation') || query.includes('dosimet') || query.includes('gcr') || query.includes('solar') || query.includes('spe'))) {
      const radDoc = NASA_RESEARCH_DATABASE.find(d => d.id === 'nasa-hrp-radiation-2019');
      
      observations.push(`Cumulative dose is measured at ${healthContext?.domains.radiation.metrics[0].value || 72.4} mSv.`);
      observations.push(`Current daily background rate is ${healthContext?.domains.radiation.metrics[1].value || 0.48} mSv/day.`);

      hypotheses.push('Chronic GCR HZE ion exposure increases microvascular endothelial oxidative stress and subclinical DNA double-strand breaks.');

      content = `### Space Radiation Dosimetry & Risk Assessment\n\n` +
        `#### 1. Telemetry Observations\n` +
        `- **Cumulative Dose:** ${healthContext?.domains.radiation.metrics[0].value || 72.4} mSv absorbed dose over Flight Day ${missionContext?.flightDay || 142}.\n` +
        `- **Dose Rate:** ${healthContext?.domains.radiation.metrics[1].value || 0.48} mSv/day (standard galactic cosmic ray background + South Atlantic Anomaly passages).\n` +
        `- **Solar Particle Event Alert:** Sensor status is NOMINAL (quiet solar magnetosphere).\n\n` +
        `#### 2. Physiological Hypotheses\n` +
        `- The cumulative dose remains well below the NASA Permissible Exposure Limit (PEL) threshold of 150 mSv for 1-year missions.\n` +
        `- Heavy ion (HZE) tracks carry higher linear energy transfer (LET), necessitating continued surveillance of chromosomal aberration biomarkers.\n\n` +
        `#### 3. Operational Protocols\n` +
        `- Continue CPAD personal badge monitoring.\n` +
        `- Maintain shelter-readiness protocols in high-density water wall stowage compartments in event of SPE warning.`;

      if (radDoc) {
        citations.push({
          docId: radDoc.id,
          title: radDoc.title,
          ntrsId: radDoc.ntrsId,
          authors: radDoc.authors[0] + ' et al.',
          year: radDoc.year,
          excerpt: 'Degenerative tissue and microvascular risk from galactic cosmic rays.'
        });
      }

      suggestedQuestions.push('Are chromosomal translocation biomarkers available from blood draws?');
      suggestedQuestions.push('What is the projected Mars transit total dose given current GCR rates?');
    }

    // Check for bone / muscle queries
    else if (!content && (query.includes('bone') || query.includes('muscle') || query.includes('bmd') || query.includes('ared') || query.includes('atrophy') || query.includes('ntx'))) {
      const boneDoc = NASA_RESEARCH_DATABASE.find(d => d.id === 'nasa-hrp-bone-2016');
      const muscleDoc = NASA_RESEARCH_DATABASE.find(d => d.id === 'nasa-hrp-muscle-2020');

      observations.push('Serum NTX bone collagen breakdown marker is elevated above baseline.');
      observations.push('Femoral neck BMD delta shows rate of loss reduced by 60% relative to historic non-ARED missions.');

      hypotheses.push('Osteoclast activity remains stimulated due to absence of steady 1-g vector, though axial ARED resistance forces protect trabecular architecture.');

      content = `### Musculoskeletal & Bone Mineral Density Analysis\n\n` +
        `#### 1. Telemetry Observations\n` +
        `- **Bone Demineralization Marker:** Serum NTX elevated at ${healthContext?.domains.musculoskeletal.metrics[1].value || 24.2} nM BCE.\n` +
        `- **Femoral Neck Delta:** ${healthContext?.domains.musculoskeletal.metrics[0].value || -2.8}% BMD change.\n` +
        `- **Countermeasure Adherence:** High ARED compliance (${missionContext?.environmental.exerciseCompliancePercentage || 94}%) has mitigated postural soleus atrophy.\n\n` +
        `#### 2. Clinical Hypotheses\n` +
        `- *Hypothesis 1:* Trabecular cancellous bone is undergoing steady turnover; calcium mobilizes to urine, increasing secondary nephrolithiasis risk.\n` +
        `- *Hypothesis 2:* Calf circumference loss (-4.1%) reflects minor slow-twitch fiber atrophy rather than complete motor unit denervation.\n\n` +
        `#### 3. Recommended Flight Surgeon Considerations\n` +
        `- Review urinary pH and hydration logs (>2.5 L/day).\n` +
        `- Maintain target axial resistance loads >550 lbs on ARED deadlift/squat protocols.`;

      if (boneDoc) {
        citations.push({
          docId: boneDoc.id,
          title: boneDoc.title,
          ntrsId: boneDoc.ntrsId,
          authors: boneDoc.authors[0] + ' et al.',
          year: boneDoc.year,
          excerpt: 'Risk of early onset osteoporosis and bone fracture in microgravity.'
        });
      }
      if (muscleDoc) {
        citations.push({
          docId: muscleDoc.id,
          title: muscleDoc.title,
          ntrsId: muscleDoc.ntrsId,
          authors: muscleDoc.authors[0] + ' et al.',
          year: muscleDoc.year,
          excerpt: 'Muscle mass, cross-sectional area loss, and ARED countermeasure preservation.'
        });
      }

      suggestedQuestions.push('What is the 24-hour urine calcium concentration?');
      suggestedQuestions.push('Should bisphosphonate or antiresorptive dosing be reviewed?');
    }

    // Check for sleep / immune queries
    else if (!content && (query.includes('sleep') || query.includes('circadian') || query.includes('immune') || query.includes('ebv') || query.includes('cortisol') || query.includes('cytokine'))) {
      const sleepDoc = NASA_RESEARCH_DATABASE.find(d => d.id === 'nasa-sleep-circadian-2014');
      const immuneDoc = NASA_RESEARCH_DATABASE.find(d => d.id === 'nasa-crucian-immune-2020');

      observations.push('Total sleep duration averages 5.4 hours over recent cycles, with deep slow-wave sleep diminished.');
      observations.push('Salivary EBV DNA shedding is elevated (+1.8 log copies), accompanied by elevated IL-6.');

      hypotheses.push('Chronic slow-wave sleep truncation and circadian phase disruption are inducing neuro-endocrine hypothalamic-pituitary-adrenal (HPA) axis activation, promoting subclinical viral reactivation.');

      content = `### Sleep Architecture & Immune System Status\n\n` +
        `#### 1. Telemetry Observations\n` +
        `- **Sleep Duration:** ${healthContext?.domains.sleep.metrics[0].value || 5.4} hrs/night (Nominal operational target: 7.0–8.0 hrs).\n` +
        `- **Sleep Fragmentation:** ${healthContext?.domains.sleep.metrics[3].value || 6} micro-awakenings recorded via actigraphy.\n` +
        `- **Immune Biomarkers:** Salivary EBV reactivation index elevated; IL-6 at ${healthContext?.domains.immune.metrics[0].value || 4.2} pg/mL.\n\n` +
        `#### 2. Physiological Hypotheses\n` +
        `- Combined sleep deficit and operational workload are suppressing cell-mediated T-cell surveillance.\n` +
        `- Persistent elevated IL-6 suggests subclinical systemic inflammatory activation consistent with the NASA Twin Study findings.\n\n` +
        `#### 3. Countermeasure Recommendations\n` +
        `- Initiate SSLA blue-depleted evening dynamic cabin lighting 90 minutes prior to sleep period.\n` +
        `- Consider 1.0 mg sublingual melatonin chronotherapy if sleep efficiency remains below 80%.`;

      if (sleepDoc) {
        citations.push({
          docId: sleepDoc.id,
          title: sleepDoc.title,
          ntrsId: sleepDoc.ntrsId,
          authors: sleepDoc.authors[0] + ' et al.',
          year: sleepDoc.year,
          excerpt: 'Prevalence of sleep deficiency and hypnotic use in spaceflight.'
        });
      }
      if (immuneDoc) {
        citations.push({
          docId: immuneDoc.id,
          title: immuneDoc.title,
          ntrsId: immuneDoc.ntrsId,
          authors: immuneDoc.authors[0] + ' et al.',
          year: immuneDoc.year,
          excerpt: 'Latent viral shedding and T-cell hyporesponsiveness in orbital flight.'
        });
      }

      suggestedQuestions.push('What are the latest cognitive throughput and reaction time scores?');
      suggestedQuestions.push('Is the crewmember taking hypnotic sleep medications?');
    }

    // Default general assistant response
    else {
      const astronaut = healthContext?.astronautName || 'Cmdr. Sarah Chen';
      const flightDay = missionContext?.flightDay || 142;
      const destination = missionContext?.targetDestination || 'ISS Low Earth Orbit';

      content = `### AstroCare Biomedical Intelligence Briefing\n\n` +
        `**Subject:** ${astronaut} | **Mission Flight Day:** ${flightDay} (${destination})\n\n` +
        `I have synthesized the active astronaut telemetry across all 5 biomedical domains:\n\n` +
        `| Domain | Status | Key Observation | Primary Risk Consideration |\n` +
        `| :--- | :--- | :--- | :--- |\n` +
        `| **Cardiovascular** | \`Nominal Shift\` | Mild cephalad fluid shift; HRV depressed | Monitor jugular venous flow & SANS markers |\n` +
        `| **Musculoskeletal** | \`Nominal Shift\` | Serum NTX +38%; Femoral BMD -2.8% | High ARED compliance protects trabecular bone |\n` +
        `| **Radiation** | \`Normal\` | Cumulative 72.4 mSv | Well within NASA Career LEO limits |\n` +
        `| **Sleep / Circadian** | \`Warning\` | 5.4 hrs/night rolling avg | Sleep fragmentation driving cognitive fatigue |\n` +
        `| **Immune System** | \`Nominal Shift\` | Elevated salivary EBV shedding | Subclinical viral reactivation linked to stress |\n\n` +
        `> [!IMPORTANT] Factual Grounding & Separation\n` +
        `> - **Observation:** Telemetry reveals acute sleep debt and mild autonomic parasympathetic suppression.\n` +
        `> - **Hypothesis:** Physiological strain is primarily driven by mission operational tempo and fluid redistribution, rather than pathological infection.\n\n` +
        `How would you like to explore these indicators? You can ask to drill down into cardiovascular hemodynamics, review NASA research papers, or generate flight surgeon questions.`;

      const twinDoc = NASA_RESEARCH_DATABASE.find(d => d.id === 'nasa-twin-study-2019');
      if (twinDoc) {
        citations.push({
          docId: twinDoc.id,
          title: twinDoc.title,
          ntrsId: twinDoc.ntrsId,
          authors: twinDoc.authors[0] + ' et al.',
          year: twinDoc.year,
          excerpt: 'Multidimensional analysis of year-long spaceflight on the ISS.'
        });
      }

      suggestedQuestions.push('Explain the correlation between sleep debt and immune markers');
      suggestedQuestions.push('What are the risks of SANS for this mission duration?');
      suggestedQuestions.push('Summarize NASA Twin Study findings on vascular changes');
    }

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      citations,
      healthContextIncluded: Boolean(healthContext),
      missionContextIncluded: Boolean(missionContext),
      observations: observations.length > 0 ? observations : undefined,
      hypotheses: hypotheses.length > 0 ? hypotheses : undefined,
      suggestedQuestions: suggestedQuestions.length > 0 ? suggestedQuestions : [
        'How does microgravity affect bone turnover?',
        'What are the primary indicators of SANS?',
        'Explain radiation thresholds for Artemis missions'
      ],
      metadata: {
        latencyMs: 650,
        modelUsed: 'AstroCare-BioSim-v2.5 (Offline Engine)',
        mode: 'mock-simulation'
      }
    };
  }

  async interpretHealthData(
    healthPayload: AstronautHealthPayload,
    missionContext: MissionContext,
    _options?: ProviderRequestOptions
  ): Promise<HealthInterpretationResult> {
    await new Promise((r) => setTimeout(r, 700));

    const domainEvaluations: HealthInterpretationResult['domainEvaluations'] = [];
    const unusualChanges: string[] = [];
    const potentialRiskPatterns: HealthInterpretationResult['potentialRiskPatterns'] = [];
    const citations: ResearchCitation[] = [];

    // Analyze Cardiovascular
    const cv = healthPayload.domains.cardiovascular;
    const hrvMetric = cv.metrics.find(m => m.id === 'cv-hrv-rmssd');
    const bpMetric = cv.metrics.find(m => m.id === 'cv-bp-sys');
    const cvObs: string[] = [];
    const cvHyp: string[] = [];

    cvObs.push(`Resting blood pressure: ${bpMetric?.value ?? 'N/A'} mmHg (${bpMetric?.status ?? 'nominal'}).`);
    cvObs.push(`HRV rMSSD: ${hrvMetric?.value ?? 'N/A'} ms vs baseline ${hrvMetric?.baseline ?? 'N/A'} ms.`);
    cvHyp.push('Headward fluid shift alters baroreceptor gain, maintaining elevated central venous pressure.');
    cvHyp.push('Vagal withdrawal correlates with mission workload and sleep debt.');

    if (hrvMetric && hrvMetric.value < 35) {
      unusualChanges.push(`Cardiovascular: Severe HRV rMSSD depression (${hrvMetric.value} ms) signals high systemic autonomic strain.`);
      potentialRiskPatterns.push({
        domain: 'cardiovascular',
        riskLevel: 'elevated',
        description: 'Vagal withdrawal and autonomic deconditioning',
        physiologicalMechanism: 'Microgravity hypovolemia combined with sustained sympathetic activation impairs orthostatic reflex integrity.'
      });
    }

    domainEvaluations.push({
      domain: 'cardiovascular',
      status: cv.overallStatus,
      observations: cvObs,
      hypotheses: cvHyp
    });

    // Analyze Bone / Musculoskeletal
    const ms = healthPayload.domains.musculoskeletal;
    const ntxMetric = ms.metrics.find(m => m.id === 'ms-serum-ntx');
    const bmdMetric = ms.metrics.find(m => m.id === 'ms-bmd-femur');
    const msObs: string[] = [];
    const msHyp: string[] = [];

    msObs.push(`Serum NTX bone resorption marker: ${ntxMetric?.value ?? 'N/A'} nM BCE.`);
    msObs.push(`Cumulative femoral neck BMD delta: ${bmdMetric?.value ?? 'N/A'}%.`);
    msHyp.push('Suppressed gravitational loading stimulates osteoclast resorption, mitigated in part by ARED resistance protocol.');
    
    if (ntxMetric && ntxMetric.value > 22) {
      unusualChanges.push(`Musculoskeletal: Serum NTX resorption marker elevated at ${ntxMetric.value} nM BCE (upper nominal 22.0).`);
      potentialRiskPatterns.push({
        domain: 'musculoskeletal',
        riskLevel: 'moderate',
        description: 'Accelerated trabecular bone calcium turnover',
        physiologicalMechanism: 'Microgravity-induced osteocyte signaling suppression elevates urinary calcium clearance.'
      });
    }

    domainEvaluations.push({
      domain: 'musculoskeletal',
      status: ms.overallStatus,
      observations: msObs,
      hypotheses: msHyp
    });

    // Analyze Sleep
    const sl = healthPayload.domains.sleep;
    const durationMetric = sl.metrics.find(m => m.id === 'sl-duration');
    const deepMetric = sl.metrics.find(m => m.id === 'sl-deep-percent');
    const slObs: string[] = [];
    const slHyp: string[] = [];

    slObs.push(`Total sleep duration: ${durationMetric?.value ?? 'N/A'} hours (baseline ${durationMetric?.baseline ?? 'N/A'} hrs).`);
    slObs.push(`Deep slow-wave (N3) proportion: ${deepMetric?.value ?? 'N/A'}%.`);
    slHyp.push('Circadian disruption from 90-minute orbital lighting cycles and environmental noise limits slow-wave sleep depth.');

    if (durationMetric && durationMetric.value < 6.0) {
      unusualChanges.push(`Sleep: Significant chronic sleep debt (< 6.0 hrs/night for multiple cycles).`);
      potentialRiskPatterns.push({
        domain: 'sleep',
        riskLevel: 'elevated',
        description: 'Cumulative sleep debt and cognitive operational risk',
        physiologicalMechanism: 'Truncated slow-wave and REM sleep impairs neurobehavioral executive function and immune homeostasis.'
      });
    }

    domainEvaluations.push({
      domain: 'sleep',
      status: sl.overallStatus,
      observations: slObs,
      hypotheses: slHyp
    });

    // Analyze Radiation
    const rad = healthPayload.domains.radiation;
    const cumDose = rad.metrics.find(m => m.id === 'rad-cum-dose');
    const radObs = [`Cumulative absorbed dose: ${cumDose?.value ?? 'N/A'} mSv over Flight Day ${missionContext.flightDay}.`];
    const radHyp = ['Trajectory dose within anticipated GCR/LEO corridor without solar proton storm contamination.'];
    domainEvaluations.push({
      domain: 'radiation',
      status: rad.overallStatus,
      observations: radObs,
      hypotheses: radHyp
    });

    // Analyze Immune
    const im = healthPayload.domains.immune;
    const ebvMetric = im.metrics.find(m => m.id === 'im-ebv-shed');
    const imObs = [`Salivary EBV shedding index: ${ebvMetric?.value ?? 'N/A'} log copies.`];
    const imHyp = ['Subclinical latent viral reactivation triggered by neuroendocrine stress response and sleep loss.'];
    domainEvaluations.push({
      domain: 'immune',
      status: im.overallStatus,
      observations: imObs,
      hypotheses: imHyp
    });

    // Populate verified citations
    const sansDoc = NASA_RESEARCH_DATABASE.find(d => d.id === 'nasa-hrp-sans-2021');
    const boneDoc = NASA_RESEARCH_DATABASE.find(d => d.id === 'nasa-hrp-bone-2016');
    const twinDoc = NASA_RESEARCH_DATABASE.find(d => d.id === 'nasa-twin-study-2019');
    if (sansDoc) {
      citations.push({
        docId: sansDoc.id,
        title: sansDoc.title,
        ntrsId: sansDoc.ntrsId,
        authors: sansDoc.authors[0] + ' et al.',
        year: sansDoc.year,
        excerpt: 'Cephalad fluid shift and venous pressure elevation.'
      });
    }
    if (boneDoc) {
      citations.push({
        docId: boneDoc.id,
        title: boneDoc.title,
        ntrsId: boneDoc.ntrsId,
        authors: boneDoc.authors[0] + ' et al.',
        year: boneDoc.year,
        excerpt: 'Bone mineral resorption dynamics and ARED countermeasure preservation.'
      });
    }
    if (twinDoc) {
      citations.push({
        docId: twinDoc.id,
        title: twinDoc.title,
        ntrsId: twinDoc.ntrsId,
        authors: twinDoc.authors[0] + ' et al.',
        year: twinDoc.year,
        excerpt: 'Multidimensional physiological and immune response in spaceflight.'
      });
    }

    return {
      executiveSummary: `Biomedical assessment for ${healthPayload.astronautName} on Flight Day ${missionContext.flightDay} of ${missionContext.missionName}. Primary physiological attention points are sleep deficit (duration ${durationMetric?.value || 5.4}h) and autonomic strain (HRV rMSSD ${hrvMetric?.value || 38}ms), compounded by elevated bone resorption (NTX ${ntxMetric?.value || 24.2} nM BCE). Radiation exposure remains nominal at ${cumDose?.value || 72.4} mSv.`,
      domainEvaluations,
      unusualChanges,
      potentialRiskPatterns,
      recommendedQuestionsForSurgeon: [
        'Should an optical coherence tomography (OCT) sweep be scheduled to evaluate optic nerve sheath diameter (ONSD)?',
        'Is hydration protocol (>2.5 L/day) sufficient to mitigate elevated urinary calcium excretion?',
        'Does the current sleep debt warrant a 48-hour chronotherapy lighting adjustment or sleep aid protocol?'
      ],
      citations,
      disclaimer: 'INFORMATIONAL AND RESEARCH DECISION SUPPORT ONLY. This interpretation is generated by the AstroCare Gemini AI Intelligence Module and does not constitute a clinical diagnosis. All recommendations must be evaluated and confirmed by a certified NASA/ESA Flight Surgeon or Biomedical Engineer.'
    };
  }

  async summarizeResearch(
    docId: string,
    query?: string,
    _options?: ProviderRequestOptions
  ): Promise<{
    summary: string;
    keyTakeaways: string[];
    citations: ResearchCitation[];
    clinicalRelevance: string;
  }> {
    await new Promise((r) => setTimeout(r, 600));

    const doc = NASA_RESEARCH_DATABASE.find(d => d.id === docId) || NASA_RESEARCH_DATABASE[0];

    return {
      summary: `### NASA Scientific Research Summary\n\n**${doc.title}**\n\n*Publication:* ${doc.publication} (${doc.year}) | *NTRS Identifier:* \`${doc.ntrsId}\`${doc.doi ? ` | *DOI:* [${doc.doi}](https://doi.org/${doc.doi})` : ''}\n\n**Authors:** ${doc.authors.join(', ')}\n\n**Abstract Overview:**\n${doc.abstract}\n\n${query ? `**Query-Specific Focus ("${query}"):**\nThe study's data underscores that microgravity-induced physiological shifts require targeted continuous countermeasures to prevent persistent post-flight deficits.` : ''}`,
      keyTakeaways: doc.keyFindings,
      clinicalRelevance: doc.clinicalTakeaways.join(' '),
      citations: [
        {
          docId: doc.id,
          title: doc.title,
          ntrsId: doc.ntrsId,
          authors: doc.authors.slice(0, 3).join(', ') + (doc.authors.length > 3 ? ' et al.' : ''),
          year: doc.year,
          excerpt: doc.abstract.slice(0, 180) + '...'
        }
      ]
    };
  }

  async generateBiomedicalInsights(
    healthPayload: AstronautHealthPayload,
    missionContext: MissionContext,
    _options?: ProviderRequestOptions
  ): Promise<AIInsightsResult> {
    await new Promise((r) => setTimeout(r, 750));

    return {
      flightDay: missionContext.flightDay,
      statusOverview: `Multi-domain physiological synthesis for ${healthPayload.astronautName} (${healthPayload.callsign}) at Flight Day ${missionContext.flightDay}/${missionContext.totalPlannedDays} (${missionContext.targetDestination}). Overall biomedical envelope is stable with actionable warning flags in sleep continuity and autonomic vagal tone.`,
      crossDomainCorrelations: [
        {
          domains: ['sleep', 'immune'],
          relationship: 'Chronically reduced slow-wave sleep (<12%) correlates with elevated salivary EBV shedding index (+1.8 log) and elevated IL-6 (4.2 pg/mL).',
          clinicalSignificance: 'Demonstrates acute neuroendocrine stress interaction where sleep loss suppresses cell-mediated immune defense.'
        },
        {
          domains: ['cardiovascular', 'radiation'],
          relationship: 'Cephalad venous congestion combined with cumulative GCR dose (72.4 mSv) promotes microvascular endothelial oxidative stress.',
          clinicalSignificance: 'Requires surveillance for transient visual disturbances, headaches, and SANS-associated choroidal folds.'
        },
        {
          domains: ['musculoskeletal'],
          relationship: 'Elevated serum NTX (+38%) indicates sustained osteoclastic resorption, while ARED exercise compliance (94%) preserves calf muscle cross-sectional area (-4.1%).',
          clinicalSignificance: 'Confirms countermeasure efficacy for postural slow-twitch muscle, but reveals continuing bone mineral turnover that increases nephrolithiasis risk.'
        }
      ],
      riskMatrix: [
        {
          riskArea: 'Circadian Desynchrony & Sleep Debt',
          severity: 'elevated',
          rationale: 'Rolling 4-day sleep average of 5.4 hours with 6 nocturnal awakenings impairs neurocognitive resilience.',
          recommendedMitigation: 'Schedule SSLA blue-depleted evening lighting phase and evaluate 1.0mg melatonin chronotherapy.'
        },
        {
          riskArea: 'Spaceflight-Associated Neuro-ocular Shift (SANS)',
          severity: 'moderate',
          rationale: 'Elevated cephalad blood pressure and cabin ambient CO2 (3200 ppm) maintain central venous congestion.',
          recommendedMitigation: 'Administer protocolized Lower Body Negative Pressure (LBNP) 20-25 mmHg for 30 minutes daily.'
        },
        {
          riskArea: 'Bone Resorption & Renal Calculus Risk',
          severity: 'moderate',
          rationale: 'Serum NTX above nominal threshold indicates liberated bone calcium passing to renal tubules.',
          recommendedMitigation: 'Enforce mandatory minimum 2.5 L/day hydration and review urinary citrate levels.'
        },
        {
          riskArea: 'Radiation Exposure (LEO Transit)',
          severity: 'low',
          rationale: 'Current dose (72.4 mSv) is within nominal projection curve; solar weather is quiescent.',
          recommendedMitigation: 'Maintain continuous CPAD dosimetry logging; no storm-shelter action required.'
        }
      ],
      suggestedQuestionsForFlightSurgeons: [
        'Would adjusting the crewmember sleep schedule by +60 minutes reduce actigraphy micro-awakenings?',
        'Is an Optical Coherence Tomography (OCT) retinal scan indicated within the next 7 days based on current cephalad pressure metrics?',
        'Does the 38% increase in serum NTX warrant prophylactic potassium citrate or antiresorptive therapy review?',
        'Has the crewmember experienced any subjective headache, blurred near vision, or post-exercise orthostatic lightheadedness?'
      ],
      missingDataNotes: [
        'Continuous 24-hour ambulatory blood pressure monitoring was not logged for Flight Day 140-141; values interpolated from morning cuff telemetry.',
        'Urinary calcium concentration pending return of frozen stowage sample on visiting vehicle.'
      ],
      generatedAt: new Date().toISOString()
    };
  }
}
