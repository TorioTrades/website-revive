import { useState, useEffect } from 'react';
import { format, startOfToday, isToday, parse, isBefore, getDay } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { BookingData } from '@/types/booking';
import { appointmentStore } from '@/lib/appointmentStore';
import { unavailabilityStore } from '@/lib/unavailabilityStore';

interface DateTimeSelectionProps {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onNext: () => void;
  onClose: () => void;
}

const allTimeSlots = [
  '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
  '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
  '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM', '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM',
  '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM', '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM',
  '5:00 PM', '5:15 PM', '5:30 PM', '5:45 PM', '6:00 PM', '6:15 PM', '6:30 PM', '6:45 PM',
  '7:00 PM', '7:15 PM', '7:30 PM', '7:45 PM', '8:00 PM'
];

const getTimeSlotsForDay = (date: Date | undefined): string[] => {
  if (!date) return allTimeSlots;
  
  const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, etc.
  
  // Sunday (0): 1:00 PM to 8:00 PM
  if (dayOfWeek === 0) {
    return allTimeSlots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      const isPM = slot.includes('PM');
      const hour24 = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);
      return hour24 >= 13 && hour24 <= 20; // 1 PM to 8 PM
    });
  }
  
  // Monday to Saturday (1-6): 10:00 AM to 7:00 PM (excluding 7:15, 7:30, 7:45)
  return allTimeSlots.filter(slot => {
    if (slot === '7:15 PM' || slot === '7:30 PM' || slot === '7:45 PM') {
      return false;
    }
    const hour = parseInt(slot.split(':')[0]);
    const isPM = slot.includes('PM');
    const hour24 = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);
    return hour24 >= 10 && hour24 <= 19; // 10 AM to 7 PM
  });
};

const DateTimeSelection = ({ bookingData, setBookingData }: DateTimeSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(bookingData.date || undefined);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([]);
  const [isFullDayUnavailable, setIsFullDayUnavailable] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBookedTimes = async () => {
    if (!selectedDate || !bookingData.stylist) return;
    
    setLoading(true);
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      
      const bookedSlots = await appointmentStore.getBookedTimeSlots(
        bookingData.stylist.name,
        dateString
      );
      
      const unavailability = await unavailabilityStore.getUnavailability(
        bookingData.stylist.name, 
        dateString
      );
      
      setIsFullDayUnavailable(unavailability?.isFullDay || false);
      setBookedTimes(bookedSlots);
      setUnavailableTimes(unavailability?.timeSlots || []);
    } catch (error) {
      console.error('Error fetching booked times:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookedTimes();
  }, [selectedDate, bookingData.stylist]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setBookingData({ ...bookingData, date: date || null, time: null });
  };

  const isTimeSlotAvailable = (timeSlot: string): boolean => {
    if (isFullDayUnavailable) return false;
    if (!selectedDate) return true;

    const now = new Date();
    const slotDate = parse(timeSlot, 'h:mm a', selectedDate);
    
    if (isToday(selectedDate) && isBefore(slotDate, now)) {
      return false;
    }

    return !bookedTimes.includes(timeSlot) && !unavailableTimes.includes(timeSlot);
  };

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time });
  };

  return (
    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Select Date</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchBookedTimes}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date) => date < startOfToday()}
          className="rounded-md border"
        />
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Select Time</h3>
        {!selectedDate ? (
          <p className="text-sm sm:text-base text-muted-foreground text-center py-6 sm:py-8">Please select a date first</p>
        ) : isFullDayUnavailable ? (
          <p className="text-sm sm:text-base text-muted-foreground text-center py-6 sm:py-8">This stylist is unavailable on this date</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
            {getTimeSlotsForDay(selectedDate).map((time) => {
              const isAvailable = isTimeSlotAvailable(time);
              return (
                <Button
                  key={time}
                  variant={bookingData.time === time ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTimeSelect(time)}
                  disabled={!isAvailable}
                  className={`text-xs sm:text-sm ${
                    bookingData.time === time
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : ''
                  }`}
                >
                  {time}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimeSelection;
