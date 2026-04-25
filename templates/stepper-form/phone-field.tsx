"use client";

import { useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { useController, type FieldValues } from "react-hook-form";
import type { ControlledFieldProps } from "./form";
import { FieldWrapper } from "./field-wrapper";
import { Input } from "./input";
import { cn } from "./cn";
import { triggerVariants } from "./variants";
import { useOutsideClick } from "./use-outside-click";
import { COUNTRY_CODES, getFlagEmoji } from "./country-code";

type Props<T extends FieldValues> = ControlledFieldProps<T> & {
  phoneProps?: {
    defaultCountryCode?: string;
    searchable?: boolean;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  };
};

export function PhoneField<T extends FieldValues>({
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
  phoneProps,
}: Props<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(wrapperRef, () => setOpen(false));

  const rawValue = typeof field.value === "string" ? field.value : "";
  const defaultCode = phoneProps?.defaultCountryCode || "+91";

  const selectedCode = rawValue.includes("|") ? rawValue.split("|")[0] : defaultCode;
  const phoneNumber = rawValue.includes("|") ? rawValue.split("|")[1] : rawValue;

  const filteredCountries = useMemo(() => {
    if (!phoneProps?.searchable || !search.trim()) return COUNTRY_CODES;
    const query = search.toLowerCase();
    return COUNTRY_CODES.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.dialCode.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query),
    );
  }, [search, phoneProps?.searchable]);

  const selectedCountry =
    COUNTRY_CODES.find((country) => country.dialCode === selectedCode) || null;

  const handleChange = (dialCode: string, number: string) => {
    field.onChange(`${dialCode}|${number}`);
  };

  return (
    <FieldWrapper
      label={label}
      required={required}
      description={description}
      error={error?.message}
      className={className}
      classNames={classNames}
    >
      <div className="flex w-full gap-2">
        <div ref={wrapperRef} className="relative w-[100px] shrink-0">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setOpen((prev) => !prev);
              setSearch("");
            }}
            className={cn(
              triggerVariants({ variant: error ? "error" : variant, size, radius }),
              classNames?.trigger,
            )}
          >
            <span className="flex min-w-0 items-center gap-2 overflow-hidden">
              <span className="text-base leading-none">
                {getFlagEmoji(selectedCountry?.flag || "IN")}
              </span>
              <span className="truncate text-sm">
                {selectedCountry?.dialCode || selectedCode}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500" />
          </button>

          {open && !disabled && (
            <div
              className={cn(
                "absolute left-0 top-[calc(100%+8px)] z-50 w-65 md:w-[320px] rounded-lg border border-zinc-200 bg-white p-2 shadow-lg",
                classNames?.dropdown,
              )}
            >
              {phoneProps?.searchable ? (
                <div className="relative mb-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search country or code"
                    className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100"
                    autoFocus
                  />
                </div>
              ) : null}

              <div className="max-h-64 overflow-y-auto">
                {filteredCountries.map((country) => {
                  const isSelected = selectedCode === country.dialCode;

                  return (
                    <button
                      key={`${country.code}-${country.dialCode}`}
                      type="button"
                      onClick={() => {
                        handleChange(country.dialCode, phoneNumber);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition hover:bg-zinc-100",
                        isSelected && "bg-zinc-100",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="text-base leading-none">
                          {getFlagEmoji(country.flag)}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-zinc-800">
                            {country.name}
                          </span>
                          <span className="block text-xs text-zinc-500">
                            {country.dialCode}
                          </span>
                        </span>
                      </span>

                      {isSelected ? <Check className="h-4 w-4 text-zinc-900" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <Input
          {...phoneProps?.inputProps}
          type="tel"
          value={phoneNumber}
          onChange={(e) => handleChange(selectedCode, e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          variant={error ? "error" : variant}
          size={size}
          radius={radius}
          className={classNames?.input}
        />
      </div>
    </FieldWrapper>
  );
}