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

const allTimeSlots = [
  '9:00 AM', '9:20 AM', '9:40 AM',
  '10:00 AM', '10:20 AM', '10:40 AM',
  '11:00 AM', '11:20 AM', '11:40 AM',
  '12:00 PM', '12:20 PM', '12:40 PM',
  '1:00 PM', '1:20 PM', '1:40 PM',
  '2:00 PM', '2:20 PM', '2:40 PM',
  '3:00 PM', '3:20 PM', '3:40 PM',
  '4:00 PM', '4:20 PM', '4:40 PM',
  '5:00 PM', '5:20 PM', '5:40 PM',
  '6:00 PM', '6:20 PM', '6:40 PM',
  '7:00 PM',
];

export const UnavailabilityManager = () => {
  const [selectedStylist, setSelectedStylist] = useState<string>('Jake');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [isFullDay, setIsFullDay] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState<Unavailability[]>([]);

  useEffect(() => {
    loadUnavailableSlots();
  }, []);

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
    const timeSlotsToSave = isFullDay ? allTimeSlots : selectedTimeSlots;

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

              <div className="grid grid-cols-3 gap-2">
                {allTimeSlots.map(timeSlot => (
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
