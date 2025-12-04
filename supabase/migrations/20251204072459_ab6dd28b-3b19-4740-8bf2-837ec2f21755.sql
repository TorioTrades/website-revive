-- Add RLS policy to allow deleting appointments
CREATE POLICY "Anyone can delete appointments" 
ON public.appointments 
FOR DELETE 
USING (true);