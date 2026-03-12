import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'

export default function HomePage() {
    return (
        <>
            <Navbar />
            <main className="pt-14">
                <HeroSection />
            </main>
            <Footer />
        </>
    )
}
