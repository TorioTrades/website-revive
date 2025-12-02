import { BookingData } from '@/types/booking';

interface ServiceSelectionProps {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onNext: () => void;
  onClose: () => void;
}

const jakeServices = [
  { id: 'j1', name: 'Blow Dry', price: 200, duration: 30, description: 'Professional blow dry service', isStartingPrice: false },
  { id: 'j2', name: "Women's Hair Cut", price: 250, duration: 45, description: 'Professional haircut for women', isStartingPrice: false },
  { id: 'j3', name: "Men's Hair Cut", price: 250, duration: 30, description: 'Professional haircut for men', isStartingPrice: false },
  { id: 'j4', name: 'Curling', price: 300, duration: 45, description: 'Hair curling service', isStartingPrice: false },
  { id: 'j5', name: 'Iron', price: 200, duration: 30, description: 'Hair straightening with iron', isStartingPrice: false },
  { id: 'j6', name: 'Brazilian Keratin', price: 2500, duration: 120, description: 'Brazilian keratin treatment', isStartingPrice: true },
  { id: 'j7', name: 'Package 1 (Color with Brazilian Keratin)', price: 3000, duration: 180, description: 'Hair color with Brazilian keratin treatment', isStartingPrice: true },
  { id: 'j8', name: 'Package 2 (Classic One Step Rebond with Brazilian Keratin or Color)', price: 3000, duration: 180, description: 'Classic one step rebond with Brazilian keratin or color', isStartingPrice: true },
  { id: 'j9', name: 'Classic Highlights or Balayage with Toner', price: 3000, duration: 180, description: 'Classic highlights or balayage with toner service', isStartingPrice: true },
];

const mariconServices = [
  { id: 'm1', name: 'Classic Natural', price: 500, duration: 90, description: 'Fullset Additional 200 - Retouch starting price 300', isStartingPrice: true },
  { id: 'm2', name: 'Hybrid (70% Classics 30% Volume)', price: 1000, duration: 120, description: 'Fullset Additional 300 - Retouch starting price 400', isStartingPrice: true },
  { id: 'm3', name: 'Regular Volume (100% Volume)', price: 1200, duration: 120, description: 'Fullset Additional 300 - Retouch starting price 500', isStartingPrice: true },
  { id: 'm4', name: 'Whispy (100% Texture Volume)', price: 1200, duration: 120, description: 'Fullset Additional 300 - Retouch starting price 500', isStartingPrice: true },
  { id: 'm5', name: 'Maskara Wetlash (100% Close from Volume)', price: 1300, duration: 120, description: 'Fullset Additional 300 - Retouch starting price 500', isStartingPrice: true },
  { id: 'm6', name: 'Anime Look (100% Close Fan)', price: 1300, duration: 120, description: 'Fullset Additional 300 - Retouch starting price 400', isStartingPrice: true },
  { id: 'm7', name: 'Lashlift with Tint', price: 800, duration: 60, description: 'Lash lift and tinting service', isStartingPrice: false },
  { id: 'm8', name: 'Brow Wax', price: 200, duration: 20, description: 'Eyebrow waxing service', isStartingPrice: false },
  { id: 'm9', name: 'Brow Tint', price: 500, duration: 30, description: 'Eyebrow tinting service', isStartingPrice: false },
  { id: 'm10', name: 'Brow Tint & Wax', price: 650, duration: 40, description: 'Eyebrow tinting and waxing service', isStartingPrice: false },
  { id: 'm11', name: 'Lash Remove', price: 200, duration: 30, description: 'Lash extension removal service', isStartingPrice: false },
  { id: 'm12', name: 'Other Studio', price: 500, duration: 60, description: 'Other studio services', isStartingPrice: false },
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
