"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { getCountries } from "@countrystatecity/countries-browser";
import { useController, type FieldValues } from "react-hook-form";
import type { ControlledFieldProps } from "./form";
import { FieldWrapper } from "./field-wrapper";
import { cn } from "./cn";
import { triggerVariants } from "./variants";
import { useOutsideClick } from "./use-outside-click";

export type CountryOption = {
  name: string;
  iso2: string;
};

type Props<T extends FieldValues> = ControlledFieldProps<T> & {
  countryProps?: {
    onValueChange?: (value: string, country?: CountryOption) => void;
  };
};

export function CountrySelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select country",
  required,
  disabled,
  description,
  className,
  classNames,
  variant,
  size,
  radius,
  countryProps,
}: Props<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(wrapperRef, () => setOpen(false));

  useEffect(() => {
    let mounted = true;

    const loadCountries = async () => {
      try {
        const data = await getCountries();
        if (!mounted) return;

        const formatted = data
          .map((item) => ({ name: item.name, iso2: item.iso2 }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formatted);
      } catch (error) {
        console.error("Failed to load countries", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCountries();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return countries;
    const q = search.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(q) ||
        country.iso2.toLowerCase().includes(q),
    );
  }, [countries, search]);

  const selected = countries.find((country) => country.iso2 === field.value);

  return (
    <FieldWrapper
      label={label}
      required={required}
      description={description}
      error={error?.message}
      className={className}
      classNames={classNames}
    >
      <div ref={wrapperRef} className="relative">
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            triggerVariants({
              variant: error ? "error" : variant,
              size,
              radius,
            }),
            classNames?.trigger,
          )}
        >
          <span className={cn(!selected && "text-zinc-400")}>
            {loading ? "Loading countries..." : selected?.name || placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-zinc-500 transition",
              open && "rotate-180",
            )}
          />
        </button>

        {open && !(disabled || loading) && (
          <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full rounded-lg border border-zinc-200 bg-white p-2 shadow-lg">
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country"
                className="h-10 w-full rounded-md text-black border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100"
              />
            </div>

            <div className="max-h-64 overflow-y-auto">
              {filtered.map((country) => {
                const active = field.value === country.iso2;

                return (
                  <button
                    key={country.iso2}
                    type="button"
                    onClick={() => {
                      field.onChange(country.iso2);
                      countryProps?.onValueChange?.(country.iso2, country);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between text-black rounded-md px-3 py-2 text-left text-sm transition hover:bg-zinc-100",
                      active && "bg-zinc-100",
                    )}
                  >
                    <span>{country.name}</span>
                    {active ? <Check className="h-4 w-4" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
