"use client";

import { useController, type FieldValues } from "react-hook-form";
import type { ControlledFieldProps, Option } from "./form";
import { FieldWrapper } from "./field-wrapper";
import { cn } from "./cn";

type Props<T extends FieldValues> = ControlledFieldProps<T> & {
  options?: Option[];
};

export function RadioField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled,
  description,
  className,
  classNames,
  options = [],
}: Props<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <FieldWrapper
      label={label}
      required={required}
      description={description}
      error={error?.message}
      className={className}
      classNames={classNames}
    >
      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-3",
          classNames?.input,
        )}
      >
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-3 text-sm text-zinc-700">
            <input
              type="radio"
              value={opt.value}
              checked={field.value === opt.value}
              onChange={() => field.onChange(opt.value)}
              onBlur={field.onBlur}
              disabled={disabled || opt.disabled}
              className="h-4 w-4 border-zinc-300"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
}