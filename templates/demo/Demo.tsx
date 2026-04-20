"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { StepConfig } from "../stepper-form";
import { StepperForm } from "../stepper-form";

export const demoSchema = z.object({
  text_input: z.string().min(1, "Text input is required"),
  email_input: z.string().email("Enter a valid email"),
  password_input: z.string().min(6, "Password must be at least 6 characters"),
  number_input: z.coerce.number().min(1, "Number must be at least 1"),
  date_input: z.string().min(1, "Date is required"),
  tel_input: z.string().min(1, "Phone number is required"),
  textarea_input: z.string().min(1, "Textarea is required"),
  select_input: z.string().min(1, "Select an option"),
  multi_select_input: z.array(z.string()).min(1, "Select at least one option"),
  radio_input: z.string().min(1, "Select one radio option"),
  checkbox_input: z.boolean().optional(),
  file_input: z.any().optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
});

export type DemoFormInput = z.input<typeof demoSchema>;
export type DemoFormValues = z.output<typeof demoSchema>;

const steps: StepConfig<DemoFormInput>[] = [
  {
    step: 1,
    title: "Basic Inputs",
    fields: [
      {
        name: "text_input",
        label: "Text Input",
        type: "text",
        placeholder: "Enter some text",
        required: true,
        variant: "default",
        inputProps: {
          maxLength: 100,
        },
      },
      {
        name: "email_input",
        label: "Email Input",
        type: "email",
        placeholder: "Enter your email",
        required: true,
        variant: "filled",
      },
      {
        name: "password_input",
        label: "Password Input",
        type: "password",
        placeholder: "Enter password",
        required: true,
      },
      {
        name: "number_input",
        label: "Number Input",
        type: "number",
        placeholder: "Enter a number",
        required: true,
        inputProps: {
          min: 1,
          max: 10,
        },
      },
      {
        name: "date_input",
        label: "Date Input",
        type: "date",
        required: true,
      },
      {
        name: "tel_input",
        label: "Phone Input",
        type: "tel",
        placeholder: "Enter phone number",
        required: true,
        phoneProps: {
          defaultCountryCode: "+91",
          searchable: true,
          inputProps: {
            maxLength: 15,
          },
        },
      },
    ],
  },
  {
    step: 2,
    title: "Advanced Inputs",
    fields: [
      {
        name: "textarea_input",
        label: "Textarea Input",
        type: "textarea",
        placeholder: "Write something here",
        required: true,
        colSpan: 2,
        textareaProps: {
          rows: 5,
        },
      },
      {
        name: "select_input",
        label: "Select Input",
        type: "select",
        placeholder: "Choose one option",
        required: true,
        selectProps: {
          searchable: true,
        },
        options: [
          { label: "Option One", value: "one" },
          { label: "Option Two", value: "two" },
          { label: "Option Three", value: "three" },
        ],
      },
      {
        name: "multi_select_input",
        label: "Multi Select Input",
        type: "multi-select",
        placeholder: "Choose multiple options",
        required: true,
        selectProps: {
          searchable: true,
        },
        options: [
          { label: "React", value: "react" },
          { label: "Next.js", value: "nextjs" },
          { label: "TypeScript", value: "typescript" },
          { label: "Node.js", value: "nodejs" },
        ],
      },
      {
        name: "radio_input",
        label: "Radio Input",
        type: "radio",
        required: true,
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "Maybe", value: "maybe" },
        ],
      },
      {
        name: "checkbox_input",
        label: "Checkbox Input",
        type: "checkbox",
        checkboxLabel: "I agree to the terms",
      },
      {
        name: "file_input",
        label: "File Input",
        type: "file",
        accept: ".pdf,.png,.jpg,.jpeg,.doc,.docx",
        description: "Supported: PDF, PNG, JPG, DOC, DOCX",
        fileProps: {
          multiple: false,
        },
      },
    ],
  },
  {
    step: 3,
    title: "Location",
    fields: [
      {
        name: "country",
        label: "Country",
        type: "country",
        required: true,
      },
      {
        name: "state",
        label: "State",
        type: "state",
        required: true,
        countryCodeField: "country",
      },
      {
        name: "city",
        label: "City",
        type: "city",
        required: true,
        countryCodeField: "country",
        stateCodeField: "state",
      },
    ],
  },
];

export default function DemoPage() {
  const form = useForm<DemoFormInput, any, DemoFormValues>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      text_input: "",
      email_input: "",
      password_input: "",
      number_input: 1,
      date_input: "",
      tel_input: "",
      textarea_input: "",
      select_input: "",
      multi_select_input: [],
      radio_input: "",
      checkbox_input: false,
      file_input: undefined,
      country: "",
      state: "",
      city: "",
    },
    mode: "onChange",
  });

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10">
      <StepperForm<DemoFormInput>
        form={form}
        steps={steps}
        title="All Input Types Demo"
        description="A reusable package-friendly stepper form with separate input components"
        submitLabel="Submit Demo"
        nextLabel="Continue"
        backLabel="Previous"
        onSubmit={(values) => {
          console.log("submitted values", values);
          alert(JSON.stringify(values, null, 2));
        }}
      />
    </div>
  );
}
