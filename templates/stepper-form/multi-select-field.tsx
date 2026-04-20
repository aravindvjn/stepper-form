"use client";

import { useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { useController, type FieldValues } from "react-hook-form";
import type { ControlledFieldProps, Option } from "./form";
import { FieldWrapper } from "./field-wrapper";
import { cn } from "./cn";
import { triggerVariants } from "./variants";
import { useOutsideClick } from "./use-outside-click";

type Props<T extends FieldValues> = ControlledFieldProps<T> & {
  options?: Option[];
  selectProps?: {
    searchable?: boolean;
    emptyText?: string;
  };
};

export function MultiSelectField<T extends FieldValues>({
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
  options = [],
  selectProps,
}: Props<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(wrapperRef, () => setOpen(false));

  const value: string[] = Array.isArray(field.value) ? field.value : [];
  const selected = options.filter((item) => value.includes(item.value));

  const filtered = useMemo(() => {
    if (!selectProps?.searchable || !search.trim()) return options;
    const q = search.toLowerCase();

    return options.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q),
    );
  }, [options, search, selectProps?.searchable]);

  const toggleValue = (nextValue: string) => {
    if (value.includes(nextValue)) {
      field.onChange(value.filter((item) => item !== nextValue));
      return;
    }

    field.onChange([...value, nextValue]);
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
      <div ref={wrapperRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setOpen((prev) => !prev)}
          disabled={disabled}
          className={cn(
            triggerVariants({
              variant: error ? "error" : variant,
              size,
              radius,
            }),
            classNames?.trigger,
          )}
        >
          <div className="flex flex-1 flex-wrap gap-1.5">
            {selected.length > 0 ? (
              selected.map((item) => (
                <span
                  key={item.value}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700"
                >
                  {item.label}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleValue(item.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleValue(item.value);
                      }
                    }}
                    className="cursor-pointer text-zinc-500 hover:text-zinc-800"
                  >
                    <X className="h-3 w-3" />
                  </span>
                </span>
              ))
            ) : (
              <span className="text-zinc-400">
                {placeholder || "Select options"}
              </span>
            )}
          </div>

          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-zinc-500 transition",
              open && "rotate-180",
            )}
          />
        </button>

        {open && !disabled && (
          <div
            className={cn(
              "absolute left-0 top-[calc(100%+8px)] z-50 w-full rounded-lg border border-zinc-200 bg-white p-2 shadow-lg",
              classNames?.dropdown,
            )}
          >
            {selectProps?.searchable ? (
              <div className="relative mb-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="h-10 w-full rounded-md text-black border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100"
                />
              </div>
            ) : null}

            <div className="max-h-64 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((opt) => {
                  const isSelected = value.includes(opt.value);

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => !opt.disabled && toggleValue(opt.value)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-black transition hover:bg-zinc-100",
                        isSelected && "bg-zinc-100",
                        opt.disabled && "cursor-not-allowed opacity-50",
                        classNames?.option,
                      )}
                    >
                      <span>{opt.label}</span>
                      {isSelected ? <Check className="h-4 w-4" /> : null}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-sm text-zinc-500">
                  {selectProps?.emptyText || "No options found"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
