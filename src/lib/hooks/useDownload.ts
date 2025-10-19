import download from "downloadjs";
import { PDFDocument } from "pdf-lib";
import { usePdfStore } from "./usePdfStore";

export const useDownload = () => {
  const { file, fileName, pages, fileBuffer, setIsDownloading } = usePdfStore();

  const handleDownload = async () => {
    if (!fileBuffer) {
      alert("No PDF file loaded.");
      return;
    }

    // Get the 0-based indices of pages to keep
    const pageIndicesToKeep = pages
      .filter((page) => page.keep)
      .map((page) => page.pageNumber - 1); // Convert 1-based to 0-based

    if (pageIndicesToKeep.length === 0) {
      alert("Please select at least one page to keep.");
      return;
    }

    setIsDownloading(true);
    try {
      // Load the *original* PDF from the buffer
      const sourcePdfDoc = await PDFDocument.load(fileBuffer);

      // Create a new PDF
      const newPdfDoc = await PDFDocument.create();

      // Copy the selected pages from the original to the new PDF
      const copiedPages = await newPdfDoc.copyPages(
        sourcePdfDoc,
        pageIndicesToKeep,
      );

      // Add the copied pages to the new PDF
      copiedPages.forEach((page) => {
        newPdfDoc.addPage(page);
      });

      // Save the new PDF into a Uint8Array
      const newPdfBytes = await newPdfDoc.save();

      // Trigger the download
      const originalName = file?.name?.replace(/\.pdf$/i, "");
      const targetName =
        originalName === fileName ? `${fileName}-ext` : fileName;

      download(newPdfBytes, `${targetName}.pdf`, "application/pdf");
    } catch (err) {
      console.error("Failed to create new PDF:", err);
      alert("An error occurred while creating the PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  return handleDownload;
};
