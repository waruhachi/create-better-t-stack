import type { Sponsor } from "@/lib/types";

export const SPECIAL_SPONSOR_THRESHOLD = 100;

export const getSponsorAmount = (sponsor: Sponsor): number => {
	// If totalProcessedAmount exists, use it, otherwise parse from tierName
	if (sponsor.totalProcessedAmount !== undefined) {
		return sponsor.totalProcessedAmount;
	}

	// Parse amount from tierName as fallback
	const match = sponsor.tierName.match(/\$(\d+(?:\.\d+)?)/);
	return match ? Number.parseFloat(match[1]) : 0;
};

export const calculateLifetimeContribution = (sponsor: Sponsor): number => {
	// If totalProcessedAmount exists, use it, otherwise parse from tierName
	if (sponsor.totalProcessedAmount !== undefined) {
		return sponsor.totalProcessedAmount;
	}

	// Parse amount from tierName as fallback
	const match = sponsor.tierName.match(/\$(\d+(?:\.\d+)?)/);
	return match ? Number.parseFloat(match[1]) : 0;
};

export const shouldShowLifetimeTotal = (sponsor: Sponsor): boolean => {
	// Only show lifetime total if totalProcessedAmount exists
	return sponsor.totalProcessedAmount !== undefined;
};

export const filterVisibleSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.filter((sponsor) => {
		const amount = getSponsorAmount(sponsor);
		return amount >= 5;
	});
};

export const isSpecialSponsor = (sponsor: Sponsor): boolean => {
	const amount = getSponsorAmount(sponsor);
	return amount >= SPECIAL_SPONSOR_THRESHOLD;
};

export const isLifetimeSpecialSponsor = (sponsor: Sponsor): boolean => {
	const lifetimeAmount = calculateLifetimeContribution(sponsor);
	return lifetimeAmount >= SPECIAL_SPONSOR_THRESHOLD;
};

export const sortSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.sort((a, b) => {
		const aAmount = getSponsorAmount(a);
		const bAmount = getSponsorAmount(b);
		const aIsSpecial = isSpecialSponsor(a);
		const bIsSpecial = isSpecialSponsor(b);

		// 1. Special sponsors (>=$100) come first
		if (aIsSpecial && !bIsSpecial) return -1;
		if (!aIsSpecial && bIsSpecial) return 1;
		if (aIsSpecial && bIsSpecial) {
			if (aAmount !== bAmount) {
				return bAmount - aAmount;
			}
			// If amounts equal, sort by name
			return a.name.localeCompare(b.name);
		}

		// 2. Regular sponsors sorted by amount (highest first)
		if (aAmount !== bAmount) {
			return bAmount - aAmount;
		}

		// 3. If amounts equal, sort by name
		return a.name.localeCompare(b.name);
	});
};

export const sortSpecialSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.sort((a, b) => {
		const aLifetime = calculateLifetimeContribution(a);
		const bLifetime = calculateLifetimeContribution(b);

		// Sort by lifetime contribution (highest first)
		if (aLifetime !== bLifetime) {
			return bLifetime - aLifetime;
		}

		// If amounts equal, sort by name
		return a.name.localeCompare(b.name);
	});
};

export const filterCurrentSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	// In the new structure, all sponsors in the main arrays are current
	return sponsors;
};

export const filterPastSponsors = (_sponsors: Sponsor[]): Sponsor[] => {
	// Past sponsors are handled separately in the new structure
	return [];
};

export const filterSpecialSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.filter(isSpecialSponsor);
};

export const filterRegularSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.filter((sponsor) => !isSpecialSponsor(sponsor));
};

export const getSponsorUrl = (sponsor: Sponsor): string => {
	return sponsor.websiteUrl || sponsor.githubUrl;
};

export const formatSponsorUrl = (url: string): string => {
	return url?.replace(/^https?:\/\//, "")?.replace(/\/$/, "");
};
