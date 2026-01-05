import { BookingData } from '@/types/booking';

interface ServiceSelectionProps {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onNext: () => void;
  onClose: () => void;
}

const jakeServices = [
  { id: 'j1', name: "Men's Hair Cut", price: 300, duration: 30, description: 'Professional haircut for men', isStartingPrice: false },
  { id: 'j2', name: "Women's Hair Cut", price: 300, duration: 45, description: 'Professional haircut for women', isStartingPrice: false },
  { id: 'j3', name: 'Hair Color', price: 1500, duration: 90, description: 'Professional hair coloring service', isStartingPrice: true },
  { id: 'j4', name: 'Shampoo and Blow Dry', price: 300, duration: 30, description: 'Shampoo and blow dry service', isStartingPrice: false },
  { id: 'j5', name: 'Curl Iron with Shampoo', price: 400, duration: 45, description: 'Curl iron styling with shampoo', isStartingPrice: false },
  { id: 'j6', name: 'Hair Mask or Treatment', price: 1500, duration: 60, description: 'Hair mask or treatment service', isStartingPrice: true },
  { id: 'j7', name: 'Charcoal Active Detox for Scalp', price: 1500, duration: 60, description: 'Charcoal active detox treatment for scalp', isStartingPrice: true },
  { id: 'j8', name: 'Highlights & Tone Hair Mask with Treatment', price: 3500, duration: 180, description: 'Highlights and tone with hair mask treatment', isStartingPrice: true },
  { id: 'j9', name: 'Keratin and Brazilian with Hair Color and Hair Mask (After 2 days)', price: 3500, duration: 180, description: 'Keratin and Brazilian treatment with hair color and hair mask', isStartingPrice: true },
  { id: 'j10', name: 'Brazilian Blow Out Original with Hair Color and Hair Mask (After 2 days)', price: 4000, duration: 180, description: 'Brazilian blow out with hair color and hair mask', isStartingPrice: true },
  { id: 'j11', name: 'One Step Rebond with Hair Color and Hair Mask', price: 5000, duration: 240, description: 'One step rebond with hair color and hair mask', isStartingPrice: true },
];

const mariconServices = [
  { id: 'm1', name: 'Classic Natural', price: 500, duration: 90, description: 'Fullset Additional 200 - Retouch starting price 300', isStartingPrice: false },
  { id: 'm2', name: 'Hybrid (70% Classics 30% Volume)', price: 1000, duration: 120, description: 'Fullset Additional 300 - Retouch starting price 400', isStartingPrice: false },
  { id: 'm3', name: 'Regular Volume (100% Volume)', price: 1200, duration: 120, description: 'Fullset Additional 300 - Retouch starting price 500', isStartingPrice: false },
  { id: 'm4', name: 'Whispy (100% Texture Volume)', price: 1200, duration: 120, description: 'Fullset Additional 300 - Retouch starting price 500', isStartingPrice: false },
  { id: 'm5', name: 'Maskara Wetlash (100% Close from Volume)', price: 1300, duration: 120, description: 'Fullset Additional 300 - Retouch starting price 500', isStartingPrice: false },
  { id: 'm6', name: 'Anime Look (100% Close Fan)', price: 1300, duration: 120, description: 'Fullset Additional 300 - Retouch starting price 400', isStartingPrice: false },
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
