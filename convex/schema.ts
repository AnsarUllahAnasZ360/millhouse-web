import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	...authTables,

	users: defineTable({
		name: v.optional(v.string()),
		email: v.optional(v.string()),
		image: v.optional(v.string()),
	}).index("by_email", ["email"]),

	workspaces: defineTable({
		name: v.string(),
		ownerId: v.id("users"),
		createdAt: v.number(),
	}).index("by_owner", ["ownerId"]),

	workspaceMembers: defineTable({
		workspaceId: v.id("workspaces"),
		userId: v.id("users"),
		role: v.union(v.literal("admin"), v.literal("member")),
		joinedAt: v.number(),
	})
		.index("by_workspace", ["workspaceId"])
		.index("by_user", ["userId"])
		.index("by_workspace_user", ["workspaceId", "userId"]),
});
