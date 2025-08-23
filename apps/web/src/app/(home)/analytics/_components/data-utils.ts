import type { AggregatedAnalyticsData } from "./types";

export const getPlatformData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.platformDistribution || [];
};

export const getPackageManagerData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.packageManagerDistribution || [];
};

export const getBackendData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.backendDistribution || [];
};

export const getDatabaseData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.databaseDistribution || [];
};

export const getORMData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.ormDistribution || [];
};

export const getDBSetupData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.dbSetupDistribution || [];
};

export const getAPIData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.apiDistribution || [];
};

export const getFrontendData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.frontendDistribution || [];
};

export const getTimeSeriesData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.timeSeries || [];
};

export const getNodeVersionData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.nodeVersionDistribution || [];
};

export const getCLIVersionData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.cliVersionDistribution || [];
};

export const getAuthData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.authDistribution || [];
};

export const getGitData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.gitDistribution || [];
};

export const getInstallData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.installDistribution || [];
};

export const getExamplesData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.examplesDistribution || [];
};

export const getAddonsData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.addonsDistribution || [];
};

export const getRuntimeData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.runtimeDistribution || [];
};

export const getProjectTypeData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return data.projectTypeDistribution || [];
};

export const getWebDeployData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];

	const filteredData = (data.webDeployDistribution || []).filter(
		(item) => item.name !== "none",
	);

	const wranglerCount = filteredData
		.filter((item) => item.name === "wrangler" || item.name === "workers")
		.reduce((sum, item) => sum + item.value, 0);

	const alchemyCount = filteredData
		.filter((item) => item.name === "alchemy")
		.reduce((sum, item) => sum + item.value, 0);

	return [
		{ name: "wrangler", value: wranglerCount },
		{ name: "alchemy", value: alchemyCount },
	].filter((item) => item.value > 0);
};

export const getServerDeployData = (data: AggregatedAnalyticsData | null) => {
	if (!data) return [];
	return (data.serverDeployDistribution || []).filter(
		(item) => item.name !== "none",
	);
};

export const getMonthlyTimeSeriesData = (
	data: AggregatedAnalyticsData | null,
) => {
	if (!data) return [];
	return data.monthlyTimeSeries || [];
};

export const getPopularStackCombinations = (
	data: AggregatedAnalyticsData | null,
) => {
	if (!data) return [];
	return data.popularStackCombinations || [];
};

export const getDatabaseORMCombinations = (
	data: AggregatedAnalyticsData | null,
) => {
	if (!data) return [];
	return data.databaseORMCombinations || [];
};

export const getHourlyDistributionData = (
	data: AggregatedAnalyticsData | null,
) => {
	if (!data) return [];
	return data.hourlyDistribution || [];
};
