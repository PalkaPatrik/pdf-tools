import {
  CheckIcon,
  CloudArrowDownIcon,
  DocumentIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import download from "downloadjs";
import { PDFDocument } from "pdf-lib";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "./components/ui/item";
import { Label } from "./components/ui/label";
import { Spinner } from "./components/ui/spinner";

type PageInfo = {
  pageNumber: number;
  keep: boolean;
};

function App() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [pages, setPages] = useState<PageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!file) {
      setPages([]);
      setFileBuffer(null); // 3. Clear buffer on file clear
      return;
    }

    const loadPdf = async () => {
      setIsLoading(true);
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (!arrayBuffer) throw new Error("Could not read file buffer.");

          setFileBuffer(arrayBuffer); // 4. Store the buffer

          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const pageCount = pdfDoc.getPageCount();

          const initialPages = Array.from({ length: pageCount }, (_, i) => ({
            pageNumber: i + 1,
            keep: true,
          }));

          setPages(initialPages);
        } catch (err) {
          console.error("Failed to load PDF:", err);
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    };

    loadPdf();
  }, [file]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // e.target.files is a FileList. We want the first file.
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      console.log("File selected:", selectedFile);
    }
  };

  const clearUploadedFile = () => {
    setFile(null);
    setPages([]);
    setFileBuffer(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePageCheckboxChange = (pageNumber: number) => {
    setPages((currentPages) =>
      currentPages.map((page) =>
        page.pageNumber === pageNumber
          ? { ...page, keep: !page.keep } // Toggle the 'keep' value
          : page,
      ),
    );
  };

  const handleSelectAll = () => {
    setPages((currentPages) =>
      currentPages.map((page) => ({ ...page, keep: true })),
    );
  };

  const handleClearSelection = () => {
    setPages((currentPages) =>
      currentPages.map((page) => ({ ...page, keep: false })),
    );
  };

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
      const originalName = file?.name.replace(/\.pdf$/i, "") || "document";
      download(newPdfBytes, `${originalName}-extracted.pdf`, "application/pdf");
    } catch (err) {
      console.error("Failed to create new PDF:", err);
      alert("An error occurred while creating the PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-2">
      <h1 className="font-bold text-3xl mb-4 text-center">
        <span className="text-red-500">P</span>ee
        <span className="text-red-500">D</span>eeE
        <span className="text-red-500">f</span> tools
      </h1>
      <div className="grid grid-cols-3 gap-4 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Upload your file</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="theFile">File</Label>
              <div className="flex gap-2 items-center">
                <Input
                  ref={fileInputRef}
                  id="theFile"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                {file && (
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={TrashIcon}
                    onClick={clearUploadedFile}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            {file && (
              <>
                <p className="mt-4 text-sm text-muted-foreground">
                  Selected file: <strong>{file.name}</strong>
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{file?.name ?? "No file uploaded"}</CardTitle>
          </CardHeader>
          <CardContent>
            {pages.length === 0 && !isLoading && (
              <Alert>
                <AlertDescription>
                  Please upload a file to start
                </AlertDescription>
              </Alert>
            )}
            {isLoading && <Spinner />}
            {isDownloading && <Spinner />}
            {pages.length > 0 && !isLoading && !isDownloading && (
              <>
                <div className="flex gap-2 mb-4">
                  <Button icon={CloudArrowDownIcon} onClick={handleDownload}>
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    icon={CheckIcon}
                    onClick={handleSelectAll}
                  >
                    Select all
                  </Button>
                  <Button
                    variant="outline"
                    icon={XMarkIcon}
                    onClick={handleClearSelection}
                  >
                    Clear
                  </Button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {pages.map((page) => (
                    <Item key={page.pageNumber} variant="outline">
                      <ItemMedia>
                        <DocumentIcon className="size-4" />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Page {page.pageNumber}</ItemTitle>
                      </ItemContent>
                      <ItemActions>
                        <Checkbox
                          id={`page-${page.pageNumber}`}
                          checked={page.keep}
                          onCheckedChange={() =>
                            handlePageCheckboxChange(page.pageNumber)
                          }
                        />
                      </ItemActions>
                    </Item>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
