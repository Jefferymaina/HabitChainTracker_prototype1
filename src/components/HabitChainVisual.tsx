import { HabitChain, HabitWithStreak } from '@/lib/types';
import { Pencil, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HabitChainVisualProps {
  chain: HabitChain | null;
  habits: HabitWithStreak[];
  onEdit?: () => void;
  onDuplicate?: () => void;
}

export function HabitChainVisual({ chain, habits, onEdit, onDuplicate }: HabitChainVisualProps) {
  // Get habits in chain order
  const chainHabits = chain?.habit_ids
    .map(id => habits.find(h => h.id === id))
    .filter(Boolean) as HabitWithStreak[] | undefined;

  // If no chain or no habits in chain, show placeholder
  const displayHabits = chainHabits && chainHabits.length > 0 
    ? chainHabits.slice(0, 5) // Max 5 circles
    : habits.slice(0, 3); // Default to first 3 habits

  return (
    <section className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Habit Chains</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onDuplicate}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chain visualization */}
      <div className="relative py-6 px-4">
        {displayHabits.length > 0 ? (
          <>
            {/* Connecting line */}
            <div className="absolute left-8 right-8 top-1/2 h-1 bg-foreground/80 -translate-y-1/2 rounded-full" />

            {/* Circles */}
            <div className="relative flex justify-between items-center">
              {displayHabits.map((habit, index) => {
                const isCustomColor = !['blue', 'purple', 'coral'].includes(habit.color);
                return (
                  <div
                    key={habit.id}
                    className={cn(
                      "chain-circle w-10 h-10 z-10 shadow-md",
                      !isCustomColor && habit.color === 'blue' && "chain-circle-blue",
                      !isCustomColor && habit.color === 'purple' && "chain-circle-purple",
                      !isCustomColor && habit.color === 'coral' && "chain-circle-coral",
                      !habit.doneToday && "chain-circle-faded"
                    )}
                    style={isCustomColor ? { 
                      backgroundColor: habit.color,
                      opacity: habit.doneToday ? 1 : 0.4
                    } : undefined}
                    title={`${habit.name} - ${habit.doneToday ? 'Done' : 'Not done'}`}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            Create a habit chain to track your daily routine
          </p>
        )}
      </div>
    </section>
  );
}
