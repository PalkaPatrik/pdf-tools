export type PageInfo = {
  pageNumber: number;
  keep: boolean;
};

export type ErrorType = "upload" | null;

export interface PdfState {
  file: File | null;
  fileBuffer: ArrayBuffer | null;
  pages: PageInfo[];
  isLoading: boolean;
  isDownloading: boolean;
  error: ErrorType;

  setFile: (file: File | null) => void;
  setFileBuffer: (fileBuffer: ArrayBuffer | null) => void;
  setPages: (pages: PageInfo[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsDownloading: (isDownloading: boolean) => void;
  setError: (error: ErrorType) => void;
}

export interface FileMetadata {
  fileName: string | null;
  setFileName: (fileName: string | null) => void;
}
