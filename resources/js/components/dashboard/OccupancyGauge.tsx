import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const data = [
  { name: "Occupancy", value: 94.2, fill: "hsl(160, 60%, 45%)" },
];

const OccupancyGauge = () => (
  <div className="bg-card border border-border rounded-lg shadow-[var(--shadow-card)] overflow-hidden h-full flex flex-col">
    <div className="px-5 py-4 border-b border-border">
      <h3 className="text-sm font-bold">Occupancy Rate</h3>
      <p className="text-xs text-muted-foreground">Current portfolio</p>
    </div>
    <div className="flex-1 flex items-center justify-center p-4 min-h-[220px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" startAngle={180} endAngle={0} data={data} barSize={14}>
          <RadialBar background dataKey="value" cornerRadius={8} max={100} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
        <span className="text-3xl font-bold">94.2%</span>
        <span className="text-xs text-muted-foreground">occupied</span>
      </div>
    </div>
  </div>
);

export default OccupancyGauge;
