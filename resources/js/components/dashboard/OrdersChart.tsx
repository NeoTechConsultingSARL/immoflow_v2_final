import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

const data = [
  { month: "Jan", workOrders: 24, completed: 20 },
  { month: "Feb", workOrders: 18, completed: 16 },
  { month: "Mar", workOrders: 30, completed: 25 },
  { month: "Apr", workOrders: 22, completed: 22 },
  { month: "May", workOrders: 28, completed: 24 },
  { month: "Jun", workOrders: 15, completed: 14 },
  { month: "Jul", workOrders: 20, completed: 18 },
  { month: "Aug", workOrders: 32, completed: 28 },
  { month: "Sep", workOrders: 26, completed: 23 },
  { month: "Oct", workOrders: 19, completed: 17 },
  { month: "Nov", workOrders: 25, completed: 22 },
  { month: "Dec", workOrders: 16, completed: 15 },
];

const OrdersChart = () => (
  <div className="bg-card border border-border rounded-lg shadow-[var(--shadow-card)] overflow-hidden h-full flex flex-col">
    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
      <div>
        <h3 className="text-sm font-bold">Work Orders</h3>
        <p className="text-xs text-muted-foreground">Created vs Completed</p>
      </div>
      <div className="flex items-center gap-3 text-[10px]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "hsl(220, 60%, 50%)" }} />Created</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Completed</span>
      </div>
    </div>
    <div className="flex-1 p-4 min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} />
          <Tooltip />
          <Line type="monotone" dataKey="workOrders" stroke="hsl(220, 60%, 50%)" strokeWidth={2} dot={{ r: 3 }} name="Created" />
          <Line type="monotone" dataKey="completed" stroke="hsl(160, 60%, 45%)" strokeWidth={2} dot={{ r: 3 }} name="Completed" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default OrdersChart;
