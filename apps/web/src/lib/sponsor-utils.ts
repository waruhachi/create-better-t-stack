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

export const calculateLifetimeContribution = (sponsor: Sponsor): number => {
	// For past sponsors, return 0
	if (sponsor.monthlyDollars === -1) {
		return 0;
	}

	// For one-time sponsors, return the one-time amount
	if (sponsor.isOneTime && sponsor.tierName) {
		const match = sponsor.tierName.match(/\$(\d+(?:\.\d+)?)/);
		return match ? Number.parseFloat(match[1]) : 0;
	}

	// For monthly sponsors, calculate total contribution since they started
	const startDate = new Date(sponsor.createdAt);
	const currentDate = new Date();
	const monthsSinceStart = Math.max(
		1,
		Math.floor(
			(currentDate.getTime() - startDate.getTime()) /
				(1000 * 60 * 60 * 24 * 30.44),
		),
	);

	return sponsor.monthlyDollars * monthsSinceStart;
};

export const shouldShowLifetimeTotal = (sponsor: Sponsor): boolean => {
	// Don't show for past sponsors
	if (sponsor.monthlyDollars === -1) {
		return false;
	}

	// Don't show for one-time sponsors
	if (sponsor.isOneTime) {
		return false;
	}

	// Don't show for first month sponsors
	const startDate = new Date(sponsor.createdAt);
	const currentDate = new Date();
	const monthsSinceStart = Math.floor(
		(currentDate.getTime() - startDate.getTime()) /
			(1000 * 60 * 60 * 24 * 30.44),
	);

	return monthsSinceStart > 1;
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
		const aLifetime = calculateLifetimeContribution(a);
		const bLifetime = calculateLifetimeContribution(b);
		const aIsPast = a.monthlyDollars === -1;
		const bIsPast = b.monthlyDollars === -1;
		const aIsSpecial = isSpecialSponsor(a);
		const bIsSpecial = isSpecialSponsor(b);
		const aIsLifetimeSpecial = isLifetimeSpecialSponsor(a);
		const bIsLifetimeSpecial = isLifetimeSpecialSponsor(b);

		// 1. Special sponsors (>=$100 current) come first
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

		// 2. Lifetime special sponsors (>=$100 total) come next
		if (aIsLifetimeSpecial && !bIsLifetimeSpecial) return -1;
		if (!aIsLifetimeSpecial && bIsLifetimeSpecial) return 1;
		if (aIsLifetimeSpecial && bIsLifetimeSpecial) {
			if (aLifetime !== bLifetime) {
				return bLifetime - aLifetime;
			}
			// If lifetime amounts equal, prefer monthly over one-time
			if (a.isOneTime && !b.isOneTime) return 1;
			if (!a.isOneTime && b.isOneTime) return -1;
			// Then by creation date (oldest first)
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		}

		// 3. Current sponsors come before past sponsors
		if (!aIsPast && bIsPast) return -1;
		if (aIsPast && !bIsPast) return 1;

		// 4. For current sponsors, sort by lifetime contribution (highest first)
		if (!aIsPast && !bIsPast) {
			if (aLifetime !== bLifetime) {
				return bLifetime - aLifetime;
			}
			// If lifetime amounts equal, prefer monthly over one-time
			if (a.isOneTime && !b.isOneTime) return 1;
			if (!a.isOneTime && b.isOneTime) return -1;
			// Then by creation date (oldest first)
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		}

		// 5. For past sponsors, sort by lifetime contribution (highest first)
		if (aIsPast && bIsPast) {
			if (aLifetime !== bLifetime) {
				return bLifetime - aLifetime;
			}
			// Then by creation date (newest first)
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		}

		return 0;
	});
};

export const sortSpecialSponsors = (sponsors: Sponsor[]): Sponsor[] => {
	return sponsors.sort((a, b) => {
		const aLifetime = calculateLifetimeContribution(a);
		const bLifetime = calculateLifetimeContribution(b);

		// First, prioritize current special sponsors
		const aIsSpecial = isSpecialSponsor(a);
		const bIsSpecial = isSpecialSponsor(b);

		if (aIsSpecial && !bIsSpecial) return -1;
		if (!aIsSpecial && bIsSpecial) return 1;

		// Then sort by lifetime contribution (highest first)
		if (aLifetime !== bLifetime) {
			return bLifetime - aLifetime;
		}

		// If lifetime amounts equal, prefer monthly over one-time
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
