import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	videos: defineTable({
		embedId: v.string(),
		title: v.string(),
	}),

	tweets: defineTable({
		tweetId: v.string(),
		order: v.optional(v.number()),
	}),

	showcase: defineTable({
		title: v.string(),
		description: v.string(),
		imageUrl: v.string(),
		liveUrl: v.string(),
		tags: v.array(v.string()),
	}),
});
