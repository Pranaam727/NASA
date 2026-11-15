export interface NasaResearchStudy {
  id: string;
  accessionNumber: string; // e.g. OSD-379, NASA-HRP-2023-01
  title: string;
  sourceRepository: 'NASA OSDR' | 'NASA GeneLab' | 'NASA NTRS' | 'NASA HRP Risks' | 'NASA Human Research Roadmap';
  publicationYear: number;
  studyType: 'Spaceflight Omics' | 'Human Spaceflight Physiology' | 'Rodent Analog' | 'Bed Rest Analog' | 'Radiation Biology';
  organism: 'Homo sapiens (Astronauts)' | 'Mus musculus' | 'In Vitro Cell Lines' | 'Analog Human Volunteers';
  physiologicalSystem: string;
  keyFindings: string[];
  originalUnits: string[];
  url: string;
  retrievalDate: string;
  limitations: string;
}
