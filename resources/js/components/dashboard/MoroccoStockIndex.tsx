import { useState } from "react";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { date: "Feb 3", value: 13842 },
  { date: "Feb 5", value: 13910 },
  { date: "Feb 7", value: 13875 },
  { date: "Feb 10", value: 13960 },
  { date: "Feb 12", value: 14025 },
  { date: "Feb 14", value: 13990 },
  { date: "Feb 17", value: 14080 },
  { date: "Feb 19", value: 14150 },
  { date: "Feb 21", value: 14110 },
  { date: "Feb 24", value: 14195 },
  { date: "Feb 26", value: 14260 },
  { date: "Feb 28", value: 14230 },
  { date: "Mar 3", value: 14310 },
  { date: "Mar 5", value: 14378 },
];

const topStocks = [
  { ticker: "IAM", name: "Maroc Telecom", price: "128.50", change: "+1.85", pct: "+1.46%" },
  { ticker: "ATW", name: "Attijariwafa Bank", price: "545.00", change: "+6.20", pct: "+1.15%" },
  { ticker: "BCP", name: "Banque Centrale Pop.", price: "298.00", change: "+2.10", pct: "+0.71%" },
  { ticker: "LHM", name: "LafargeHolcim Maroc", price: "1980.00", change: "-12.00", pct: "-0.60%" },
  { ticker: "CMA", name: "Ciments du Maroc", price: "2150.00", change: "+18.00", pct: "+0.84%" },
  { ticker: "TQM", name: "Taqa Morocco", price: "1185.00", change: "-8.50", pct: "-0.71%" },
];

const MoroccoStockIndex = () => {
  const [period] = useState("1M");
  const currentValue = 14378.52;
  const changeValue = +68.32;
  const changePct = +0.48;
  const isPositive = changeValue >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Morocco Stock Market · MASI
        </CardTitle>
        <Badge variant="outline" className="text-[0.625rem] font-medium px-2 py-0.5 text-muted-foreground">
          Casablanca SE
        </Badge>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Index value */}
        <div className="flex items-end gap-3 mb-4">
          <span className="font-display text-2xl md:text-3xl font-bold tabular-nums">
            {currentValue.toLocaleString("en", { minimumFractionDigits: 2 })}
          </span>
          <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{isPositive ? "+" : ""}{changeValue.toFixed(2)}</span>
            <span className="text-xs">({isPositive ? "+" : ""}{changePct.toFixed(2)}%)</span>
          </div>
        </div>

        {/* Period tabs */}
        <div className="flex gap-1 mb-4">
          {["1W", "1M", "3M", "1Y"].map((p) => (
            <button
              key={p}
              className={`px-2.5 py-1 text-[0.6875rem] font-medium rounded-md transition-colors ${
                p === period
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-48 mb-5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="masiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
              <YAxis domain={["dataMin - 50", "dataMax + 50"]} tick={{ fontSize: 10 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))", fontSize: "11px" }}
                formatter={(value: number) => [value.toLocaleString("en", { minimumFractionDigits: 2 }), "MASI"]}
              />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#masiGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top movers */}
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Top Movers</h4>
        <div className="space-y-2">
          {topStocks.map((stock) => {
            const up = stock.change.startsWith("+");
            return (
              <div key={stock.ticker} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-bold w-9 shrink-0">{stock.ticker}</span>
                  <span className="text-xs text-muted-foreground truncate">{stock.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold tabular-nums">{stock.price}</span>
                  <span className={`text-[0.6875rem] font-semibold tabular-nums flex items-center gap-0.5 ${up ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                    {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stock.pct}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[0.625rem] text-muted-foreground mt-4 text-right">
          Data is for illustration purposes · Last updated 15 min ago
        </p>
      </CardContent>
    </Card>
  );
};

export default MoroccoStockIndex;
