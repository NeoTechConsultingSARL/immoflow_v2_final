import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Maintenance", value: 32000, color: "hsl(36, 90%, 55%)" },
  { name: "Insurance", value: 18000, color: "hsl(220, 60%, 50%)" },
  { name: "Taxes", value: 24000, color: "hsl(160, 60%, 45%)" },
  { name: "Utilities", value: 14000, color: "hsl(280, 50%, 55%)" },
  { name: "Management", value: 9000, color: "hsl(0, 70%, 55%)" },
];

const ChargesChart = () => (
  <div className="bg-card border border-border rounded-lg shadow-[var(--shadow-card)] overflow-hidden h-full flex flex-col">
    <div className="px-5 py-4 border-b border-border">
      <h3 className="text-sm font-bold">Charges Breakdown</h3>
      <p className="text-xs text-muted-foreground">Total: €97,000</p>
    </div>
    <div className="flex-1 p-4 min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3} strokeWidth={0}>
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip formatter={(v: number) => `€${(v / 1000).toFixed(0)}K`} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ChargesChart;
