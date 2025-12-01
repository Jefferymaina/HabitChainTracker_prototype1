import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Link2, BarChart3, Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">HabitChain</h1>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Log in
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="rounded-full px-6">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Build better habits,
              <br />
              <span className="text-primary">one chain at a time</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Track your daily habits, visualize your progress, and keep your streaks alive with HabitChain.
            </p>
            <Link to="/auth">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg">
                Get started free
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-md bg-card rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Track Daily Habits</h3>
                <p className="text-sm text-muted-foreground">
                  Create custom habits and check them off each day to build consistency.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-card rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Link2 className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Build Habit Chains</h3>
                <p className="text-sm text-muted-foreground">
                  Link habits together and watch your chain grow stronger every day.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-card rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">View Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  See weekly stats and track your journey with beautiful charts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2025 HabitChain. Keep your habits unbroken.
        </p>
      </footer>
    </div>
  );
};

export default Index;
