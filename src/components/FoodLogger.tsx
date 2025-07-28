import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Plus } from "lucide-react";
import { useState } from "react";

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  food_name: string;
  serving_size?: string;
}

interface FoodLoggerProps {
  onAddFood: (nutrition: NutritionData) => void;
  onCancel: () => void;
}

// Sample food database
const sampleFoods = [
  { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: "100g" },
  { name: "Brown Rice", calories: 111, protein: 2.6, carbs: 23, fat: 0.9, serving: "100g" },
  { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: "1 medium" },
  { name: "Greek Yogurt", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, serving: "100g" },
  { name: "Almonds", calories: 579, protein: 21, carbs: 22, fat: 50, serving: "100g" },
  { name: "Salmon", calories: 208, protein: 20, carbs: 0, fat: 13, serving: "100g" },
  { name: "Sweet Potato", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, serving: "100g" },
  { name: "Eggs", calories: 155, protein: 13, carbs: 1.1, fat: 11, serving: "2 large" },
  { name: "Oatmeal", calories: 68, protein: 2.4, carbs: 12, fat: 1.4, serving: "100g" },
  { name: "Broccoli", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, serving: "100g" }
];

export function FoodLogger({ onAddFood, onCancel }: FoodLoggerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredFoods = sampleFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFood = (food: typeof sampleFoods[0]) => {
    onAddFood({
      food_name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      serving_size: food.serving
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold">Add Food</h1>
        </div>

        {/* Search */}
        <Card className="mb-6 shadow-card border-0">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Food List */}
        <div className="space-y-3">
          {filteredFoods.map((food, index) => (
            <Card key={index} className="shadow-soft border-0 hover:shadow-card transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{food.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{food.serving}</p>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-secondary">{food.calories}</div>
                        <div className="text-xs text-muted-foreground">cal</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-protein">{food.protein}g</div>
                        <div className="text-xs text-muted-foreground">protein</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-carbs">{food.carbs}g</div>
                        <div className="text-xs text-muted-foreground">carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-fat">{food.fat}g</div>
                        <div className="text-xs text-muted-foreground">fat</div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleAddFood(food)}
                    size="sm"
                    className="ml-4 bg-gradient-primary hover:bg-gradient-secondary"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFoods.length === 0 && searchTerm && (
          <Card className="shadow-soft border-0">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No foods found matching "{searchTerm}"</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}