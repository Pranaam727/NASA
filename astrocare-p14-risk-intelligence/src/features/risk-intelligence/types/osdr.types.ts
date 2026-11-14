export interface OSDRStudy {
  id: string; // e.g. "OSD-37", "OSD-104", "OSD-254"
  title: string;
  description: string;
  organism: string;
  organismClassification: 'Human Astronaut' | 'Rodent / Mammalian' | 'Plant' | 'Invertebrate / Microorganism' | 'Cell Culture / Organoid';
  experimentType: string;
  missionName: string;
  flightDate?: string;
  payloadName?: string;
  assays: string[];
  factors: string[];
  dataTypes: string[];
  fileCount: number;
  sampleCount: number;
  studyUrl: string;
  restMetaUrl: string;
  associatedRiskCodes: string[];
  isHuman: boolean;
  rawJsonSummary?: string;
}

export interface OSDRSearchResponse {
  totalHits: number;
  hits: OSDRStudy[];
  isLiveApi: boolean;
  dataSourceNotice: string;
}
