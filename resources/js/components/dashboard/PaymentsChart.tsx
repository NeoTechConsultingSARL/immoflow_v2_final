import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

const data = [
  { month: "Jan", collected: 142, pending: 18 },
  { month: "Feb", collected: 155, pending: 12 },
  { month: "Mar", collected: 130, pending: 22 },
  { month: "Apr", collected: 168, pending: 15 },
  { month: "May", collected: 148, pending: 20 },
  { month: "Jun", collected: 172, pending: 10 },
  { month: "Jul", collected: 185, pending: 8 },
  { month: "Aug", collected: 160, pending: 14 },
  { month: "Sep", collected: 175, pending: 11 },
  { month: "Oct", collected: 152, pending: 19 },
  { month: "Nov", collected: 180, pending: 9 },
  { month: "Dec", collected: 195, pending: 6 },
];

const PaymentsChart = () => (
  <div className="bg-card border border-border rounded-lg shadow-[var(--shadow-card)] overflow-hidden h-full flex flex-col">
    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
      <div>
        <h3 className="text-sm font-bold">Payments</h3>
        <p className="text-xs text-muted-foreground">Collected vs Pending (€K)</p>
      </div>
    </div>
    <div className="flex-1 p-4 min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(36, 90%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(36, 90%, 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} tickFormatter={(v) => `€${v}K`} />
          <Tooltip formatter={(v: number) => `€${v}K`} />
          <Area type="monotone" dataKey="collected" stroke="hsl(160, 60%, 45%)" fill="url(#colorCollected)" strokeWidth={2} name="Collected" />
          <Area type="monotone" dataKey="pending" stroke="hsl(36, 90%, 55%)" fill="url(#colorPending)" strokeWidth={2} name="Pending" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default PaymentsChart;
