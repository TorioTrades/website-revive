import { BookingData } from '@/types/booking';

interface StylistSelectionProps {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onNext: () => void;
  onClose: () => void;
}

const stylists = [{
  id: '1',
  name: 'Jake',
  image: 'https://i.imgur.com/sZFOl2S.png',
  specialties: ['Hair Styling', 'Hair Coloring', 'Hair Treatment'],
  experience: 'Expert',
  expertise: 'Hair styling & coloring specialist'
}, {
  id: '2',
  name: 'Maricon',
  image: 'https://i.imgur.com/a6MvuSN.png',
  specialties: ['Eyelash Extensions', 'Eyelash Lift', 'Eyelash Tint'],
  experience: 'Expert',
  expertise: 'Eyelash extension specialist'
}];

const StylistSelection = ({
  bookingData,
  setBookingData,
  onNext
}: StylistSelectionProps) => {
  const handleStylistSelect = (stylist: typeof stylists[0]) => {
    setBookingData({
      ...bookingData,
      stylist: {
        id: stylist.id,
        name: stylist.name,
        image: stylist.image
      }
    });
    onNext();
  };
  
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-center">
        Choose your preferred stylist for your appointment
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stylists.map(stylist => (
          <div 
            key={stylist.id} 
            onClick={() => handleStylistSelect(stylist)} 
            className={`p-4 md:p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
              bookingData.stylist?.id === stylist.id 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex md:flex-col md:text-center items-center md:items-center gap-4 md:gap-0">
              <div className="w-24 h-24 md:w-40 md:h-40 md:mx-auto md:mb-4 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
                <img src={stylist.image} alt={stylist.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 md:flex-none">
                <h3 className="text-lg md:text-xl font-serif text-foreground mb-1 md:mb-2">
                  {stylist.name}
                </h3>
                
                <p className="text-primary text-sm mb-2">
                  {stylist.experience}
                </p>
                
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {stylist.expertise}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StylistSelection;
