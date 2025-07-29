import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface WeightLog {
  id: string;
  weight_kg: number;
  logged_at: string;
  notes?: string;
}

interface WeightChartProps {
  refreshTrigger?: number;
}

export function WeightChart({ refreshTrigger }: WeightChartProps) {
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWeightLogs();
    }
  }, [user, refreshTrigger]);

  const fetchWeightLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: true });

      if (error) throw error;
      setWeightLogs(data || []);
    } catch (error) {
      console.error('Error fetching weight logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = weightLogs.map(log => ({
    date: new Date(log.logged_at).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    weight: Number(log.weight_kg),
    fullDate: log.logged_at
  }));

  const getTrend = () => {
    if (weightLogs.length < 2) return null;
    
    const latest = weightLogs[weightLogs.length - 1];
    const previous = weightLogs[weightLogs.length - 2];
    const diff = Number(latest.weight_kg) - Number(previous.weight_kg);
    
    if (diff > 0.1) return { type: 'up', value: diff, icon: TrendingUp };
    if (diff < -0.1) return { type: 'down', value: Math.abs(diff), icon: TrendingDown };
    return { type: 'stable', value: 0, icon: Minus };
  };

  const trend = getTrend();
  const currentWeight = weightLogs.length > 0 ? Number(weightLogs[weightLogs.length - 1].weight_kg) : null;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weight Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (weightLogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weight Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">No weight data yet. Start logging your weight to see progress!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Weight Progress
          {currentWeight && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono">{currentWeight} kg</span>
              {trend && (
                <div className={`flex items-center gap-1 ${
                  trend.type === 'up' ? 'text-red-500' : 
                  trend.type === 'down' ? 'text-green-500' : 
                  'text-muted-foreground'
                }`}>
                  <trend.icon className="w-4 h-4" />
                  {trend.value > 0 && <span>{trend.value.toFixed(1)} kg</span>}
                </div>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip 
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value} kg`, 'Weight']}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {weightLogs.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Total entries: {weightLogs.length}</p>
            {weightLogs.length > 1 && (
              <p>
                Total change: {(Number(weightLogs[weightLogs.length - 1].weight_kg) - Number(weightLogs[0].weight_kg)).toFixed(1)} kg
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}