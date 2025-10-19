import { usePdfStore } from "@/lib/hooks/usePdfStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "lucide-react";
import { useState } from "react"; // 1. Import useState
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Spinner } from "../ui/spinner";
import { Toggle } from "../ui/toggle";

export const PageSelectionCard = () => {
  const file = usePdfStore((state) => state.file);
  const isLoading = usePdfStore((state) => state.isLoading);
  const isDownloading = usePdfStore((state) => state.isDownloading);
  const pages = usePdfStore((state) => state.pages);
  const setPages = usePdfStore((state) => state.setPages);

  const [lastClickedPage, setLastClickedPage] = useState<number | null>(null);

  const handleSelectAll = () => {
    setPages(pages.map((page) => ({ ...page, keep: true })));
    setLastClickedPage(null);
  };

  const handleClearSelection = () => {
    setPages(pages.map((page) => ({ ...page, keep: false })));
    setLastClickedPage(null);
  };

  const handlePageSelected = (event: React.MouseEvent, clickedPage: number) => {
    const { shiftKey } = event;

    if (shiftKey && lastClickedPage !== null) {
      const start = Math.min(lastClickedPage, clickedPage);
      const end = Math.max(lastClickedPage, clickedPage);

      const targetKeepState = !pages.find((p) => p.pageNumber === clickedPage)!
        .keep;

      const newPages = pages.map((page) => {
        if (page.pageNumber >= start && page.pageNumber <= end) {
          return { ...page, keep: targetKeepState };
        }
        return page;
      });

      setPages(newPages);
    } else {
      setPages(
        pages.map((page) =>
          page.pageNumber === clickedPage
            ? { ...page, keep: !page.keep }
            : page,
        ),
      );
      setLastClickedPage(clickedPage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{file?.name ?? "No file uploaded"}</CardTitle>
        <CardDescription>Highlighted pages will be kept.</CardDescription>
      </CardHeader>
      <CardContent>
        {pages.length === 0 && !isLoading && (
          <Alert variant="destructive">
            <AlertDescription>File is empty.</AlertDescription>
          </Alert>
        )}

        {(isLoading || isDownloading) && <Spinner />}

        {pages.length > 0 && !isLoading && !isDownloading && (
          <>
            <div className="flex gap-2 mb-4 w-full shrink">
              <Button
                variant="outline"
                onClick={handleSelectAll}
                size="sm"
                className="w-1/2 lg:w-fit"
              >
                <CheckIcon className="mr-2 h-4 w-4" />
                Select all
              </Button>
              <Button
                className="w-1/2 lg:w-fit"
                variant="outline"
                onClick={handleClearSelection}
                size="sm"
              >
                <XMarkIcon className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {pages.map((page) => (
                <Toggle
                  key={"page_select_" + page.pageNumber}
                  onClick={(e) => handlePageSelected(e, page.pageNumber)}
                  pressed={page.keep}
                >
                  Page {page.pageNumber}
                </Toggle>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
