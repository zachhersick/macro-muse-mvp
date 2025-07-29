import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Activity, Ruler } from "lucide-react";

interface BodyCompositionLog {
  id: string;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  bone_mass_kg?: number;
  water_percentage?: number;
  visceral_fat_rating?: number;
  logged_at: string;
  notes?: string;
}

interface BodyMeasurement {
  id: string;
  measurement_type: string;
  value_cm: number;
  logged_at: string;
  notes?: string;
}

interface BodyCompositionChartsProps {
  refreshTrigger?: number;
}

export function BodyCompositionCharts({ refreshTrigger }: BodyCompositionChartsProps) {
  const [compositionLogs, setCompositionLogs] = useState<BodyCompositionLog[]>([]);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, refreshTrigger]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const [compositionResponse, measurementsResponse] = await Promise.all([
        supabase
          .from('body_composition_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('logged_at', { ascending: true }),
        supabase
          .from('body_measurements')
          .select('*')
          .eq('user_id', user.id)
          .order('logged_at', { ascending: true })
      ]);

      if (compositionResponse.error) throw compositionResponse.error;
      if (measurementsResponse.error) throw measurementsResponse.error;

      setCompositionLogs(compositionResponse.data || []);
      setMeasurements(measurementsResponse.data || []);
    } catch (error) {
      console.error('Error fetching body data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompositionChartData = () => {
    return compositionLogs.map(log => ({
      date: new Date(log.logged_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      bodyFat: log.body_fat_percentage || null,
      muscleMass: log.muscle_mass_kg || null,
      waterPercentage: log.water_percentage || null,
      visceralFat: log.visceral_fat_rating || null,
      fullDate: log.logged_at
    }));
  };

  const getMeasurementsByType = () => {
    const measurementsByType: Record<string, any[]> = {};
    
    measurements.forEach(measurement => {
      if (!measurementsByType[measurement.measurement_type]) {
        measurementsByType[measurement.measurement_type] = [];
      }
      measurementsByType[measurement.measurement_type].push({
        date: new Date(measurement.logged_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        value: measurement.value_cm,
        fullDate: measurement.logged_at
      });
    });

    return measurementsByType;
  };

  const measurementsByType = getMeasurementsByType();
  const compositionChartData = getCompositionChartData();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Body Composition Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compositionLogs.length === 0 && measurements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Body Composition Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">No body composition data yet. Start tracking to see progress!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Body Composition Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="composition" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="composition">Body Composition</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="composition">
            {compositionLogs.length > 0 ? (
              <div className="space-y-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={compositionChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <YAxis 
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
                      />
                      <Line 
                        type="monotone" 
                        dataKey="bodyFat" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={2}
                        name="Body Fat %"
                        connectNulls={false}
                        dot={{ r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="muscleMass" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Muscle Mass (kg)"
                        connectNulls={false}
                        dot={{ r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="waterPercentage" 
                        stroke="hsl(var(--accent-foreground))" 
                        strokeWidth={2}
                        name="Water %"
                        connectNulls={false}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {compositionLogs.length > 0 && (
                    <>
                      <div className="text-center p-3 bg-accent rounded-lg">
                        <div className="font-semibold text-destructive">
                          {compositionLogs[compositionLogs.length - 1].body_fat_percentage || '--'}%
                        </div>
                        <div className="text-xs text-muted-foreground">Body Fat</div>
                      </div>
                      <div className="text-center p-3 bg-accent rounded-lg">
                        <div className="font-semibold text-primary">
                          {compositionLogs[compositionLogs.length - 1].muscle_mass_kg || '--'} kg
                        </div>
                        <div className="text-xs text-muted-foreground">Muscle Mass</div>
                      </div>
                      <div className="text-center p-3 bg-accent rounded-lg">
                        <div className="font-semibold">
                          {compositionLogs[compositionLogs.length - 1].water_percentage || '--'}%
                        </div>
                        <div className="text-xs text-muted-foreground">Water</div>
                      </div>
                      <div className="text-center p-3 bg-accent rounded-lg">
                        <div className="font-semibold">
                          {compositionLogs[compositionLogs.length - 1].visceral_fat_rating || '--'}
                        </div>
                        <div className="text-xs text-muted-foreground">Visceral Fat</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">No body composition data yet.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="measurements">
            {Object.keys(measurementsByType).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(measurementsByType).map(([type, data]) => (
                  <div key={type} className="space-y-2">
                    <h3 className="font-semibold capitalize flex items-center gap-2">
                      <Ruler className="w-4 h-4" />
                      {type} Measurements
                    </h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 10 }}
                            className="text-muted-foreground"
                          />
                          <YAxis 
                            tick={{ fontSize: 10 }}
                            className="text-muted-foreground"
                            domain={['dataMin - 2', 'dataMax + 2']}
                          />
                          <Tooltip 
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                            formatter={(value: number) => [`${value} cm`, type]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center p-2 bg-accent rounded text-sm">
                      Latest: <span className="font-semibold">{data[data.length - 1]?.value} cm</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">No measurements recorded yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}