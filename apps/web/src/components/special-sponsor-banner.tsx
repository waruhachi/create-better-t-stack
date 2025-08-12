"use client";
import { Github, Globe, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
	filterCurrentSponsors,
	filterSpecialSponsors,
	formatSponsorUrl,
	getSponsorUrl,
	sortSpecialSponsors,
} from "@/lib/sponsor-utils";
import type { Sponsor } from "@/lib/types";

export function SpecialSponsorBanner() {
	const [specialSponsors, setSpecialSponsors] = useState<Sponsor[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("https://sponsors.amanv.dev/sponsors.json")
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch sponsors");
				return res.json();
			})
			.then((data) => {
				const sponsorsData = Array.isArray(data) ? data : [];
				const currentSponsors = filterCurrentSponsors(sponsorsData);
				const specials = sortSpecialSponsors(
					filterSpecialSponsors(currentSponsors),
				);
				setSpecialSponsors(specials);
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div>
				<div className="grid grid-cols-4 items-center gap-2 py-1">
					{["s1", "s2", "s3", "s4"].map((key) => (
						<div
							key={key}
							className="size-12 animate-pulse rounded border border-border bg-muted"
						/>
					))}
				</div>
			</div>
		);
	}

	if (!specialSponsors.length) {
		return null;
	}

	return (
		<div>
			<div className="no-scrollbar grid grid-cols-4 items-center gap-2 overflow-x-auto whitespace-nowrap py-1">
				{specialSponsors.map((entry) => {
					const displayName = entry.sponsor.name || entry.sponsor.login;
					const imgSrc = entry.sponsor.customLogoUrl || entry.sponsor.avatarUrl;
					const since = new Date(entry.createdAt).toLocaleDateString(
						undefined,
						{
							year: "numeric",
							month: "short",
						},
					);
					const sponsorUrl = getSponsorUrl(entry);

					return (
						<HoverCard key={entry.sponsor.login}>
							<HoverCardTrigger asChild>
								<a
									href={entry.sponsor.websiteUrl || sponsorUrl}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={displayName}
									className="inline-flex"
								>
									<Image
										src={imgSrc}
										alt={displayName}
										width={66}
										height={66}
										className="size-12 rounded border border-border"
										unoptimized
									/>
								</a>
							</HoverCardTrigger>
							<HoverCardContent
								align="start"
								sideOffset={8}
								className="bg-fd-background"
							>
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<Star className="h-4 w-4 text-yellow-500/90" />
										<div className="ml-auto text-muted-foreground text-xs">
											<span>SPECIAL</span>
											<span className="px-1">•</span>
											<span>SINCE {since.toUpperCase()}</span>
										</div>
									</div>
									<div className="flex gap-3">
										<Image
											src={imgSrc}
											alt={displayName}
											width={80}
											height={80}
											className="rounded border border-border"
											unoptimized
										/>
										<div className="grid grid-cols-1 grid-rows-[1fr_auto]">
											<div>
												<h3 className="truncate font-semibold text-sm">
													{displayName}
												</h3>
												{entry.tierName ? (
													<p className="text-primary text-xs">
														{entry.tierName}
													</p>
												) : null}
											</div>
											<div className="flex flex-col gap-1">
												<a
													href={`https://github.com/${entry.sponsor.login}`}
													target="_blank"
													rel="noopener noreferrer"
													className="group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
												>
													<Github className="h-4 w-4" />
													<span className="truncate">
														{entry.sponsor.login}
													</span>
												</a>
												{entry.sponsor.websiteUrl || entry.sponsor.linkUrl ? (
													<a
														href={sponsorUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="group flex items-center gap-2 text-muted-foreground text-xs transition-colors hover:text-primary"
													>
														<Globe className="h-4 w-4" />
														<span className="truncate">
															{formatSponsorUrl(sponsorUrl)}
														</span>
													</a>
												) : null}
											</div>
										</div>
									</div>
								</div>
							</HoverCardContent>
						</HoverCard>
					);
				})}
			</div>
		</div>
	);
}
