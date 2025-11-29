import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";

const Products = () => {
  const products = [
    { 
      name: "Purple Shampoo",
      image: product1,
      description: "Anti-fading toning shampoo"
    },
    { 
      name: "Hair Care Collection",
      image: product2,
      description: "Complete hair treatment set"
    },
    { 
      name: "Premium Hair Products",
      image: product3,
      description: "Professional salon products"
    },
    { 
      name: "Natural Moringa Oil",
      image: product4,
      description: "Nourishing hair oil"
    },
    { 
      name: "Purple Hair Masque & Brazilian Keratin",
      image: product5,
      description: "Deep conditioning & repair"
    },
  ];

  const handleOrderClick = () => {
    window.open('https://www.messenger.com/t/106878802435637', '_blank');
  };

  return (
    <section id="products" className="py-12 md:py-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-3 md:mb-4">
            Our Products
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Premium hair care products for maintaining your beautiful look at home
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto mb-8"
        >
          <CarouselContent>
            {products.map((product, index) => (
              <CarouselItem key={index} className="basis-[85%] md:basis-1/2 lg:basis-1/3">
                <div className="p-2">
                  <div className="relative overflow-hidden rounded-xl shadow-lg bg-card">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        <div className="text-center animate-fade-in-up">
          <Button 
            size="lg" 
            onClick={handleOrderClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Order Now via Messenger
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;
