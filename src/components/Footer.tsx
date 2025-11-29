import { Phone, Mail, MapPin, Clock, Facebook, ChevronDown } from "lucide-react";
import { useState } from "react";
const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };
  return <footer id="contact" className="bg-gradient-to-b from-secondary/30 to-secondary/50 pt-12 md:pt-20 pb-6 md:pb-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Brand */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center space-x-2 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-lg md:text-xl font-serif">CJ</span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl md:text-2xl text-foreground">CJ Hair Lounge</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Beauty & Wellness</p>
              </div>
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Your premier destination for complete beauty transformation in Angeles City, Pampanga.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <button onClick={() => toggleSection('links')} className="flex items-center justify-between w-full md:cursor-default">
              <h4 className="font-semibold text-base md:text-lg text-foreground mb-3 md:mb-4">Quick Links</h4>
              <ChevronDown className={`w-5 h-5 text-foreground transition-transform md:hidden ${openSection === 'links' ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-2 md:space-y-3 ${openSection === 'links' ? 'block' : 'hidden md:block'}`}>
              <li>
                <button onClick={() => scrollToSection('home')} className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="text-muted-foreground hover:text-primary transition-colors">
                  Our Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('gallery')} className="text-muted-foreground hover:text-primary transition-colors">
                  Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <button onClick={() => toggleSection('services')} className="flex items-center justify-between w-full md:cursor-default">
              <h4 className="font-semibold text-base md:text-lg text-foreground mb-3 md:mb-4">Services</h4>
              <ChevronDown className={`w-5 h-5 text-foreground transition-transform md:hidden ${openSection === 'services' ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-2 md:space-y-3 text-sm md:text-base text-muted-foreground ${openSection === 'services' ? 'block' : 'hidden md:block'}`}>
              <li>Hair Cut & Styling</li>
              <li>Brazilian Keratin</li>
              <li>Hair Color & Highlights</li>
              <li>Rebonding</li>
              <li>Balayage</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <button onClick={() => toggleSection('contact')} className="flex items-center justify-between w-full md:cursor-default">
              <h4 className="font-semibold text-base md:text-lg text-foreground mb-3 md:mb-4">Contact Us</h4>
              <ChevronDown className={`w-5 h-5 text-foreground transition-transform md:hidden ${openSection === 'contact' ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-3 md:space-y-4 ${openSection === 'contact' ? 'block' : 'hidden md:block'}`}>
              <li className="flex items-start space-x-2 md:space-x-3">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <a href="tel:09552219851" className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors">
                    09552219851
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2 md:space-x-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <a href="mailto:cjhairlounge.07@gmail.com" className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors break-all">
                    cjhairlounge.07@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2 md:space-x-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-1" />
                <div className="text-sm md:text-base text-muted-foreground">
                  Unit 3 MB Building Arayat Blvd.<br />
                  Pampang, Angeles City, Philippines
                </div>
              </li>
              
              <li className="flex items-start space-x-2 md:space-x-3">
                <Facebook className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <a href="https://www.facebook.com/CJhairlounge" target="_blank" rel="noopener noreferrer" className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors">
                    Follow us on Facebook
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 border-t border-border">
          <div className="text-center space-y-3">
            <p className="text-xs md:text-sm text-muted-foreground">
              © {new Date().getFullYear()} CJ Hair Lounge. All rights reserved. Crafted with care for your beauty journey.
            </p>
            <p className="text-xs text-muted-foreground/80">
              Powered by <span className="text-primary font-semibold">TORIOWEB</span>
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;