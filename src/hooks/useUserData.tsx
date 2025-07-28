import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  age: number | null;
  gender: string | null;
  height_cm: number | null;
  activity_level: string;
  goal_type: string;
  created_at: string;
  updated_at: string;
}

interface DailyGoal {
  id: string;
  user_id: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FoodLog {
  id: string;
  user_id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: string | null;
  meal_type: string;
  logged_at: string;
  created_at: string;
}

export function useUserData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal | null>(null);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setProfile(null);
      setDailyGoals(null);
      setFoodLogs([]);
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Fetch daily goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('daily_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (goalsError && goalsError.code !== 'PGRST116') {
        throw goalsError;
      }

      // Fetch today's food logs
      const today = new Date().toISOString().split('T')[0];
      const { data: logsData, error: logsError } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', `${today}T00:00:00`)
        .lt('logged_at', `${today}T23:59:59`)
        .order('logged_at', { ascending: false });

      if (logsError) {
        throw logsError;
      }

      setProfile(profileData);
      setDailyGoals(goalsData);
      setFoodLogs(logsData || []);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addFoodLog = async (foodData: {
    food_name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    serving_size?: string;
    meal_type?: string;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('food_logs')
        .insert({
          user_id: user.id,
          ...foodData,
          meal_type: foodData.meal_type || 'snack'
        })
        .select()
        .single();

      if (error) throw error;

      setFoodLogs(prev => [data, ...prev]);
      
      toast({
        title: "Food logged!",
        description: `Added ${foodData.food_name} to your diary.`
      });
    } catch (error: any) {
      console.error('Error adding food log:', error);
      toast({
        title: "Error logging food",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateDailyGoals = async (goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => {
    if (!user || !dailyGoals) return;

    try {
      const { data, error } = await supabase
        .from('daily_goals')
        .update(goals)
        .eq('id', dailyGoals.id)
        .select()
        .single();

      if (error) throw error;

      setDailyGoals(data);
      
      toast({
        title: "Goals updated!",
        description: "Your daily nutrition goals have been saved."
      });
    } catch (error: any) {
      console.error('Error updating goals:', error);
      toast({
        title: "Error updating goals",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Calculate consumed totals from food logs
  const consumed = foodLogs.reduce(
    (totals, log) => ({
      calories: totals.calories + Number(log.calories),
      protein: totals.protein + Number(log.protein),
      carbs: totals.carbs + Number(log.carbs),
      fat: totals.fat + Number(log.fat)
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    profile,
    dailyGoals,
    foodLogs,
    consumed,
    loading,
    addFoodLog,
    updateDailyGoals,
    refreshData: fetchUserData
  };
}