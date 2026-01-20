# Next.js 15+ Patterns Skill

## Triggers
- Next.js, App Router, RSC, server component, client component, routing

## App Router Patterns

### Server vs Client Components
```tsx
// Server Component (default) - src/app/page.tsx
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Component - src/components/counter.tsx
"use client";
import { useState } from "react";
export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### When to Use Client Components
- useState, useEffect, or other hooks
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)
- Third-party libraries requiring client-side

### Data Fetching
```tsx
// Server Component with async
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <main>{/* render data */}</main>;
}
```

### Route Handlers
```tsx
// src/app/api/users/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ users: [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ created: body });
}
```

### Layouts and Templates
```tsx
// src/app/layout.tsx - Shared across routes
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// src/app/(dashboard)/layout.tsx - Group-specific layout
export default function DashboardLayout({ children }) {
  return <div className="dashboard">{children}</div>;
}
```

### Loading and Error States
```tsx
// src/app/loading.tsx
export default function Loading() {
  return <Skeleton />;
}

// src/app/error.tsx
"use client";
export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

## Rules
- Default to Server Components
- Add "use client" only when necessary
- Keep client components small and leaf-level
- Use route groups for organization: (auth), (dashboard)
- Colocate related files in route folders
