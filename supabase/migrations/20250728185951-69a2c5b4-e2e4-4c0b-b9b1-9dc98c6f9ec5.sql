-- Fix missing policies for caltracker table
-- Add DELETE policies for daily_goals (missing operation)
CREATE POLICY "Users can delete their own goals" 
ON public.daily_goals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Fix function search path (set to safe value)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;