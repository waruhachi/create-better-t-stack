import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Stack Builder - Better-T-Stack",
	description: "Interactive Ui to roll your own stack",
	openGraph: {
		title: "Stack Builder - Better-T-Stack",
		description: "Interactive Ui to roll your own stack",
		url: "https://better-t-stack.dev/new",
		images: [
			{
				url: "https://r2.better-t-stack.dev/og.png",
				width: 1200,
				height: 630,
				alt: "Better-T-Stack Stack Builder",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Stack Builder - Better-T-Stack",
		description: "Interactive Ui to roll your own stack",
		images: ["https://r2.better-t-stack.dev/og.png"],
	},
};

export default function NewLayout({ children }: { children: ReactNode }) {
	return children;
}
