import { useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useHabits } from '@/hooks/useHabits';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Flame, Target } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { format, subDays } from 'date-fns';

export default function Statistics() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { habits, entries, loading: habitsLoading } = useHabits();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const stats = useMemo(() => {
    // Days with at least one completed habit
    const daysWithCompletion = new Set(
      entries.filter(e => e.done).map(e => e.date)
    ).size;

    // Longest streak across all habits
    let longestStreak = 0;
    habits.forEach(habit => {
      const habitEntries = entries
        .filter(e => e.habit_id === habit.id && e.done)
        .map(e => e.date)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      let currentStreak = 1;
      let maxStreak = habitEntries.length > 0 ? 1 : 0;

      for (let i = 1; i < habitEntries.length; i++) {
        const prev = new Date(habitEntries[i - 1]);
        const curr = new Date(habitEntries[i]);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }

      longestStreak = Math.max(longestStreak, maxStreak);
    });

    // Completion rate for last 30 days
    const last30Days: string[] = [];
    for (let i = 0; i < 30; i++) {
      last30Days.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
    }

    const totalPossible = habits.length * 30;
    const totalCompleted = entries.filter(
      e => e.done && last30Days.includes(e.date)
    ).length;
    const completionRate = totalPossible > 0 
      ? Math.round((totalCompleted / totalPossible) * 100) 
      : 0;

    return {
      daysWithCompletion,
      longestStreak,
      completionRate,
    };
  }, [habits, entries]);

  if (authLoading || habitsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pb-8">
      <Navbar />

      <main className="px-4">
        <div className="main-card animate-slide-up">
          {/* Back button */}
          <Link to="/">
            <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <h1 className="text-2xl font-bold text-foreground mb-6">Statistics</h1>

          {/* Stats cards */}
          <div className="space-y-4">
            {/* Days with completion */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/10">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Days</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.daysWithCompletion}
                </p>
                <p className="text-xs text-muted-foreground">
                  Days with at least one habit completed
                </p>
              </div>
            </div>

            {/* Longest streak */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/10">
              <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Flame className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.longestStreak} {stats.longestStreak === 1 ? 'day' : 'days'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Best consecutive streak across all habits
                </p>
              </div>
            </div>

            {/* Completion rate */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/10">
              <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.completionRate}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Overall completion in the last 30 days
                </p>
              </div>
            </div>
          </div>

          {/* Habit breakdown */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Habits Overview</h2>
            
            {habits.length > 0 ? (
              <div className="space-y-3">
                {habits.map(habit => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{habit.icon}</span>
                      <span className="font-medium text-foreground">{habit.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {habit.streak} day streak
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                No habits yet. Add some habits to see your statistics!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
