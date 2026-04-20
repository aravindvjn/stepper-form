"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useController, type FieldValues } from "react-hook-form";
import type { ControlledFieldProps } from "./form";
import { FieldWrapper } from "./field-wrapper";
import { Input } from "./input";
import { cn } from "./cn";

type Props<T extends FieldValues> = ControlledFieldProps<T> & {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export function PasswordField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required,
  disabled,
  description,
  className,
  classNames,
  variant,
  size,
  radius,
  inputProps,
}: Props<T>) {
  const [show, setShow] = useState(false);

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
      <div className="relative">
        <Input
          {...inputProps}
          id={String(name)}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          variant={error ? "error" : variant}
          size={size}
          radius={radius}
          className={cn("pr-10", classNames?.input)}
          value={field.value?.toString?.() ?? ""}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          name={field.name}
          ref={field.ref}
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-700"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </FieldWrapper>
  );
}
