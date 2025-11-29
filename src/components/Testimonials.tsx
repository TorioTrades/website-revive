import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria Lourdes Reyes",
      review: "Service ambiance experience price all great! 😍",
      rating: 5,
    },
    {
      name: "Carmen Bautista",
      review: "Nice services, affordable prices. Nice staff 👍",
      rating: 5,
    },
    {
      name: "Isabella Ramos",
      review: "Staff is really kind... and services are also good! ⭐️⭐️",
      rating: 5,
    },
  ];

  return (
    <section className="py-12 md:py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <p className="text-primary font-medium tracking-wider uppercase text-xs md:text-sm mb-2">Testimonials</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-foreground mb-3 md:mb-4">
            What They're Talking About us
          </h2>
          <button 
            onClick={() => window.open('https://www.facebook.com/CJhairlounge', '_blank')}
            className="inline-flex items-center justify-center mt-4 px-5 py-2 md:px-6 bg-black hover:bg-black/90 text-white font-semibold rounded-full transition-all text-sm md:text-base w-full sm:w-auto"
          >
            Share Your Feedback
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="p-4 md:p-6 bg-card border-0 shadow-lg hover-lift animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex mb-3 md:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-base md:text-lg text-foreground mb-4 md:mb-6 leading-relaxed">
                "{testimonial.review}"
              </p>
              <p className="font-semibold text-foreground">{testimonial.name}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
