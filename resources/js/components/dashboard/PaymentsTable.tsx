import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const payments = [
  { tenant: "Anna Müller", property: "Schillerstraße 12, 4B", amount: "€1,450", date: "Mar 1, 2026", status: "Paid" },
  { tenant: "Thomas Braun", property: "Mozartweg 8, 2A", amount: "€980", date: "Mar 1, 2026", status: "Paid" },
  { tenant: "Lisa Weber", property: "Berliner Allee 22, 1C", amount: "€1,200", date: "Mar 1, 2026", status: "Pending" },
  { tenant: "Erik Hoffmann", property: "Gartenstraße 5, 3D", amount: "€850", date: "Feb 28, 2026", status: "Overdue" },
  { tenant: "Sarah Klein", property: "Hauptstraße 17, 5A", amount: "€1,100", date: "Mar 1, 2026", status: "Paid" },
];

const statusStyles: Record<string, string> = {
  Paid: "bg-emerald-500/10 text-emerald-600",
  Pending: "bg-amber-500/10 text-amber-600",
  Overdue: "bg-destructive/10 text-destructive",
};

const PaymentsTable = () => (
  <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
    <div className="flex items-center justify-between px-6 py-5 border-b border-border">
      <h3 className="font-display text-[1.0625rem] font-bold">Recent Payments</h3>
      <button className="text-[0.8125rem] font-medium hover:underline bg-transparent border-none cursor-pointer" style={{ color: "hsl(var(--accent))" }}>View all</button>
    </div>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs uppercase tracking-wider">Tenant</TableHead>
            <TableHead className="text-xs uppercase tracking-wider">Property</TableHead>
            <TableHead className="text-xs uppercase tracking-wider">Amount</TableHead>
            <TableHead className="text-xs uppercase tracking-wider">Date</TableHead>
            <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p, i) => (
            <TableRow key={i}>
              <TableCell className="font-semibold">{p.tenant}</TableCell>
              <TableCell>{p.property}</TableCell>
              <TableCell>{p.amount}</TableCell>
              <TableCell>{p.date}</TableCell>
              <TableCell>
                <span className={cn("text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full", statusStyles[p.status])}>
                  {p.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default PaymentsTable;
