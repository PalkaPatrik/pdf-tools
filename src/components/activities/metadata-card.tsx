import { useDownload } from "@/lib/hooks/useDownload";
import { usePdfStore } from "@/lib/hooks/usePdfStore";
import { CloudArrowDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
import { InputWrapper } from "../input-wrapper";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

export const FileMetadataCard = () => {
  const fileName = usePdfStore((state) => state.fileName);
  const setFileName = usePdfStore((state) => state.setFileName);
  const pages = usePdfStore((state) => state.pages);

  const pagesToKeep = pages.filter((page) => page.keep).length;

  const fileNameRef = useRef<HTMLInputElement>(null);
  const download = useDownload();

  const handleFileNameChange = () => {
    if (fileNameRef.current) {
      setFileName(fileNameRef.current.value);
    }
  };

  const handleDownload = async () => {
    await download();
  };

  useEffect(() => {
    if (fileNameRef.current) {
      fileNameRef.current.value = fileName ?? "";
    }
  }, [fileName]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <InputWrapper label="File name" inputId="filename">
          <Input
            type="text"
            id="filename"
            ref={fileNameRef}
            onBlur={handleFileNameChange}
          />
        </InputWrapper>

        <Button
          icon={CloudArrowDownIcon}
          onClick={handleDownload}
          disabled={pagesToKeep === 0}
        >
          Download {pagesToKeep} page{pagesToKeep === 1 ? "" : "s"}
        </Button>
      </CardContent>
    </Card>
  );
};
