import { MapPin, Clock, Phone, Mail } from "lucide-react";
const Location = () => {
  return <section className="py-16 md:py-24 bg-gradient-to-b from-background via-secondary/20 to-secondary/30 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Location Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-8">
                Visit Our Modern Clinic
              </h2>
            </div>

            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Location</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Unit 3 MB Building Arayat Blvd.<br />
                    Pampang, Angeles City, Philippines
                  </p>
                </div>
              </div>

              {/* Office Hours */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Opening Hours</h3>
                  <p className="text-muted-foreground">
                    Monday - Saturday: 10:00 AM - 7:00 PM<br />
                    Sunday: 2:00 PM - 8:00 PM
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Contact</h3>
                  <p className="text-muted-foreground">
                    Clinic: <a href="tel:09552219851" className="hover:text-primary transition-colors">09552219851</a><br />
                    Email: <a href="mailto:tumaladentalclinic@gmail.com" className="hover:text-primary transition-colors">Cjhairlounge.07@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <a 
            href="https://www.google.com/maps/dir//Unit+3,+CJ+hair+lounge,+MB+Building,+city,+Angeles,+2009+Pampanga/@15.1494234,120.574798,17z/data=!4m16!1m7!3m6!1s0x2bd5f29773142711:0x69f2928b36578da4!2sCJ+hair+lounge!8m2!3d15.1492499!4d120.5771908!16s%2Fg%2F11v43r0b1t!4m7!1m0!1m5!1m1!1s0x2bd5f29773142711:0x69f2928b36578da4!2m2!1d120.5771908!2d15.1492499?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-large border-2 border-primary/20 group cursor-pointer"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.187405!2d120.5746095!3d15.1492499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2bd5f29773142711%3A0x69f2928b36578da4!2sCJ%20hair%20lounge!5e0!3m2!1sen!2sph!4v1732874600000!5m2!1sen!2sph" 
              width="100%" 
              height="100%" 
              style={{ border: 0, pointerEvents: 'none' }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade" 
              title="CJ Hair Lounge Location" 
              className="" 
            />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
              <div className="bg-background/90 px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <span className="text-foreground font-semibold">Click for Directions</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>;
};
export default Location;