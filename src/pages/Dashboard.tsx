import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useHabits } from '@/hooks/useHabits';
import { Navbar } from '@/components/Navbar';
import { HabitList } from '@/components/HabitList';
import { HabitChainVisual } from '@/components/HabitChainVisual';
import { WeeklyProgress } from '@/components/WeeklyProgress';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { EditChainDialog } from '@/components/EditChainDialog';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    habits,
    chains,
    loading: habitsLoading,
    toggleHabitToday,
    addHabit,
    deleteHabit,
    updateChain,
    createChain,
    getWeeklyProgress,
  } = useHabits();

  const [editMode, setEditMode] = useState(false);
  const [chainDialogOpen, setChainDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleToggleHabit = async (habitId: string) => {
    await toggleHabitToday(habitId);
  };

  const handleAddHabit = async (name: string, icon: string, color: 'blue' | 'purple' | 'coral') => {
    await addHabit(name, icon, color);
    toast({
      title: 'Habit created!',
      description: `"${name}" has been added to your habits.`,
    });
  };

  const handleDeleteHabit = async (habitId: string) => {
    await deleteHabit(habitId);
    toast({
      title: 'Habit deleted',
      description: 'The habit has been removed.',
    });
  };

  const handleSaveChain = async (chainId: string | null, habitIds: string[]) => {
    if (chainId) {
      await updateChain(chainId, habitIds);
    } else {
      await createChain('My Chain', habitIds);
    }
    toast({
      title: 'Chain updated!',
      description: 'Your habit chain has been saved.',
    });
  };

  const handleDuplicateChain = async () => {
    const mainChain = chains[0];
    if (mainChain) {
      await createChain(`${mainChain.name || 'Chain'} (Copy)`, mainChain.habit_ids);
      toast({
        title: 'Chain duplicated!',
        description: 'A copy of your chain has been created.',
      });
    }
  };

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

  const weeklyData = getWeeklyProgress();
  const mainChain = chains[0] || null;

  return (
    <div className="min-h-screen pb-8">
      <Navbar />

      <main className="px-4">
        <div className="main-card animate-slide-up">
          {/* Card Header */}
          <div className="text-center pb-4 mb-6 border-b border-border">
            <h1 className="text-2xl font-bold text-foreground">HabitChain</h1>
          </div>

          {/* My Habits Section */}
          <HabitList
            habits={habits}
            onToggle={handleToggleHabit}
            onEdit={() => setEditMode(!editMode)}
            onDelete={() => setEditMode(!editMode)}
            editMode={editMode}
            onDeleteHabit={handleDeleteHabit}
          />

          <AddHabitDialog onAdd={handleAddHabit} />

          {/* Divider */}
          <div className="section-divider" />

          {/* Habit Chains Section */}
          <HabitChainVisual
            chain={mainChain}
            habits={habits}
            onEdit={() => setChainDialogOpen(true)}
            onDuplicate={handleDuplicateChain}
          />

          {/* Divider */}
          <div className="section-divider" />

          {/* Weekly Progress Section */}
          <WeeklyProgress data={weeklyData} />
        </div>
      </main>

      {/* Edit Chain Dialog */}
      <EditChainDialog
        open={chainDialogOpen}
        onOpenChange={setChainDialogOpen}
        chain={mainChain}
        habits={habits}
        onSave={handleSaveChain}
      />
    </div>
  );
}
