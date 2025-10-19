import { PDFDocument } from "pdf-lib";
import type { PageInfo } from "./types";

type ReadFileResult = Promise<{
  pages: PageInfo[];
  buffer: ArrayBuffer;
  ok: boolean;
}>;

const readFile = async (file: File): ReadFileResult => {
  try {
    const buffer = await file.arrayBuffer();

    const pdfDoc = await PDFDocument.load(buffer);
    const pageCount = pdfDoc.getPageCount();

    const pages = Array.from({ length: pageCount }, (_, i) => ({
      pageNumber: i + 1,
      keep: true,
    }));

    return { pages, buffer, ok: true };
  } catch (err) {
    console.error("Failed to load PDF:", err);
    return { pages: [], buffer: new ArrayBuffer(0), ok: false };
  }
};

export const FileUtils = {
  readFile,
} as const;
