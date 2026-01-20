# Tailwind CSS 4 + shadcn/ui Patterns Skill

## Triggers
- Tailwind, shadcn, styling, UI, components, theme

## Configuration
This project uses:
- Tailwind CSS 4.x
- shadcn/ui (new-york style)
- Base color: neutral
- Icon library: lucide-react
- Font: Inter

## Utility Function
```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Using shadcn/ui Components
```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Email" type="email" />
        <Input placeholder="Password" type="password" />
        <Button className="w-full">Sign In</Button>
      </CardContent>
    </Card>
  );
}
```

## Adding New Components
```bash
bunx shadcn@latest add [component-name]
```

Available components: accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, combobox, command, context-menu, data-table, date-picker, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toggle, toggle-group, tooltip

## Common Patterns

### Responsive Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id}>{item.name}</Card>)}
</div>
```

### Conditional Styling
```tsx
<Button
  variant={isActive ? "default" : "outline"}
  className={cn("w-full", disabled && "opacity-50")}
>
  Submit
</Button>
```

### Dark Mode
```tsx
// Automatic with next-themes
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">Subtle text</p>
</div>
```

## CSS Variables
Access theme colors via CSS variables defined in globals.css:
- `--background`, `--foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`
- `--border`, `--input`, `--ring`

## Rules
- Use `cn()` for conditional classes
- Prefer shadcn/ui components over custom
- Use CSS variables for theming
- Keep component styling consistent
- Use Tailwind utilities, avoid custom CSS
