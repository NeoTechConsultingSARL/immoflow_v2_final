import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { month: "Jan", revenue: 145 },
  { month: "Feb", revenue: 160 },
  { month: "Mar", revenue: 135 },
  { month: "Apr", revenue: 180 },
  { month: "May", revenue: 155 },
  { month: "Jun", revenue: 170 },
  { month: "Jul", revenue: 190 },
  { month: "Aug", revenue: 165 },
  { month: "Sep", revenue: 175 },
  { month: "Oct", revenue: 150 },
  { month: "Nov", revenue: 185 },
  { month: "Dec", revenue: 195 },
];

const RevenueChart = () => (
  <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
    <div className="flex items-center justify-between px-6 py-5 border-b border-border">
      <h3 className="font-display text-[1.0625rem] font-bold">Revenue Overview</h3>
      <button className="text-[0.8125rem] font-medium text-accent-foreground hover:underline bg-transparent border-none cursor-pointer" style={{ color: "hsl(var(--accent))" }}>View report</button>
    </div>
    <div className="p-6">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} tickFormatter={(v) => `€${v}K`} />
          <Tooltip formatter={(value: number) => [`€${value}K`, "Revenue"]} cursor={{ fill: "hsl(220, 15%, 94%)" }} />
          <Bar dataKey="revenue" fill="hsl(36, 90%, 55%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default RevenueChart;
