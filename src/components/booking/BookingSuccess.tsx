import { format } from 'date-fns';
import { CheckCircle, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingData } from '@/types/booking';

interface BookingSuccessProps {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onNext: () => void;
  onClose: () => void;
}

const BookingSuccess = ({
  bookingData,
  onClose
}: BookingSuccessProps) => {
  const bookingId = bookingData.bookingId || 'CLNT-0';

  return (
    <div className="max-w-2xl mx-auto text-center space-y-3">
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-1">
          Booking Confirmed!
        </h2>
        <p className="text-sm text-muted-foreground">
          Your appointment has been successfully booked
        </p>
      </div>

      <div className="bg-card border rounded-lg p-4 text-left space-y-3">
        <div className="text-center pb-3 border-b">
          <p className="text-xs text-muted-foreground mb-1">Client #</p>
          <p className="text-lg font-mono font-bold text-primary">{bookingId}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Date & Time</p>
              <p className="text-sm font-semibold text-foreground">
                {bookingData.date && format(bookingData.date, 'MMM dd, yyyy')} at {bookingData.time}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-semibold text-foreground">Unit 3 MB Building Arayat Blvd. Pampang, Angeles City</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Contact</p>
              <p className="text-sm font-semibold text-foreground">{bookingData.customerInfo.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-secondary/30 border border-primary/20 rounded-lg p-3 space-y-1.5">
        <p className="text-xs text-foreground">
          <strong>Important:</strong> Please arrive 5-10 minutes before your appointment time.
        </p>
        <p className="text-xs text-foreground">
          <strong>Tip:</strong> Take a screenshot of this confirmation to show your stylist during your appointment.
        </p>
      </div>

      <Button 
        onClick={onClose}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Close
      </Button>
    </div>
  );
};

export default BookingSuccess;
