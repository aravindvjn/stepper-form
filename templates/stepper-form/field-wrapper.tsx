import React from "react";
import { cn } from "./cn";

type Props = {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  description?: string;
  error?: string;
  className?: string;
  classNames?: {
    root?: string;
    label?: string;
    description?: string;
    error?: string;
  };
  children: React.ReactNode;
};

export function FieldWrapper({
  label,
  htmlFor,
  required,
  description,
  error,
  className,
  classNames,
  children,
}: Props) {
  return (
    <div className={cn("flex flex-col gap-1.5", className, classNames?.root)}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className={cn("text-sm font-medium text-zinc-800", classNames?.label)}
        >
          {label}
          {required ? <span className="ml-1 text-red-500">*</span> : null}
        </label>
      ) : null}

      {children}

      {!error && description ? (
        <span
          className={cn("text-[13px] text-zinc-500", classNames?.description)}
        >
          {description}
        </span>
      ) : null}

      {error ? (
        <span
          className={cn(
            "text-[12px] font-medium text-red-500",
            classNames?.error,
          )}
        >
          {error}
        </span>
      ) : null}
    </div>
  );
}
