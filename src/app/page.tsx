
import { LandingHeader } from "@/components/landing-header";
import { Orbs } from "@/components/landing/orbs";
import { Hero } from "@/components/landing/hero";
import { Advantages } from "@/components/landing/advantages";
import { Courses } from "@/components/landing/courses";
import { Trajectories } from "@/components/landing/trajectories";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { PlatformDetails } from '@/components/landing/platform-details';

export default function LandingPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
      <Orbs />
      <LandingHeader />
      <main id="main" className="flex-1">
        <Hero />
        <Advantages />
        <Courses />
        <Trajectories />
        <PlatformDetails />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
