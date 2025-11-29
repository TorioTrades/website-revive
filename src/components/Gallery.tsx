import { useState, useEffect } from "react";
import GalleryDialog from "./GalleryDialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { galleryStore, GalleryImage } from "@/lib/galleryStore";
import gallery1 from "@/assets/gallery-1.jpeg";
import gallery2 from "@/assets/gallery-2.jpeg";
import gallery3 from "@/assets/gallery-3.jpeg";
import gallery4 from "@/assets/gallery-4.jpeg";
import gallery5 from "@/assets/gallery-5.jpeg";

const Gallery = () => {
  const [dbImages, setDbImages] = useState<GalleryImage[]>([]);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  
  const staticImages = [
    { src: gallery1, alt: "CJ Hair Lounge transformation 1" },
    { src: gallery2, alt: "CJ Hair Lounge transformation 2" },
    { src: gallery3, alt: "CJ Hair Lounge transformation 3" },
    { src: gallery4, alt: "CJ Hair Lounge transformation 4" },
    { src: gallery5, alt: "CJ Hair Lounge transformation 5" },
  ];

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    const images = await galleryStore.getImages();
    setDbImages(images);
  };

  // Combine database images with static images
  const allImages = [
    ...dbImages.map(img => ({ src: img.image_url, alt: img.title || "Gallery image" })),
    ...staticImages
  ];

  return (
    <section id="gallery" className="py-12 md:py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-3 md:mb-4">
            Our Gallery
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Explore stunning transformations and beautiful hair artistry from CJ Hair Lounge
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {allImages.map((image, index) => (
              <CarouselItem key={index} className="basis-[85%] md:basis-1/2 lg:basis-1/3">
                <div className="p-2">
                  <div 
                    className="relative overflow-hidden rounded-xl shadow-lg aspect-[3/4] group cursor-pointer"
                    onClick={() => setGalleryDialogOpen(true)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg font-semibold">
                        View Gallery
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>

      <GalleryDialog open={galleryDialogOpen} onOpenChange={setGalleryDialogOpen} />
    </section>
  );
};

export default Gallery;
