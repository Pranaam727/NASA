import { describe, it, expect } from 'vitest'
import { CitationService } from '../services/citationService'
import { SourceValidationService } from '../services/sourceValidationService'
import { NASADiscoveryService } from '../services/nasaDiscoveryService'
import { ReportService } from '../services/reportService'
import { INITIAL_SOURCES } from '../data/demoSources'
import { INITIAL_CLAIMS } from '../data/demoClaims'
import { INITIAL_EVIDENCE } from '../data/demoEvidence'
import { ScientificSource } from '../types/source.types'
import { ScientificClaim } from '../types/claim.types'

describe('P16 Citation Formatting Engine', () => {
  const samplePaper = INITIAL_SOURCES.find((s) => s.id === 'SRC-NASA-TWINS-002')!
  const sampleIncomplete = INITIAL_SOURCES.find((s) => s.id === 'SRC-DEMO-INCOMP-013')!

  it('formats APA citation correctly with DOI and volume/issue', () => {
    const citation = CitationService.formatCitation(samplePaper, 'apa')
    expect(citation.isComplete).toBe(true)
    expect(citation.style).toBe('apa')
    expect(citation.formattedText).toContain('Science')
    expect(citation.formattedText).toContain('10.1126/science.aau8650')
    expect(citation.missingFields).toHaveLength(0)
  })

  it('formats IEEE citation correctly with quotation marks around title', () => {
    const citation = CitationService.formatCitation(samplePaper, 'ieee')
    expect(citation.style).toBe('ieee')
    expect(citation.formattedText).toContain('The NASA Twins Study')
    expect(citation.formattedText).toContain('vol. 364')
  })

  it('formats Vancouver and Harvard citations accurately', () => {
    const van = CitationService.formatCitation(samplePaper, 'vancouver')
    expect(van.style).toBe('vancouver')
    expect(van.formattedText).toContain('Science')

    const harvard = CitationService.formatCitation(samplePaper, 'harvard')
    expect(harvard.style).toBe('harvard')
    expect(harvard.formattedText).toContain('Garrett-Bakelman')
  })

  it('detects incomplete metadata and lists missing fields without fabricating data', () => {
    const citation = CitationService.formatCitation(sampleIncomplete, 'apa')
    expect(citation.isComplete).toBe(false)
    expect(citation.missingFields).toContain('Authors')
    expect(citation.missingFields).toContain('Publication Date')
    expect(citation.formattedText).toContain('n.d.') // Marked explicitly as no date
  })

  it('exports valid BibTeX string for scientific sources', () => {
    const bibtex = CitationService.exportBibTeX([samplePaper])
    expect(bibtex).toContain('@article{SRC-NASA-TWINS-002,')
    expect(bibtex).toContain('title = {The NASA Twins Study')
    expect(bibtex).toContain('doi = {10.1126/science.aau8650}')
  })
})

describe('P16 Source Validation & Duplicate Detection Engine', () => {
  it('validates authentic NASA source metadata as valid', () => {
    const source = INITIAL_SOURCES[0]
    const result = SourceValidationService.validateSource(source, INITIAL_SOURCES)
    expect(result.status).toBe('valid')
    expect(result.isDuplicate).toBe(false)
  })

  it('flags missing title, organization, and invalid URL protocol', () => {
    const invalidSource: ScientificSource = {
      id: 'SRC-TEST-INVALID',
      title: '',
      organization: '',
      url: 'ftp://invalid-protocol.example.com',
      sourceType: 'other',
      researchDomain: 'multi_system',
      description: 'Test invalid',
      retrievalDate: '2024-01-01',
      verificationStatus: 'unverified',
    }

    const result = SourceValidationService.validateSource(invalidSource, INITIAL_SOURCES)
    expect(result.status).toBe('incomplete_metadata')
    const ruleNames = result.issues.map((i) => i.rule)
    expect(ruleNames).toContain('missing_title')
    expect(ruleNames).toContain('missing_organization')
    expect(ruleNames).toContain('invalid_url_protocol')
  })

  it('detects duplicate URLs even with differing query params and trailing slashes', () => {
    const baseSource = INITIAL_SOURCES[0]
    const duplicateSource: ScientificSource = {
      ...baseSource,
      id: 'SRC-TEST-DUP-01',
      title: 'Duplicate Attempt',
      url: `${baseSource.url}/?tracking=123`,
    }

    const result = SourceValidationService.validateSource(duplicateSource, [baseSource])
    expect(result.isDuplicate).toBe(true)
    expect(result.status).toBe('duplicate_detected')
    expect(result.duplicateMatchId).toBe(baseSource.id)
  })

  it('detects duplicate DOIs irrespective of case and protocol prefix', () => {
    const twinSource = INITIAL_SOURCES.find((s) => s.doi)!
    const duplicateDoiSource: ScientificSource = {
      ...twinSource,
      id: 'SRC-TEST-DUP-DOI',
      url: 'https://different-domain.org/study',
      doi: `https://doi.org/${twinSource.doi!.toUpperCase()}`,
    }

    const result = SourceValidationService.validateSource(duplicateDoiSource, [twinSource])
    expect(result.isDuplicate).toBe(true)
    expect(result.duplicateMatchId).toBe(twinSource.id)
  })
})

describe('P16 NASA Discovery Service', () => {
  it('retrieves official NASA research sources matching search keywords', () => {
    const radiationRecords = NASADiscoveryService.search('Radiation')
    expect(radiationRecords.length).toBeGreaterThan(0)
    expect(radiationRecords[0].researchDomain).toBe('radiation')
  })

  it('filters NASA discovery records by study category', () => {
    const osdrRecords = NASADiscoveryService.search('', 'all', 'OSDR Study')
    expect(osdrRecords.length).toBeGreaterThan(0)
    expect(osdrRecords.every((r) => r.discoveryCategory === 'OSDR Study')).toBe(true)
  })

  it('converts discovered record into a valid ScientificSource', () => {
    const rec = NASADiscoveryService.search('OSDR-248')[0]
    expect(rec).toBeDefined()
    const src = NASADiscoveryService.convertToScientificSource(rec)
    expect(src.id).toBe(`SRC-${rec.id}`)
    expect(src.verificationStatus).toBe('verified_authentic')
    expect(src.datasetId).toBe('OSDR-248')
  })
})

describe('P16 Research Reports & Export Engine', () => {
  it('generates a structured Markdown report with claims, evidence, and warnings', () => {
    const config = {
      title: 'Test Flight Surgeon Report',
      includedClaimIds: ['CLM-BONE-001', 'CLM-ANTIOX-007'],
      includeEvidenceClassifications: true,
      includeStudyPopulations: true,
      includeMethodology: true,
      includeLimitations: true,
      includeMissingSourceWarnings: true,
      includeCitationList: true,
      citationStyle: 'apa' as const,
      includeProvenanceLineage: true,
      includeDatasetAttribution: true,
      generatedBy: 'Test Officer',
    }

    const report = ReportService.generateReport(config, INITIAL_CLAIMS, INITIAL_SOURCES, INITIAL_EVIDENCE)
    expect(report.title).toBe('Test Flight Surgeon Report')
    expect(report.claimCount).toBe(2)
    expect(report.missingSourceWarningCount).toBe(1) // CLM-ANTIOX-007 has 0 sources
    expect(report.markdownContent).toContain('UNVERIFIED SCIENTIFIC CLAIMS DETECTED')
    expect(report.markdownContent).toContain('FORMATTED SCIENTIFIC BIBLIOGRAPHY')
  })

  it('exports structured CSV containing claim-to-source-to-evidence mappings', () => {
    const csv = ReportService.exportCSV(INITIAL_CLAIMS, INITIAL_SOURCES, INITIAL_EVIDENCE)
    expect(csv).toContain('Claim ID,Status,Domain,Claim Statement')
    expect(csv).toContain('CLM-BONE-001')
    expect(csv).toContain('SRC-NASA-EVD-BONE-006')
  })
})
