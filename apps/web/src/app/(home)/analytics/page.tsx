import type { Metadata } from "next";
import AnalyticsPage from "./_components/analytics-page";

export const metadata: Metadata = {
	title: "Analytics - Better-T-Stack",
	description: "Project creation analytics for Better-T-Stack.",
	openGraph: {
		title: "Analytics - Better-T-Stack",
		description: "Project creation analytics for Better-T-Stack.",
		url: "https://better-t-stack.dev/analytics",
		images: [
			{
				url: "https://r2.better-t-stack.dev/og.png",
				width: 1200,
				height: 630,
				alt: "Better-T-Stack Analytics",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Analytics - Better-T-Stack",
		description: "Project creation analytics for Better-T-Stack.",
		images: ["https://r2.better-t-stack.dev/og.png"],
	},
};

export default async function Analytics() {
	const response = await fetch(
		"https://r2.better-t-stack.dev/analytics-data.json",
	);
	const analyticsData = await response.json();

	return <AnalyticsPage data={analyticsData} />;
}
