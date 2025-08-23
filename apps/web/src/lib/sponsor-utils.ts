import type { Sponsor } from "@/lib/types";

export const SPECIAL_SPONSOR_THRESHOLD = 100;

export const getSponsorAmount = (sponsor: Sponsor): number => {
	// For past sponsors, return 0
	if (sponsor.monthlyDollars === -1) {
		return 0;
	}

	// For one-time sponsors, parse the actual amount from tierName
	if (sponsor.isOneTime && sponsor.tierName) {
		const match = sponsor.tierName.match(/\$(\d+(?:\.\d+)?)/);
		return match ? Number.parseFloat(match[1]) : sponsor.monthlyDollars;
	}

	// For monthly sponsors, use monthlyDollars
	return sponsor.monthlyDollars;
};

export const isSpecialSponsor = (sponsor: Sponsor): boolean => {
	const amount = getSponsorAmount(sponsor);
	return amount >= SPECIAL_SPONSOR_THRESHOLD;
};

export const sortSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.sort((a, b) => {
		const aAmount = getSponsorAmount(a);
		const bAmount = getSponsorAmount(b);
		const aIsPast = a.monthlyDollars === -1;
		const bIsPast = b.monthlyDollars === -1;
		const aIsSpecial = isSpecialSponsor(a);
		const bIsSpecial = isSpecialSponsor(b);

		// 1. Special sponsors (>=$100) come first, sorted by amount (highest first)
		if (aIsSpecial && !bIsSpecial) return -1;
		if (!aIsSpecial && bIsSpecial) return 1;
		if (aIsSpecial && bIsSpecial) {
			if (aAmount !== bAmount) {
				return bAmount - aAmount;
			}
			// If amounts equal, prefer monthly over one-time
			if (a.isOneTime && !b.isOneTime) return 1;
			if (!a.isOneTime && b.isOneTime) return -1;
			// Then by creation date (oldest first)
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		}

		// 2. Current sponsors come before past sponsors
		if (!aIsPast && bIsPast) return -1;
		if (aIsPast && !bIsPast) return 1;

		// 3. For current sponsors, sort by amount (highest first)
		if (!aIsPast && !bIsPast) {
			if (aAmount !== bAmount) {
				return bAmount - aAmount;
			}
			// If amounts equal, prefer monthly over one-time
			if (a.isOneTime && !b.isOneTime) return 1;
			if (!a.isOneTime && b.isOneTime) return -1;
			// Then by creation date (oldest first)
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		}

		// 4. For past sponsors, sort by amount (highest first)
		if (aIsPast && bIsPast) {
			if (aAmount !== bAmount) {
				return bAmount - aAmount;
			}
			// Then by creation date (newest first)
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		}

		return 0;
	});
};

export const sortSpecialSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.sort((a, b) => {
		const aAmount = getSponsorAmount(a);
		const bAmount = getSponsorAmount(b);

		// Sort by actual amount (highest first)
		if (aAmount !== bAmount) {
			return bAmount - aAmount;
		}

		// If amounts equal, prefer monthly over one-time
		if (a.isOneTime && !b.isOneTime) return 1;
		if (!a.isOneTime && b.isOneTime) return -1;

		// Then by creation date (oldest first)
		return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
	});
};

export const filterCurrentSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.filter((sponsor) => sponsor.monthlyDollars !== -1);
};

export const filterPastSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.filter((sponsor) => sponsor.monthlyDollars === -1);
};

export const filterSpecialSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.filter(isSpecialSponsor);
};

export const filterRegularSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.filter((sponsor) => !isSpecialSponsor(sponsor));
};

export const getSponsorUrl = (sponsor: Sponsor): string => {
	return (
		sponsor.sponsor.websiteUrl ||
		sponsor.sponsor.linkUrl ||
		`https://github.com/${sponsor.sponsor.login}`
	);
};

export const formatSponsorUrl = (url: string): string => {
	return url?.replace(/^https?:\/\//, "")?.replace(/\/$/, "");
};
