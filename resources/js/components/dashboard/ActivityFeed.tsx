import { cn } from "@/lib/utils";

const activities = [
  { color: "bg-emerald-500", title: "Lease signed", detail: "Unit 4B, Schillerstraße 12", time: "2 hours ago" },
  { color: "bg-amber-500", title: "Payment received", detail: "€1,450 from Anna Müller", time: "4 hours ago" },
  { color: "bg-destructive", title: "Maintenance request", detail: "Heating issue, Mozartweg 8", time: "6 hours ago" },
  { color: "bg-blue-500", title: "Inspection completed", detail: "Berliner Allee 22", time: "Yesterday" },
  { color: "bg-emerald-500", title: "New tenant", detail: "Thomas Braun added", time: "Yesterday" },
];

const ActivityFeed = () => (
  <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
    <div className="flex items-center justify-between px-6 py-5 border-b border-border">
      <h3 className="font-display text-[1.0625rem] font-bold">Recent Activity</h3>
      <button className="text-[0.8125rem] font-medium hover:underline bg-transparent border-none cursor-pointer" style={{ color: "hsl(var(--accent))" }}>View all</button>
    </div>
    <div className="px-6 py-5 flex flex-col gap-1">
      {activities.map((a, i) => (
        <div key={i} className="flex items-start gap-3 py-3">
          <span className={cn("w-2 h-2 rounded-full shrink-0 mt-1.5", a.color)} />
          <div>
            <p className="text-[0.8125rem] leading-relaxed">
              <strong className="font-semibold">{a.title}</strong> — {a.detail}
            </p>
            <p className="text-[0.6875rem] text-muted-foreground mt-0.5">{a.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ActivityFeed;
