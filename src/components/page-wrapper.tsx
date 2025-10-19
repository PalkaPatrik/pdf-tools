import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";

export const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="p-2 px-4">
      <SiteHeader />
      <main>{children}</main>
    </div>
  );
};
