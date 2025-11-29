import { forwardRef, useImperativeHandle } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, Scissors, Phone, Mail } from 'lucide-react';
import { BookingData } from '@/types/booking';
import { appointmentStore } from '@/lib/appointmentStore';
import { toast } from 'sonner';
import { customerInfoSchema } from '@/lib/validations/booking';

interface BookingConfirmationProps {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onNext: () => void;
  onClose: () => void;
}

const BookingConfirmation = forwardRef<{ handleConfirm: () => Promise<void> }, BookingConfirmationProps>(
  ({ bookingData, setBookingData, onNext }, ref) => {
    const handleConfirm = async () => {
      if (!bookingData.stylist || !bookingData.service || !bookingData.date || !bookingData.time) {
        toast.error('Missing booking information');
        return;
      }

      // Validate customer information before submitting
      try {
        customerInfoSchema.parse(bookingData.customerInfo);
      } catch (error: any) {
        if (error.errors && error.errors.length > 0) {
          toast.error(`Validation error: ${error.errors[0].message}`);
        } else {
          toast.error('Please check your information and try again');
        }
        return;
      }

      try {
        const appointment = await appointmentStore.addAppointment({
          barberName: bookingData.stylist.name,
          customerName: bookingData.customerInfo.name.trim(),
          customerPhone: bookingData.customerInfo.phone.trim(),
          customerEmail: bookingData.customerInfo.email?.trim() || '',
          service: bookingData.service.name,
          date: format(bookingData.date, 'yyyy-MM-dd'),
          time: bookingData.time,
          status: 'pending',
          price: bookingData.service.price.toString(),
          duration: bookingData.service.duration,
        });

        if (appointment) {
          setBookingData({ ...bookingData, bookingId: `CLNT-${appointment.bookingNumber}` });
          toast.success('Booking confirmed successfully!');
          onNext();
        } else {
          toast.error('Failed to create booking');
        }
      } catch (error) {
        console.error('Error confirming booking:', error);
        toast.error('An error occurred while creating the booking');
      }
    };

    useImperativeHandle(ref, () => ({
      handleConfirm,
    }));

    return (
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Review Your Booking</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Please confirm the details below</p>
        </div>

        <Card>
          <CardContent className="pt-3 sm:pt-4 space-y-2.5">
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Stylist</p>
                <p className="text-sm font-semibold text-foreground">{bookingData.stylist?.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Scissors className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Service</p>
                <p className="text-sm font-semibold text-foreground">{bookingData.service?.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-semibold text-foreground">
                  {bookingData.date && format(bookingData.date, 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-sm font-semibold text-foreground">{bookingData.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Contact</p>
                <p className="text-sm font-semibold text-foreground">{bookingData.customerInfo.name}</p>
                <p className="text-xs text-foreground">{bookingData.customerInfo.phone}</p>
                {bookingData.customerInfo.email && (
                  <p className="text-xs text-foreground">{bookingData.customerInfo.email}</p>
                )}
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    );
  }
);

BookingConfirmation.displayName = 'BookingConfirmation';

export default BookingConfirmation;
