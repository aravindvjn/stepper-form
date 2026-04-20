"use client";

import { useController, type FieldValues } from "react-hook-form";
import type { ControlledFieldProps } from "./form";
import { FieldWrapper } from "./field-wrapper";
import { Textarea } from "./textarea";

type Props<T extends FieldValues> = ControlledFieldProps<T> & {
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
};

export function TextareaField<T extends FieldValues>({
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
  textareaProps,
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
      <Textarea
        {...textareaProps}
        id={String(name)}
        placeholder={placeholder}
        disabled={disabled}
        variant={error ? "error" : variant}
        size={size}
        radius={radius}
        className={classNames?.input}
        value={field.value?.toString?.() ?? ""}
        onChange={(e) => field.onChange(e.target.value)}
        onBlur={field.onBlur}
        name={field.name}
        ref={field.ref}
      />
    </FieldWrapper>
  );
}
