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
      .select('time')
      .eq('barber_name', barberName)
      .eq('date', date)
      .in('status', ['pending', 'confirmed']);

    if (error) {
      console.error('Error fetching booked times:', error);
      return [];
    }

    return (data || []).map(apt => apt.time);
  },
};
