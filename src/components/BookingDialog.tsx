import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StylistSelection from './booking/StylistSelection';
import ServiceSelection from './booking/ServiceSelection';
import DateTimeSelection from './booking/DateTimeSelection';
import CustomerInfo from './booking/CustomerInfo';
import BookingConfirmation from './booking/BookingConfirmation';
import BookingSuccess from './booking/BookingSuccess';
import { BookingData } from '@/types/booking';
interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const BookingDialog = ({
  open,
  onOpenChange
}: BookingDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const confirmationRef = useRef<{
    handleConfirm: () => Promise<void>;
  } | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    stylist: null,
    service: null,
    date: null,
    time: null,
    customerInfo: {
      name: '',
      phone: '',
      email: ''
    }
  });
  const steps = [{
    title: 'Select Hairstylist',
    component: StylistSelection
  }, {
    title: 'Choose Service',
    component: ServiceSelection
  }, {
    title: 'Select Date & Time',
    component: DateTimeSelection
  }, {
    title: 'Fill Up Information',
    component: CustomerInfo
  }, {
    title: 'Confirmation',
    component: BookingConfirmation
  }, {
    title: 'Booking Confirmed',
    component: BookingSuccess
  }];
  const handleNext = async () => {
    if (currentStep === 4 && confirmationRef.current) {
      await confirmationRef.current.handleConfirm();
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleClose = () => {
    setCurrentStep(0);
    setBookingData({
      stylist: null,
      service: null,
      date: null,
      time: null,
      customerInfo: {
        name: '',
        phone: '',
        email: ''
      }
    });
    onOpenChange(false);
  };
  const CurrentStepComponent = steps[currentStep].component;
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return bookingData.stylist !== null;
      case 1:
        return bookingData.service !== null;
      case 2:
        return bookingData.date !== null && bookingData.time !== null;
      case 3:
        return bookingData.customerInfo.name.trim() !== '' && bookingData.customerInfo.phone.trim() !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };
  return <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-primary/20 w-[95vw] sm:w-full p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-serif text-primary text-center">
            {steps[currentStep].title}
          </DialogTitle>
          
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-1.5 sm:space-x-2 mt-3 sm:mt-4">
            {steps.map((_, index) => <div key={index} className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${index <= currentStep ? 'bg-primary' : 'bg-muted'}`} />)}
          </div>
        </DialogHeader>

        <div className="mt-6">
          <CurrentStepComponent ref={currentStep === 4 ? confirmationRef : null} bookingData={bookingData} setBookingData={setBookingData} onNext={() => setCurrentStep(currentStep + 1)} onClose={handleClose} />
        </div>

        {/* Priority Fee */}
        {currentStep === 1 && <div className="mt-4 text-center">
            
          </div>}

        {/* Navigation Buttons */}
        {currentStep < 5 && <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 pt-4 border-t border-border">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 0} className="flex items-center justify-center space-x-2 w-full sm:w-auto">
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            <Button onClick={handleNext} disabled={!canProceed()} className="flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
              <span>{currentStep === 4 ? 'Confirm Booking' : 'Next'}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>}
      </DialogContent>
    </Dialog>;
};
export default BookingDialog;