import { create } from "zustand";
import type { ErrorType, FileMetadata, PageInfo, PdfState } from "../types";

export const usePdfStore = create<PdfState & FileMetadata>((set) => ({
  file: null,
  fileName: null,
  fileBuffer: null,
  pages: [],
  isLoading: false,
  isDownloading: false,
  error: null,

  setFile: (file: File | null) => set({ file, fileName: file?.name }),
  setFileName: (fileName: string | null) => set({ fileName }),
  setFileBuffer: (fileBuffer: ArrayBuffer | null) => set({ fileBuffer }),
  setPages: (pages: PageInfo[]) => set({ pages }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setIsDownloading: (isDownloading: boolean) => set({ isDownloading }),
  setError: (error: ErrorType) => set({ error }),
}));
