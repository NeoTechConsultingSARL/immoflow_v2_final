import { useMemo, useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import {
    Printer, FileText, User, Building2, Calendar, Mail, Phone, MapPin,
    CreditCard, Plus, Pencil, Trash2, ArrowLeft, BadgeCheck, AlertTriangle, Clock, Languages,
} from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock data — in a real app this would be fetched by contract id
const buildMockContract = (id: string) => ({
    id,
    reference: `CT-2026-${id.padStart(3, "0")}`,
    createdAt: "2026-01-15",
    client: {
        name: "Anna Müller",
        cin: "DE-A123456",
        phone: "+49 170 1234567",
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

interface ContractDetailsProps {
    contract?: any;
    path?: string;
    bloc?: any;
}

const ContractDetails = ({ contract, path, bloc }: ContractDetailsProps) => {
    const { url } = usePage();
    const searchParams = useMemo(() => {
        return new URL(url || "/", window.location.origin).searchParams;
    }, [url]);

    const id = useMemo(() => {
        return searchParams.get("id") || "1";
    }, [searchParams]);

    const c = useMemo(() => {
        if (!contract) {
            return buildMockContract(id);
        }

        // Map client info
        const clientName = contract.client?.full_name || "Unknown Client";
        const clientCIN = contract.client?.identity_number || "N/A";
        const clientPhone = contract.client?.phone || "N/A";
        const clientAddress = contract.client?.address || "N/A";
        const clientEmail = contract.client?.email || "N/A";
        const clientObservation = contract.modification?.notes || "";

        // Map property info
        const propType = contract.property?.property_type?.name || contract.property?.propertyType?.name || "Apartment";
        const propCode = contract.property 
            ? `${contract.property.name} — ${contract.property.bloc?.tranche?.project?.name || ''}`
            : "Unit A1 — Residenz am Englischen Garten";
        const surface = contract.property?.surface || 92;
        const level = contract.property?.level || "3rd floor";
        const parking = contract.property?.parking || "Sector B — P-14";
        const parkingPrice = contract.property?.parkingPrice || 18000;

        // Map finance info
        const salePrice = Number(contract.price || 0);
        const advance = Number(contract.advance || 0);
        const paymentDuration = Number(contract.payment_duration || 24);
        const monthsCount = Number(contract.payment_duration || 24);

        // Map schedule rows
        const schedules = (contract.payment_schedules || []).map((s: any) => {
            const dueDate = s.due_date ? s.due_date.slice(0, 10) : "";
            const todayStr = new Date().toISOString().slice(0, 10);
            const isPast = dueDate < todayStr;
            const status = isPast ? ("Paid" as const) : ("Upcoming" as const);
            return {
                id: String(s.id),
                date: dueDate,
                installment: Number(s.amount || 0),
                status: status,
                observation: s.observation || "",
            };
        });

        // Installment calculation
        const installment = schedules.length > 0 
            ? schedules[0].installment 
            : (paymentDuration > 0 ? (salePrice - advance) / paymentDuration : 0);

        // Generate payments history:
        const paymentsList: any[] = [];
        if (advance > 0) {
            paymentsList.push({
                id: "p-adv",
                opDate: contract.date ? contract.date.slice(0, 10) : (contract.created_at ? contract.created_at.slice(0, 10) : ""),
                payDate: contract.date ? contract.date.slice(0, 10) : (contract.created_at ? contract.created_at.slice(0, 10) : ""),
                amount: advance,
                mode: "Bank transfer",
                account: "DE89...0532",
                opNumber: "OP-ADV"
            });
        }

        schedules.forEach((s: any) => {
            if (s.status === "Paid") {
                paymentsList.push({
                    id: `p-${s.id}`,
                    opDate: s.date,
                    payDate: s.date,
                    amount: s.installment,
                    mode: "Bank transfer",
                    account: "DE89...0532",
                    opNumber: `OP-${s.id}`
                });
            }
        });

        // Total paid
        const totalPaid = paymentsList.reduce((acc, curr) => acc + curr.amount, 0);

        // Map commissions
        const commissionsList = contract.commission ? [
            {
                id: String(contract.commission.id),
                agent: contract.commission.broker_name || "Broker",
                role: "Broker",
                amount: Number(contract.commission.amount || 0),
                status: contract.commission.status || "Pending",
            }
        ] : [];

        // Map extraInfo
        const extraInfoList = contract.modification ? [
            {
                id: String(contract.modification.id),
                date: contract.modification.created_at ? contract.modification.created_at.slice(0, 10) : "",
                amount: 0,
                observation: contract.modification.notes || "Modification note",
                status: "Active"
            }
        ] : [];

        // Map status
        let statusDisplay: "Active" | "Pending" | "Completed" | "Expired" = "Active";
        if (contract.status === "completed") {
            statusDisplay = "Completed";
        } else if (contract.status === "cancelled") {
            statusDisplay = "Expired";
        } else if (contract.status === "draft") {
            statusDisplay = "Pending";
        }

        return {
            id: String(contract.id),
            reference: contract.contract_number || `CT-2026-${String(contract.id).padStart(3, "0")}`,
            createdAt: contract.date ? contract.date.slice(0, 10) : (contract.created_at ? contract.created_at.slice(0, 10) : ""),
            client: {
                name: clientName,
                cin: clientCIN,
                phone: clientPhone,
                address: clientAddress,
                email: clientEmail,
                observation: clientObservation,
            },
            property: {
                type: propType,
                code: propCode,
                surface: surface,
                level: level,
                parking: parking,
                parkingPrice: parkingPrice,
            },
            finance: {
                salePrice: salePrice,
                advance: advance,
                paymentDuration: paymentDuration,
                monthsCount: monthsCount,
                installment: installment,
                paid: totalPaid,
                note: contract.modification?.notes || "",
            },
            status: statusDisplay,
            resold: false,
            extraInfo: extraInfoList,
            scheduledPayments: schedules,
            payments: paymentsList,
            commissions: commissionsList,
        };
    }, [contract, id]);

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

    const handlePrint = (label: string) => {
        if (!c.id) return;
        
        let template = "summary";
        if (label === "Contract AR") template = "ar";
        else if (label === "Contract FR") template = "fr";
        else if (label === "Contract EN") template = "en";
        else if (label === "Resell Certificate") template = "resell";
        else if (label === "Full Payment Certificate") template = "full_payment";

        const blocId = contract?.property?.bloc_id || searchParams.get("bloc") || "1";
        
        window.open(`/blocs/${blocId}/contracts/${c.id}/pdf?template=${template}`, '_blank');
    };

    // Dialog states
    const [clientDialogOpen, setClientDialogOpen] = useState(false);
    const [clientForm, setClientForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        cin: "",
        address: "",
    });

    const [contractDialogOpen, setContractDialogOpen] = useState(false);
    const [contractForm, setContractForm] = useState({
        contractNumber: "",
        status: "active",
        price: "",
        advance: "",
        paymentDuration: "",
        paymentFrequency: "",
    });

    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        dueDate: "",
        amount: "",
        observation: "",
    });

    const [commissionDialogOpen, setCommissionDialogOpen] = useState(false);
    const [commissionForm, setCommissionForm] = useState({
        brokerName: "",
        amount: "",
        description: "",
        status: "Pending",
    });

    const [observationDialogOpen, setObservationDialogOpen] = useState(false);
    const [observationForm, setObservationForm] = useState({
        notes: "",
    });

    // Opening handlers
    const openEditClient = () => {
        const nameParts = (c.client.name || "").trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        setClientForm({
            firstName: firstName,
            lastName: lastName,
            email: c.client.email || "",
            phone: c.client.phone || "",
            cin: c.client.cin || "",
            address: c.client.address || "",
        });
        setClientDialogOpen(true);
    };

    const openEditContract = () => {
        setContractForm({
            contractNumber: c.reference || "",
            status: contract?.status || "active",
            price: String(c.finance.salePrice || ""),
            advance: String(c.finance.advance || ""),
            paymentDuration: String(c.finance.paymentDuration || ""),
            paymentFrequency: String(contract?.payment_frequency || "1"),
        });
        setContractDialogOpen(true);
    };

    const openAddPayment = () => {
        setPaymentForm({
            dueDate: new Date().toISOString().slice(0, 10),
            amount: "",
            observation: "",
        });
        setPaymentDialogOpen(true);
    };

    const openAddCommission = () => {
        setCommissionForm({
            brokerName: contract?.commission?.broker_name || "",
            amount: contract?.commission?.amount ? String(contract.commission.amount) : "",
            description: contract?.commission?.description || "",
            status: contract?.commission?.status || "Pending",
        });
        setCommissionDialogOpen(true);
    };

    const openEditObservation = () => {
        setObservationForm({
            notes: c.finance.note || "",
        });
        setObservationDialogOpen(true);
    };

    // Saving handlers
    const saveClient = () => {
        const blocId = contract?.property?.bloc_id || searchParams.get("bloc") || "1";
        const payload = {
            client_name: `${clientForm.firstName} ${clientForm.lastName}`.trim(),
            client_email: clientForm.email,
            client_phone: clientForm.phone,
            client_cin: clientForm.cin,
            client_address: clientForm.address,
        };

        router.put(`/blocs/${blocId}/contracts/${c.id}`, payload, {
            onSuccess: () => {
                toast({ title: "Client information updated successfully" });
                setClientDialogOpen(false);
            },
            onError: () => {
                toast({ title: "Failed to update client information", variant: "destructive" });
            }
        });
    };

    const saveContract = () => {
        const blocId = contract?.property?.bloc_id || searchParams.get("bloc") || "1";
        const payload = {
            contract_number: contractForm.contractNumber,
            status: contractForm.status,
            price: contractForm.price,
            advance: contractForm.advance,
            payment_duration: contractForm.paymentDuration,
            payment_frequency: contractForm.paymentFrequency,
        };

        router.put(`/blocs/${blocId}/contracts/${c.id}`, payload, {
            onSuccess: () => {
                toast({ title: "Contract details updated successfully" });
                setContractDialogOpen(false);
            },
            onError: () => {
                toast({ title: "Failed to update contract details", variant: "destructive" });
            }
        });
    };

    const savePayment = () => {
        const payload = {
            due_date: paymentForm.dueDate,
            amount: paymentForm.amount,
            observation: paymentForm.observation,
        };

        router.post(`/contracts/${c.id}/payments`, payload, {
            onSuccess: () => {
                toast({ title: "Payment scheduled successfully" });
                setPaymentDialogOpen(false);
            },
            onError: () => {
                toast({ title: "Failed to add payment", variant: "destructive" });
            }
        });
    };

    const deletePayment = (paymentId: string) => {
        const cleanId = paymentId.replace("p-", "");
        if (cleanId === "adv") {
            toast({ title: "Advance payment cannot be deleted directly here. Edit contract details instead.", variant: "destructive" });
            return;
        }

        router.delete(`/contracts/${c.id}/payments/${cleanId}`, {
            onSuccess: () => {
                toast({ title: "Payment entry deleted successfully" });
            },
            onError: () => {
                toast({ title: "Failed to delete payment entry", variant: "destructive" });
            }
        });
    };

    const saveCommission = () => {
        const payload = {
            broker_name: commissionForm.brokerName,
            amount: commissionForm.amount,
            description: commissionForm.description,
            status: commissionForm.status,
        };

        router.post(`/contracts/${c.id}/commissions`, payload, {
            onSuccess: () => {
                toast({ title: "Commission saved successfully" });
                setCommissionDialogOpen(false);
            },
            onError: () => {
                toast({ title: "Failed to save commission", variant: "destructive" });
            }
        });
    };

    const deleteCommission = (commId: string) => {
        router.delete(`/contracts/${c.id}/commissions/${commId}`, {
            onSuccess: () => {
                toast({ title: "Commission deleted successfully" });
            },
            onError: () => {
                toast({ title: "Failed to delete commission", variant: "destructive" });
            }
        });
    };

    const saveObservation = () => {
        const payload = {
            notes: observationForm.notes,
        };

        router.post(`/contracts/${c.id}/modifications`, payload, {
            onSuccess: () => {
                toast({ title: "Observation saved successfully" });
                setObservationDialogOpen(false);
            },
            onError: () => {
                toast({ title: "Failed to save observation", variant: "destructive" });
            }
        });
    };

    const deleteObservation = (modId: string) => {
        router.delete(`/contracts/${c.id}/modifications/${modId}`, {
            onSuccess: () => {
                toast({ title: "Entry deleted successfully" });
            },
            onError: () => {
                toast({ title: "Failed to delete entry", variant: "destructive" });
            }
        });
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
                                    <Button
                                        key={a.label}
                                        variant={a.variant}
                                        size="sm"
                                        className={cn("gap-1.5", a.className)}
                                        onClick={() => handlePrint(a.label)}
                                    >
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
                                        <Button variant="outline" size="sm" className="gap-1.5" onClick={openEditClient}><Pencil className="w-3.5 h-3.5" /> Edit</Button>
                                        <Button variant="outline" size="sm" className="gap-1.5" onClick={openEditObservation}><Plus className="w-3.5 h-3.5" /> Observation</Button>
                                    </div>
                                </div>
                                <dl className="divide-y divide-border">
                                    {[
                                        { k: "Full name", v: c.client.name, icon: User },
                                        { k: "ID / CIN", v: c.client.cin, icon: BadgeCheck },
                                        { k: "Phone", v: c.client.phone, icon: Phone },
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
                                        <Button variant="outline" size="sm" className="gap-1.5" onClick={openEditObservation}><Plus className="w-3.5 h-3.5" /> Extra info</Button>
                                        <Button variant="outline" size="sm" className="gap-1.5" onClick={openEditContract}><Pencil className="w-3.5 h-3.5" /> Edit</Button>
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
                                <Button size="sm" className="gap-1.5" onClick={openEditObservation}><Plus className="w-3.5 h-3.5" /> Add entry</Button>
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
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={openEditObservation}><Pencil className="w-3.5 h-3.5" /></Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteObservation(e.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
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
                                    {c.scheduledPayments.map((s: any) => {
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
                                <Button size="sm" className="gap-1.5" onClick={openAddPayment}><Plus className="w-3.5 h-3.5" /> New payment</Button>
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
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deletePayment(p.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
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
                                <Button size="sm" variant="outline" className="gap-1.5" onClick={openAddCommission}><Plus className="w-3.5 h-3.5" /> Add commission</Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Agent</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[100px] text-right">Actions</TableHead>
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
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteCommission(k.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </main>

                    {/* Client Edit Dialog */}
                    <Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Client Information</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="client-lastName">Last Name *</Label>
                                        <Input
                                            id="client-lastName"
                                            value={clientForm.lastName}
                                            onChange={(e) => setClientForm({ ...clientForm, lastName: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="client-firstName">First Name *</Label>
                                        <Input
                                            id="client-firstName"
                                            value={clientForm.firstName}
                                            onChange={(e) => setClientForm({ ...clientForm, firstName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="client-cin">ID / CIN</Label>
                                    <Input
                                        id="client-cin"
                                        value={clientForm.cin}
                                        onChange={(e) => setClientForm({ ...clientForm, cin: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="client-phone">Phone</Label>
                                    <Input
                                        id="client-phone"
                                        value={clientForm.phone}
                                        onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="client-email">Email</Label>
                                    <Input
                                        id="client-email"
                                        type="email"
                                        value={clientForm.email}
                                        onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="client-address">Address</Label>
                                    <Textarea
                                        id="client-address"
                                        value={clientForm.address}
                                        onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setClientDialogOpen(false)}>Cancel</Button>
                                <Button onClick={saveClient}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Contract Edit Dialog */}
                    <Dialog open={contractDialogOpen} onOpenChange={setContractDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Contract Details</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="contract-number">Contract Reference</Label>
                                    <Input
                                        id="contract-number"
                                        value={contractForm.contractNumber}
                                        onChange={(e) => setContractForm({ ...contractForm, contractNumber: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contract-status">Status</Label>
                                    <Select
                                        value={contractForm.status}
                                        onValueChange={(val) => setContractForm({ ...contractForm, status: val })}
                                    >
                                        <SelectTrigger id="contract-status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="draft">Pending / Draft</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Expired / Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contract-price">Sale Price (€)</Label>
                                    <Input
                                        id="contract-price"
                                        type="number"
                                        value={contractForm.price}
                                        onChange={(e) => setContractForm({ ...contractForm, price: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contract-advance">Advance (€)</Label>
                                    <Input
                                        id="contract-advance"
                                        type="number"
                                        value={contractForm.advance}
                                        onChange={(e) => setContractForm({ ...contractForm, advance: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contract-duration">Payment Duration (Months)</Label>
                                    <Input
                                        id="contract-duration"
                                        type="number"
                                        value={contractForm.paymentDuration}
                                        onChange={(e) => setContractForm({ ...contractForm, paymentDuration: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contract-frequency">Payment Frequency</Label>
                                    <Select
                                        value={contractForm.paymentFrequency}
                                        onValueChange={(val) => setContractForm({ ...contractForm, paymentFrequency: val })}
                                    >
                                        <SelectTrigger id="contract-frequency">
                                            <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Monthly</SelectItem>
                                            <SelectItem value="3">Quarterly</SelectItem>
                                            <SelectItem value="6">Semi-Annual</SelectItem>
                                            <SelectItem value="12">Annual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setContractDialogOpen(false)}>Cancel</Button>
                                <Button onClick={saveContract}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Payment Add Dialog */}
                    <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add Payment Entry</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="payment-date">Due Date</Label>
                                    <Input
                                        id="payment-date"
                                        type="date"
                                        value={paymentForm.dueDate}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="payment-amount">Amount (€)</Label>
                                    <Input
                                        id="payment-amount"
                                        type="number"
                                        value={paymentForm.amount}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="payment-observation">Observation</Label>
                                    <Textarea
                                        id="payment-observation"
                                        value={paymentForm.observation}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, observation: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
                                <Button onClick={savePayment}>Add payment</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Commission Add/Edit Dialog */}
                    <Dialog open={commissionDialogOpen} onOpenChange={setCommissionDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Save Commission</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="broker-name">Agent / Broker Name</Label>
                                    <Input
                                        id="broker-name"
                                        value={commissionForm.brokerName}
                                        onChange={(e) => setCommissionForm({ ...commissionForm, brokerName: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="commission-amount">Amount (€)</Label>
                                    <Input
                                        id="commission-amount"
                                        type="number"
                                        value={commissionForm.amount}
                                        onChange={(e) => setCommissionForm({ ...commissionForm, amount: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="commission-status">Status</Label>
                                    <Select
                                        value={commissionForm.status}
                                        onValueChange={(val) => setCommissionForm({ ...commissionForm, status: val })}
                                    >
                                        <SelectTrigger id="commission-status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Paid">Paid</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="commission-desc">Description</Label>
                                    <Textarea
                                        id="commission-desc"
                                        value={commissionForm.description}
                                        onChange={(e) => setCommissionForm({ ...commissionForm, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setCommissionDialogOpen(false)}>Cancel</Button>
                                <Button onClick={saveCommission}>Save Commission</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Observation/Modification Dialog */}
                    <Dialog open={observationDialogOpen} onOpenChange={setObservationDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Additional Info / Notes</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="observation-notes">Observation / Notes</Label>
                                    <Textarea
                                        id="observation-notes"
                                        value={observationForm.notes}
                                        onChange={(e) => setObservationForm({ ...observationForm, notes: e.target.value })}
                                        placeholder="Enter notes or modifications here..."
                                        rows={5}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setObservationDialogOpen(false)}>Cancel</Button>
                                <Button onClick={saveObservation}>Save notes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default ContractDetails;