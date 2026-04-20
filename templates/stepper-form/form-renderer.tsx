"use client";

import type { FieldValues } from "react-hook-form";
import type { FormFieldConfig, RenderFieldProps } from "./form";
import { TextField } from "./text-field";
import { PasswordField } from "./password-field";
import { TextareaField } from "./textarea-field";
import { SelectField } from "./select-field";
import { MultiSelectField } from "./multi-select-field";
import { CheckboxField } from "./checkbox-field";
import { RadioField } from "./radio-field";
import { FileField } from "./file-field";
import { PhoneField } from "./phone-field";
import { CountrySelectField } from "./country-select-field";
import { StateSelectField } from "./state-select-field";
import { CitySelectField } from "./city-select-field";

export function FormRenderer<T extends FieldValues>({
  fieldConfig,
  control,
}: RenderFieldProps<T>) {
  const common = {
    control,
    name: fieldConfig.name,
    label: fieldConfig.label,
    placeholder: fieldConfig.placeholder,
    required: fieldConfig.required,
    disabled: fieldConfig.disabled,
    description: fieldConfig.description,
    className: fieldConfig.className,
    classNames: fieldConfig.classNames,
    style: fieldConfig.style,
    variant: fieldConfig.variant,
    size: fieldConfig.size,
    radius: fieldConfig.radius,
  };

  switch (fieldConfig.type) {
    case "text":
    case "email":
    case "date":
    case "number":
      return (
        <TextField
          {...common}
          type={fieldConfig.type}
          inputProps={fieldConfig.inputProps}
        />
      );

    case "password":
      return <PasswordField {...common} inputProps={fieldConfig.inputProps} />;

    case "textarea":
      return (
        <TextareaField {...common} textareaProps={fieldConfig.textareaProps} />
      );

    case "select":
      return (
        <SelectField
          {...common}
          options={fieldConfig.options}
          selectProps={fieldConfig.selectProps}
        />
      );

    case "multi-select":
      return (
        <MultiSelectField
          {...common}
          options={fieldConfig.options}
          selectProps={fieldConfig.selectProps}
        />
      );

    case "checkbox":
      return (
        <CheckboxField {...common} checkboxLabel={fieldConfig.checkboxLabel} />
      );

    case "radio":
      return <RadioField {...common} options={fieldConfig.options} />;

    case "file":
      return (
        <FileField
          {...common}
          accept={fieldConfig.accept}
          fileProps={fieldConfig.fileProps}
        />
      );

    case "tel":
      return <PhoneField {...common} phoneProps={fieldConfig.phoneProps} />;

    case "country":
      return (
        <CountrySelectField
          {...common}
          countryProps={fieldConfig.countryProps}
        />
      );

    case "state":
      return (
        <StateSelectField
          {...common}
          countryCodeField={fieldConfig.countryCodeField}
          stateProps={fieldConfig.stateProps}
        />
      );

    case "city":
      return (
        <CitySelectField
          {...common}
          countryCodeField={fieldConfig.countryCodeField}
          stateCodeField={fieldConfig.stateCodeField}
          cityProps={fieldConfig.cityProps}
        />
      );

    default:
      return null;
  }
}
