"use client";

import { useController, type FieldValues } from "react-hook-form";
import type { ControlledFieldProps } from "./form";
import { FieldWrapper } from "./field-wrapper";
import { cn } from "./cn";

type Props<T extends FieldValues> = ControlledFieldProps<T> & {
  checkboxLabel?: string;
};

export function CheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled,
  description,
  className,
  classNames,
  checkboxLabel,
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
      <label
        className={cn(
          "flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-700",
          classNames?.input,
        )}
      >
        <input
          id={String(name)}
          type="checkbox"
          checked={!!field.value}
          onChange={(e) => field.onChange(e.target.checked)}
          onBlur={field.onBlur}
          disabled={disabled}
          name={field.name}
          ref={field.ref}
          className="h-4 w-4 rounded border-zinc-300"
        />
        <span>{checkboxLabel || label}</span>
      </label>
    </FieldWrapper>
  );
}
