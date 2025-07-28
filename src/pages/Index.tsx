import { Dashboard } from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            CalorieTracker
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Track your nutrition, reach your goals, and transform your health with our comprehensive calorie tracking platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="bg-gradient-primary hover:bg-gradient-secondary text-lg px-8"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-card border-0 text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Precise Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Log your meals with detailed macro breakdowns and reach your daily nutrition goals with precision.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-secondary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Visual Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Beautiful charts and progress indicators help you visualize your nutrition journey and stay motivated.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-hero rounded-lg mx-auto mb-4 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Personal Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Set custom calorie and macro targets based on your personal health and fitness objectives.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
