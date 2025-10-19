import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";

function Button({
  className,
  variant,
  size,
  type,
  asChild = false,
  icon: Icon,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon?: ({ className }: { className: string }) => React.ReactNode;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      type={type ? type : "button"}
      className={cn(
        buttonVariants({ variant, size, className }),
        "flex gap-2 items-center justify-center",
        props.disabled ? "cursor-not-allowed" : "cursor-pointer",
      )}
      {...props}
    >
      {Icon && (
        <span className={cn("size-4")}>
          <Icon className={"size-4"} />
        </span>
      )}
      {children}
    </Comp>
  );
}

export { Button };
