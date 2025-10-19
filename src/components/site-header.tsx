import { BookmarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";

export const SiteHeader = () => (
  <header className="mb-4 flex justify-between items-center">
    <h1 className="font-bold text-3xl">
      <span className="text-red-500">P</span>ee
      <span className="text-red-500">D</span>eeE
      <span className="text-red-500">f</span> tools
    </h1>
    <Button size="sm" variant="ghost" icon={BookmarkIcon}>
      <a target="_blank" href="https://github.com/Hopding/pdf-lib">
        @Hopding/pdf-lib
      </a>
    </Button>
  </header>
);
