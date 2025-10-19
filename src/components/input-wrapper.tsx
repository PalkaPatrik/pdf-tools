import { Label } from "./ui/label";

export const InputWrapper = ({
  label,
  inputId,
  children,
}: {
  label?: string;
  inputId?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      {label && inputId && <Label htmlFor={inputId}>{label}</Label>}
      {children}
    </div>
  );
};
