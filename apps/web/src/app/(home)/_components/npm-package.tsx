"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NpmPackage = () => {
	const [version, setVersion] = useState("");
	const [versionLoading, setVersionLoading] = useState(true);

	useEffect(() => {
		const getLatestVersion = async () => {
			setVersionLoading(true);
			try {
				const res = await fetch(
					"https://registry.npmjs.org/create-better-t-stack/latest",
				);
				if (!res.ok) throw new Error("Failed to fetch version");
				const data = await res.json();
				setVersion(data.version);
			} catch (error) {
				console.error("Error fetching NPM version:", error);
				setVersion("?.?.?");
			} finally {
				setVersionLoading(false);
			}
		};
		getLatestVersion();
	}, []);

	return (
		<div className="mt-2 flex items-center justify-center">
			<span
				className={cn(
					"mr-2 inline-block h-5 w-3 bg-primary",
					versionLoading && "animate-pulse",
				)}
			/>
			<span className=" text-muted-foreground text-xl">
				{versionLoading ? "[v?.?.?]" : `[v${version}]`}
			</span>
		</div>
	);
};

export default NpmPackage;
