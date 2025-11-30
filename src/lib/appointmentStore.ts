import { supabase } from '@/integrations/supabase/client';

export interface Appointment {
  id: string;
  barberName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  service: string;
  date: string;
  time: string;
  status: string;
  price?: string;
  duration?: number;
  bookingNumber: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const appointmentStore = {
  async getAppointments(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }

    return (data || []).map(apt => ({
      id: apt.id,
      barberName: apt.barber_name,
      customerName: apt.customer_name,
      customerPhone: apt.customer_phone,
      customerEmail: apt.customer_email,
      service: apt.service,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      price: apt.price,
      duration: apt.duration,
      bookingNumber: apt.booking_number,
      notes: apt.notes,
      createdAt: apt.created_at,
      updatedAt: apt.updated_at,
    }));
  },

  async addAppointment(appointment: Omit<Appointment, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>): Promise<Appointment | null> {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        barber_name: appointment.barberName,
        customer_name: appointment.customerName,
        customer_phone: appointment.customerPhone,
        customer_email: appointment.customerEmail,
        service: appointment.service,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        price: appointment.price,
        duration: appointment.duration,
        notes: appointment.notes,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      return null;
    }

    return {
      id: data.id,
      barberName: data.barber_name,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerEmail: data.customer_email,
      service: data.service,
      date: data.date,
      time: data.time,
      status: data.status,
      price: data.price,
      duration: data.duration,
      bookingNumber: data.booking_number,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async getBookedTimeSlots(barberName: string, date: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('time, duration')
      .eq('barber_name', barberName)
      .eq('date', date)
      .in('status', ['pending', 'confirmed']);

    if (error) {
      console.error('Error fetching booked times:', error);
      return [];
    }

    const allTimeSlots = [
      '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
      '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
      '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM', '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM',
      '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM', '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM',
      '5:00 PM', '5:15 PM', '5:30 PM', '5:45 PM', '6:00 PM', '6:15 PM', '6:30 PM', '6:45 PM',
      '7:00 PM', '7:15 PM', '7:30 PM', '7:45 PM', '8:00 PM'
    ];

    const occupiedSlots: string[] = [];

    (data || []).forEach(apt => {
      const startTime = apt.time;
      const duration = apt.duration || 30; // Default to 30 minutes if not specified
      const startIndex = allTimeSlots.indexOf(startTime);

      if (startIndex !== -1) {
        // Calculate how many 15-minute slots this appointment occupies
        const slotsNeeded = Math.ceil(duration / 15);
        
        // Add all occupied slots
        for (let i = 0; i < slotsNeeded; i++) {
          if (startIndex + i < allTimeSlots.length) {
            occupiedSlots.push(allTimeSlots[startIndex + i]);
          }
        }
      }
    });

    return [...new Set(occupiedSlots)]; // Remove duplicates
  },
};
