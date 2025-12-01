import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface WeeklyProgressProps {
  data: { day: string; count: number; isWeekend: boolean }[];
}

export function WeeklyProgress({ data }: WeeklyProgressProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <section className="animate-fade-in">
      <h2 className="text-xl font-semibold text-foreground mb-4">Weekly Progress</h2>

      {/* Bar chart */}
      <div className="flex items-end justify-between gap-2 h-40 px-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            {/* Bar */}
            <div className="w-full flex items-end justify-center h-32">
              <div
                className={cn(
                  "chart-bar w-full max-w-10 transition-all duration-500",
                  item.isWeekend ? "chart-bar-weekend" : "chart-bar-weekday"
                )}
                style={{
                  height: `${Math.max((item.count / maxCount) * 100, 8)}%`,
                }}
              />
            </div>
            
            {/* Day label */}
            <span className="text-xs text-muted-foreground mt-2 font-medium">
              {item.day}
            </span>
          </div>
        ))}
      </div>

      {/* Link to statistics */}
      <div className="mt-6 text-center">
        <Link 
          to="/statistics" 
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          View full statistics →
        </Link>
      </div>
    </section>
  );
}
