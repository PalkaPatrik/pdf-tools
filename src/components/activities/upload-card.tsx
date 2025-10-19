import { FileUtils } from "@/lib/file.utils";
import { usePdfStore } from "@/lib/hooks/usePdfStore";
import { TrashIcon } from "lucide-react";
import { useRef, type ChangeEvent } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

export const FileUploadCard = () => {
  const {
    file,
    setFile,
    setIsLoading,
    setFileBuffer,
    setPages,
    setError,
    error,
  } = usePdfStore((state) => state);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setIsLoading(true);
      const result = await FileUtils.readFile(selectedFile);

      if (result.ok) {
        setFile(selectedFile);
        setFileBuffer(result.buffer);
        setPages(result.pages);
      } else {
        setError("upload");
      }
      setIsLoading(false);
    }
  };

  const clearUploadedFile = () => {
    setFile(null);
    setFileBuffer(null);
    setPages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload your file</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full max-w-sm items-center gap-3">
        <div className="flex gap-2 items-center">
          <Input
            disabled={!!file}
            className="cursor-pointer w-full"
            ref={fileInputRef}
            id="theFile"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          {file && (
            <Button
              size="icon"
              variant="secondary"
              icon={TrashIcon}
              onClick={clearUploadedFile}
            />
          )}
          {error === "upload" && (
            <Alert variant="destructive">
              <AlertDescription>
                Error ocurred while uploading the file.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
