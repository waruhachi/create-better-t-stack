import {
	parseAsArrayOf,
	parseAsString,
	parseAsStringEnum,
	useQueryState,
	useQueryStates,
} from "nuqs";
import {
	DEFAULT_STACK,
	isStackDefault,
	type StackState,
	TECH_OPTIONS,
} from "@/lib/constant";
import {
	stackParsers,
	stackQueryStatesOptions,
	stackUrlKeys,
} from "@/lib/stack-url-state";

const CATEGORY_ORDER: Array<keyof typeof TECH_OPTIONS> = [
	"webFrontend",
	"nativeFrontend",
	"backend",
	"runtime",
	"api",
	"database",
	"orm",
	"dbSetup",
	"webDeploy",
	"serverDeploy",
	"auth",
	"packageManager",
	"addons",
	"examples",
	"git",
	"install",
];

const getStackKeyFromUrlKey = (urlKey: string): keyof StackState | null =>
	(Object.entries(stackUrlKeys).find(
		([, value]) => value === urlKey,
	)?.[0] as keyof StackState) || null;

const isDefaultStack = (stack: StackState): boolean =>
	Object.entries(DEFAULT_STACK).every(
		([key, _defaultValue]) =>
			key === "projectName" ||
			isStackDefault(
				stack,
				key as keyof StackState,
				stack[key as keyof StackState],
			),
	);

export function parseSearchParamsToStack(
	searchParams: Record<string, string | string[] | undefined>,
): StackState {
	const parsedStack: StackState = { ...DEFAULT_STACK };

	Object.entries(searchParams)
		.filter(([key]) => !key.startsWith("utm_"))
		.forEach(([key, value]) => {
			const stackKey = getStackKeyFromUrlKey(key);
			if (stackKey && value !== undefined) {
				try {
					const parser = stackParsers[stackKey];
					if (parser) {
						parsedStack[stackKey] = parser.parseServerSide(
							Array.isArray(value) ? value[0] : value,
						) as never;
					}
				} catch (error) {
					console.warn(`Failed to parse ${key}:`, error);
				}
			}
		});

	return parsedStack;
}

export function generateStackSummary(stack: StackState): string {
	const selectedTechs = CATEGORY_ORDER.flatMap((category) => {
		const options = TECH_OPTIONS[category];
		const selectedValue = stack[category as keyof StackState];

		if (!options) return [];

		const getTechNames = (value: string | string[]) => {
			const values = Array.isArray(value) ? value : [value];
			return values
				.filter(
					(id) =>
						id !== "none" &&
						id !== "false" &&
						!(["git", "install", "auth"].includes(category) && id === "true"),
				)
				.map((id) => options.find((opt) => opt.id === id)?.name)
				.filter(Boolean) as string[];
		};

		return getTechNames(selectedValue);
	});

	return selectedTechs.length > 0 ? selectedTechs.join(" • ") : "Custom stack";
}

export function generateStackCommand(stack: StackState): string {
	const packageManagerCommands = {
		npm: "npx create-better-t-stack@latest",
		pnpm: "pnpm create better-t-stack@latest",
		default: "bun create better-t-stack@latest",
	};

	const base =
		packageManagerCommands[
			stack.packageManager as keyof typeof packageManagerCommands
		] || packageManagerCommands.default;
	const projectName = stack.projectName || "my-better-t-app";

	if (isDefaultStack(stack)) {
		return `${base} ${projectName} --yes`;
	}

	const flags = [
		`--frontend ${
			[...stack.webFrontend, ...stack.nativeFrontend]
				.filter((v, _, arr) => v !== "none" || arr.length === 1)
				.join(" ") || "none"
		}`,
		`--backend ${stack.backend}`,
		`--runtime ${stack.runtime}`,
		`--api ${stack.api}`,
		`--auth ${stack.auth}`,
		`--database ${stack.database}`,
		`--orm ${stack.orm}`,
		`--db-setup ${stack.dbSetup}`,
		`--package-manager ${stack.packageManager}`,
		stack.git === "false" ? "--no-git" : "--git",
		`--web-deploy ${stack.webDeploy}`,
		`--server-deploy ${stack.serverDeploy}`,
		stack.install === "false" ? "--no-install" : "--install",
		`--addons ${
			stack.addons.length > 0
				? stack.addons
						.filter((addon) =>
							[
								"pwa",
								"tauri",
								"starlight",
								"biome",
								"husky",
								"turborepo",
								"ultracite",
								"fumadocs",
								"oxlint",
								"ruler",
							].includes(addon),
						)
						.join(" ") || "none"
				: "none"
		}`,
		`--examples ${stack.examples.join(" ") || "none"}`,
	];

	return `${base} ${projectName} ${flags.join(" ")}`;
}

// URL generation functions
export function generateStackUrl(
	pathname: string,
	searchParams: URLSearchParams,
): string {
	const searchString = searchParams.toString();
	return `https://better-t-stack.dev${pathname}${searchString ? `?${searchString}` : ""}`;
}

export function generateStackUrlFromState(
	stack: StackState,
	baseUrl?: string,
): string {
	const origin =
		baseUrl ||
		(typeof window !== "undefined"
			? window.location.origin
			: "https://better-t-stack.dev");

	if (isDefaultStack(stack)) {
		return `${origin}/stack`;
	}

	const stackParams = new URLSearchParams();
	Object.entries(stackUrlKeys).forEach(([stackKey, urlKey]) => {
		const value = stack[stackKey as keyof StackState];
		if (value !== undefined) {
			stackParams.set(
				urlKey,
				Array.isArray(value) ? value.join(",") : String(value),
			);
		}
	});

	return `${origin}/stack?${stackParams.toString()}`;
}

// Primary hook - simplified approach
export function useStackState() {
	const [stack, setStack] = useQueryStates(
		stackParsers,
		stackQueryStatesOptions,
	);

	const updateStack = async (
		updates: Partial<StackState> | ((prev: StackState) => Partial<StackState>),
	) => {
		const newStack = typeof updates === "function" ? updates(stack) : updates;
		const finalStack = { ...stack, ...newStack };

		await setStack(isDefaultStack(finalStack) ? null : finalStack);
	};

	return [stack, updateStack] as const;
}

// Individual state hook - kept for backward compatibility but simplified
export function useIndividualStackStates() {
	const getValidIds = (category: keyof typeof TECH_OPTIONS) =>
		TECH_OPTIONS[category]?.map((opt) => opt.id) ?? [];

	// Individual query states
	const queryStates = {
		projectName: useQueryState(
			"name",
			parseAsString.withDefault(DEFAULT_STACK.projectName),
		),
		webFrontend: useQueryState(
			"fe-w",
			parseAsArrayOf(parseAsString).withDefault(DEFAULT_STACK.webFrontend),
		),
		nativeFrontend: useQueryState(
			"fe-n",
			parseAsArrayOf(parseAsString).withDefault(DEFAULT_STACK.nativeFrontend),
		),
		runtime: useQueryState(
			"rt",
			parseAsStringEnum(getValidIds("runtime")).withDefault(
				DEFAULT_STACK.runtime,
			),
		),
		backend: useQueryState(
			"be",
			parseAsStringEnum(getValidIds("backend")).withDefault(
				DEFAULT_STACK.backend,
			),
		),
		api: useQueryState(
			"api",
			parseAsStringEnum(getValidIds("api")).withDefault(DEFAULT_STACK.api),
		),
		database: useQueryState(
			"db",
			parseAsStringEnum(getValidIds("database")).withDefault(
				DEFAULT_STACK.database,
			),
		),
		orm: useQueryState(
			"orm",
			parseAsStringEnum(getValidIds("orm")).withDefault(DEFAULT_STACK.orm),
		),
		dbSetup: useQueryState(
			"dbs",
			parseAsStringEnum(getValidIds("dbSetup")).withDefault(
				DEFAULT_STACK.dbSetup,
			),
		),
		auth: useQueryState(
			"au",
			parseAsStringEnum(getValidIds("auth")).withDefault(DEFAULT_STACK.auth),
		),
		packageManager: useQueryState(
			"pm",
			parseAsStringEnum(getValidIds("packageManager")).withDefault(
				DEFAULT_STACK.packageManager,
			),
		),
		addons: useQueryState(
			"add",
			parseAsArrayOf(parseAsString).withDefault(DEFAULT_STACK.addons),
		),
		examples: useQueryState(
			"ex",
			parseAsArrayOf(parseAsString).withDefault(DEFAULT_STACK.examples),
		),
		git: useQueryState(
			"git",
			parseAsStringEnum(["true", "false"] as const).withDefault(
				DEFAULT_STACK.git as "true" | "false",
			),
		),
		install: useQueryState(
			"i",
			parseAsStringEnum(["true", "false"] as const).withDefault(
				DEFAULT_STACK.install as "true" | "false",
			),
		),
		webDeploy: useQueryState(
			"wd",
			parseAsStringEnum(getValidIds("webDeploy")).withDefault(
				DEFAULT_STACK.webDeploy,
			),
		),
		serverDeploy: useQueryState(
			"sd",
			parseAsStringEnum(getValidIds("serverDeploy")).withDefault(
				DEFAULT_STACK.serverDeploy,
			),
		),
	};

	const stack: StackState = Object.fromEntries(
		Object.entries(queryStates).map(([key, [value]]) => [key, value]),
	) as StackState;

	const setStack = async (updates: Partial<StackState>) => {
		const promises = Object.entries(updates).map(([key, value]) => {
			const setter = queryStates[key as keyof typeof queryStates]?.[1];
			return setter?.(value as never);
		});
		await Promise.all(promises.filter(Boolean));
	};

	return [stack, setStack] as const;
}

export { CATEGORY_ORDER };
