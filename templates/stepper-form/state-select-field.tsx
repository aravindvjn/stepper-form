"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { getStatesOfCountry } from "@countrystatecity/countries-browser";
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

export type StateOption = {
  name: string;
  iso2: string;
  countryCode: string;
};

type Props<T extends FieldValues> = ControlledFieldProps<T> & {
  countryCodeField?: Path<T>;
  stateProps?: {
    onValueChange?: (value: string, state?: StateOption) => void;
  };
};

export function StateSelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select state",
  required,
  disabled,
  description,
  className,
  classNames,
  variant,
  size,
  radius,
  countryCodeField,
  stateProps,
}: Props<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  const countryCode = useWatch({
    control,
    name: countryCodeField as Path<T>,
  }) as string | undefined;

  const [states, setStates] = useState<StateOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(wrapperRef, () => setOpen(false));

  useEffect(() => {
    let mounted = true;

    const loadStates = async () => {
      if (!countryCode) {
        setStates([]);
        return;
      }

      setLoading(true);

      try {
        const data = await getStatesOfCountry(countryCode);
        if (!mounted) return;

        const formatted = data
          .map((item) => ({
            name: item.name,
            iso2: item.iso2,
            countryCode: item.country_code,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setStates(formatted);
      } catch (error) {
        console.error("Failed to load states", error);
        if (mounted) setStates([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadStates();
    return () => {
      mounted = false;
    };
  }, [countryCode]);

  const filtered = useMemo(() => {
    if (!search.trim()) return states;
    const q = search.toLowerCase();
    return states.filter(
      (state) =>
        state.name.toLowerCase().includes(q) ||
        state.iso2.toLowerCase().includes(q),
    );
  }, [states, search]);

  const selected = states.find((state) => state.iso2 === field.value);

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
          disabled={disabled || loading || !countryCode}
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
            {!countryCode
              ? "Select country first"
              : loading
                ? "Loading states..."
                : selected?.name || placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-zinc-500 transition",
              open && "rotate-180",
            )}
          />
        </button>

        {open && !(disabled || loading || !countryCode) && (
          <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full rounded-lg border border-zinc-200 bg-white p-2 shadow-lg">
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search state"
                className="h-10 w-full rounded-md text-black border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100"
              />
            </div>

            <div className="max-h-64 overflow-y-auto">
              {filtered.map((state) => {
                const active = field.value === state.iso2;

                return (
                  <button
                    key={state.iso2}
                    type="button"
                    onClick={() => {
                      field.onChange(state.iso2);
                      stateProps?.onValueChange?.(state.iso2, state);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition text-black hover:bg-zinc-100",
                      active && "bg-zinc-100",
                    )}
                  >
                    <span>{state.name}</span>
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
