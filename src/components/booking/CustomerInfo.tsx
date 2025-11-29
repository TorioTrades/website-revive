import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookingData } from '@/types/booking';
import { customerInfoSchema } from '@/lib/validations/booking';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface CustomerInfoProps {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  onNext: () => void;
  onClose: () => void;
}

const CustomerInfo = ({
  bookingData,
  setBookingData
}: CustomerInfoProps) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleCustomerInfoChange = (field: keyof BookingData['customerInfo'], value: string) => {
    const updatedInfo = {
      ...bookingData.customerInfo,
      [field]: value
    };
    
    setBookingData({
      ...bookingData,
      customerInfo: updatedInfo
    });

    // Validate individual field
    try {
      customerInfoSchema.parse(updatedInfo);
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } catch (error: any) {
      if (error.errors) {
        const fieldError = error.errors.find((e: any) => e.path[0] === field);
        if (fieldError) {
          setValidationErrors(prev => ({
            ...prev,
            [field]: fieldError.message
          }));
        }
      }
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-3">
      <div className="text-center space-y-1">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Your Information</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">Please fill in your details to complete the booking</p>
      </div>

      <div className="bg-secondary/30 p-3 sm:p-4 rounded-lg space-y-3 border border-border">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-primary text-xs sm:text-sm">
            Full Name *
          </Label>
          <Input 
            id="name" 
            type="text" 
            placeholder="Enter your full name" 
            value={bookingData.customerInfo.name} 
            onChange={e => handleCustomerInfoChange('name', e.target.value)} 
            className={`bg-background border-input focus:border-primary h-9 text-sm ${validationErrors.name ? 'border-destructive' : ''}`}
          />
          {validationErrors.name && (
            <p className="text-xs text-destructive">{validationErrors.name}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-primary text-xs sm:text-sm">Contact Number *</Label>
          <Input 
            id="phone" 
            type="tel" 
            placeholder="e.g. 09123456789" 
            value={bookingData.customerInfo.phone} 
            onChange={e => handleCustomerInfoChange('phone', e.target.value)} 
            className={`bg-background border-input focus:border-primary h-9 text-sm ${validationErrors.phone ? 'border-destructive' : ''}`}
          />
          {validationErrors.phone && (
            <p className="text-xs text-destructive">{validationErrors.phone}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-primary text-xs sm:text-sm">
            Email Address (Optional)
          </Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="your.email@example.com" 
            value={bookingData.customerInfo.email} 
            onChange={e => handleCustomerInfoChange('email', e.target.value)} 
            className={`bg-background border-input focus:border-primary h-9 text-sm ${validationErrors.email ? 'border-destructive' : ''}`}
          />
          {validationErrors.email && (
            <p className="text-xs text-destructive">{validationErrors.email}</p>
          )}
        </div>
      </div>

      {Object.keys(validationErrors).length > 0 && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-3 w-3" />
          <AlertDescription className="text-xs">
            Please correct the errors above before continuing.
          </AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-muted-foreground space-y-0.5 text-center">
        <p>• Name and phone required for booking</p>
        <p>• Phone used for important updates</p>
      </div>
    </div>
  );
};

export default CustomerInfo;
