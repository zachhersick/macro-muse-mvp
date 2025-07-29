import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Activity, Ruler } from "lucide-react";

interface BodyCompositionTrackerProps {
  onDataAdded?: () => void;
}

const measurementTypes = [
  { value: "chest", label: "Chest" },
  { value: "waist", label: "Waist" },
  { value: "hips", label: "Hips" },
  { value: "neck", label: "Neck" },
  { value: "thigh", label: "Thigh" },
  { value: "bicep", label: "Bicep" },
  { value: "forearm", label: "Forearm" },
  { value: "calf", label: "Calf" }
];

export function BodyCompositionTracker({ onDataAdded }: BodyCompositionTrackerProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Body composition states
  const [bodyFat, setBodyFat] = useState("");
  const [muscleMass, setMuscleMass] = useState("");
  const [boneMass, setBoneMass] = useState("");
  const [waterPercentage, setWaterPercentage] = useState("");
  const [visceralFat, setVisceralFat] = useState("");
  const [compositionNotes, setCompositionNotes] = useState("");
  
  // Measurements states
  const [measurementType, setMeasurementType] = useState("");
  const [measurementValue, setMeasurementValue] = useState("");
  const [measurementNotes, setMeasurementNotes] = useState("");

  const handleCompositionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const compositionData: any = {
        user_id: user.id,
        notes: compositionNotes || null
      };

      if (bodyFat) compositionData.body_fat_percentage = parseFloat(bodyFat);
      if (muscleMass) compositionData.muscle_mass_kg = parseFloat(muscleMass);
      if (boneMass) compositionData.bone_mass_kg = parseFloat(boneMass);
      if (waterPercentage) compositionData.water_percentage = parseFloat(waterPercentage);
      if (visceralFat) compositionData.visceral_fat_rating = parseInt(visceralFat);

      const { error } = await supabase
        .from('body_composition_logs')
        .insert(compositionData);

      if (error) throw error;

      // Reset form
      setBodyFat("");
      setMuscleMass("");
      setBoneMass("");
      setWaterPercentage("");
      setVisceralFat("");
      setCompositionNotes("");
      
      onDataAdded?.();
      
      toast({
        title: "Body composition logged!",
        description: "Your body composition data has been recorded."
      });
    } catch (error: any) {
      console.error('Error logging body composition:', error);
      toast({
        title: "Error logging data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMeasurementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !measurementType || !measurementValue) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('body_measurements')
        .insert({
          user_id: user.id,
          measurement_type: measurementType,
          value_cm: parseFloat(measurementValue),
          notes: measurementNotes || null
        });

      if (error) throw error;

      // Reset form
      setMeasurementType("");
      setMeasurementValue("");
      setMeasurementNotes("");
      
      onDataAdded?.();
      
      toast({
        title: "Measurement logged!",
        description: `${measurementTypes.find(t => t.value === measurementType)?.label} measurement recorded.`
      });
    } catch (error: any) {
      console.error('Error logging measurement:', error);
      toast({
        title: "Error logging measurement",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Body Composition & Measurements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="composition" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="composition">Body Composition</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="composition" className="space-y-4">
            <form onSubmit={handleCompositionSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bodyFat">Body Fat (%)</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 15.5"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="muscleMass">Muscle Mass (kg)</Label>
                  <Input
                    id="muscleMass"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 35.2"
                    value={muscleMass}
                    onChange={(e) => setMuscleMass(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="boneMass">Bone Mass (kg)</Label>
                  <Input
                    id="boneMass"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 3.2"
                    value={boneMass}
                    onChange={(e) => setBoneMass(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="waterPercentage">Water Percentage (%)</Label>
                  <Input
                    id="waterPercentage"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 60.5"
                    value={waterPercentage}
                    onChange={(e) => setWaterPercentage(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="visceralFat">Visceral Fat Rating</Label>
                  <Input
                    id="visceralFat"
                    type="number"
                    placeholder="e.g., 8"
                    value={visceralFat}
                    onChange={(e) => setVisceralFat(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="compositionNotes">Notes (optional)</Label>
                <Textarea
                  id="compositionNotes"
                  placeholder="Any notes about your measurement conditions..."
                  value={compositionNotes}
                  onChange={(e) => setCompositionNotes(e.target.value)}
                  rows={2}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:bg-gradient-secondary"
                disabled={loading || (!bodyFat && !muscleMass && !boneMass && !waterPercentage && !visceralFat)}
              >
                {loading ? "Logging..." : "Log Body Composition"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="measurements" className="space-y-4">
            <form onSubmit={handleMeasurementSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="measurementType">Measurement Type</Label>
                  <Select value={measurementType} onValueChange={setMeasurementType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select measurement type" />
                    </SelectTrigger>
                    <SelectContent>
                      {measurementTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Ruler className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="measurementValue">Value (cm)</Label>
                  <Input
                    id="measurementValue"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 85.5"
                    value={measurementValue}
                    onChange={(e) => setMeasurementValue(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="measurementNotes">Notes (optional)</Label>
                <Textarea
                  id="measurementNotes"
                  placeholder="Any notes about this measurement..."
                  value={measurementNotes}
                  onChange={(e) => setMeasurementNotes(e.target.value)}
                  rows={2}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:bg-gradient-secondary"
                disabled={loading || !measurementType || !measurementValue}
              >
                {loading ? "Logging..." : "Log Measurement"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}