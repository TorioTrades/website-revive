import { z } from 'zod';

export const customerInfoSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, and common punctuation'),
  
  phone: z.string()
    .trim()
    .min(1, 'Phone number is required')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  
  email: z.string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .optional()
    .or(z.literal('')),
});

export type CustomerInfo = z.infer<typeof customerInfoSchema>;
