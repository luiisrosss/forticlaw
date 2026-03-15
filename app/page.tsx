import { WAITLIST_MODE } from "@/lib/config"
import { Navbar } from "@/components/ui/navbar"
import { NavbarLaunch } from "@/components/ui/navbar-launch"
import { HeroSection } from "@/components/sections/hero-section"
import { HeroSectionLaunch } from "@/components/sections/hero-section-launch"
import { ImpactSection } from "@/components/sections/impact-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CtaSection } from "@/components/sections/cta-section"
import { CtaSectionLaunch } from "@/components/sections/cta-section-launch"
import { FooterSection } from "@/components/sections/footer-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      {WAITLIST_MODE ? <Navbar /> : <NavbarLaunch />}
      {WAITLIST_MODE ? <HeroSection /> : <HeroSectionLaunch />}
      <ImpactSection />
      <FeaturesSection />
      <TestimonialsSection />
      {WAITLIST_MODE ? <CtaSection /> : <CtaSectionLaunch />}
      <FooterSection />
    </main>
  )
}
