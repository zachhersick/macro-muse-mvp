import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Scale, TrendingUp } from "lucide-react";

interface WeightTrackerProps {
  onWeightAdded?: () => void;
}

export function WeightTracker({ onWeightAdded }: WeightTrackerProps) {
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !weight) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('weight_logs')
        .insert({
          user_id: user.id,
          weight_kg: parseFloat(weight),
          notes: notes || null
        });

      if (error) throw error;

      setWeight("");
      setNotes("");
      onWeightAdded?.();
      
      toast({
        title: "Weight logged!",
        description: `Recorded ${weight} kg`
      });
    } catch (error: any) {
      console.error('Error logging weight:', error);
      toast({
        title: "Error logging weight",
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
          <Scale className="w-5 h-5" />
          Log Weight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="Enter your weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any notes about your weight measurement..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:bg-gradient-secondary"
            disabled={loading || !weight}
          >
            {loading ? "Logging..." : "Log Weight"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}