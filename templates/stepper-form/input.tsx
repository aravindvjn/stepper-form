import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { inputVariants } from "./variants";
import { cn } from "./cn";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> &
  VariantProps<typeof inputVariants>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, radius, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ variant, size, radius }), className)}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";