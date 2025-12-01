import { HabitWithStreak } from '@/lib/types';
import { Check, Circle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HabitListProps {
  habits: HabitWithStreak[];
  onToggle: (habitId: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  editMode?: boolean;
  onDeleteHabit?: (habitId: string) => void;
}

const habitIcons: Record<string, string> = {
  '🏃': '🏃',
  '📚': '📚',
  '🧘': '🧘',
  '💪': '💪',
  '✏️': '✏️',
  '💧': '💧',
  '😴': '😴',
  '🎯': '🎯',
};

export function HabitList({ 
  habits, 
  onToggle, 
  onEdit, 
  onDelete,
  editMode,
  onDeleteHabit 
}: HabitListProps) {
  return (
    <section className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">My Habits</h2>
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
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl transition-all duration-200 cursor-pointer hover:bg-muted/50",
              editMode && "pr-2"
            )}
            onClick={() => !editMode && onToggle(habit.id)}
          >
            {/* Icon */}
            <div
              className={cn(
                "habit-icon",
                habit.color === 'blue' && "habit-icon-blue",
                habit.color === 'purple' && "habit-icon-purple",
                habit.color === 'coral' && "habit-icon-coral"
              )}
              style={
                !['blue', 'purple', 'coral'].includes(habit.color)
                  ? { backgroundColor: `${habit.color}20`, color: habit.color }
                  : undefined
              }
            >
              {habit.icon}
            </div>

            {/* Name */}
            <span className="flex-1 font-medium text-foreground">{habit.name}</span>

            {/* Streak */}
            <span className="text-muted-foreground text-sm">
              {habit.streak} {habit.streak === 1 ? 'day' : 'days'}
            </span>

            {/* Status */}
            {editMode && onDeleteHabit ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteHabit(habit.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : habit.doneToday ? (
              <Check className="h-6 w-6 status-done" strokeWidth={3} />
            ) : (
              <Circle className="h-6 w-6 status-pending" strokeWidth={2} />
            )}
          </div>
        ))}

        {habits.length === 0 && (
          <p className="text-center text-muted-foreground py-6">
            No habits yet. Add your first habit to get started!
          </p>
        )}
      </div>
    </section>
  );
}
