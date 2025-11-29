import { supabase } from '@/integrations/supabase/client';

export interface Unavailability {
  id: string;
  barberName: string;
  date: string;
  timeSlots: string[];
  isFullDay: boolean;
  reason?: string;
  createdAt?: string;
}

export const unavailabilityStore = {
  async getUnavailability(barberName: string, date: string): Promise<Unavailability | null> {
    const { data, error } = await supabase
      .from('unavailability')
      .select('*')
      .eq('barber_name', barberName)
      .eq('date', date)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching unavailability:', error);
      return null;
    }

    return {
      id: data.id,
      barberName: data.barber_name,
      date: data.date,
      timeSlots: data.time_slots,
      isFullDay: data.is_full_day,
      reason: data.reason,
      createdAt: data.created_at,
    };
  },

  async setUnavailability(
    barberName: string,
    date: string,
    timeSlots: string[],
    isFullDay: boolean = false,
    reason?: string
  ): Promise<Unavailability | null> {
    // Check if unavailability already exists
    const existing = await this.getUnavailability(barberName, date);

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('unavailability')
        .update({
          time_slots: timeSlots,
          is_full_day: isFullDay,
          reason: reason,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating unavailability:', error);
        return null;
      }

      return {
        id: data.id,
        barberName: data.barber_name,
        date: data.date,
        timeSlots: data.time_slots,
        isFullDay: data.is_full_day,
        reason: data.reason,
        createdAt: data.created_at,
      };
    } else {
      // Create new
      const { data, error } = await supabase
        .from('unavailability')
        .insert({
          barber_name: barberName,
          date: date,
          time_slots: timeSlots,
          is_full_day: isFullDay,
          reason: reason,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating unavailability:', error);
        return null;
      }

      return {
        id: data.id,
        barberName: data.barber_name,
        date: data.date,
        timeSlots: data.time_slots,
        isFullDay: data.is_full_day,
        reason: data.reason,
        createdAt: data.created_at,
      };
    }
  },

  async deleteUnavailability(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('unavailability')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting unavailability:', error);
      return false;
    }

    return true;
  },
};
