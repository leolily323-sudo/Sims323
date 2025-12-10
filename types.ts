export interface CosmicResponse {
  phrase: string;
  explanation: string;
  theme: 'occult' | 'conspiracy' | 'paranormal' | 'mysticism';
  sourceUrl: string;
}

export enum AppState {
  IDLE = 'IDLE',
  GAZING = 'GAZING', // Loading
  REVEALED = 'REVEALED',
  ERROR = 'ERROR'
}
