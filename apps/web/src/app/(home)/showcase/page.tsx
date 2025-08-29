export const dynamic = "force-static";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import ShowcasePage from "./_components/showcase-page";

export default async function Showcase() {
	const showcaseProjects = await fetchQuery(api.showcase.getShowcaseProjects);
	return <ShowcasePage showcaseProjects={showcaseProjects} />;
}
