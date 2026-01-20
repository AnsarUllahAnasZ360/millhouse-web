# Excalidraw Collab - System Design Document

**Version:** 2.0
**Date:** January 2026
**Project:** Self-hosted Excalidraw collaborative whiteboard
**Domain:** collab.zikrainfotech.com
**Team Size:** 60 members

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Goals and Non-Goals](#2-goals-and-non-goals)
3. [Architecture Overview](#3-architecture-overview)
4. [Technology Stack](#4-technology-stack)
5. [Wrapper Strategy](#5-wrapper-strategy)
6. [Data Model](#6-data-model)
7. [Real-time Collaboration](#7-real-time-collaboration)
8. [Authentication](#8-authentication)
9. [File Structure](#9-file-structure)
10. [Data Flow](#10-data-flow)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment](#12-deployment)
13. [Success Criteria](#13-success-criteria)
14. [Task Breakdown](#14-task-breakdown)
15. [Risk Assessment](#15-risk-assessment)

---

## 1. Problem Statement

### 1.1 Current Situation

Zikrainfotech has a 60-person team that needs a collaborative whiteboard tool for:
- Brainstorming sessions
- Technical diagrams and architecture planning
- Visual collaboration across remote team members
- Document review and annotation

### 1.2 Why Not Use Excalidraw.com?

- **Data ownership**: Company data should stay on company infrastructure
- **Privacy**: No third-party access to sensitive diagrams
- **Customization**: Ability to customize for company workflows
- **Cost**: Free self-hosted vs paid Excalidraw+ ($7/user/month = $420/month)

### 1.3 Core Problem

Build a self-hosted Excalidraw platform that provides:
1. Real-time collaboration (multiple users editing the same canvas)
2. User authentication (Google OAuth, invite-only)
3. Scene management (create, save, organize, share)
4. Zero modifications to Excalidraw source code (wrapper pattern)

### 1.4 Critical Technical Constraint

**Excalidraw requires 30fps cursor synchronization (33ms intervals).**

This is a hard requirement from the Excalidraw codebase:
```typescript
// excalidraw-app/app_constants.ts
export const CURSOR_SYNC_TIMEOUT = 33; // ~30fps
```

This means ANY real-time backend must support:
- High-frequency updates (30 times per second per active user)
- Low latency (<100ms round-trip)
- Fire-and-forget messaging (volatile/lossy acceptable for cursors)

---

## 2. Goals and Non-Goals

### 2.1 Goals (Must Have)

| # | Goal | Success Metric |
|---|------|---------------|
| G1 | Real-time collaboration | 2+ users can draw simultaneously, see each other's cursors within 100ms |
| G2 | Google OAuth authentication | Team members can sign in with @zikrainfotech.com Google accounts |
| G3 | Invite-only access | Only invited users can access the platform |
| G4 | Scene persistence | Drawings auto-save and persist across sessions |
| G5 | Scene organization | Users can create collections/folders to organize scenes |
| G6 | Share links | Generate view-only links for stakeholders |
| G7 | Comments | Add comments to specific points on a scene |
| G8 | Activity logs | Track who edited what and when |
| G9 | Zero Excalidraw modifications | All features via wrapper pattern only |

### 2.2 Non-Goals (Explicitly Not Building)

| # | Non-Goal | Reason |
|---|----------|--------|
| NG1 | Voice/video hangouts | Out of scope, use existing tools (Meet, Zoom) |
| NG2 | Screen sharing | Out of scope |
| NG3 | Presentation mode | Out of scope |
| NG4 | Mobile app | Web-only for now |
| NG5 | Offline mode | Adds complexity, can be added later |
| NG6 | Version history/undo across saves | Complex, can be added later |

### 2.3 Constraints

| Constraint | Reason |
|------------|--------|
| Zero cost for hosting (or minimal) | Bootstrap constraint |
| 60 users maximum | Company size |
| No modifications to Excalidraw source | Maintainability |
| Must use existing auth providers | No custom auth system |

---

## 3. Architecture Overview

### 3.1 Why Hybrid Architecture?

**Critical Discovery:** After researching, Convex CANNOT handle Excalidraw's real-time requirements alone.

| Requirement | Convex Capability | Verdict |
|-------------|------------------|---------|
| 30fps cursor sync (33ms) | ~50-100ms per mutation | TOO SLOW |
| Volatile messages (fire-and-forget) | All mutations are durable | NOT SUPPORTED |
| High-frequency bandwidth | 1GB/month free tier | EXCEEDED QUICKLY |

**Calculation:**
- 60 users × 30 cursor updates/second × 100 bytes = 180KB/second
- 180KB × 3600 seconds × 8 hours = 5.2GB per day of active use
- Convex free tier (1GB/month) would be exhausted in <1 day

**Solution:** Hybrid architecture with two backends:
1. **excalidraw-room** (WebSocket): Real-time cursor + element sync
2. **Convex**: Storage, auth, dashboard, comments, activity logs

### 3.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER'S BROWSER                                  │
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │                    Next.js Application (Vercel)                     │    │
│   │                                                                      │    │
│   │   ┌─────────────┐   ┌─────────────┐   ┌────────────────────────┐   │    │
│   │   │   Pages     │   │ Components  │   │    ExcalidrawWrapper   │   │    │
│   │   │             │   │             │   │                        │   │    │
│   │   │ /dashboard  │   │ Dashboard   │   │ - onChange → save      │   │    │
│   │   │ /scene/[id] │   │ SceneCard   │   │ - onPointerUpdate      │   │    │
│   │   │ /view/[id]  │   │ Comments    │   │ - Socket.IO client     │   │    │
│   │   └─────────────┘   └─────────────┘   └────────────────────────┘   │    │
│   │          │                                      │         │         │    │
│   └──────────┼──────────────────────────────────────┼─────────┼─────────┘    │
│              │                                      │         │              │
└──────────────┼──────────────────────────────────────┼─────────┼──────────────┘
               │                                      │         │
               │ Convex Client                        │         │ Socket.IO
               │ (queries, mutations)                 │         │ (WebSocket)
               │                                      │         │
               ▼                                      │         ▼
┌──────────────────────────────────┐                  │   ┌──────────────────────────┐
│          CONVEX BACKEND          │                  │   │    EXCALIDRAW-ROOM       │
│                                  │                  │   │  (Google Cloud Run)      │
│  ┌────────────┐ ┌────────────┐   │                  │   │                          │
│  │  Database  │ │  Functions │   │                  │   │  Socket.IO Server        │
│  │            │ │            │   │                  │   │  - join-room             │
│  │  users     │ │  queries/  │   │                  │   │  - server-broadcast      │
│  │  scenes    │ │  mutations │   │                  │   │  - server-volatile-      │
│  │  comments  │ │  auth.ts   │   │                  │   │    broadcast (cursors)   │
│  │  activity  │ │            │   │                  │   │                          │
│  └────────────┘ └────────────┘   │                  │   │  Ephemeral (no storage)  │
│                                  │                  │   │  End-to-end encrypted    │
│  ┌────────────┐ ┌────────────┐   │                  │   └──────────────────────────┘
│  │   Storage  │ │ Convex Auth│   │                  │
│  │            │ │            │   │                  │
│  │  Scene JSON│ │  Google    │   │                  │
│  │  Thumbnails│ │  OAuth     │   │                  │
│  └────────────┘ └────────────┘   │                  │
│                                  │◄─────────────────┘
│                                  │  Scene save (debounced every 5s)
└──────────────────────────────────┘
```

### 3.3 Component Responsibilities

| Component | Responsibility | Protocol |
|-----------|----------------|----------|
| **Vercel (Next.js)** | Frontend hosting, SSR, routing | HTTPS |
| **Convex** | Database, file storage, auth, slow operations | WebSocket (Convex protocol) |
| **excalidraw-room** | Real-time cursor sync, element broadcast | WebSocket (Socket.IO) |

### 3.4 Why This Split?

| Operation | Backend | Reason |
|-----------|---------|--------|
| Cursor sync (30fps) | excalidraw-room | Needs volatile WebSocket messages, high frequency |
| Element broadcast | excalidraw-room | Real-time sync between collaborators |
| Scene persistence | Convex | Durable storage, versioning, metadata |
| Authentication | Convex Auth | Built-in Google OAuth, no extra service |
| Dashboard data | Convex | Reactive queries, real-time subscriptions |
| Comments | Convex | Persistent, associated with scenes |
| Activity logs | Convex | Persistent audit trail |

---

## 4. Technology Stack

### 4.1 Final Stack

| Component | Technology | Version | Confidence | Rationale |
|-----------|------------|---------|------------|-----------|
| **Frontend Framework** | Next.js (App Router) | 14+ | HIGH | SSR, Vercel integration, React ecosystem |
| **Language** | TypeScript | 5.x | HIGH | Type safety across stack |
| **Drawing Canvas** | @excalidraw/excalidraw | Latest | HIGH | MIT license, well-documented API |
| **Real-time Sync** | excalidraw-room | Latest | HIGH | Official solution, Socket.IO, proven |
| **Database** | Convex | Latest | HIGH | Real-time subscriptions, file storage |
| **Authentication** | Convex Auth | Latest | MEDIUM | Google OAuth via Auth.js, beta but functional |
| **Styling** | Tailwind CSS | 3.x | HIGH | Utility-first, shadcn/ui components |
| **UI Components** | shadcn/ui | Latest | HIGH | Accessible, customizable |
| **Unit Testing** | Vitest | 1.x | HIGH | Fast, TypeScript-native, same as Excalidraw |
| **E2E Testing** | Playwright | 1.x | HIGH | Cross-browser, reliable |
| **Frontend Hosting** | Vercel | - | HIGH | Free tier, zero-config deployment |
| **WebSocket Server** | Google Cloud Run | - | HIGH | Container hosting, ~$5/month |

### 4.2 Why These Choices?

**excalidraw-room (not Convex for real-time):**
- Official Excalidraw collaboration server
- Supports volatile messages for cursors (fire-and-forget)
- End-to-end encryption built-in
- Simple deployment (Docker or Node.js)
- Used by excalidraw.com in production

**Convex (not PostgreSQL + custom backend):**
- Zero backend code for CRUD operations
- Built-in real-time subscriptions for dashboard
- File storage included
- Convex Auth eliminates need for Clerk

**Convex Auth (not Clerk):**
- No additional service dependency
- Free (included with Convex)
- Google OAuth via Auth.js
- Acceptable for 60-person internal tool

### 4.3 Verified from Research

**excalidraw-room Socket.IO Events (verified from source code):**
```typescript
// Room management
"join-room"              // Client joins a room
"first-in-room"          // First user in room notification
"new-user"               // Broadcast when user joins

// Data sync (CRITICAL for collaboration)
"server-broadcast"       // Durable element updates
"server-volatile-broadcast"  // Volatile cursor updates (lossy OK)
"client-broadcast"       // Client receives updates

// User tracking
"room-user-change"       // User list changed
"user-follow"            // Following another user
```

**Convex Auth Setup (verified from docs):**
```typescript
// convex/auth.ts
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
});
```

---

## 5. Wrapper Strategy

### 5.1 Core Principle: Zero Modifications to Excalidraw

**We will NOT modify the Excalidraw codebase.** Instead:

- Import `@excalidraw/excalidraw` as an npm package
- Build wrapper components around it
- Use Excalidraw's props and callbacks API
- Use exported utilities (`exportToBlob`, `reconcileElements`, etc.)

### 5.2 What Excalidraw Provides (verified from packages/excalidraw/index.tsx)

```typescript
// Core component
export { Excalidraw } from "./components/App";

// Imperative API type
export type { ExcalidrawImperativeAPI } from "./types";

// Export utilities
export { exportToBlob, exportToCanvas, exportToSvg } from "./packages/utils";

// Data utilities
export { serializeAsJSON } from "./data/json";
export { reconcileElements } from "./data/reconcile";
export { restoreElements } from "./data/restore";

// UI components for customization
export { MainMenu, Sidebar, Footer } from "./components";
```

### 5.3 Excalidraw Props We Use

| Prop | Type | Purpose |
|------|------|---------|
| `excalidrawAPI` | `(api: ExcalidrawImperativeAPI) => void` | Get imperative API reference |
| `initialData` | `{ elements, appState, files }` | Load saved scene |
| `onChange` | `(elements, appState, files) => void` | Detect changes for auto-save |
| `onPointerUpdate` | `({ pointer, button }) => void` | Cursor position for sync |
| `renderTopRightUI` | `(isMobile) => ReactNode` | Render collaborator avatars |
| `viewModeEnabled` | `boolean` | Read-only mode for shared links |
| `isCollaborating` | `boolean` | Show collaboration UI |
| `UIOptions` | `object` | Hide/show UI elements |

### 5.4 The ExcalidrawWrapper Component

```typescript
// src/components/editor/excalidraw-wrapper.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { io, Socket } from "socket.io-client";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

// Dynamic import - Excalidraw doesn't support SSR
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

interface ExcalidrawWrapperProps {
  sceneId: string;
  roomId: string;
  initialData: any;
  viewMode?: boolean;
}

export function ExcalidrawWrapper({
  sceneId,
  roomId,
  initialData,
  viewMode = false,
}: ExcalidrawWrapperProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Convex for persistence (NOT real-time sync)
  const saveScene = useMutation(api.scenes.save);
  const collaborators = useQuery(api.scenes.getCollaborators, { sceneId });

  // Connect to excalidraw-room for real-time
  useEffect(() => {
    if (viewMode) return;

    const socket = io(process.env.NEXT_PUBLIC_COLLAB_SERVER_URL!, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("join-room", roomId);
    });

    // Receive element updates from other users
    socket.on("client-broadcast", (encryptedData, iv) => {
      // Decrypt and apply to canvas
      const data = decrypt(encryptedData, iv);
      if (excalidrawAPI && data.type === "SCENE_UPDATE") {
        const reconciledElements = reconcileElements(
          excalidrawAPI.getSceneElements(),
          data.elements,
          excalidrawAPI.getAppState()
        );
        excalidrawAPI.updateScene({ elements: reconciledElements });
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [roomId, viewMode, excalidrawAPI]);

  // Handle canvas changes
  const handleChange = useCallback(
    (elements: any[], appState: any, files: any) => {
      if (viewMode) return;

      // Broadcast to other users via excalidraw-room (immediate)
      if (socketRef.current?.connected) {
        const encrypted = encrypt({ type: "SCENE_UPDATE", elements });
        socketRef.current.emit("server-broadcast", roomId, encrypted.data, encrypted.iv);
      }

      // Save to Convex (debounced)
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        saveScene({
          sceneId,
          elements: JSON.stringify(elements),
          appState: JSON.stringify(appState),
        });
      }, 5000); // 5 second debounce
    },
    [sceneId, roomId, viewMode, saveScene]
  );

  // Handle cursor updates (30fps)
  const handlePointerUpdate = useCallback(
    (payload: { pointer: { x: number; y: number }; button: string }) => {
      if (viewMode || !socketRef.current?.connected) return;

      // Use volatile broadcast for cursors (fire-and-forget)
      const encrypted = encrypt({
        type: "CURSOR_UPDATE",
        cursor: payload.pointer,
      });
      socketRef.current.volatile.emit(
        "server-volatile-broadcast",
        roomId,
        encrypted.data,
        encrypted.iv
      );
    },
    [roomId, viewMode]
  );

  return (
    <Excalidraw
      excalidrawAPI={(api) => setExcalidrawAPI(api)}
      initialData={initialData}
      onChange={handleChange}
      onPointerUpdate={handlePointerUpdate}
      viewModeEnabled={viewMode}
      isCollaborating={!viewMode}
      UIOptions={{
        canvasActions: {
          loadScene: false,
          saveAsImage: true,
        },
      }}
    />
  );
}
```

---

## 6. Data Model

### 6.1 Convex Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Auth tables (provided by Convex Auth)
  ...authTables,

  // Users (extended)
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    workspaceId: v.optional(v.id("workspaces")),
    role: v.optional(v.union(v.literal("admin"), v.literal("member"))),
  })
    .index("by_email", ["email"])
    .index("by_workspace", ["workspaceId"]),

  // Workspaces
  workspaces: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerId: v.id("users"),
    settings: v.object({
      allowMemberInvites: v.boolean(),
    }),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_owner", ["ownerId"]),

  // Invitations
  invitations: defineTable({
    workspaceId: v.id("workspaces"),
    email: v.optional(v.string()),
    token: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
    expiresAt: v.number(),
    usedAt: v.optional(v.number()),
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_email", ["email"]),

  // Collections (folders)
  collections: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
    parentId: v.optional(v.id("collections")),
    ownerId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_parent", ["parentId"]),

  // Scenes
  scenes: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
    collectionId: v.optional(v.id("collections")),
    ownerId: v.id("users"),

    // Data storage
    dataFileId: v.optional(v.id("_storage")),
    thumbnailFileId: v.optional(v.id("_storage")),

    // Collaboration
    roomId: v.string(), // excalidraw-room room ID

    // Sharing
    shareToken: v.optional(v.string()),
    isPublic: v.boolean(),

    // Metadata
    version: v.number(),
    elementCount: v.number(),
    lastEditedBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_collection", ["collectionId"])
    .index("by_room", ["roomId"])
    .index("by_share_token", ["shareToken"]),

  // Comments
  comments: defineTable({
    sceneId: v.id("scenes"),
    userId: v.id("users"),
    content: v.string(),
    position: v.optional(v.object({
      x: v.number(),
      y: v.number(),
    })),
    elementId: v.optional(v.string()),
    parentId: v.optional(v.id("comments")),
    resolved: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_scene", ["sceneId"])
    .index("by_parent", ["parentId"]),

  // Activity logs
  activityLogs: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    action: v.string(),
    resourceType: v.string(),
    resourceId: v.string(),
    resourceName: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_time", ["workspaceId", "createdAt"]),
});
```

### 6.2 Data Storage Strategy

| Data Type | Storage | Reason |
|-----------|---------|--------|
| Scene elements JSON | Convex File Storage | Large, versioned, ~100KB-1MB per scene |
| Scene metadata | Convex Database | Small, queryable, indexed |
| Thumbnails | Convex File Storage | Binary images |
| User data | Convex Database | Auth integration |
| Comments | Convex Database | Real-time subscriptions |
| Activity logs | Convex Database | Queryable, indexed by time |

---

## 7. Real-time Collaboration

### 7.1 Architecture: Hybrid Sync

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REAL-TIME DATA FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

User A draws a rectangle:
┌────────────┐                                              ┌────────────┐
│   User A   │                                              │   User B   │
│  (drawing) │                                              │  (viewing) │
└─────┬──────┘                                              └─────▲──────┘
      │                                                           │
      │ 1. onChange fires                                         │
      │    (elements changed)                                     │
      │                                                           │
      ▼                                                           │
┌─────────────────────┐                              ┌────────────┴───────────┐
│ ExcalidrawWrapper   │                              │   ExcalidrawWrapper    │
│                     │                              │                        │
│ 2. Encrypt elements │                              │ 5. Decrypt, reconcile  │
│ 3. Emit to socket   │                              │ 6. Update canvas       │
└─────────┬───────────┘                              └────────────▲───────────┘
          │                                                       │
          │ socket.emit("server-broadcast",                       │
          │   roomId, encryptedData, iv)                         │
          │                                                       │
          ▼                                                       │
┌─────────────────────────────────────────────────────────────────┴───────────┐
│                           EXCALIDRAW-ROOM                                    │
│                        (Google Cloud Run)                                    │
│                                                                              │
│   4. Broadcast to all clients in room                                        │
│      (except sender)                                                         │
│                                                                              │
│   socket.to(roomId).emit("client-broadcast", encryptedData, iv)             │
└─────────────────────────────────────────────────────────────────────────────┘

Simultaneously:
┌─────────────────────┐
│ ExcalidrawWrapper   │
│                     │
│ 7. Debounce (5s)    │
│ 8. Save to Convex   │
└─────────┬───────────┘
          │
          │ useMutation(api.scenes.save)
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CONVEX                                          │
│                                                                              │
│   9. Store scene JSON in file storage                                        │
│   10. Update scene metadata (version, updatedAt)                             │
│   11. Log activity                                                           │
│                                                                              │
│   (Dashboard subscribers auto-update via Convex real-time queries)           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Cursor Sync Flow

```
User A moves cursor:
┌────────────┐                                              ┌────────────┐
│   User A   │                                              │   User B   │
└─────┬──────┘                                              └─────▲──────┘
      │                                                           │
      │ onPointerUpdate                                           │
      │ (33ms intervals, ~30fps)                                 │
      │                                                           │
      ▼                                                           │
┌─────────────────────┐                              ┌────────────┴───────────┐
│ socket.volatile.emit│                              │   Update collaborator  │
│ "server-volatile-   │──────────────────────────────│   cursor position      │
│  broadcast"         │                              │                        │
└─────────────────────┘                              └────────────────────────┘
                              │
                              │ Volatile = fire-and-forget
                              │ No acknowledgment, lossy OK
                              │ Crucial for 30fps performance
                              ▼
                    ┌───────────────────────┐
                    │    EXCALIDRAW-ROOM    │
                    │                       │
                    │ Broadcast to room     │
                    │ (volatile, no persist)│
                    └───────────────────────┘
```

### 7.3 Why excalidraw-room?

**Verified from source code research:**

1. **Volatile broadcasts**: `socket.volatile.emit()` for cursor updates
   - Fire-and-forget, no acknowledgment
   - If packet is lost, next one comes in 33ms anyway
   - Critical for 30fps performance

2. **End-to-end encryption**: Server never sees plaintext
   - Client encrypts before sending
   - Client decrypts after receiving
   - Server is just a relay

3. **Room management**: Built-in
   - `join-room` event creates room if needed
   - Auto-cleanup when last user leaves
   - No persistent storage needed

4. **Production-proven**: Used by excalidraw.com

### 7.4 Latency Budget

| Operation | Target | Method |
|-----------|--------|--------|
| Cursor sync | <100ms | excalidraw-room volatile broadcast |
| Element sync | <200ms | excalidraw-room broadcast |
| Scene save | <500ms | Convex mutation (debounced 5s) |
| Dashboard load | <1s | Convex query |

---

## 8. Authentication

### 8.1 Convex Auth with Google OAuth

**Setup (verified from Convex docs):**

```typescript
// convex/auth.ts
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
});
```

```typescript
// convex/http.ts
import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();
auth.addHttpRoutes(http);

export default http;
```

### 8.2 Environment Variables

```bash
# Set via Convex CLI
npx convex env set AUTH_GOOGLE_ID "your-google-client-id"
npx convex env set AUTH_GOOGLE_SECRET "your-google-client-secret"
```

### 8.3 Google Cloud Console Setup

1. Go to [Google Auth Platform](https://console.cloud.google.com/auth/overview)
2. Create OAuth 2.0 Client ID (Web application)
3. Set Authorized JavaScript origins: `https://collab.zikrainfotech.com`
4. Set Authorized redirect URI: `https://YOUR_CONVEX_URL.convex.site/api/auth/callback/google`

### 8.4 Invite-Only Enforcement

```typescript
// convex/auth.ts
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Google],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      // Check if user exists or has valid invitation
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.profile.email))
        .unique();

      if (existingUser) {
        return existingUser._id;
      }

      // Check for valid invitation
      const invitation = await ctx.db
        .query("invitations")
        .withIndex("by_email", (q) => q.eq("email", args.profile.email))
        .filter((q) =>
          q.and(
            q.gt(q.field("expiresAt"), Date.now()),
            q.eq(q.field("usedAt"), undefined)
          )
        )
        .first();

      if (!invitation) {
        throw new Error("No valid invitation found");
      }

      // Create user and mark invitation as used
      const userId = await ctx.db.insert("users", {
        email: args.profile.email!,
        name: args.profile.name,
        image: args.profile.image,
        workspaceId: invitation.workspaceId,
        role: invitation.role,
      });

      await ctx.db.patch(invitation._id, { usedAt: Date.now() });

      return userId;
    },
  },
});
```

---

## 9. File Structure

### 9.1 Directory Layout

```
excalidraw-collab/
├── .env.local.example              # Environment template
├── .env.local                      # Local env (git-ignored)
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── vitest.config.ts                # Unit test configuration
├── playwright.config.ts            # E2E test configuration
├── package.json
│
├── convex/                         # Convex backend
│   ├── _generated/                 # Generated types (git-ignored)
│   ├── schema.ts                   # Database schema
│   ├── auth.ts                     # Convex Auth setup
│   ├── http.ts                     # HTTP routes (OAuth callbacks)
│   ├── users.ts                    # User queries/mutations
│   ├── workspaces.ts               # Workspace CRUD
│   ├── invitations.ts              # Invite system
│   ├── scenes.ts                   # Scene CRUD + storage
│   ├── collections.ts              # Collection management
│   ├── comments.ts                 # Comments CRUD
│   └── activityLogs.ts             # Activity logging
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (providers)
│   │   ├── page.tsx                # Landing/redirect
│   │   │
│   │   ├── (auth)/                 # Auth routes (public)
│   │   │   ├── sign-in/page.tsx
│   │   │   └── invite/[token]/page.tsx
│   │   │
│   │   ├── (dashboard)/            # Protected routes
│   │   │   ├── layout.tsx          # Dashboard layout
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── scene/[id]/page.tsx
│   │   │   ├── collections/[id]/page.tsx
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       ├── members/page.tsx
│   │   │       └── activity/page.tsx
│   │   │
│   │   └── view/[shareToken]/page.tsx  # Public view-only
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── auth/                   # Auth components
│   │   ├── dashboard/              # Dashboard components
│   │   ├── editor/                 # Editor components
│   │   │   ├── excalidraw-wrapper.tsx
│   │   │   ├── scene-editor.tsx
│   │   │   ├── save-status.tsx
│   │   │   └── share-dialog.tsx
│   │   └── shared/                 # Shared components
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── use-socket.ts           # Socket.IO hook
│   │   └── use-debounce.ts
│   │
│   ├── lib/
│   │   ├── convex.ts               # Convex client
│   │   ├── encryption.ts           # E2E encryption utils
│   │   └── constants.ts
│   │
│   └── types/
│       └── index.ts
│
├── tests/
│   ├── unit/                       # Vitest tests
│   │   ├── hooks/
│   │   └── convex/
│   └── e2e/                        # Playwright tests
│       ├── auth.spec.ts
│       ├── dashboard.spec.ts
│       └── editor.spec.ts
│
└── docs/
    ├── SETUP.md
    └── DEPLOYMENT.md
```

### 9.2 File Count Estimate

| Category | Files | Lines (approx) |
|----------|-------|----------------|
| Convex backend | 11 | 1,200 |
| Pages/routes | 10 | 500 |
| Components | 20 | 2,000 |
| Hooks | 2 | 150 |
| Utilities | 3 | 200 |
| Config files | 6 | 150 |
| Tests | 10 | 800 |
| **Total** | **~62** | **~5,000** |

---

## 10. Data Flow

### 10.1 User Sign-In Flow

```
1. User clicks "Sign in with Google"
2. signIn("google") called (Convex Auth)
3. Redirect to Google consent screen
4. Google redirects to Convex callback URL
5. Convex Auth validates, checks invitation
6. If valid: create/update user, redirect to /dashboard
7. If no invitation: show error
```

### 10.2 Create Scene Flow

```
1. User clicks "New Scene" in dashboard
2. useMutation(api.scenes.create) called
3. Convex creates scene record with:
   - Unique roomId (for excalidraw-room)
   - Initial metadata
4. Redirect to /scene/[id]
5. ExcalidrawWrapper mounts
6. Socket connects to excalidraw-room with roomId
7. Convex query loads initial data (empty for new scene)
8. Excalidraw renders
```

### 10.3 Join Existing Scene Flow

```
1. User navigates to /scene/[id]
2. Convex query fetches scene metadata
3. Convex query fetches scene data from file storage
4. Socket connects to excalidraw-room with scene.roomId
5. Excalidraw renders with initialData
6. Socket joins room, receives current state from other users
7. reconcileElements() merges local and remote state
```

### 10.4 Save Scene Flow

```
1. User draws on canvas
2. onChange fires with new elements
3. Broadcast to excalidraw-room (immediate)
4. Start/reset 5-second debounce timer
5. Timer fires → useMutation(api.scenes.save)
6. Convex mutation:
   a. Upload scene JSON to file storage
   b. Update scene metadata (version, updatedAt)
   c. Generate thumbnail
   d. Log activity
7. Dashboard subscribers auto-update (Convex real-time)
```

---

## 11. Testing Strategy

### 11.1 Testing Philosophy

| Test Type | Purpose | Tool |
|-----------|---------|------|
| Unit tests | Test hooks, utilities, Convex functions | Vitest |
| Integration tests | Test Convex functions with real DB | convex-test |
| E2E tests | Test full user flows | Playwright |

### 11.2 Unit Test Setup

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

```typescript
// tests/setup.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Convex
vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => vi.fn()),
}));

// Mock Excalidraw (SSR issues)
vi.mock("@excalidraw/excalidraw", () => ({
  Excalidraw: vi.fn(() => null),
}));

// Mock Socket.IO
vi.mock("socket.io-client", () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    connected: true,
    volatile: { emit: vi.fn() },
  })),
}));
```

### 11.3 Convex Function Tests

```typescript
// tests/unit/convex/scenes.test.ts
import { convexTest } from "convex-test";
import { describe, it, expect, beforeEach } from "vitest";
import schema from "@/convex/schema";
import { api } from "@/convex/_generated/api";

describe("scenes", () => {
  let t: ReturnType<typeof convexTest>;

  beforeEach(() => {
    t = convexTest(schema);
  });

  it("should create a scene with roomId", async () => {
    // Setup
    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: "test@example.com",
        name: "Test",
      });
    });

    const workspaceId = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", {
        name: "Test",
        slug: "test",
        ownerId: userId,
        settings: { allowMemberInvites: true },
        createdAt: Date.now(),
      });
    });

    // Test
    const sceneId = await t.mutation(api.scenes.create, {
      name: "Test Scene",
      workspaceId,
    });

    const scene = await t.run(async (ctx) => {
      return await ctx.db.get(sceneId);
    });

    expect(scene?.name).toBe("Test Scene");
    expect(scene?.roomId).toBeDefined();
    expect(scene?.roomId).toMatch(/^room_/);
  });
});
```

### 11.4 E2E Tests

```typescript
// tests/e2e/editor.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Scene Editor", () => {
  test.beforeEach(async ({ page }) => {
    // Login (set auth cookies)
    await page.goto("/sign-in");
    // ... authenticate
  });

  test("should load Excalidraw canvas", async ({ page }) => {
    await page.goto("/dashboard");
    await page.click("text=New Scene");

    // Wait for Excalidraw to load
    await expect(page.locator(".excalidraw")).toBeVisible();
    await expect(page.locator("canvas")).toBeVisible();
  });

  test("should show save status", async ({ page }) => {
    await page.goto("/scene/test-scene-id");

    // Draw something (click on canvas)
    const canvas = page.locator("canvas").first();
    await canvas.click({ position: { x: 100, y: 100 } });

    // Should show saving status
    await expect(page.getByText(/saving/i)).toBeVisible();
    await expect(page.getByText(/saved/i)).toBeVisible({ timeout: 10000 });
  });
});
```

### 11.5 Test Coverage Goals

| Area | Target | Reason |
|------|--------|--------|
| Convex functions | 80% | Business logic |
| Custom hooks | 90% | Reusable logic |
| UI components | 60% | Visual, hard to test |
| E2E critical paths | 100% | Auth, create, edit, share |

---

## 12. Deployment

### 12.1 Infrastructure

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Vercel | Free (hobby) |
| Database + Auth | Convex | Free (up to limits) |
| Real-time server | Google Cloud Run | ~$5/month |

### 12.2 excalidraw-room Deployment (Cloud Run)

**Dockerfile (from excalidraw-room repo):**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY dist/ ./dist/

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/index.js"]
```

**Deploy to Cloud Run:**
```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT_ID/excalidraw-room

# Deploy
gcloud run deploy excalidraw-room \
  --image gcr.io/PROJECT_ID/excalidraw-room \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --min-instances 1 \
  --max-instances 3
```

### 12.3 Environment Variables

```bash
# .env.local (Next.js)
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
NEXT_PUBLIC_COLLAB_SERVER_URL=https://excalidraw-room-xxxx.run.app

# Convex (set via CLI)
npx convex env set AUTH_GOOGLE_ID "..."
npx convex env set AUTH_GOOGLE_SECRET "..."

# excalidraw-room (Cloud Run)
PORT=8080
CORS_ORIGIN=https://collab.zikrainfotech.com
```

### 12.4 Domain Configuration

1. **Vercel**: Add custom domain `collab.zikrainfotech.com`
2. **Cloud Run**: Configure custom domain or use generated URL
3. **Google OAuth**: Add authorized origins and redirect URIs

---

## 13. Success Criteria

### 13.1 Functional Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| SC1 | User can sign in with Google | E2E test |
| SC2 | Only invited users can access | Manual test with non-invited email |
| SC3 | User can create new scene | E2E test |
| SC4 | Scene loads with Excalidraw canvas | E2E test |
| SC5 | Changes auto-save after 5 seconds | E2E test, check Convex |
| SC6 | Two users see each other's cursors | Manual test, <100ms latency |
| SC7 | Two users see each other's drawings | Manual test, <200ms latency |
| SC8 | Share link works for view-only | E2E test |
| SC9 | Comments can be added to scene | E2E test |
| SC10 | Activity logs show user actions | Query Convex, verify logs |

### 13.2 Performance Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial load time | <3s | Lighthouse |
| Cursor sync latency | <100ms | Manual test with timer |
| Element sync latency | <200ms | Manual test with timer |
| Save latency | <500ms | Convex dashboard metrics |

### 13.3 Quality Criteria

| Metric | Target |
|--------|--------|
| Unit test coverage | >70% |
| E2E test pass rate | 100% |
| TypeScript errors | 0 |
| ESLint warnings | 0 |

---

## 14. Task Breakdown

### 14.1 Phase 1: Foundation (Tasks 1-7)

| # | Task | Hours | Files |
|---|------|-------|-------|
| 1 | Project setup (Next.js, Convex, Tailwind) | 2 | Config files |
| 2 | Convex schema | 1 | `convex/schema.ts` |
| 3 | Convex Auth + Google OAuth | 3 | `convex/auth.ts`, `convex/http.ts` |
| 4 | Invite system | 2 | `convex/invitations.ts`, invite page |
| 5 | Dashboard layout + scene grid | 3 | Layout, components |
| 6 | Scene CRUD | 2 | `convex/scenes.ts` |
| 7 | Collections | 2 | `convex/collections.ts` |

### 14.2 Phase 2: Editor (Tasks 8-12)

| # | Task | Hours | Files |
|---|------|-------|-------|
| 8 | ExcalidrawWrapper component | 4 | `excalidraw-wrapper.tsx` |
| 9 | Socket.IO integration | 3 | `use-socket.ts`, wrapper updates |
| 10 | Auto-save with debounce | 2 | Wrapper updates |
| 11 | Cursor sync | 2 | Wrapper updates |
| 12 | Scene editor page | 2 | `/scene/[id]/page.tsx` |

### 14.3 Phase 3: Features (Tasks 13-17)

| # | Task | Hours | Files |
|---|------|-------|-------|
| 13 | Share dialog + links | 2 | `share-dialog.tsx` |
| 14 | View-only page | 2 | `/view/[token]/page.tsx` |
| 15 | Comments system | 4 | `convex/comments.ts`, components |
| 16 | Activity logs | 2 | `convex/activityLogs.ts`, component |
| 17 | Member management | 2 | Settings pages |

### 14.4 Phase 4: Testing + Deploy (Tasks 18-22)

| # | Task | Hours | Files |
|---|------|-------|-------|
| 18 | Unit tests | 4 | `tests/unit/*` |
| 19 | E2E tests | 4 | `tests/e2e/*` |
| 20 | excalidraw-room deployment | 2 | Dockerfile, Cloud Run |
| 21 | Production deployment | 2 | Vercel, DNS |
| 22 | Polish + bug fixes | 3 | Various |

### 14.5 Summary

| Phase | Hours | Tasks |
|-------|-------|-------|
| Foundation | 15 | 7 |
| Editor | 13 | 5 |
| Features | 12 | 5 |
| Testing + Deploy | 15 | 5 |
| **Total** | **55** | **22** |

---

## 15. Risk Assessment

### 15.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Convex Auth issues (beta) | MEDIUM | HIGH | Fallback to Clerk |
| excalidraw-room scaling | LOW | MEDIUM | Cloud Run auto-scaling |
| Excalidraw version breaking | LOW | HIGH | Pin version, test before upgrade |
| WebSocket connection issues | MEDIUM | MEDIUM | Reconnection logic, status indicator |

### 15.2 Fallback Plans

**If Convex Auth fails:**
1. Install Clerk (`npm install @clerk/nextjs`)
2. Replace ConvexAuthProvider with ClerkProvider
3. Update Convex functions to use Clerk JWT
4. Estimated migration: 4-6 hours

**If Convex real-time subscriptions are slow:**
1. The current architecture already uses excalidraw-room for real-time
2. Convex is only for storage, not real-time collaboration
3. No fallback needed for this scenario

### 15.3 Confidence Levels

| Component | Confidence | Notes |
|-----------|------------|-------|
| Next.js + Vercel | HIGH | Well-documented, production-proven |
| @excalidraw/excalidraw | HIGH | Well-documented API, examples exist |
| excalidraw-room | HIGH | Official solution, source code reviewed |
| Convex storage | HIGH | Well-documented, reliable |
| Convex Auth | MEDIUM | Beta, but Google OAuth verified in docs |
| E2E testing Excalidraw | MEDIUM | Canvas testing is challenging |

---

## Summary

This system design provides a **hybrid architecture** that correctly separates concerns:

1. **excalidraw-room**: Real-time collaboration (30fps cursor sync, element broadcast)
2. **Convex**: Storage, authentication, dashboard, comments, activity logs
3. **Vercel**: Frontend hosting

Key decisions:
- Zero modifications to Excalidraw source code
- Convex Auth for Google OAuth (with Clerk fallback documented)
- excalidraw-room for real-time (NOT Convex, which can't handle 30fps)
- Comprehensive testing strategy (Vitest + Playwright)

Estimated effort: **55 hours** across **22 tasks**

---

## References

**Verified Sources:**
- [excalidraw-room source code](https://github.com/excalidraw/excalidraw-room) - Socket.IO events, deployment
- [Convex Auth setup](https://labs.convex.dev/auth/setup) - Schema, provider setup
- [Convex Auth Google OAuth](https://labs.convex.dev/auth/config/oauth/google) - Google Cloud Console setup
- [Excalidraw app_constants.ts](https://github.com/excalidraw/excalidraw/blob/master/excalidraw-app/app_constants.ts) - CURSOR_SYNC_TIMEOUT = 33
- [Excalidraw package exports](https://github.com/excalidraw/excalidraw/blob/master/packages/excalidraw/index.tsx) - API surface
