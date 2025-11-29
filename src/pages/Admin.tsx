import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Appointment, appointmentStore } from '@/lib/appointmentStore';
import { galleryStore, GalleryImage } from '@/lib/galleryStore';
import { Calendar, Clock, User, Scissors, Phone, Mail, Search, ArrowLeft, Image as ImageIcon, Plus, Trash2, ChevronDown, FileText } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [addingImage, setAddingImage] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentNotes, setAppointmentNotes] = useState('');
  useEffect(() => {
    checkAuth();
  }, []);
  const checkAuth = async () => {
    const hasAccess = localStorage.getItem('admin_access') === 'true';
    if (!hasAccess) {
      navigate('/auth');
      return;
    }
    await loadAppointments();
    await loadGalleryImages();
    setLoading(false);

    // Set up real-time subscription for new appointments
    const channel = supabase.channel('appointments-changes').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'appointments'
    }, () => {
      toast.success('New booking received!');
      loadAppointments();
    }).on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'appointments'
    }, () => {
      loadAppointments();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  };
  const loadAppointments = async () => {
    // First, delete old cancelled appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];
    
    await supabase
      .from('appointments')
      .delete()
      .eq('status', 'cancelled')
      .lt('date', todayString);
    
    const data = await appointmentStore.getAppointments();
    setAppointments(data);
  };

  const loadGalleryImages = async () => {
    const data = await galleryStore.getImages();
    setGalleryImages(data);
  };

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }

    setAddingImage(true);
    const result = await galleryStore.addImage({
      image_url: newImageUrl,
      title: newImageTitle || undefined,
      display_order: galleryImages.length,
    });

    if (result) {
      toast.success('Image added to gallery');
      setNewImageUrl('');
      setNewImageTitle('');
      await loadGalleryImages();
    } else {
      toast.error('Failed to add image');
    }
    setAddingImage(false);
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    const success = await galleryStore.deleteImage(id);
    if (success) {
      toast.success('Image deleted');
      await loadGalleryImages();
    } else {
      toast.error('Failed to delete image');
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', appointmentId);

    if (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
      return;
    }

    toast.success(`Appointment ${newStatus}`);
    await loadAppointments();
  };

  const handleOpenNotes = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentNotes(appointment.notes || '');
    setNotesDialogOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedAppointment) return;

    const { error } = await supabase
      .from('appointments')
      .update({ notes: appointmentNotes })
      .eq('id', selectedAppointment.id);

    if (error) {
      toast.error('Failed to save notes');
      console.error('Error saving notes:', error);
      return;
    }

    toast.success('Notes saved successfully');
    setNotesDialogOpen(false);
    await loadAppointments();
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);
    
    // Show all appointments (including completed/cancelled) that are today or future
    return aptDate >= today;
  }).sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Only show completed appointments from past dates in history
  const completedAppointments = appointments.filter(apt => {
    if (apt.status !== 'completed') return false;
    
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);
    
    // Only include if date is before today
    return aptDate < today;
  });
  
  // Group by customer name (case-insensitive)
  const groupedHistory = completedAppointments.reduce((acc, apt) => {
    const nameKey = apt.customerName.toLowerCase();
    if (!acc[nameKey]) {
      acc[nameKey] = {
        customerName: apt.customerName,
        customerPhone: apt.customerPhone,
        appointments: []
      };
    }
    acc[nameKey].appointments.push(apt);
    return acc;
  }, {} as Record<string, { customerName: string; customerPhone: string; appointments: Appointment[] }>);

  const filteredHistory = Object.values(groupedHistory).filter(group => {
    const query = searchQuery.toLowerCase();
    return group.customerName.toLowerCase().includes(query) || 
           group.customerPhone.includes(query) ||
           group.appointments.some(apt => apt.service.toLowerCase().includes(query));
  });
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">CJ HAIR LOUNGE    </h1>
          <p className="text-muted-foreground">Manage bookings and client history</p>
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="history">Client History</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6">
            <div className="space-y-3">
              {upcomingAppointments.length === 0 ? <Card>
                  <CardContent className="py-8 text-center text-muted-foreground text-sm">
                    No upcoming bookings
                  </CardContent>
                </Card> : upcomingAppointments.map(appointment => <Card key={appointment.id} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">Client #{appointment.bookingNumber}</span>
                          {isToday(new Date(appointment.date)) && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">
                              Today
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {appointment.status === 'completed' && (
                            <Dialog open={notesDialogOpen && selectedAppointment?.id === appointment.id} onOpenChange={(open) => {
                              if (!open) setNotesDialogOpen(false);
                            }}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs px-2 py-1 h-auto"
                                  onClick={() => handleOpenNotes(appointment)}
                                >
                                  <FileText className="w-3 h-3 mr-1" />
                                  {appointment.notes ? 'View Notes' : 'Add Notes'}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Appointment Notes</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>Service Notes</Label>
                                    <Textarea
                                      placeholder="Add notes about the service..."
                                      value={appointmentNotes}
                                      onChange={(e) => setAppointmentNotes(e.target.value)}
                                      rows={5}
                                    />
                                  </div>
                                  <Button onClick={handleSaveNotes} className="w-full">
                                    Save Notes
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                className={`text-xs px-3 py-1 h-auto rounded-full font-medium ${
                                  appointment.status === 'completed'
                                    ? 'bg-green-600 text-white hover:bg-green-700' 
                                    : appointment.status === 'cancelled'
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                              >
                                {appointment.status}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(appointment.id, 'completed')}
                                className="text-green-600 focus:text-green-600"
                              >
                                ✓ Mark as Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                className="text-red-600 focus:text-red-600"
                              >
                                ✕ Mark as Cancelled
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        <div className="flex items-start gap-2">
                          <User className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-muted-foreground">Customer</p>
                            <p className="font-medium truncate">{appointment.customerName}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Phone className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-muted-foreground">Phone</p>
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{appointment.customerPhone}</p>
                              <a 
                                href={`tel:${appointment.customerPhone}`}
                                className="text-primary hover:text-primary/80 transition-colors"
                                title="Call customer"
                              >
                                <Phone className="w-4 h-4 fill-current" />
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Calendar className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-muted-foreground">Date</p>
                            <p className="font-medium truncate">{format(new Date(appointment.date), 'MMM d, yyyy')}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Clock className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-muted-foreground">Time</p>
                            <p className="font-medium">{appointment.time}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Scissors className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-muted-foreground">Service</p>
                            <p className="font-medium truncate">{appointment.service}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <User className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-muted-foreground">Stylist</p>
                            <p className="font-medium">{appointment.barberName}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input type="text" placeholder="Search by name, phone, or service..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
            </div>

            <div className="space-y-6">
              {filteredHistory.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground text-sm">
                    {searchQuery ? 'No results found' : 'No completed bookings'}
                  </CardContent>
                </Card>
              ) : (
                filteredHistory.map((group) => (
                  <Collapsible key={group.customerName.toLowerCase()}>
                    <Card className="shadow-sm">
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-start gap-2">
                              <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-base font-bold">{group.customerName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-xs text-muted-foreground font-normal flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {group.customerPhone}
                                  </p>
                                  <a 
                                    href={`tel:${group.customerPhone}`}
                                    className="text-primary hover:text-primary/80 transition-colors"
                                    title="Call customer"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Phone className="w-3.5 h-3.5 fill-current" />
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                                {group.appointments.length} {group.appointments.length === 1 ? 'visit' : 'visits'}
                              </span>
                              <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200" />
                            </div>
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {group.appointments
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .map((appointment) => (
                                <div key={appointment.id} className="border-l-2 border-primary/20 pl-3 py-2">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                    <div className="flex items-start gap-2">
                                      <Calendar className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                      <div className="min-w-0">
                                        <p className="text-muted-foreground">Date</p>
                                        <p className="font-medium">{format(new Date(appointment.date), 'MMM d, yyyy')}</p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                      <Clock className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                      <div className="min-w-0">
                                        <p className="text-muted-foreground">Time</p>
                                        <p className="font-medium">{appointment.time}</p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                      <Scissors className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                      <div className="min-w-0">
                                        <p className="text-muted-foreground">Service</p>
                                        <p className="font-medium truncate">{appointment.service}</p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                      <User className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                      <div className="min-w-0">
                                        <p className="text-muted-foreground">Stylist</p>
                                        <p className="font-medium">{appointment.barberName}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {appointment.notes && (
                                    <div className="pt-2 mt-2 border-t border-border/50">
                                      <p className="text-muted-foreground mb-0.5">Notes</p>
                                      <p className="text-xs">{appointment.notes}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Add New Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL *</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageTitle">Title (Optional)</Label>
                  <Input
                    id="imageTitle"
                    type="text"
                    placeholder="Enter image title"
                    value={newImageTitle}
                    onChange={(e) => setNewImageTitle(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleAddImage} 
                  disabled={addingImage}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {addingImage ? 'Adding...' : 'Add to Gallery'}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Gallery Images ({galleryImages.length})</h3>
              {galleryImages.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No images in gallery yet
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="relative aspect-square">
                        <img
                          src={image.image_url}
                          alt={image.title || "Gallery image"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/400x400?text=Image+Not+Found";
                          }}
                        />
                      </div>
                      <CardContent className="p-3 space-y-2">
                        {image.title && (
                          <p className="text-sm font-medium truncate">{image.title}</p>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteImage(image.id)}
                          className="w-full"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>;
};
export default Admin;