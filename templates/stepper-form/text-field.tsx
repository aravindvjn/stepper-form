"use client";

import { useController, type FieldValues } from "react-hook-form";
import type { ControlledFieldProps } from "./form";
import { FieldWrapper } from "./field-wrapper";
import { Input } from "./input";
import { cn } from "./cn";

type Props<T extends FieldValues> = ControlledFieldProps<T> & {
  type?: "text" | "email" | "date" | "number";
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required,
  disabled,
  description,
  className,
  classNames,
  style,
  variant,
  size,
  radius,
  inputProps,
  type = "text",
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
        {...inputProps}
        id={String(name)}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        variant={error ? "error" : variant}
        size={size}
        radius={radius}
        className={cn(classNames?.input)}
        style={style}
        value={
          type === "number"
            ? (field.value ?? "")
            : (field.value?.toString?.() ?? "")
        }
        onChange={(e) =>
          field.onChange(
            type === "number"
              ? e.target.value === ""
                ? ""
                : Number(e.target.value)
              : e.target.value,
          )
        }
        onBlur={field.onBlur}
        name={field.name}
        ref={field.ref}
      />
    </FieldWrapper>
  );
}