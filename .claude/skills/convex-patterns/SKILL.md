# Convex Patterns Skill

## Triggers
- Convex, queries, mutations, actions, database, real-time, schema

## Schema Definition
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
  }).index("by_email", ["email"]),

  messages: defineTable({
    userId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
```

## Queries (Read Data)
```typescript
// convex/messages.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(50);
  },
});
```

## Mutations (Write Data)
```typescript
// convex/messages.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    content: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      content: args.content,
      userId: args.userId,
      createdAt: Date.now(),
    });
  },
});
```

## Actions (External APIs, Side Effects)
```typescript
// convex/ai.ts
import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateResponse = action({
  args: { prompt: v.string() },
  handler: async (ctx, args) => {
    const response = await fetch("https://api.example.com/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: args.prompt }),
    });
    return await response.json();
  },
});
```

## React Hooks
```tsx
// Client Component
"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function MessageList({ userId }) {
  const messages = useQuery(api.messages.list, { userId });
  const createMessage = useMutation(api.messages.create);

  if (messages === undefined) return <Loading />;

  return (
    <div>
      {messages.map(m => <Message key={m._id} message={m} />)}
      <button onClick={() => createMessage({ content: "Hello", userId })}>
        Send
      </button>
    </div>
  );
}
```

## Authentication
```typescript
// convex/messages.ts
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: { content: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("messages", {
      content: args.content,
      userId,
      createdAt: Date.now(),
    });
  },
});
```

## Rules
- Always validate auth in mutations/actions
- Use indexes for query performance
- Keep functions small and focused
- Use actions only for external APIs
- Real-time by default - no manual refresh needed
