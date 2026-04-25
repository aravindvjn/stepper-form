"use client";

import React, { useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";
import type { StepperFormProps } from "./form";
import { cn } from "./cn";
import { Button } from "./button";
import { FormRenderer } from "./form-renderer";

export function StepperForm<T extends FieldValues>({
  form,
  steps,
  onSubmit,
  title,
  description,
  submitLabel = "Submit",
  updateLabel = "Update",
  nextLabel = "Next",
  backLabel = "Back",
  isEdit = false,
  isSubmitting = false,
  renderField,
  renderUncommonField,
  onStepChange,
  validateStep = true,
  containerClassName,
  gridClassName,
}: StepperFormProps<T>) {
  const [currentStep, setCurrentStep] = useState(1);

  const currentStepConfig = useMemo(
    () => steps.find((item) => item.step === currentStep),
    [steps, currentStep],
  );

  const isLastStep = currentStep === steps.length;

  const goToStep = (step: number) => {
    setCurrentStep(step);
    onStepChange?.(step);
  };

  const nextStep = async () => {
    if (!currentStepConfig) return;

    if (validateStep) {
      const fieldNames = currentStepConfig.fields.map((item) => item.name);
      const valid = await form.trigger(fieldNames);
      if (!valid) return;
    }

    if (isLastStep) {
      await form.handleSubmit(onSubmit)();
      return;
    }

    goToStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-5xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm",
        containerClassName,
      )}
    >
      {(title || description) && (
        <div className="mb-6">
          {title ? (
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              {title}
            </h2>
          ) : null}

          {description ? (
            <p className="mt-2 text-sm text-zinc-500">{description}</p>
          ) : null}
        </div>
      )}

      <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-1">
        {steps.map((step, index) => {
          const active = currentStep === step.step;
          const completed = currentStep > step.step;

          return (
            <React.Fragment key={step.step}>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition",
                    completed && "border-zinc-900 bg-zinc-900 text-white",
                    active && "border-zinc-900 bg-zinc-900 text-white",
                    !completed &&
                      !active &&
                      "border-zinc-300 bg-white text-zinc-500",
                  )}
                >
                  {completed ? "✓" : step.step}
                </div>

                <span
                  className={cn(
                    "whitespace-nowrap text-sm font-medium",
                    active || completed ? "text-zinc-900" : "text-zinc-500",
                  )}
                >
                  {step.title}
                </span>
              </div>

              {index !== steps.length - 1 ? (
                <div className="h-px w-10 shrink-0 bg-zinc-200" />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          className={cn(
            "grid gap-5  grid-cols-1 md:grid-cols-2",
            gridClassName,
          )}
        >
          {currentStepConfig?.fields.map((fieldConfig) => {
            const widthStyle =
              fieldConfig.colSpan === 2
                ? { gridColumn: "span 2 / span 2" as const }
                : undefined;

            if (fieldConfig.isUncommon && renderUncommonField) {
              return (
                <div key={String(fieldConfig.name)} style={widthStyle}>
                  {renderUncommonField({
                    fieldConfig,
                    control: form.control,
                    form,
                  })}
                </div>
              );
            }

            if (renderField) {
              return (
                <div key={String(fieldConfig.name)} style={widthStyle}>
                  {renderField({
                    fieldConfig,
                    control: form.control,
                    form,
                  })}
                </div>
              );
            }

            return (
              <div key={String(fieldConfig.name)} style={widthStyle}>
                <FormRenderer
                  fieldConfig={fieldConfig}
                  control={form.control}
                  form={form}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={prevStep}
              disabled={isSubmitting}
            >
              {backLabel}
            </Button>
          ) : null}

          <Button type="button" onClick={nextStep} disabled={isSubmitting}>
            {isSubmitting
              ? "Please wait..."
              : isLastStep
                ? isEdit
                  ? updateLabel
                  : submitLabel
                : nextLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StepperForm;
