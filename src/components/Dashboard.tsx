import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, Target, TrendingUp } from "lucide-react";
import { MacroChart } from "./MacroChart";
import { FoodLogger } from "./FoodLogger";
import { useState } from "react";

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function Dashboard() {
  const [consumed, setConsumed] = useState<NutritionData>({
    calories: 1245,
    protein: 85,
    carbs: 120,
    fat: 45
  });

  const goals: DailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
  };

  const [showFoodLogger, setShowFoodLogger] = useState(false);

  const addFood = (nutrition: NutritionData) => {
    setConsumed(prev => ({
      calories: prev.calories + nutrition.calories,
      protein: prev.protein + nutrition.protein,
      carbs: prev.carbs + nutrition.carbs,
      fat: prev.fat + nutrition.fat
    }));
    setShowFoodLogger(false);
  };

  const remaining = {
    calories: Math.max(0, goals.calories - consumed.calories),
    protein: Math.max(0, goals.protein - consumed.protein),
    carbs: Math.max(0, goals.carbs - consumed.carbs),
    fat: Math.max(0, goals.fat - consumed.fat)
  };

  const calorieProgress = (consumed.calories / goals.calories) * 100;
  const proteinProgress = (consumed.protein / goals.protein) * 100;
  const carbsProgress = (consumed.carbs / goals.carbs) * 100;
  const fatProgress = (consumed.fat / goals.fat) * 100;

  if (showFoodLogger) {
    return <FoodLogger onAddFood={addFood} onCancel={() => setShowFoodLogger(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            CalorieTracker
          </h1>
          <p className="text-muted-foreground">Track your nutrition, reach your goals</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card border-0 bg-gradient-hero text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consumed.calories}</div>
              <div className="text-sm opacity-75">of {goals.calories} goal</div>
              <Progress value={calorieProgress} className="mt-2 bg-white/20" />
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-protein flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-protein"></div>
                Protein
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consumed.protein}g</div>
              <div className="text-sm text-muted-foreground">of {goals.protein}g</div>
              <Progress value={proteinProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-carbs flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-carbs"></div>
                Carbs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consumed.carbs}g</div>
              <div className="text-sm text-muted-foreground">of {goals.carbs}g</div>
              <Progress value={carbsProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-fat flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-fat"></div>
                Fat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consumed.fat}g</div>
              <div className="text-sm text-muted-foreground">of {goals.fat}g</div>
              <Progress value={fatProgress} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Charts and Remaining */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Macro Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MacroChart consumed={consumed} goals={goals} />
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Remaining Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-secondary rounded-lg text-white">
                <div className="text-3xl font-bold">{remaining.calories}</div>
                <div className="text-sm opacity-90">calories remaining</div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-accent rounded-lg">
                  <div className="font-semibold text-protein">{remaining.protein}g</div>
                  <div className="text-xs text-muted-foreground">protein</div>
                </div>
                <div className="p-3 bg-accent rounded-lg">
                  <div className="font-semibold text-carbs">{remaining.carbs}g</div>
                  <div className="text-xs text-muted-foreground">carbs</div>
                </div>
                <div className="p-3 bg-accent rounded-lg">
                  <div className="font-semibold text-fat">{remaining.fat}g</div>
                  <div className="text-xs text-muted-foreground">fat</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Food Button */}
        <div className="flex justify-center">
          <Button 
            onClick={() => setShowFoodLogger(true)}
            size="lg" 
            className="bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300 shadow-card"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Food
          </Button>
        </div>
      </div>
    </div>
  );
}