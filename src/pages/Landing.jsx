import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Hero/Hero'
import Features from '../components/Features/Features'
import HowItWorks from '../components/HowItWorks/HowItWorks'
import FAQ from '../components/FAQ/FAQ'
import Footer from '../components/Footer/Footer'

function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <FAQ />
        <Footer />
      </main>
    </>
  )
}

export default Landing
