"use client";
import CommandSection from "./_components/command-section";
import Footer from "./_components/footer";
import HeroSection from "./_components/hero-section";
import SponsorsSection from "./_components/sponsors-section";
import StatsSection from "./_components/stats-section";
import Testimonials from "./_components/testimonials";

export default function HomePage() {
	return (
		<div className="mx-auto min-h-svh max-w-[1280px]">
			<main className="mx-auto px-4 pt-12">
				<HeroSection />
				<CommandSection />
				<StatsSection />
				<SponsorsSection />
				<Testimonials />
			</main>
			<Footer />
		</div>
	);
}
