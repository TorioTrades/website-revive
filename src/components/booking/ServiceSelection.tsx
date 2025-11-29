import { BookingData } from '@/types/booking';

interface ServiceSelectionProps {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onNext: () => void;
  onClose: () => void;
}

const jakeServices = [
  { id: 'j1', name: 'Haircut', price: 300, duration: 30, description: 'Professional haircut service', isStartingPrice: false },
  { id: 'j3', name: 'Shampoo & Blowdry', price: 300, duration: 30, description: 'Shampoo and blowdry service', isStartingPrice: true },
  { id: 'j11', name: 'Curl Iron with Shampoo', price: 400, duration: 30, description: 'Curl styling with shampoo service', isStartingPrice: false },
  { id: 'j12', name: 'Charcoal Active Detox for Scalp', price: 1500, duration: 60, description: 'For men and women', isStartingPrice: true },
  { id: 'j2', name: 'Hair Color', price: 1500, duration: 60, description: 'Professional hair coloring', isStartingPrice: true },
  { id: 'j4', name: 'Hair Mask or Treatment', price: 1500, duration: 45, description: 'Nourishing hair treatment', isStartingPrice: true },
  { id: 'j10', name: 'One Step Rebond with Hair Color and Hair Mask', price: 2500, duration: 120, description: 'Quick rebonding with color and treatment', isStartingPrice: true },
  { id: 'j5', name: 'Highlights and Tone with Hair Mask Treatment', price: 3000, duration: 180, description: 'Complete highlighting service with treatment', isStartingPrice: true },
  { id: 'j7', name: 'Keratin & Brazilian with Hair Color and Hair Mask', price: 3000, duration: 60, description: 'Keratin or Brazilian treatment with color', isStartingPrice: true },
  { id: 'j8', name: 'Keratin with Hair Color and Hair Mask', price: 3500, duration: 120, description: 'Keratin treatment with color and mask', isStartingPrice: true },
  { id: 'j6', name: 'Balayage & Tone with Hair Mask Treatment', price: 3500, duration: 180, description: 'Balayage coloring with treatment', isStartingPrice: true },
  { id: 'j9', name: 'Brazilian Blow Out Original with Hair Color and Hair Mask', price: 4000, duration: 120, description: 'Original Brazilian blowout with color', isStartingPrice: true },
];

const mariconServices = [
  { id: 'm1', name: 'Classic Lashes', price: 700, duration: 90, description: 'Classic lash extensions', isStartingPrice: true },
  { id: 'm2', name: 'Volume Lashes (70% Classic / 30% Volume)', price: 1200, duration: 120, description: 'Hybrid volume lash extensions', isStartingPrice: true },
  { id: 'm3', name: 'Regular Volume (100% volume)', price: 1500, duration: 120, description: 'Full volume lash extensions', isStartingPrice: true },
  { id: 'm4', name: 'Mascara Wetlash (100% Close Fan)', price: 1300, duration: 120, description: 'Wet look volume lashes', isStartingPrice: true },
  { id: 'm5', name: 'Anime Lash (100% Close Fan)', price: 1300, duration: 120, description: 'Anime-style volume lashes', isStartingPrice: true },
  { id: 'm6', name: 'Lash Lift with Tint', price: 1000, duration: 60, description: 'Lash lift and tinting service', isStartingPrice: true },
];

const ServiceSelection = ({ bookingData, setBookingData, onNext }: ServiceSelectionProps) => {
  const services = bookingData.stylist?.name === 'Jake' ? jakeServices : mariconServices;
  
  const handleServiceSelect = (service: typeof jakeServices[0]) => {
    setBookingData({
      ...bookingData,
      service: {
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration
      }
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-center">
        Select a service for your appointment
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          return (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                bookingData.service?.id === service.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex flex-col">
                <h3 className="text-sm font-serif text-foreground mb-1">
                  {service.name}
                </h3>
                
                <p className="text-xs text-muted-foreground mb-2">
                  {service.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-primary">
                      ₱{service.price}
                    </span>
                    {service.isStartingPrice && (
                      <span className="text-xs text-muted-foreground">
                        starting price
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {service.duration} mins
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelection;
