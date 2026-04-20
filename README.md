# @aravindvjn/stepper-form

A CLI to generate a fully reusable, config-driven stepper form system for React / Next.js apps.

Build complex multi-step forms faster using React Hook Form, Zod, Tailwind, and CVA — without writing boilerplate.

---

## ✨ Features

- Config-driven stepper form
- Separate reusable field components
- React Hook Form + Zod ready
- Tailwind + tailwind-merge + CVA variants
- Searchable select & multi-select
- Country / State / City fields
- Fully extensible architecture
- CLI-based setup (similar to shadcn)

---

## 🚀 Usage

Run directly with npx:

```bash
npx @aravindvjn/stepper-form init
```

With demo:

```bash
npx @aravindvjn/stepper-form init --demo
```

Custom path:

```bash
npx @aravindvjn/stepper-form init --path components/custom-stepper
```


---

## 📁 What it generates

Automatically detects your project structure:

| Project Structure | Output Folder |
|---|---|
| `src/components` exists | `src/components/stepper-form` |
| `components` exists | `components/stepper-form` |
| none | `src/components/stepper-form` |

---

## 📦 Install dependencies

After running the CLI:

```bash
npm install react-hook-form zod @hookform/resolvers class-variance-authority clsx tailwind-merge lucide-react @countrystatecity/countries-browser 
```

(or pnpm / yarn will be suggested automatically)

---

## 🧑‍💻 Usage Example

### 1. Import

```ts
import { StepperForm } from "@/components/stepper-form";
```

### 2. Create schema

```ts
import { z } from "zod";

export const schema = z.object({
  full_name: z.string().min(1, "Required"),
  email: z.string().email(),
  skills: z.array(z.string()).min(1),
});
```

### 3. Create steps config

```ts
const steps = [
  {
    step: 1,
    title: "Basic Details",
    fields: [
      {
        name: "full_name",
        label: "Full Name",
        type: "text",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
      },
    ],
  },
  {
    step: 2,
    title: "Skills",
    fields: [
      {
        name: "skills",
        label: "Skills",
        type: "multi-select",
        required: true,
        options: [
          { label: "React", value: "react" },
          { label: "Next.js", value: "nextjs" },
          { label: "TypeScript", value: "ts" },
        ],
        selectProps: {
          searchable: true,
        },
      },
    ],
  },
];
```

### 4. Use StepperForm

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {
    full_name: "",
    email: "",
    skills: [],
  },
});

<StepperForm
  form={form}
  steps={steps}
  title="Example Form"
  description="Reusable stepper form"
  onSubmit={(values) => {
    console.log(values);
  }}
/>;
```

---

## 🧩 Supported Field Types

- `text`
- `email`
- `password`
- `number`
- `date`
- `textarea`
- `select`
- `multi-select`
- `checkbox`
- `radio`
- `file`
- `tel`
- `country`
- `state`
- `city`

---

## 🎨 Variants

All fields support:

```ts
variant: "default" | "filled" | "ghost" | "error";
size: "sm" | "md" | "lg";
radius: "sm" | "md" | "lg";
```

---

## 🧱 Architecture

- **StepperForm** → handles steps and navigation
- **FormRenderer** → renders fields dynamically
- **Field components** → reusable independently
- **Config** → drives everything

---

## 🔧 Customization

You can:

- Override fields using `renderField`
- Inject custom UI
- Extend field types
- Modify variants
- Use fields independently

---

## 📸 Demo

Generate demo:

```bash
npx @aravindvjn/stepper-form init --demo
```

---

## 🛠 Roadmap

- [ ] Interactive CLI (like shadcn)
- [ ] Add/remove components individually
- [ ] Theme support
- [ ] Validation presets
- [ ] Form builder UI

---

## 🤝 Contributing

PRs and ideas are welcome.

---

## 📄 License

Aravind Vijayan