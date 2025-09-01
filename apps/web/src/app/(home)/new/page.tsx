import StackBuilder from "../_components/stack-builder";

export default function FullScreenStackBuilder() {
	return (
		<div className="grid h-[calc(100vh-64px)] w-full flex-1 grid-cols-1 overflow-hidden">
			<StackBuilder />
		</div>
	);
}
