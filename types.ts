export interface SummaryState {
  originalLength: number | null; // Placeholder for token count estimation if needed, or just null
  summary: string;
}

export enum FileSource {
  UPLOAD = 'UPLOAD',
  URL = 'URL'
}

export interface PdfFile {
  name: string;
  data: string; // Base64 encoded data
  source: FileSource;
}
