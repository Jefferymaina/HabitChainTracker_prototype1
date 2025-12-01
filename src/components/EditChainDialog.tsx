import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { HabitWithStreak, HabitChain } from '@/lib/types';
import { cn } from '@/lib/utils';

interface EditChainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chain: HabitChain | null;
  habits: HabitWithStreak[];
  onSave: (chainId: string | null, habitIds: string[]) => void;
}

export function EditChainDialog({ 
  open, 
  onOpenChange, 
  chain, 
  habits, 
  onSave 
}: EditChainDialogProps) {
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  useEffect(() => {
    if (chain) {
      setSelectedHabits(chain.habit_ids);
    } else {
      setSelectedHabits(habits.slice(0, 3).map(h => h.id));
    }
  }, [chain, habits, open]);

  const toggleHabit = (habitId: string) => {
    setSelectedHabits(prev => 
      prev.includes(habitId)
        ? prev.filter(id => id !== habitId)
        : [...prev, habitId].slice(0, 5) // Max 5 habits
    );
  };

  const handleSave = () => {
    onSave(chain?.id || null, selectedHabits);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Habit Chain</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select up to 5 habits to include in your chain.
          </p>

          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                  selectedHabits.includes(habit.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => toggleHabit(habit.id)}
              >
                <Checkbox
                  checked={selectedHabits.includes(habit.id)}
                  onChange={() => toggleHabit(habit.id)}
                />
                <div
                  className={cn(
                    "habit-icon",
                    habit.color === 'blue' && "habit-icon-blue",
                    habit.color === 'purple' && "habit-icon-purple",
                    habit.color === 'coral' && "habit-icon-coral"
                  )}
                >
                  {habit.icon}
                </div>
                <span className="font-medium">{habit.name}</span>
              </div>
            ))}
          </div>

          {habits.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Add some habits first to create a chain.
            </p>
          )}

          <Button onClick={handleSave} className="w-full" disabled={habits.length === 0}>
            Save Chain
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
