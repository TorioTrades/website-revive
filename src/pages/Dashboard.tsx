import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { appointmentStore, Appointment } from '@/lib/appointmentStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LogOut, Calendar, Clock, User, Mail, Phone, DollarSign } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // For now, staff access is disabled - can be enabled when user_roles table exists
      setIsStaff(false);

      // Fetch appointments
      const appointmentsList = await appointmentStore.getAppointments();
      setAppointments(appointmentsList);
    } catch (error) {
      console.error('Error checking auth:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await (supabase as any)
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success('Appointment status updated');
      checkAuth(); // Refresh appointments
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-br from-secondary/30 to-primary/10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome, {user?.email} {isStaff && <span className="text-primary font-semibold">(Staff)</span>}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isStaff ? 'All Appointments' : 'My Appointments'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No appointments found</p>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <Card key={appointment.id} className="border-2">
                        <CardContent className="pt-6">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">{appointment.customerName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{appointment.customerEmail}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{appointment.customerPhone}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{appointment.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{appointment.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-semibold">₱{appointment.price}</span>
                              </div>
                              <div className="mt-2">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  appointment.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                  appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                  appointment.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                  'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                }`}>
                                  {appointment.status.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                              <strong>Service:</strong> {appointment.service}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <strong>Stylist:</strong> {appointment.barberName}
                            </p>
                          </div>
                          {isStaff && (
                            <div className="mt-4 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                disabled={appointment.status === 'confirmed'}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                disabled={appointment.status === 'completed'}
                              >
                                Complete
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                disabled={appointment.status === 'cancelled'}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;