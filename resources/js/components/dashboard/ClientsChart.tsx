import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

const data = [
  { month: "Jan", newClients: 8, churned: 2 },
  { month: "Feb", newClients: 12, churned: 1 },
  { month: "Mar", newClients: 6, churned: 3 },
  { month: "Apr", newClients: 15, churned: 2 },
  { month: "May", newClients: 10, churned: 4 },
  { month: "Jun", newClients: 18, churned: 1 },
  { month: "Jul", newClients: 14, churned: 3 },
  { month: "Aug", newClients: 9, churned: 2 },
  { month: "Sep", newClients: 11, churned: 5 },
  { month: "Oct", newClients: 16, churned: 2 },
  { month: "Nov", newClients: 13, churned: 3 },
  { month: "Dec", newClients: 20, churned: 1 },
];

const ClientsChart = () => (
  <div className="bg-card border border-border rounded-lg shadow-[var(--shadow-card)] overflow-hidden h-full flex flex-col">
    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
      <div>
        <h3 className="text-sm font-bold">Clients</h3>
        <p className="text-xs text-muted-foreground">New vs Churned</p>
      </div>
      <div className="flex items-center gap-3 text-[10px]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />New</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "hsl(0, 70%, 55%)" }} />Churned</span>
      </div>
    </div>
    <div className="flex-1 p-4 min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} />
          <Tooltip />
          <Bar dataKey="newClients" fill="hsl(160, 60%, 45%)" radius={[3, 3, 0, 0]} barSize={14} name="New" />
          <Bar dataKey="churned" fill="hsl(0, 70%, 55%)" radius={[3, 3, 0, 0]} barSize={14} name="Churned" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ClientsChart;
