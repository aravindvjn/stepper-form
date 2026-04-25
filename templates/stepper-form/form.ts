import type {
  Control,
  FieldValues,
  Path,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import type {
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "date"
  | "number"
  | "tel"
  | "file"
  | "select"
  | "multi-select"
  | "textarea"
  | "checkbox"
  | "radio"
  | "country"
  | "state"
  | "city";

export type FieldVariant = "default" | "filled" | "ghost" | "error";
export type FieldSize = "sm" | "md" | "lg";
export type FieldRadius = "sm" | "md" | "lg";

export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
};

export type FieldClassNames = {
  root?: string;
  label?: string;
  input?: string;
  trigger?: string;
  description?: string;
  error?: string;
  option?: string;
  dropdown?: string;
};

export type BaseFieldConfig<
  T extends FieldValues,
  K extends FieldType = FieldType,
> = {
  name: Path<T>;
  label: string;
  type: K;
  placeholder?: string;
  required?: boolean;
  description?: string;
  disabled?: boolean;
  colSpan?: 1 | 2;
  isUncommon?: boolean;
  className?: string;
  classNames?: FieldClassNames;
  style?: CSSProperties;
  variant?: FieldVariant;
  size?: FieldSize;
  radius?: FieldRadius;
};

export type TextLikeFieldConfig<T extends FieldValues> = BaseFieldConfig<
  T,
  "text" | "email" | "password" | "date" | "number"
> & {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "name" | "type" | "value" | "defaultValue" | "onChange" | "size"
  >;
};

export type TextareaFieldConfig<T extends FieldValues> = BaseFieldConfig<
  T,
  "textarea"
> & {
  textareaProps?: Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "name" | "value" | "defaultValue" | "onChange"
  >;
};

export type SelectFieldConfig<T extends FieldValues> = BaseFieldConfig<
  T,
  "select"
> & {
  options?: Option[];
  selectProps?: {
    searchable?: boolean;
    emptyText?: string;
    closeOnSelect?: boolean;
  };
};

export type MultiSelectFieldConfig<T extends FieldValues> = BaseFieldConfig<
  T,
  "multi-select"
> & {
  options?: Option[];
  selectProps?: {
    searchable?: boolean;
    emptyText?: string;
  };
};

export type RadioFieldConfig<T extends FieldValues> = BaseFieldConfig<
  T,
  "radio"
> & {
  options?: Option[];
};

export type CheckboxFieldConfig<T extends FieldValues> = BaseFieldConfig<
  T,
  "checkbox"
> & {
  checkboxLabel?: string;
};

export type FileFieldConfig<T extends FieldValues> = BaseFieldConfig<
  T,
  "file"
> & {
  accept?: string;
  fileProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "name" | "type" | "value" | "defaultValue" | "onChange" | "size"
  > & {
    preview?: boolean;
  };
};

export type PhoneFieldConfig<T extends FieldValues> = BaseFieldConfig<
  T,
  "tel"
> & {
  phoneProps?: {
    defaultCountryCode?: string;
    searchable?: boolean;
    inputProps?: Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "name" | "type" | "value" | "defaultValue" | "onChange" | "size"
    >;
  };
};

export type CountryFieldConfig<T extends FieldValues> = BaseFieldConfig<
  T,
  "country"
> & {
  countryProps?: {
    onValueChange?: (
      value: string,
      meta?: { name: string; iso2: string },
    ) => void;
  };
};

export type StateFieldConfig<T extends FieldValues> = BaseFieldConfig<
  T,
  "state"
> & {
  countryCodeField?: Path<T>;
  stateProps?: {
    onValueChange?: (
      value: string,
      meta?: { name: string; iso2: string; countryCode: string },
    ) => void;
  };
};

export type CityFieldConfig<T extends FieldValues> = BaseFieldConfig<
  T,
  "city"
> & {
  countryCodeField?: Path<T>;
  stateCodeField?: Path<T>;
  cityProps?: {
    onValueChange?: (value: string, meta?: { name: string }) => void;
  };
};

export type FormFieldConfig<T extends FieldValues> =
  | TextLikeFieldConfig<T>
  | TextareaFieldConfig<T>
  | SelectFieldConfig<T>
  | MultiSelectFieldConfig<T>
  | RadioFieldConfig<T>
  | CheckboxFieldConfig<T>
  | FileFieldConfig<T>
  | PhoneFieldConfig<T>
  | CountryFieldConfig<T>
  | StateFieldConfig<T>
  | CityFieldConfig<T>;

export type StepConfig<T extends FieldValues> = {
  step: number;
  title: string;
  description?: string;
  fields: FormFieldConfig<T>[];
};

export type RenderFieldProps<T extends FieldValues> = {
  fieldConfig: FormFieldConfig<T>;
  control: Control<T>;
  form: UseFormReturn<T>;
};

export type StepperFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  steps: StepConfig<T>[];
  onSubmit: SubmitHandler<T>;
  title?: string;
  description?: string;
  submitLabel?: string;
  gridClassName?: string;
  updateLabel?: string;
  nextLabel?: string;
  backLabel?: string;
  isEdit?: boolean;
  isSubmitting?: boolean;
  renderField?: (props: RenderFieldProps<T>) => ReactNode;
  renderUncommonField?: (props: RenderFieldProps<T>) => ReactNode;
  onStepChange?: (step: number) => void;
  validateStep?: boolean;
  containerClassName?: string;
};

export type ControlledFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  className?: string;
  classNames?: FieldClassNames;
  style?: CSSProperties;
  variant?: FieldVariant;
  size?: FieldSize;
  radius?: FieldRadius;
};
