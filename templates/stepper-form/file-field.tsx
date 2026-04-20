"use client";

import { useController, type FieldValues } from "react-hook-form";
import type { ControlledFieldProps } from "./form";
import { FieldWrapper } from "./field-wrapper";
import { Input } from "./input";
import { cn } from "./cn";

type Props<T extends FieldValues> = ControlledFieldProps<T> & {
  accept?: string;
  fileProps?: React.InputHTMLAttributes<HTMLInputElement> & {
    preview?: boolean;
  };
};

export function FileField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled,
  description,
  className,
  classNames,
  variant,
  size,
  radius,
  accept,
  fileProps,
}: Props<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <FieldWrapper
      label={label}
      htmlFor={String(name)}
      required={required}
      description={description}
      error={error?.message}
      className={className}
      classNames={classNames}
    >
      <Input
        {...fileProps}
        id={String(name)}
        type="file"
        accept={accept}
        disabled={disabled}
        variant={error ? "error" : variant}
        size={size}
        radius={radius}
        className={cn(
          "cursor-pointer pt-2 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200",
          classNames?.input,
        )}
        onChange={(e) => field.onChange(e.target.files?.[0] || null)}
      />
    </FieldWrapper>
  );
}