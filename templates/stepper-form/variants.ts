import { cva } from "class-variance-authority";

export const inputVariants = cva(
  [
    "flex w-full rounded-md border outline-none transition",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "placeholder:text-zinc-400",
    "focus:ring-4",
  ],
  {
    variants: {
      variant: {
        default:
          "border-zinc-200 bg-white text-zinc-900 focus:border-zinc-300 focus:ring-zinc-100",
        filled:
          "border-zinc-200 bg-zinc-50 text-zinc-900 focus:border-zinc-300 focus:ring-zinc-100",
        ghost:
          "border-transparent bg-zinc-100 text-zinc-900 focus:border-zinc-300 focus:ring-zinc-100",
        error:
          "border-red-300 bg-white text-zinc-900 focus:border-red-400 focus:ring-red-100",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
      radius: {
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      radius: "md",
    },
  },
);

export const textareaVariants = cva(
  [
    "flex w-full border outline-none transition resize-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "placeholder:text-zinc-400",
    "focus:ring-4",
  ],
  {
    variants: {
      variant: {
        default:
          "border-zinc-200 bg-white text-zinc-900 focus:border-zinc-300 focus:ring-zinc-100",
        filled:
          "border-zinc-200 bg-zinc-50 text-zinc-900 focus:border-zinc-300 focus:ring-zinc-100",
        ghost:
          "border-transparent bg-zinc-100 text-zinc-900 focus:border-zinc-300 focus:ring-zinc-100",
        error:
          "border-red-300 bg-white text-zinc-900 focus:border-red-400 focus:ring-red-100",
      },
      size: {
        sm: "min-h-[90px] px-3 py-2 text-sm",
        md: "min-h-[110px] px-3 py-2.5 text-sm",
        lg: "min-h-[140px] px-4 py-3 text-base",
      },
      radius: {
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      radius: "md",
    },
  },
);

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-zinc-900 text-white hover:bg-zinc-800",
        secondary:
          "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
        ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100",
      },
      size: {
        sm: "h-9 rounded-md px-3 text-sm",
        md: "h-10 rounded-md px-4 text-sm",
        lg: "h-11 rounded-lg px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export const triggerVariants = cva(
  [
    "flex w-full items-center justify-between gap-2 border text-left outline-none transition",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "focus:ring-4",
  ],
  {
    variants: {
      variant: {
        default:
          "border-zinc-200 bg-white text-zinc-900 focus:border-zinc-300 focus:ring-zinc-100",
        filled:
          "border-zinc-200 bg-zinc-50 text-zinc-900 focus:border-zinc-300 focus:ring-zinc-100",
        ghost:
          "border-transparent bg-zinc-100 text-zinc-900 focus:border-zinc-300 focus:ring-zinc-100",
        error:
          "border-red-300 bg-white text-zinc-900 focus:border-red-400 focus:ring-red-100",
      },
      size: {
        sm: "min-h-9 px-3 py-2 text-sm",
        md: "min-h-11 px-3 py-2 text-sm",
        lg: "min-h-12 px-4 py-3 text-base",
      },
      radius: {
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      radius: "md",
    },
  },
);
