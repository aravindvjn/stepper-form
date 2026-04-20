import React from "react";
import { type VariantProps } from "class-variance-authority";
import { textareaVariants } from "./variants";
import { cn } from "./cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaVariants>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, radius, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(textareaVariants({ variant, size, radius }), className)}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";