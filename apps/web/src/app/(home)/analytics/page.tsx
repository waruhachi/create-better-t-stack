"use client";
import { useCallback, useEffect, useState } from "react";
import Footer from "../_components/footer";
import {
	AddonsExamplesCharts,
	type AggregatedAnalyticsData,
	AnalyticsHeader,
	DevEnvironmentCharts,
	MetricsCards,
	StackConfigurationCharts,
	TimelineCharts,
} from "./_components";

export default function AnalyticsPage() {
	const [data, setData] = useState<AggregatedAnalyticsData | null>(null);
	const [loadingLastUpdated, setLoadingLastUpdated] = useState(true);

	const loadAnalyticsData = useCallback(async () => {
		try {
			const response = await fetch("https://r2.amanv.dev/analytics-data.json");
			const analyticsData = await response.json();

			setData(analyticsData);
			console.log("Loaded aggregated analytics data from R2 bucket");
			console.log(`Data generated at: ${analyticsData.generatedAt}`);
		} catch (error: unknown) {
			console.error("Error loading analytics data:", error);
		} finally {
			setLoadingLastUpdated(false);
		}
	}, []);

	useEffect(() => {
		loadAnalyticsData();
	}, [loadAnalyticsData]);

	const totalProjects = data?.summary?.totalProjects || 0;
	const avgProjectsPerDay = data?.summary?.avgProjectsPerDay || 0;
	const authEnabledPercent = data?.summary?.authEnabledPercent || 0;
	const mostPopularFrontend = data?.summary?.mostPopularFrontend || "None";
	const mostPopularBackend = data?.summary?.mostPopularBackend || "None";
	const mostPopularORM = data?.summary?.mostPopularORM || "None";
	const mostPopularAPI = data?.summary?.mostPopularAPI || "None";
	const mostPopularPackageManager =
		data?.summary?.mostPopularPackageManager || "npm";

	return (
		<div className="mx-auto min-h-svh max-w-[1280px]">
			<div className="container mx-auto space-y-8 px-4 py-8 pt-16">
				<AnalyticsHeader
					totalProjects={totalProjects}
					lastUpdated={data?.lastUpdated || null}
					loadingLastUpdated={loadingLastUpdated}
				/>

				<MetricsCards
					totalProjects={totalProjects}
					avgProjectsPerDay={avgProjectsPerDay}
					authEnabledPercent={authEnabledPercent}
					mostPopularFrontend={mostPopularFrontend}
					mostPopularBackend={mostPopularBackend}
					mostPopularORM={mostPopularORM}
					mostPopularAPI={mostPopularAPI}
					mostPopularPackageManager={mostPopularPackageManager}
				/>

				<TimelineCharts data={data} />

				<StackConfigurationCharts data={data} />

				<AddonsExamplesCharts data={data} />

				<DevEnvironmentCharts data={data} />
			</div>
			<Footer />
		</div>
	);
}
