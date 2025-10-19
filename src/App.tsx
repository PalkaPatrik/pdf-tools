import { FileMetadataCard } from "./components/activities/metadata-card";
import { PageSelectionCard } from "./components/activities/page-selection-card";
import { FileUploadCard } from "./components/activities/upload-card";
import { CardGrid } from "./components/card-grid";
import { PageWrapper } from "./components/page-wrapper";
import { Skeleton } from "./components/ui/skeleton";
import { usePdfStore } from "./lib/hooks/usePdfStore";

function App() {
  const { file, isLoading } = usePdfStore((state) => state);

  return (
    <PageWrapper>
      <CardGrid
        left={
          <>
            <FileUploadCard />
            {!!file && <FileMetadataCard />}
            {!file && isLoading && <Skeleton className="h-60" />}
          </>
        }
        right={
          <>
            {!!file && <PageSelectionCard />}
            {!file && isLoading && <Skeleton className="h-80" />}
          </>
        }
      />
    </PageWrapper>
  );
}

export default App;
