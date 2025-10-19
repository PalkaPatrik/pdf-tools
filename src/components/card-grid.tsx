import type { ReactNode } from "react";

export const CardGrid = ({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) => {
  return (
    <div className="grid lg:grid-cols-4 gap-4">
      <div className="col-span-1 flex flex-col gap-4">{left}</div>
      <div className="col-span-3 flex flex-col gap-4">{right}</div>
    </div>
  );
};
