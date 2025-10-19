import { usePdfStore } from "@/lib/hooks/usePdfStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Spinner } from "../ui/spinner";

export const PageSelectionCard = () => {
  const { file, isLoading, isDownloading, pages, setPages } = usePdfStore(
    (state) => state,
  );

  const handleSelectAll = () => {
    setPages(pages.map((page) => ({ ...page, keep: true })));
  };

  const handleClearSelection = () => {
    setPages(pages.map((page) => ({ ...page, keep: false })));
  };

  const handlePageSelected = (pageNumber: number) => {
    setPages(
      pages.map((page) =>
        page.pageNumber === pageNumber ? { ...page, keep: !page.keep } : page,
      ),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{file?.name ?? "No file uploaded"}</CardTitle>
      </CardHeader>
      <CardContent>
        {pages.length === 0 && !isLoading && (
          <Alert>
            <AlertDescription>Please upload a file to start</AlertDescription>
          </Alert>
        )}
        {isLoading && <Spinner />}
        {isDownloading && <Spinner />}
        {pages.length > 0 && !isLoading && !isDownloading && (
          <>
            <div className="flex gap-2 mb-4">
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
                <Button
                  key={"page_select_" + page.pageNumber}
                  onClick={() => handlePageSelected(page.pageNumber)}
                  variant={page.keep ? "default" : "outline"}
                >
                  Page {page.pageNumber}
                </Button>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
