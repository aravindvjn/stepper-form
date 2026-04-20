"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { getCitiesOfState } from "@countrystatecity/countries-browser";
import {
  useController,
  useWatch,
  type FieldValues,
  type Path,
} from "react-hook-form";
import type { ControlledFieldProps } from "./form";
import { FieldWrapper } from "./field-wrapper";
import { cn } from "./cn";
import { triggerVariants } from "./variants";
import { useOutsideClick } from "./use-outside-click";

export type CityOption = {
  name: string;
};

type Props<T extends FieldValues> = ControlledFieldProps<T> & {
  countryCodeField?: Path<T>;
  stateCodeField?: Path<T>;
  cityProps?: {
    onValueChange?: (value: string, city?: CityOption) => void;
  };
};

export function CitySelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select city",
  required,
  disabled,
  description,
  className,
  classNames,
  variant,
  size,
  radius,
  countryCodeField,
  stateCodeField,
  cityProps,
}: Props<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  const countryCode = useWatch({
    control,
    name: countryCodeField as Path<T>,
  }) as string | undefined;

  const stateCode = useWatch({
    control,
    name: stateCodeField as Path<T>,
  }) as string | undefined;

  const [cities, setCities] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(wrapperRef, () => setOpen(false));

  useEffect(() => {
    let mounted = true;

    const loadCities = async () => {
      if (!countryCode || !stateCode) {
        setCities([]);
        return;
      }

      setLoading(true);

      try {
        const data = await getCitiesOfState(countryCode, stateCode);
        if (!mounted) return;

        const formatted = data
          .map((item) => ({ name: item.name }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCities(formatted);
      } catch (error) {
        console.error("Failed to load cities", error);
        if (mounted) setCities([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCities();
    return () => {
      mounted = false;
    };
  }, [countryCode, stateCode]);

  const filtered = useMemo(() => {
    if (!search.trim()) return cities;
    const q = search.toLowerCase();
    return cities.filter((city) => city.name.toLowerCase().includes(q));
  }, [cities, search]);

  const selected = cities.find((city) => city.name === field.value);

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
          disabled={disabled || loading || !countryCode || !stateCode}
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
            {!countryCode || !stateCode
              ? "Select state first"
              : loading
                ? "Loading cities..."
                : selected?.name || placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-zinc-500 transition",
              open && "rotate-180",
            )}
          />
        </button>

        {open && !(disabled || loading || !countryCode || !stateCode) && (
          <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full rounded-lg border border-zinc-200 bg-white p-2 shadow-lg">
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city"
                className="h-10 w-full rounded-md text-black border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100"
              />
            </div>

            <div className="max-h-64 overflow-y-auto">
              {filtered.map((city) => {
                const active = field.value === city.name;

                return (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() => {
                      field.onChange(city.name);
                      cityProps?.onValueChange?.(city.name, city);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center text-black justify-between rounded-md px-3 py-2 text-left text-sm transition hover:bg-zinc-100",
                      active && "bg-zinc-100",
                    )}
                  >
                    <span>{city.name}</span>
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
