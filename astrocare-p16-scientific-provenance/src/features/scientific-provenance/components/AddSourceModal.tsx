import React, { useState, useEffect } from 'react'
import { X, PlusCircle, Save, AlertCircle } from 'lucide-react'
import { ScientificSource, SourceType, ResearchDomain, VerificationStatus } from '../types/source.types'

interface AddSourceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (source: ScientificSource) => void
  initialSource?: ScientificSource | null
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSource,
}) => {
  const [title, setTitle] = useState('')
  const [organization, setOrganization] = useState('')
  const [authorsStr, setAuthorsStr] = useState('')
  const [publicationDate, setPublicationDate] = useState('')
  const [sourceType, setSourceType] = useState<SourceType>('peer_reviewed_paper')
  const [researchDomain, setResearchDomain] = useState<ResearchDomain>('bone_and_muscle')
  const [url, setUrl] = useState('')
  const [doi, setDoi] = useState('')
  const [datasetId, setDatasetId] = useState('')
  const [description, setDescription] = useState('')
  const [journal, setJournal] = useState('')
  const [reportNumber, setReportNumber] = useState('')
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('pending_verification')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialSource) {
      setTitle(initialSource.title || '')
      setOrganization(initialSource.organization || '')
      setAuthorsStr(initialSource.authors?.join(', ') || '')
      setPublicationDate(initialSource.publicationDate || '')
      setSourceType(initialSource.sourceType || 'peer_reviewed_paper')
      setResearchDomain(initialSource.researchDomain || 'bone_and_muscle')
      setUrl(initialSource.url || '')
      setDoi(initialSource.doi || '')
      setDatasetId(initialSource.datasetId || '')
      setDescription(initialSource.description || '')
      setJournal(initialSource.publicationMetadata?.journal || '')
      setReportNumber(initialSource.publicationMetadata?.reportNumber || '')
      setVerificationStatus(initialSource.verificationStatus || 'verified_authentic')
    } else {
      setTitle('')
      setOrganization('')
      setAuthorsStr('')
      setPublicationDate('')
      setSourceType('peer_reviewed_paper')
      setResearchDomain('bone_and_muscle')
      setUrl('')
      setDoi('')
      setDatasetId('')
      setDescription('')
      setJournal('')
      setReportNumber('')
      setVerificationStatus('pending_verification')
    }
    setError(null)
  }, [initialSource, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Source title is required.')
      return
    }
    if (!organization.trim()) {
      setError('Publishing organization or institution is required.')
      return
    }
    if (!url.trim()) {
      setError('Original source URL is required.')
      return
    }

    try {
      new URL(url)
    } catch {
      setError('Please provide a valid URL beginning with http:// or https://')
      return
    }

    const authors = authorsStr
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0)

    const source: ScientificSource = {
      id: initialSource ? initialSource.id : `SRC-USR-${Date.now().toString(36).toUpperCase()}`,
      title: title.trim(),
      organization: organization.trim(),
      authors: authors.length > 0 ? authors : undefined,
      publicationDate: publicationDate.trim() || undefined,
      sourceType,
      researchDomain,
      url: url.trim(),
      doi: doi.trim() || undefined,
      datasetId: datasetId.trim() || undefined,
      description: description.trim() || 'Descriptive summary pending scientific verification.',
      retrievalDate: initialSource ? initialSource.retrievalDate : new Date().toISOString().split('T')[0],
      publicationMetadata:
        journal.trim() || reportNumber.trim()
          ? {
              journal: journal.trim() || undefined,
              reportNumber: reportNumber.trim() || undefined,
              publisher: organization.trim(),
            }
          : undefined,
      verificationStatus,
      isUserEntered: true,
      retrievalSource: 'manual_entry',
    }

    onSave(source)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-astro-surface border border-astro-border rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-astro-border bg-astro-card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-astro-cyan/10 border border-astro-cyan/30 flex items-center justify-center text-astro-cyan">
              {initialSource ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                {initialSource ? `Edit Source: ${initialSource.id}` : 'Register New Scientific Source'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Official publication, technical report, or Open Science dataset
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-astro-darkest transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
              Publication Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Risk of Impaired Vision and Decreased Brain Perfusion..."
              className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none focus:border-astro-cyan/60"
              required
            />
          </div>

          {/* Organization & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Organization / Institution *
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. NASA Johnson Space Center"
                className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none focus:border-astro-cyan/60"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Source Category *
              </label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as SourceType)}
                className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none focus:border-astro-cyan/60"
              >
                <option value="nasa_publication">NASA Publication</option>
                <option value="nasa_technical_report">NASA Technical Report</option>
                <option value="nasa_hrp_page">NASA HRP Evidence Page</option>
                <option value="nasa_osdr_study">NASA OSDR Study</option>
                <option value="peer_reviewed_paper">Peer-Reviewed Paper</option>
                <option value="scientific_dataset">Scientific Dataset</option>
                <option value="research_institution">Research Institution</option>
                <option value="government_official">Government Research Source</option>
                <option value="other">Other Verifiable Source</option>
              </select>
            </div>
          </div>

          {/* Research Domain & Publication Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Research Domain *
              </label>
              <select
                value={researchDomain}
                onChange={(e) => setResearchDomain(e.target.value as ResearchDomain)}
                className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none focus:border-astro-cyan/60"
              >
                <option value="bone_and_muscle">Bone & Muscle</option>
                <option value="radiation">Radiation</option>
                <option value="cardiovascular">Cardiovascular</option>
                <option value="immune_system">Immune System</option>
                <option value="sleep_and_circadian">Sleep & Circadian</option>
                <option value="neurovestibular">Neurovestibular / SANS</option>
                <option value="multi_system">Multi-System / Twins</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Publication Date (YYYY or YYYY-MM)
              </label>
              <input
                type="text"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                placeholder="Leave blank if unavailable"
                className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none focus:border-astro-cyan/60 font-mono"
              />
            </div>
          </div>

          {/* URL & DOI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Original Official URL *
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none focus:border-astro-cyan/60 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                DOI (Digital Object Identifier)
              </label>
              <input
                type="text"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="10.xxxx/..."
                className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none focus:border-astro-cyan/60 font-mono"
              />
            </div>
          </div>

          {/* Authors & Dataset ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Authors (Comma-separated)
              </label>
              <input
                type="text"
                value={authorsStr}
                onChange={(e) => setAuthorsStr(e.target.value)}
                placeholder="e.g. J. C. McPhee, J. B. Charles"
                className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none focus:border-astro-cyan/60"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                NASA OSDR Dataset Identifier
              </label>
              <input
                type="text"
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                placeholder="e.g. OSDR-379"
                className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none focus:border-astro-cyan/60 font-mono"
              />
            </div>
          </div>

          {/* Journal / Report Number & Verification Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Journal Name
              </label>
              <input
                type="text"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="e.g. Science"
                className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none focus:border-astro-cyan/60"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Report Number
              </label>
              <input
                type="text"
                value={reportNumber}
                onChange={(e) => setReportNumber(e.target.value)}
                placeholder="e.g. NASA/TP-2017-219291"
                className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none focus:border-astro-cyan/60 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Verification Status
              </label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value as VerificationStatus)}
                className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none focus:border-astro-cyan/60"
              >
                <option value="verified_authentic">Verified Authentic</option>
                <option value="pending_verification">Pending Verification</option>
                <option value="incomplete_metadata">Incomplete Metadata</option>
                <option value="unverified">Unverified</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
          </div>

          {/* Abstract / Summary */}
          <div>
            <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
              Description / Abstract
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of research findings and objectives..."
              className="w-full px-3 py-1.5 bg-astro-darkest border border-astro-border rounded text-slate-100 focus:outline-none focus:border-astro-cyan/60 leading-relaxed"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-astro-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-md text-slate-400 hover:text-white hover:bg-astro-darkest transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-astro-cyan text-astro-darkest font-semibold hover:bg-cyan-300 transition-colors shadow-sm glow-cyan-sm"
            >
              {initialSource ? 'Save Changes' : 'Register Source'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
