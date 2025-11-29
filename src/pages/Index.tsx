import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Promotions from "@/components/Promotions";
import Products from "@/components/Products";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Location from "@/components/Location";
import BookingDialog from "@/components/BookingDialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const Index = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById('contact');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const isVisible = footerRect.top < window.innerHeight;
        setIsFooterVisible(isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="home" className="min-h-screen bg-background">
      <Header onBookingClick={() => setBookingOpen(true)} />
      <main>
        <Hero onBookingClick={() => setBookingOpen(true)} />
        <About />
        <Services onBookingClick={() => setBookingOpen(true)} />
        <Products />
        <WhyChooseUs />
        <Promotions onBookingClick={() => setBookingOpen(true)} />
        <Gallery />
        <Testimonials />
      </main>
      <Location />
      <Footer />
      
      <Button
        onClick={() => setBookingOpen(true)}
        size="lg"
        className={`fixed bottom-8 right-8 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground z-50 transition-opacity duration-300 ${
          isFooterVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Calendar className="mr-2 h-5 w-5" />
        Book Now
      </Button>

      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  );
};

export default Index;
