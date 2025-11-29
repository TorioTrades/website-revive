const salonInterior = "https://i.imgur.com/OwGDdmx.jpeg";
const About = () => {
  return <section id="about" className="py-8 md:py-12 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
          <p className="text-primary font-medium tracking-wider uppercase text-xs md:text-sm mb-2">Our Story</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-foreground">About Us</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mt-8 md:mt-12">
          {/* Text Content */}
          <div className="space-y-3 md:space-y-4 animate-fade-in-up">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Welcome to <span className="font-semibold text-foreground">CJ Hair Lounge</span> — Pampanga's premier destination for hair excellence. We bring global hair trends and cutting-edge techniques to transform your look with personalized luxury care.
            </p>

            <div className="grid grid-cols-1 gap-2 md:gap-3 pt-3">
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm md:text-base text-foreground">Brazilian Keratin Treatments</h4>
                  <p className="text-sm md:text-base text-muted-foreground">Smooth, frizz-free hair with our signature keratin therapy</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm md:text-base text-foreground">Color & Highlights Expertise</h4>
                  <p className="text-sm md:text-base text-muted-foreground">From balayage to full color transformations</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm md:text-base text-foreground">Professional Styling Services</h4>
                  <p className="text-sm md:text-base text-muted-foreground">Cuts, blow dry, curling, and rebonding for every style</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="animate-scale-in order-first md:order-last">
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
              <img src={salonInterior} alt="CJ Hair Lounge luxurious salon interior with modern styling stations" className="w-full h-64 md:h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
                <h3 className="text-xl md:text-2xl font-serif font-bold mb-1 md:mb-2">Our Hair Lounge Space</h3>
                <p className="text-xs md:text-sm text-white/90">A sanctuary designed for your transformation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default About;