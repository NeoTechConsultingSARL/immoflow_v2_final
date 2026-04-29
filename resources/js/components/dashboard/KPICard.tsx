import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  accentClass: string;
}

const KPICard = ({ label, value, change, trend, icon: Icon, accentClass }: KPICardProps) => (
  <div className="bg-card border border-border rounded-lg p-4 shadow-[var(--shadow-card)] flex items-center gap-4">
    <div className={cn("w-11 h-11 rounded-lg flex items-center justify-center shrink-0", accentClass)}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground font-medium truncate">{label}</p>
      <p className="text-xl font-bold leading-tight">{value}</p>
    </div>
    <div className={cn(
      "flex items-center gap-1 text-xs font-semibold shrink-0",
      trend === "up" ? "text-emerald-600" : "text-destructive"
    )}>
      {trend === "up" ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
      {change}
    </div>
  </div>
);

export default KPICard;
