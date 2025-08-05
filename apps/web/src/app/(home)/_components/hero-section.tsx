import NpmPackage from "./npm-package";

export default function HeroSection() {
	return (
		<>
			<div className="mb-8 flex items-center justify-center">
				<div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6">
					<pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
						{`
██████╗  ██████╗ ██╗     ██╗
██╔══██╗██╔═══██╗██║     ██║
██████╔╝██║   ██║██║     ██║
██╔══██╗██║   ██║██║     ██║
██║  ██║╚██████╔╝███████╗███████╗
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝`}
					</pre>

					<pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
						{`
██╗   ██╗ ██████╗ ██╗   ██╗██████╗
╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗
 ╚████╔╝ ██║   ██║██║   ██║██████╔╝
  ╚██╔╝  ██║   ██║██║   ██║██╔══██╗
   ██║   ╚██████╔╝╚██████╔╝██║  ██║
   ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝`}
					</pre>

					<pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
						{`
 ██████╗ ██╗    ██╗███╗   ██╗
██╔═══██╗██║    ██║████╗  ██║
██║   ██║██║ █╗ ██║██╔██╗ ██║
██║   ██║██║███╗██║██║╚██╗██║
╚██████╔╝╚███╔███╔╝██║ ╚████║
 ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝`}
					</pre>

					<pre className="ascii-art text-primary text-xs leading-tight sm:text-sm">
						{`
███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
███████╗   ██║   ███████║██║     █████╔╝
╚════██║   ██║   ██╔══██║██║     ██╔═██╗
███████║   ██║   ██║  ██║╚██████╗██║  ██╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`}
					</pre>
				</div>
			</div>

			<div className="mb-6 text-center">
				<p className="mx-auto text-lg text-muted-foreground">
					Modern CLI for scaffolding end-to-end type-safe TypeScript projects
				</p>
				<p className="mx-auto mt-2 max-w-2xl text-muted-foreground text-sm">
					Production-ready • Customizable • Best practices included
				</p>
				<NpmPackage />
			</div>
		</>
	);
}
