import { cn } from "@/lib/utils";

const properties = [
  { name: "Schillerstraße 12", address: "Munich, 80539", status: "Occupied", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&q=80" },
  { name: "Mozartweg 8", address: "Berlin, 10115", status: "Maintenance", img: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=120&q=80" },
  { name: "Berliner Allee 22", address: "Hamburg, 20095", status: "Occupied", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&q=80" },
  { name: "Gartenstraße 5", address: "Frankfurt, 60311", status: "Vacant", img: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=120&q=80" },
];

const statusStyles: Record<string, string> = {
  Occupied: "bg-emerald-500/10 text-emerald-600",
  Vacant: "bg-amber-500/10 text-amber-600",
  Maintenance: "bg-destructive/10 text-destructive",
};

const TopProperties = () => (
  <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
    <div className="flex items-center justify-between px-6 py-5 border-b border-border">
      <h3 className="font-display text-[1.0625rem] font-bold">Top Properties</h3>
      <button className="text-[0.8125rem] font-medium hover:underline bg-transparent border-none cursor-pointer" style={{ color: "hsl(var(--accent))" }}>View all</button>
    </div>
    <div className="px-6 py-5 flex flex-col">
      {properties.map((p, i) => (
        <div key={i} className={cn("flex items-center gap-4 py-3.5", i < properties.length - 1 && "border-b border-border")}>
          <img src={p.img} alt={p.name} className="w-14 h-14 rounded-lg object-cover shrink-0 bg-muted" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{p.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{p.address}</p>
          </div>
          <span className={cn("text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap", statusStyles[p.status])}>
            {p.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default TopProperties;
