import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CitySelector from '@/components/CitySelector'
import FeaturedProjects from '@/components/FeaturedProjects'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <section id="home">
        <Hero />
      </section>
      <section id="projects">
        <CitySelector />
        <FeaturedProjects />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <section id="contact">
        <ContactSection />
      </section>
      <Footer />
    </main>
  )
}
