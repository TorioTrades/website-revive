import { Button } from "@/components/ui/button";
import heroWoman from "@/assets/hero-woman-new.png";
import { useState } from "react";
import GalleryDialog from "./GalleryDialog";

interface PromotionsProps {
  onBookingClick: () => void;
}

const Promotions = ({ onBookingClick }: PromotionsProps) => {
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <>
    <section className="py-12 md:py-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Promotion 1 */}
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl group animate-fade-in-up bg-gradient-to-br from-primary to-primary/80 p-8 md:p-12 flex flex-col justify-center min-h-[350px] md:min-h-[400px]">
            <div className="relative z-10 text-center">
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-3 md:mb-4">
                Discover Your
                <span className="block mt-1 md:mt-2">New Look</span>
              </h3>
              <p className="text-primary-foreground/90 text-sm md:text-lg mb-6 md:mb-8 max-w-md mx-auto">
                Transform your style with our expert team
              </p>
              <Button 
                onClick={onBookingClick}
                className="bg-background text-primary hover:bg-background/90 font-semibold px-6 py-5 md:px-8 md:py-6 text-base md:text-lg rounded-full shadow-lg hover:scale-105 transition-all w-full sm:w-auto mx-auto"
              >
                Book Now
              </Button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-transparent" />
          </div>

          {/* Promotion 2 */}
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl group animate-fade-in-up">
            <img 
              src={heroWoman} 
              alt="Beautiful confident woman - CJ Hair Lounge transformation" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end h-full min-h-[350px] md:min-h-[400px]">
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3 md:mb-4">
                Explore Our
                <span className="block mt-1 md:mt-2 text-primary">Hair Gallery</span>
              </h3>
              <p className="text-white/90 text-sm md:text-lg mb-4 md:mb-6">
                See stunning transformations and beautiful hair artistry
              </p>
              <Button 
                onClick={() => setGalleryOpen(true)}
                className="self-start bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-5 md:px-8 md:py-6 text-base md:text-lg rounded-full shadow-lg hover:scale-105 transition-all w-full sm:w-auto"
              >
                Gallery
              </Button>
            </div>
          </div>
        </div>
      </div>

      <GalleryDialog open={galleryOpen} onOpenChange={setGalleryOpen} />
    </section>
    </>
  );
};

export default Promotions;
