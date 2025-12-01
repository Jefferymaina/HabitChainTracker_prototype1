import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HabitColor } from '@/lib/types';

interface AddHabitDialogProps {
  onAdd: (name: string, icon: string, color: HabitColor) => void;
}

const defaultIcons = ['🏃', '📚', '🧘', '💪', '✏️', '💧', '😴', '🎯', '🎸', '🍎', '🚶', '🏋️'];
const defaultColors: { value: HabitColor; label: string; class: string }[] = [
  { value: 'blue', label: 'Blue', class: 'bg-primary' },
  { value: 'purple', label: 'Purple', class: 'bg-secondary' },
  { value: 'coral', label: 'Coral', class: 'bg-accent' },
];

export function AddHabitDialog({ onAdd }: AddHabitDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [customIcon, setCustomIcon] = useState('');
  const [color, setColor] = useState<HabitColor>('blue');
  const [customColor, setCustomColor] = useState('#10b981');
  const [useCustomColor, setUseCustomColor] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const finalIcon = customIcon.trim() || icon;
      const finalColor = useCustomColor ? customColor : color;
      onAdd(name.trim(), finalIcon, finalColor);
      setName('');
      setIcon('🎯');
      setCustomIcon('');
      setColor('blue');
      setCustomColor('#10b981');
      setUseCustomColor(false);
      setOpen(false);
    }
  };

  const handleCustomIconChange = (value: string) => {
    setCustomIcon(value);
    if (value.trim()) {
      setIcon(value.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mt-4" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Run"
              required
            />
          </div>

          {/* Icon selection */}
          <div className="space-y-3">
            <Label>Icon</Label>
            <div className="grid grid-cols-6 gap-2">
              {defaultIcons.map((i) => (
                <button
                  key={i}
                  type="button"
                  className={cn(
                    "h-10 w-10 rounded-lg text-xl flex items-center justify-center transition-all",
                    icon === i && !customIcon
                      ? "bg-primary/20 ring-2 ring-primary"
                      : "bg-muted hover:bg-muted/80"
                  )}
                  onClick={() => {
                    setIcon(i);
                    setCustomIcon('');
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={customIcon}
                onChange={(e) => handleCustomIconChange(e.target.value)}
                placeholder="Or type any emoji..."
                className="flex-1"
              />
              {customIcon && (
                <span className="text-2xl w-10 h-10 flex items-center justify-center bg-primary/20 rounded-lg ring-2 ring-primary">
                  {customIcon}
                </span>
              )}
            </div>
          </div>

          {/* Color selection */}
          <div className="space-y-3">
            <Label>Color</Label>
            <div className="flex gap-3 items-center">
              {defaultColors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={cn(
                    "h-10 w-10 rounded-full transition-all",
                    c.class,
                    color === c.value && !useCustomColor && "ring-2 ring-offset-2 ring-foreground"
                  )}
                  onClick={() => {
                    setColor(c.value);
                    setUseCustomColor(false);
                  }}
                  title={c.label}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="customColor" className="text-sm text-muted-foreground whitespace-nowrap">
                Custom:
              </Label>
              <input
                type="color"
                id="customColor"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setUseCustomColor(true);
                }}
                className="h-10 w-14 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              {useCustomColor && (
                <div 
                  className="h-10 w-10 rounded-full ring-2 ring-offset-2 ring-foreground"
                  style={{ backgroundColor: customColor }}
                />
              )}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create Habit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
