import { useState, useEffect } from "react";
import { router, Link, usePage } from "@inertiajs/react";
import { Users, FileText, Check, ChevronsUpDown, ArrowLeft, Save, Plus, Trash2, Banknote, ClipboardList, Percent } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// existingClients will be fetched from the API

// propertiesByType state moved inside the component

const companies = ["Legrand Klein SARL", "Spree Property GmbH", "München Residenz AG"];
const propertyStates = ["Basic construction works", "Mid-finish", "Ready to move in", "Custom finish"];
const paymentMethods = ["Cash", "Bank Transfer", "Check", "Card"];
const subsoilTypes = ["None", "Cellar", "Parking Spot", "Storage Room"];
const today = new Date().toISOString().slice(0, 10);

type ScheduleRow = { date: string; amount: string; note: string };
const makeRow = (): ScheduleRow => ({ date: today, amount: "", note: "" });

const ContractCreate = () => {
  const { url } = usePage();
  const location = new URL(url || "/", window.location.origin);
  const searchParams = location.searchParams;

  // Properties
  const [propertiesByType, setPropertiesByType] = useState<Record<string, any[]>>({});
  
  // Client
  const [existingClients, setExistingClients] = useState<any[]>([]);
  const [clientMode, setClientMode] = useState<"new" | "existing">("new");
  const [existingClientId, setExistingClientId] = useState("");
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [client, setClient] = useState({
    firstName: "", lastName: "", idNumber: "", birthdate: "", email: "", phone: "", address: "",
  });

  // Contract — Etape 2
  const [contract, setContract] = useState({
    contractNumber: "",
    creationDate: today,
    propertyType: "",
    property: "",
    negotiatedPrice: "",
    advance: "",
    paymentDuration: "",
    paymentFrequency: "",
    installment: "",
    paymentMethod: "Cash",
    operationNumber: "",
    agreedSalePrice: "",
    deposit: "",
    company: "",
    propertyState: "",
    facade: "",
    otherClauses: "",
    subsoil: "",
    subsoilPrice: "0",
  });

  // Modifications
  const [withModifications, setWithModifications] = useState(false);
  const [modNote, setModNote] = useState("");
  const [modImage, setModImage] = useState<File | null>(null);

  // Additional info (payment schedule)
  const [withDetails, setWithDetails] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleRow[]>(Array.from({ length: 6 }, makeRow));

  // Commission
  const [withCommission, setWithCommission] = useState(false);
  const [commission, setCommission] = useState({ name: "", amount: "", description: "", status: "Pending" });
  const [properties, setProperties] = useState<any[]>([]);

  const updateContract = (k: keyof typeof contract, v: string) =>
    setContract(prev => ({ ...prev, [k]: v }));
  const updateClient = (k: keyof typeof client, v: string) =>
    setClient(prev => ({ ...prev, [k]: v }));
  const updateRow = (i: number, k: keyof ScheduleRow, v: string) =>
    setSchedule(prev => prev.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const addRow = () => setSchedule(prev => [...prev, makeRow()]);
  const removeRow = (i: number) => setSchedule(prev => prev.filter((_, idx) => idx !== i));

  const selectedClientLabel = (() => {
    const c = existingClients.find(x => x.id === existingClientId);
    return c ? `${c.name} — ${c.email}` : "Search a client...";
  })();

  const cancel = () => {
    const qs = searchParams.toString();
    router.visit(`/client-contracts${qs ? `?${qs}` : ""}`);
  };

  const blocId = searchParams.get('bloc');

  // Load properties for current bloc on mount
  useEffect(() => {
    if (!blocId) return;
    fetch(`/api/blocs/${blocId}/properties`, { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then((data) => {
        setProperties(data || []);
      })
      .catch((err) => console.error('Failed to load properties', err));
  }, [blocId]);

  // Load clients & next contract number
  useEffect(() => {
    fetch('/api/clients-lookup', { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then((data) => {
        setExistingClients(data || []);
      })
      .catch((err) => console.error('Failed to load clients', err));

    fetch('/api/contracts/next-number', { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then((data) => {
        if (data && data.contract_number) {
          updateContract("contractNumber", data.contract_number);
        }
      })
      .catch((err) => console.error('Failed to load next contract number', err));
  }, []);

  // Build propertiesByType whenever properties array changes
  useEffect(() => {
    const map: Record<string, any[]> = {};
    properties.forEach((p: any) => {
      const typeName = p.property_type?.name || p.propertyType?.name || 'Unknown';
      if (!map[typeName]) map[typeName] = [];
      map[typeName].push(p);
    });
    setPropertiesByType(map);
  }, [properties]);

  const handleSave = () => {
    let clientName = "";
    if (clientMode === "existing") {
      // eslint-disable-next-line eqeqeq
      const ex = existingClients.find(c => c.id == existingClientId);
      if (!ex) { toast({ title: "Please select an existing client", variant: "destructive" }); return; }
      clientName = ex.name;
    } else {
      clientName = `${client.firstName} ${client.lastName}`.trim();
      if (!clientName) { toast({ title: "Client first and last name are required", variant: "destructive" }); return; }
    }
    if (!contract.contractNumber.trim()) {
      toast({ title: "Contract number is required", variant: "destructive" });
      return;
    }
    // build payload and submit to backend
    // property must be an id (number). If not provided, ask user to select a real property id.
    const propertyId = Number(contract.property);
    if (!propertyId || Number.isNaN(propertyId)) {
      toast({ title: "Please select a valid property (ID)", variant: "destructive" });
      return;
    }

    const form = new FormData();
    // client
    if (clientMode === "existing") {
      form.append('client_id', existingClientId);
    } else {
      form.append('first_name', client.firstName);
      form.append('last_name', client.lastName);
      if (client.email) form.append('email', client.email);
      if (client.phone) form.append('phone', client.phone);
      if (client.idNumber) form.append('id_number', client.idNumber);
      if (client.address) form.append('address', client.address);
    }

    // contract fields
    form.append('property_id', String(propertyId));
    form.append('contract_number', contract.contractNumber);
    if (contract.negotiatedPrice) form.append('price', contract.negotiatedPrice.replace(/[^0-9.]/g, ''));
    if (contract.advance) form.append('advance', contract.advance.replace(/[^0-9.]/g, ''));
    if (contract.paymentDuration) form.append('paymentDuration', contract.paymentDuration);
    if (contract.paymentFrequency) form.append('paymentFrequency', contract.paymentFrequency);
    if (contract.creationDate) form.append('date', contract.creationDate);

    // modifications
    form.append('withDetails', withDetails ? '1' : '0');
    if (withModifications) {
      form.append('modification[notes]', modNote || '');
      if (modImage) {
        form.append('modification[image]', modImage);
      }
    }

    // schedule rows
    if (withDetails && schedule.length) {
      schedule.forEach((r, i) => {
        if (r.date && r.amount) {
          form.append(`schedule[${i}][due_date]`, r.date);
          form.append(`schedule[${i}][amount]`, r.amount.replace(/[^0-9.]/g, ''));
          form.append(`schedule[${i}][observation]`, r.note || '');
        }
      });
    }

    // commission
    if (withCommission) {
      form.append('commission[broker_name]', commission.name || '');
      form.append('commission[amount]', commission.amount ? commission.amount.replace(/[^0-9.]/g, '') : '0');
      form.append('commission[description]', commission.description || '');
      form.append('commission[status]', commission.status || 'Pending');
    }

    router.post('/contracts', form, {
      onSuccess: () => {
        toast({ title: 'Contract created', description: `${contract.contractNumber} · ${clientName}` });
        cancel();
      },
      onError: (errors) => {
        const errorMessages = Object.values(errors).join('\\n');
        toast({ title: 'Validation error', description: errorMessages || 'Please check the form fields', variant: 'destructive' });
        console.error('Contract save errors', errors);
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
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={cancel} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={handleSave} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                <Save className="w-4 h-4" /> Save Contract
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] w-full mx-auto animate-in fade-in slide-in-from-bottom-1 duration-400 space-y-6">
            <div>
              <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">New Client Contract</h2>
              <p className="text-[0.9375rem] text-muted-foreground">Capture the client and the full contract specifications.</p>
            </div>

            {/* SECTION 1 — CLIENT */}
            <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" /> Client Information
                </h3>
                <ToggleGroup
                  type="single"
                  value={clientMode}
                  onValueChange={(v) => v && setClientMode(v as "new" | "existing")}
                  className="bg-muted rounded-lg p-0.5"
                >
                  <ToggleGroupItem value="new" className="px-3 py-1.5 text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md">New client</ToggleGroupItem>
                  <ToggleGroupItem value="existing" className="px-3 py-1.5 text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md">Existing client</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="p-5">
                {clientMode === "existing" ? (
                  <div className="grid gap-2 max-w-2xl">
                    <Label>Select client</Label>
                    <Popover open={clientPickerOpen} onOpenChange={setClientPickerOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={clientPickerOpen} className="w-full justify-between font-normal">
                          {selectedClientLabel}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search by name, email, ID..." />
                          <CommandList>
                            <CommandEmpty>No client found.</CommandEmpty>
                            <CommandGroup>
                              {existingClients.map(c => (
                                <CommandItem
                                  key={c.id}
                                  value={`${c.name} ${c.email} ${c.idNumber} ${c.phone}`}
                                  onSelect={() => { setExistingClientId(c.id); setClientPickerOpen(false); }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", existingClientId === c.id ? "opacity-100" : "opacity-0")} />
                                  <div className="flex flex-col">
                                    <span className="font-medium">{c.name}</span>
                                    <span className="text-xs text-muted-foreground">{c.email} · {c.idNumber}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label>Last name *</Label>
                        <Input value={client.lastName} onChange={e => updateClient("lastName", e.target.value)} placeholder="Müller" />
                      </div>
                      <div className="grid gap-2">
                        <Label>First name *</Label>
                        <Input value={client.firstName} onChange={e => updateClient("firstName", e.target.value)} placeholder="Anna" />
                      </div>
                      <div className="grid gap-2">
                        <Label>ID</Label>
                        <Input value={client.idNumber} onChange={e => updateClient("idNumber", e.target.value)} placeholder="DE-A123456" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Birthdate</Label>
                        <Input type="date" value={client.birthdate} onChange={e => updateClient("birthdate", e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Phone</Label>
                        <Input value={client.phone} onChange={e => updateClient("phone", e.target.value)} placeholder="+49 170 1234567" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input type="email" value={client.email} onChange={e => updateClient("email", e.target.value)} placeholder="client@email.com" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Address</Label>
                      <Input value={client.address} onChange={e => updateClient("address", e.target.value)} placeholder="Street, City" />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 2 — CONTRACT */}
            <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <h3 className="font-display text-base font-bold">Contract Information</h3>
              </div>
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="grid gap-2">
                    <Label>Contract # *</Label>
                    <Input value={contract.contractNumber} onChange={e => updateContract("contractNumber", e.target.value)} placeholder="CT-2026-001" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Creation date</Label>
                    <Input type="date" value={contract.creationDate} onChange={e => updateContract("creationDate", e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Property type</Label>
                    <Select value={contract.propertyType} onValueChange={v => { updateContract("propertyType", v); updateContract("property", ""); }}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {Object.keys(propertiesByType).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Property</Label>
                    <Select value={contract.property} onValueChange={v => updateContract("property", v)} disabled={!contract.propertyType}>
                      <SelectTrigger><SelectValue placeholder={contract.propertyType ? "Select property" : "Pick type first"} /></SelectTrigger>
                      <SelectContent>
                        {properties
                          .filter(p => (p.property_type && p.property_type.name ? p.property_type.name : (p.propertyType ? p.propertyType.name : '')) === contract.propertyType)
                          .map((p: any) => (
                            <SelectItem key={p.id} value={String(p.id)}>{p.name} — {p.property_type?.name || p.propertyType?.name || ''}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="grid gap-2">
                    <Label>Negotiated price</Label>
                    <Input value={contract.negotiatedPrice} onChange={e => updateContract("negotiatedPrice", e.target.value)} placeholder="€" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Advance</Label>
                    <Input value={contract.advance} onChange={e => updateContract("advance", e.target.value)} placeholder="€" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Payment duration <span className="text-xs text-accent">(e.g. 36 months)</span></Label>
                    <Input value={contract.paymentDuration} onChange={e => updateContract("paymentDuration", e.target.value)} placeholder="36" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Payment frequency <span className="text-xs text-accent">(e.g. every 3 months)</span></Label>
                    <Input value={contract.paymentFrequency} onChange={e => updateContract("paymentFrequency", e.target.value)} placeholder="3" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="grid gap-2">
                    <Label>Installment</Label>
                    <Input value={contract.installment} onChange={e => updateContract("installment", e.target.value)} placeholder="€" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Payment method</Label>
                    <Select value={contract.paymentMethod} onValueChange={v => updateContract("paymentMethod", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Operation #</Label>
                    <Input value={contract.operationNumber} onChange={e => updateContract("operationNumber", e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Company</Label>
                    <Select value={contract.company} onValueChange={v => updateContract("company", v)}>
                      <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                      <SelectContent>
                        {companies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="grid gap-2">
                    <Label>Agreed sale price</Label>
                    <Input value={contract.agreedSalePrice} onChange={e => updateContract("agreedSalePrice", e.target.value)} placeholder="€" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Deposit</Label>
                    <Input value={contract.deposit} onChange={e => updateContract("deposit", e.target.value)} placeholder="€" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Property state</Label>
                    <Select value={contract.propertyState} onValueChange={v => updateContract("propertyState", v)}>
                      <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                      <SelectContent>
                        {propertyStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Facade</Label>
                    <Input value={contract.facade} onChange={e => updateContract("facade", e.target.value)} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Other clauses</Label>
                  <Textarea rows={3} value={contract.otherClauses} onChange={e => updateContract("otherClauses", e.target.value)} placeholder="Additional terms..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div className="grid gap-2">
                    <Label>Subsoil</Label>
                    <Select value={contract.subsoil} onValueChange={v => updateContract("subsoil", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {subsoilTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Subsoil price</Label>
                    <Input value={contract.subsoilPrice} onChange={e => updateContract("subsoilPrice", e.target.value)} placeholder="0" />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3 — MODIFICATIONS */}
            <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <label className="px-5 py-4 flex items-center gap-3 cursor-pointer">
                <Checkbox checked={withModifications} onCheckedChange={(v) => setWithModifications(!!v)} />
                <span className="font-display text-base font-bold flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-accent" /> With Modifications
                </span>
              </label>
              {withModifications && (
                <div className="p-5 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Client note</Label>
                    <Textarea rows={4} value={modNote} onChange={e => setModNote(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Client note image</Label>
                    <Input type="file" onChange={(e: any) => setModImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
                  </div>
                </div>
              )}
            </section>

            {/* SECTION 4 — ADDITIONAL DETAILS / PAYMENT SCHEDULE */}
            <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <label className="px-5 py-4 flex items-center gap-3 cursor-pointer">
                <Checkbox checked={withDetails} onCheckedChange={(v) => setWithDetails(!!v)} />
                <span className="font-display text-base font-bold flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-accent" /> Provide more details — Payment schedule
                </span>
              </label>
              {withDetails && (
                <div className="p-5 pt-0 space-y-3">
                  {schedule.map((row, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-[180px_1fr_1fr_auto] gap-3 items-end">
                      <div className="grid gap-1">
                        {i === 0 && <Label className="text-xs">Date</Label>}
                        <Input type="date" value={row.date} onChange={e => updateRow(i, "date", e.target.value)} />
                      </div>
                      <div className="grid gap-1">
                        {i === 0 && <Label className="text-xs">Amount</Label>}
                        <Input value={row.amount} onChange={e => updateRow(i, "amount", e.target.value)} placeholder="Amount" />
                      </div>
                      <div className="grid gap-1">
                        {i === 0 && <Label className="text-xs">Observation</Label>}
                        <Input value={row.note} onChange={e => updateRow(i, "note", e.target.value)} placeholder="Observation" />
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeRow(i)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addRow} className="gap-2">
                    <Plus className="w-4 h-4" /> Add row
                  </Button>
                </div>
              )}
            </section>

            {/* SECTION 5 — COMMISSION */}
            <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <label className="px-5 py-4 flex items-center gap-3 cursor-pointer">
                <Checkbox checked={withCommission} onCheckedChange={(v) => setWithCommission(!!v)} />
                <span className="font-display text-base font-bold flex items-center gap-2">
                  <Percent className="w-4 h-4 text-accent" /> With Commission
                </span>
              </label>
              {withCommission && (
                <div className="p-5 pt-0 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="grid gap-2">
                    <Label>Commissioner</Label>
                    <Input value={commission.name} onChange={e => setCommission({ ...commission, name: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Amount</Label>
                    <Input value={commission.amount} onChange={e => setCommission({ ...commission, amount: e.target.value })} placeholder="€" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Description</Label>
                    <Input value={commission.description} onChange={e => setCommission({ ...commission, description: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select value={commission.status} onValueChange={v => setCommission({ ...commission, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </section>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={cancel}>Cancel</Button>
              <Button onClick={handleSave} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                <Save className="w-4 h-4" /> Save Contract
              </Button>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ContractCreate;
