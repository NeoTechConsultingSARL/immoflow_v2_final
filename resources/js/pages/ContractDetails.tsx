import { useMemo } from "react";
import { usePage, Link } from "@inertiajs/react";
import {
    Printer, FileText, User, Building2, Calendar, Mail, Phone, MapPin,
    CreditCard, Plus, Pencil, Trash2, ArrowLeft, BadgeCheck, AlertTriangle, Clock, Languages,
} from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Mock data — in a real app this would be fetched by contract id
const buildMockContract = (id: string) => ({
    id,
    reference: `CT-2026-${id.padStart(3, "0")}`,
    createdAt: "2026-01-15",
    client: {
        name: "Anna Müller",
        cin: "DE-A123456",
        phone1: "+49 170 1234567",
        phone2: "+49 89 555 0234",
        address: "Leopoldstraße 12, München",
        email: "anna.mueller@email.com",
        observation: "Preferred contact in the morning. VIP client.",
    },
    property: {
        type: "Apartment",
        code: "Unit A1 — Residenz am Englischen Garten",
        surface: 92,
        level: "3rd floor",
        parking: "Sector B — P-14",
        parkingPrice: 18000,
    },
    finance: {
        salePrice: 485000,
        advance: 50000,
        paymentDuration: 24,
        monthsCount: 24,
        installment: 18125,
        paid: 218000,
        note: "Payment schedule adjusted on March 5th.",
    },
    status: "Active" as const,
    resold: false,
    extraInfo: [
        { id: "e1", date: "2026-02-04", amount: 5000, observation: "Notary fees adjustment", status: "Active" },
        { id: "e2", date: "2026-03-12", amount: 1200, observation: "Registration extension", status: "Active" },
    ],
    scheduledPayments: [
        { id: "s1", date: "2026-04-15", installment: 18125, status: "Paid" as const },
        { id: "s2", date: "2026-05-15", installment: 18125, status: "Paid" as const },
        { id: "s3", date: "2026-06-15", installment: 18125, status: "Upcoming" as const },
        { id: "s4", date: "2026-07-15", installment: 18125, status: "Upcoming" as const },
        { id: "s5", date: "2026-03-15", installment: 18125, status: "Overdue" as const },
    ],
    payments: [
        { id: "p1", opDate: "2026-01-20", payDate: "2026-01-20", amount: 50000, mode: "Bank transfer", account: "DE89...0532", opNumber: "OP-001" },
        { id: "p2", opDate: "2026-02-15", payDate: "2026-02-15", amount: 18125, mode: "Bank transfer", account: "DE89...0532", opNumber: "OP-002" },
        { id: "p3", opDate: "2026-03-15", payDate: "2026-03-15", amount: 18125, mode: "Check", account: "DE89...0532", opNumber: "OP-003" },
    ],
    commissions: [
        { id: "k1", agent: "Markus Hartmann", role: "Sales agent", amount: 9700, status: "Paid" },
        { id: "k2", agent: "Sofia Becker", role: "Broker", amount: 4850, status: "Pending" },
    ],
});

const fmt = (n: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const ContractDetails = () => {
    const { url } = usePage();
    const id = useMemo(() => {
        const searchParams = new URL(url || "/", window.location.origin).searchParams;
        return searchParams.get("id") || "1";
    }, [url]);
    const c = useMemo(() => buildMockContract(id), [id]);

    const remaining = c.finance.salePrice + c.property.parkingPrice - c.finance.paid;
    const progress = Math.min(100, Math.round((c.finance.paid / (c.finance.salePrice + c.property.parkingPrice)) * 100));
    const progressColor =
        progress < 25 ? "bg-destructive" :
            progress < 50 ? "bg-amber-500" :
                progress < 75 ? "bg-blue-500" : "bg-emerald-500";

    const printActions = [
        { label: "Contract Summary", icon: FileText, variant: "outline" as const },
        { label: "Contract AR", icon: Languages, className: "bg-emerald-600 hover:bg-emerald-700 text-white" },
        { label: "Contract FR", icon: Languages, className: "bg-blue-600 hover:bg-blue-700 text-white" },
        { label: "Contract EN", icon: Languages, className: "bg-amber-600 hover:bg-amber-700 text-white" },
        { label: "Resell Certificate", icon: BadgeCheck, className: "bg-rose-600 hover:bg-rose-700 text-white" },
        { label: "Full Payment Certificate", icon: BadgeCheck, className: "bg-slate-800 hover:bg-slate-900 text-white" },
    ];

    const scheduleBadge: Record<string, string> = {
        Paid: "bg-emerald-500/10 text-emerald-600",
        Upcoming: "bg-blue-500/10 text-blue-600",
        Overdue: "bg-destructive/10 text-destructive",
    };
    const scheduleIcon: Record<string, typeof Clock> = {
        Paid: BadgeCheck, Upcoming: Clock, Overdue: AlertTriangle,
    };

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="lg:hidden" />
                            <AppBreadcrumb />
                        </div>
                        <Button asChild variant="ghost" className="gap-2">
                            <Link href="/client-contracts"><ArrowLeft className="w-4 h-4" /> Back to contracts</Link>
                        </Button>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-1 duration-400">
                        {/* Title */}
                        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                            <div>
                                <p className="text-xs font-mono text-muted-foreground">{c.reference}</p>
                                <h1 className="font-display text-[1.75rem] xl:text-[2rem] font-bold leading-tight">{c.client.name}</h1>
                                <p className="text-[0.9375rem] text-muted-foreground">{c.property.code}</p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                                <BadgeCheck className="w-3.5 h-3.5" /> {c.status}
                            </span>
                        </div>

                        {/* Print toolbar */}
                        <div className="bg-card border border-border rounded-xl p-4 shadow-[var(--shadow-card)] mb-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <Printer className="w-4 h-4 text-muted-foreground mr-1" />
                                {printActions.map((a) => (
                                    <Button key={a.label} variant={a.variant} size="sm" className={cn("gap-1.5", a.className)}>
                                        <a.icon className="w-3.5 h-3.5" /> {a.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-card)] mb-6">
                            <div className="flex items-end justify-between mb-3">
                                <div>
                                    <h3 className="font-display text-base font-bold">Contract progress</h3>
                                    <p className="text-xs text-muted-foreground">Payment completion across the contract lifecycle</p>
                                </div>
                                <span className="font-display text-2xl font-bold">{progress}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                <div className={cn("h-full transition-all", progressColor)} style={{ width: `${progress}%` }} />
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-border">
                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Total</p>
                                    <p className="font-display font-bold">{fmt(c.finance.salePrice + c.property.parkingPrice)}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Paid</p>
                                    <p className="font-display font-bold text-emerald-600">{fmt(c.finance.paid)}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Remaining</p>
                                    <p className="font-display font-bold text-amber-600">{fmt(remaining)}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Installment</p>
                                    <p className="font-display font-bold">{fmt(c.finance.installment)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Summary: client + contract */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Client info */}
                            <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
                                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <h3 className="font-display font-bold">Client information</h3>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="outline" size="sm" className="gap-1.5"><Pencil className="w-3.5 h-3.5" /> Edit</Button>
                                        <Button variant="outline" size="sm" className="gap-1.5"><Plus className="w-3.5 h-3.5" /> Observation</Button>
                                    </div>
                                </div>
                                <dl className="divide-y divide-border">
                                    {[
                                        { k: "Full name", v: c.client.name, icon: User },
                                        { k: "ID / CIN", v: c.client.cin, icon: BadgeCheck },
                                        { k: "Phone 1", v: c.client.phone1, icon: Phone },
                                        { k: "Phone 2", v: c.client.phone2, icon: Phone },
                                        { k: "Address", v: c.client.address, icon: MapPin },
                                        { k: "Email", v: c.client.email, icon: Mail },
                                        { k: "Observation", v: c.client.observation, icon: FileText },
                                    ].map((row) => (
                                        <div key={row.k} className="px-5 py-3 grid grid-cols-3 gap-4">
                                            <dt className="text-xs text-muted-foreground flex items-center gap-2 col-span-1">
                                                <row.icon className="w-3.5 h-3.5" /> {row.k}
                                            </dt>
                                            <dd className="text-sm font-medium col-span-2 break-words">{row.v}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            {/* Contract info */}
                            <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
                                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-muted-foreground" />
                                        <h3 className="font-display font-bold">Contract information</h3>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="outline" size="sm" className="gap-1.5"><Plus className="w-3.5 h-3.5" /> Extra info</Button>
                                        <Button variant="outline" size="sm" className="gap-1.5"><Pencil className="w-3.5 h-3.5" /> Edit</Button>
                                    </div>
                                </div>
                                <dl className="divide-y divide-border">
                                    {[
                                        { k: "Property type", v: c.property.type },
                                        { k: "Property code", v: c.property.code },
                                        { k: "Surface", v: `${c.property.surface} m²` },
                                        { k: "Level", v: c.property.level },
                                        { k: "Parking", v: c.property.parking },
                                        { k: "Parking price", v: fmt(c.property.parkingPrice) },
                                        { k: "Sale price", v: fmt(c.finance.salePrice) },
                                        { k: "Advance", v: fmt(c.finance.advance) },
                                        { k: "Payment duration", v: `${c.finance.paymentDuration} months` },
                                        { k: "Number of months", v: `${c.finance.monthsCount} months` },
                                        { k: "Installment", v: fmt(c.finance.installment) },
                                        { k: "Total paid", v: fmt(c.finance.paid) },
                                        { k: "Remaining", v: fmt(remaining) },
                                        { k: "Created on", v: c.createdAt, icon: Calendar },
                                        { k: "Note", v: c.finance.note },
                                    ].map((row) => (
                                        <div key={row.k} className="px-5 py-3 grid grid-cols-3 gap-4">
                                            <dt className="text-xs text-muted-foreground col-span-1">{row.k}</dt>
                                            <dd className="text-sm font-medium col-span-2 break-words">{row.v}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>

                        {/* Extra info (Cas Libre) */}
                        <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden mb-6">
                            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                                <h3 className="font-display font-bold">Additional information</h3>
                                <Button size="sm" className="gap-1.5"><Plus className="w-3.5 h-3.5" /> Add entry</Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Observation</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {c.extraInfo.map((e) => (
                                        <TableRow key={e.id}>
                                            <TableCell>{e.date}</TableCell>
                                            <TableCell className="font-semibold">{fmt(e.amount)}</TableCell>
                                            <TableCell>{e.observation}</TableCell>
                                            <TableCell>
                                                <span className="text-[0.625rem] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                                                    {e.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="w-3.5 h-3.5" /></Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
                                        <TableCell className="font-bold" colSpan={2}>{fmt(c.extraInfo.reduce((s, x) => s + x.amount, 0))}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        {/* Scheduled payments */}
                        <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden mb-6">
                            <div className="px-5 py-4 border-b border-border">
                                <h3 className="font-display font-bold">Scheduled payments</h3>
                                <p className="text-xs text-muted-foreground">Upcoming and past installments</p>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Scheduled date</TableHead>
                                        <TableHead>Installment</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {c.scheduledPayments.map((s) => {
                                        const Icon = scheduleIcon[s.status];
                                        return (
                                            <TableRow key={s.id}>
                                                <TableCell>{s.date}</TableCell>
                                                <TableCell className="font-semibold">{fmt(s.installment)}</TableCell>
                                                <TableCell>
                                                    <span className={cn("inline-flex items-center gap-1 text-[0.625rem] font-semibold px-2 py-0.5 rounded-full", scheduleBadge[s.status])}>
                                                        <Icon className="w-3 h-3" /> {s.status}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Payments / Réglements */}
                        <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden mb-6">
                            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="font-display font-bold">Payments</h3>
                                </div>
                                <Button size="sm" className="gap-1.5"><Plus className="w-3.5 h-3.5" /> New payment</Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Op. date</TableHead>
                                        <TableHead>Payment date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Mode</TableHead>
                                        <TableHead>Bank account</TableHead>
                                        <TableHead>Op. #</TableHead>
                                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {c.payments.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell>{p.opDate}</TableCell>
                                            <TableCell>{p.payDate}</TableCell>
                                            <TableCell className="font-semibold">{fmt(p.amount)}</TableCell>
                                            <TableCell>{p.mode}</TableCell>
                                            <TableCell className="font-mono text-xs">{p.account}</TableCell>
                                            <TableCell className="font-mono text-xs">{p.opNumber}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="w-3.5 h-3.5" /></Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-right font-semibold">Total received</TableCell>
                                        <TableCell className="font-bold" colSpan={5}>{fmt(c.payments.reduce((s, x) => s + x.amount, 0))}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        {/* Commissions */}
                        <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden mb-6">
                            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                                <h3 className="font-display font-bold">Commissions</h3>
                                <Button size="sm" variant="outline" className="gap-1.5"><Plus className="w-3.5 h-3.5" /> Add commission</Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Agent</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {c.commissions.map((k) => (
                                        <TableRow key={k.id}>
                                            <TableCell className="font-semibold">{k.agent}</TableCell>
                                            <TableCell>{k.role}</TableCell>
                                            <TableCell className="font-semibold">{fmt(k.amount)}</TableCell>
                                            <TableCell>
                                                <span className={cn(
                                                    "text-[0.625rem] font-semibold px-2 py-0.5 rounded-full",
                                                    k.status === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                                )}>{k.status}</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default ContractDetails;