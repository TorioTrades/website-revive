import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { unavailabilityStore, Unavailability } from '@/lib/unavailabilityStore';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// All possible time slots (10:00 AM to 8:00 PM with 15-minute intervals)
const allTimeSlots = [
  '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
  '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM', 
  '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
  '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM', 
  '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM',
  '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM', 
  '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM',
  '5:00 PM', '5:15 PM', '5:30 PM', '5:45 PM', 
  '6:00 PM', '6:15 PM', '6:30 PM', '6:45 PM',
  '7:00 PM', '7:15 PM', '7:30 PM', '7:45 PM', 
  '8:00 PM'
];

// Get time slots based on day of week
// Sunday: 1:00 PM to 8:00 PM
// Monday-Saturday: 10:00 AM to 7:00 PM
const getTimeSlotsForDay = (date: Date | undefined): string[] => {
  if (!date) return allTimeSlots;
  
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
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

export const UnavailabilityManager = () => {
  const [selectedStylist, setSelectedStylist] = useState<string>('Jake');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [isFullDay, setIsFullDay] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState<Unavailability[]>([]);
  
  // Get available time slots based on selected date
  const availableTimeSlots = getTimeSlotsForDay(selectedDate);

  useEffect(() => {
    loadUnavailableSlots();
  }, []);

  // Reset selected time slots when date changes (if the slots aren't valid for new day)
  useEffect(() => {
    if (selectedDate && selectedTimeSlots.length > 0) {
      const validSlots = selectedTimeSlots.filter(slot => 
        availableTimeSlots.includes(slot)
      );
      if (validSlots.length !== selectedTimeSlots.length) {
        setSelectedTimeSlots(validSlots);
      }
    }
  }, [selectedDate]);

  const loadUnavailableSlots = async () => {
    // For now, we'll fetch all unavailability records
    // In a real app, you might want to paginate or filter these
    const { data } = await supabase
      .from('unavailability')
      .select('*')
      .order('date', { ascending: true });
    
    if (data) {
      const mapped: Unavailability[] = data.map(item => ({
        id: item.id,
        barberName: item.barber_name,
        date: item.date,
        timeSlots: item.time_slots,
        isFullDay: item.is_full_day,
        reason: item.reason,
        createdAt: item.created_at,
      }));
      setUnavailableSlots(mapped);
    }
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    if (isFullDay) return; // Don't allow individual selection if full day is marked
    
    setSelectedTimeSlots(prev => {
      if (prev.includes(timeSlot)) {
        return prev.filter(t => t !== timeSlot);
      } else {
        return [...prev, timeSlot];
      }
    });
  };

  const handleMarkFullDay = () => {
    setIsFullDay(!isFullDay);
    if (!isFullDay) {
      setSelectedTimeSlots([]); // Clear individual selections
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (!isFullDay && selectedTimeSlots.length === 0) {
      toast.error('Please select time slots or mark the full day as unavailable');
      return;
    }

    setLoading(true);
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const timeSlotsToSave = isFullDay ? availableTimeSlots : selectedTimeSlots;

    const result = await unavailabilityStore.setUnavailability(
      selectedStylist,
      dateString,
      timeSlotsToSave,
      isFullDay,
      reason || undefined
    );

    if (result) {
      toast.success(`Marked ${isFullDay ? 'full day' : `${selectedTimeSlots.length} time slot(s)`} as unavailable`);
      // Reset form
      setSelectedTimeSlots([]);
      setIsFullDay(false);
      setReason('');
      await loadUnavailableSlots();
    } else {
      toast.error('Failed to mark unavailability');
    }

    setLoading(false);
  };

  const handleDeleteUnavailability = async (id: string) => {
    if (!confirm('Are you sure you want to delete this unavailability record?')) return;

    const success = await unavailabilityStore.deleteUnavailability(id);
    if (success) {
      toast.success('Unavailability deleted');
      await loadUnavailableSlots();
    } else {
      toast.error('Failed to delete unavailability');
    }
  };

  const handleRemoveTimeSlot = (timeSlot: string) => {
    setSelectedTimeSlots(prev => prev.filter(t => t !== timeSlot));
  };

  return (
    <div className="space-y-6">
      {/* Mark Unavailability Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mark Daily Unavailability</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select dates and times when you're not available for appointments
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stylist Selection */}
          <div className="space-y-2">
            <Label>Select Stylist *</Label>
            <Select value={selectedStylist} onValueChange={setSelectedStylist}>
              <SelectTrigger>
                <SelectValue placeholder="Select a stylist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jake">Jake</SelectItem>
                <SelectItem value="Maricon">Maricon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Select Date *</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              className="rounded-md border"
            />
          </div>

          {/* Mark Full Day Button */}
          <Button
            onClick={handleMarkFullDay}
            variant={isFullDay ? "destructive" : "outline"}
            className="w-full"
          >
            {isFullDay ? 'Unmark Full Day' : 'Mark Whole Day Unavailable'}
          </Button>

          {/* Time Slot Selection */}
          {!isFullDay && (
            <>
              <div className="space-y-2">
                <Label>Select Specific Unavailable Time Slots</Label>
                <p className="text-sm text-muted-foreground">
                  Click on time slots to mark them as unavailable. You can select multiple times.
                </p>
              </div>

              {!selectedDate ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Please select a date first to see available time slots
                </p>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">
                    {selectedDate.getDay() === 0 
                      ? 'Sunday hours: 1:00 PM - 8:00 PM' 
                      : 'Mon-Sat hours: 10:00 AM - 7:00 PM'}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimeSlots.map(timeSlot => (
                      <Button
                        key={timeSlot}
                        variant={selectedTimeSlots.includes(timeSlot) ? "destructive" : "outline"}
                        onClick={() => handleTimeSlotToggle(timeSlot)}
                        className="w-full"
                      >
                        {timeSlot}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Selected Times Display */}
          {selectedTimeSlots.length > 0 && (
            <div className="space-y-2">
              <Label>Selected unavailable times ({selectedTimeSlots.length}):</Label>
              <div className="flex flex-wrap gap-2">
                {selectedTimeSlots.map(timeSlot => (
                  <Badge key={timeSlot} variant="destructive" className="gap-1">
                    {timeSlot}
                    <X
                      className="w-3 h-3 cursor-pointer hover:opacity-70"
                      onClick={() => handleRemoveTimeSlot(timeSlot)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Textarea
              placeholder="Enter reason for unavailability..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading || !selectedDate || (!isFullDay && selectedTimeSlots.length === 0)}
            className="w-full"
          >
            {loading ? 'Saving...' : `Mark ${isFullDay ? 'Full Day' : `${selectedTimeSlots.length} Time Slot(s)`} as Unavailable`}
          </Button>
        </CardContent>
      </Card>

      {/* Current Unavailable Slots */}
      <Card>
        <CardHeader>
          <CardTitle>Current Unavailable Slots</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your marked unavailable dates and times
          </p>
        </CardHeader>
        <CardContent>
          {unavailableSlots.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No unavailable slots marked</p>
          ) : (
            <div className="space-y-4">
              {unavailableSlots.map((slot) => (
                <Card key={slot.id} className="shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{slot.barberName}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="font-medium">{format(new Date(slot.date), 'MMM d, yyyy')}</span>
                          {slot.isFullDay && (
                            <Badge variant="destructive">Full Day</Badge>
                          )}
                        </div>
                        
                        {!slot.isFullDay && (
                          <div className="flex flex-wrap gap-1">
                            {slot.timeSlots.map(time => (
                              <Badge key={time} variant="secondary" className="text-xs">
                                {time}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {slot.reason && (
                          <p className="text-sm text-muted-foreground italic">
                            Reason: {slot.reason}
                          </p>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUnavailability(slot.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
