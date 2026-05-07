import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  iconColorClass: string;
}

const StatCard = ({ label, value, change, trend, icon: Icon, iconColorClass }: StatCardProps) => (
  <div className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-card)] flex items-start justify-between">
    <div className="flex flex-col gap-1">
      <p className="text-[0.8125rem] text-muted-foreground font-medium">{label}</p>
      <p className="font-display text-[1.75rem] font-bold leading-tight">{value}</p>
      <p className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold mt-1",
        trend === "up" ? "text-emerald-600" : "text-destructive"
      )}>
        {trend === "up" ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/></svg>
        )}
        {change}
      </p>
    </div>
    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", iconColorClass)}>
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

export default StatCard;
