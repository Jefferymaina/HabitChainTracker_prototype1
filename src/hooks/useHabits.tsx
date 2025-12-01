import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Habit, HabitEntry, HabitChain, HabitWithStreak, HabitColor } from '@/lib/types';
import { format, subDays, parseISO, isAfter, isBefore, startOfDay } from 'date-fns';

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<HabitWithStreak[]>([]);
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [chains, setChains] = useState<HabitChain[]>([]);
  const [loading, setLoading] = useState(true);

  const today = format(new Date(), 'yyyy-MM-dd');

  const calculateStreak = useCallback((habitId: string, allEntries: HabitEntry[]): number => {
    const habitEntries = allEntries
      .filter(e => e.habit_id === habitId && e.done)
      .map(e => e.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (habitEntries.length === 0) return 0;

    let streak = 0;
    let currentDate = startOfDay(new Date());

    // Check if today is done
    const todayStr = format(currentDate, 'yyyy-MM-dd');
    if (habitEntries.includes(todayStr)) {
      streak = 1;
      currentDate = subDays(currentDate, 1);
    }

    // Count consecutive days
    while (true) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      if (habitEntries.includes(dateStr)) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        // If we haven't started counting yet (today not done), check yesterday
        if (streak === 0) {
          const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
          if (habitEntries.includes(yesterdayStr)) {
            streak = 1;
            currentDate = subDays(currentDate, 2);
            continue;
          }
        }
        break;
      }
    }

    return streak;
  }, []);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (habitsError) throw habitsError;

      // Fetch all entries for the user's habits
      const habitIds = (habitsData || []).map(h => h.id);
      let entriesData: HabitEntry[] = [];
      
      if (habitIds.length > 0) {
        const { data, error: entriesError } = await supabase
          .from('habit_entries')
          .select('*')
          .in('habit_id', habitIds);

        if (entriesError) throw entriesError;
        entriesData = (data || []) as HabitEntry[];
      }

      // Fetch chains
      const { data: chainsData, error: chainsError } = await supabase
        .from('habit_chains')
        .select('*')
        .eq('user_id', user.id);

      if (chainsError) throw chainsError;

      // Process habits with streaks
      const habitsWithStreaks: HabitWithStreak[] = (habitsData || []).map(habit => {
        const todayEntry = entriesData.find(
          e => e.habit_id === habit.id && e.date === today
        );
        return {
          ...habit,
          color: habit.color as HabitColor,
          streak: calculateStreak(habit.id, entriesData),
          doneToday: todayEntry?.done || false,
        };
      });

      setHabits(habitsWithStreaks);
      setEntries(entriesData);
      setChains((chainsData || []) as HabitChain[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, today, calculateStreak]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleHabitToday = async (habitId: string) => {
    if (!user) return;

    const existingEntry = entries.find(
      e => e.habit_id === habitId && e.date === today
    );

    try {
      if (existingEntry) {
        // Toggle existing entry
        const { error } = await supabase
          .from('habit_entries')
          .update({ done: !existingEntry.done })
          .eq('id', existingEntry.id);

        if (error) throw error;
      } else {
        // Create new entry
        const { error } = await supabase
          .from('habit_entries')
          .insert({
            habit_id: habitId,
            date: today,
            done: true,
          });

        if (error) throw error;
      }

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const addHabit = async (name: string, icon: string, color: HabitColor) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name,
          icon,
          color,
        });

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const updateChain = async (chainId: string, habitIds: string[]) => {
    try {
      const { error } = await supabase
        .from('habit_chains')
        .update({ habit_ids: habitIds })
        .eq('id', chainId);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating chain:', error);
    }
  };

  const createChain = async (name: string, habitIds: string[]) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('habit_chains')
        .insert({
          user_id: user.id,
          name,
          habit_ids: habitIds,
        });

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error creating chain:', error);
    }
  };

  // Get weekly progress data
  const getWeeklyProgress = useCallback(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const result: { day: string; count: number; isWeekend: boolean }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      const dayName = days[(dayOfWeek + 6) % 7]; // Convert to Mon-Sun
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const count = entries.filter(
        e => e.date === dateStr && e.done
      ).length;

      result.push({ day: dayName, count, isWeekend });
    }

    return result;
  }, [entries]);

  return {
    habits,
    entries,
    chains,
    loading,
    toggleHabitToday,
    addHabit,
    deleteHabit,
    updateChain,
    createChain,
    getWeeklyProgress,
    refetch: fetchData,
  };
}
