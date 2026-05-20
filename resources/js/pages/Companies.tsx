import { router } from "@inertiajs/react";
import { useState } from "react";
import { Building2, Plus, Pencil, Trash2, MapPin, Phone, Mail, Globe, LayoutGrid, Rows3, Table as TableIcon, Printer } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  logo: string;
  properties: number;
  rc?: string;
  if?: string;
  patent?: string;
  fax?: string;
}

const initialCompanies: Company[] = [
  { id: "1", name: "Keller Immobilien GmbH", address: "Maximilianstraße 35, Munich 80539", phone: "+49 89 123 456", email: "info@keller-immo.de", website: "keller-immo.de", description: "Premium residential and commercial property management across Bavaria.", logo: "KI", properties: 48 },
  { id: "2", name: "BerlinWohnen AG", address: "Friedrichstraße 100, Berlin 10117", phone: "+49 30 987 654", email: "contact@berlinwohnen.de", website: "berlinwohnen.de", description: "Specialist in Berlin residential real estate with a focus on modern living.", logo: "BW", properties: 32 },
  { id: "3", name: "Hanseatische Hausverwaltung", address: "Jungfernstieg 22, Hamburg 20354", phone: "+49 40 555 123", email: "info@hh-hausverwaltung.de", website: "hh-hausverwaltung.de", description: "Full-service property management for the Hamburg metropolitan area.", logo: "HH", properties: 27 },
  { id: "4", name: "Rhein-Main Properties", address: "Kaiserstraße 60, Frankfurt 60311", phone: "+49 69 444 789", email: "hello@rheinmain-prop.de", website: "rheinmain-prop.de", description: "Commercial and mixed-use property management in the Rhine-Main region.", logo: "RM", properties: 17 },
];

const emptyForm: Omit<Company, "id"> = { name: "", address: "", phone: "", email: "", website: "", description: "", logo: "", properties: 0, rc: "", if: "", patent: "", fax: "" };

const gradientColors = [
  "from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10",
  "from-emerald-500/10 to-emerald-600/5 hover:from-emerald-500/20 hover:to-emerald-600/10",
  "from-amber-500/10 to-amber-600/5 hover:from-amber-500/20 hover:to-amber-600/10",
  "from-violet-500/10 to-violet-600/5 hover:from-violet-500/20 hover:to-violet-600/10",
  "from-rose-500/10 to-rose-600/5 hover:from-rose-500/20 hover:to-rose-600/10",
  "from-cyan-500/10 to-cyan-600/5 hover:from-cyan-500/20 hover:to-cyan-600/10",
];

const logoColors = [
  "bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-blue-500/10",
  "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/10",
  "bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-amber-500/10",
  "bg-rose-500/20 text-rose-600 dark:text-rose-400 shadow-rose-500/10",
  "bg-violet-500/20 text-violet-600 dark:text-violet-400 shadow-violet-500/10",
  "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-cyan-500/10",
];

type ViewMode = "card" | "grid" | "table";

const Companies = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [deleting, setDeleting] = useState<Company | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (company: Company) => {
    setEditing(company);
    setForm({ 
      name: company.name, 
      address: company.address, 
      phone: company.phone, 
      email: company.email, 
      website: company.website, 
      description: company.description, 
      logo: company.logo, 
      properties: company.properties,
      rc: company.rc || "",
      if: company.if || "",
      patent: company.patent || "",
      fax: company.fax || "",
    });
    setDialogOpen(true);
  };

  const openDelete = (company: Company) => {
    setDeleting(company);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast({ title: "Company name is required", variant: "destructive" });
      return;
    }
    const logo = form.logo || form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    if (editing) {
      setCompanies(prev => prev.map(c => c.id === editing.id ? { ...c, ...form, logo } : c));
      toast({ title: "Company updated" });
    } else {
      setCompanies(prev => [...prev, { ...form, logo, id: crypto.randomUUID() }]);
      toast({ title: "Company created" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleting) {
      setCompanies(prev => prev.filter(c => c.id !== deleting.id));
      toast({ title: "Company deleted" });
    }
    setDeleteOpen(false);
    setDeleting(null);
  };

  const updateField = (field: keyof typeof form, value: string | number) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <AppBreadcrumb />
            </div>
            <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              <Plus className="w-4 h-4" />
              Add Company
            </Button>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Manage Companies</h2>
                <p className="text-[0.9375rem] text-muted-foreground">View, create, edit, and remove companies from your portfolio.</p>
              </div>
              <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as ViewMode)} className="bg-muted rounded-lg p-0.5">
                <ToggleGroupItem value="card" aria-label="Card view" className="px-2.5 py-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md">
                  <Rows3 className="w-4 h-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid" aria-label="Grid view" className="px-2.5 py-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md">
                  <LayoutGrid className="w-4 h-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label="Table view" className="px-2.5 py-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md">
                  <TableIcon className="w-4 h-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Card View - single column */}
            {viewMode === "card" && (
              <div className="flex flex-col gap-3">
                {companies.map((company, idx) => (
                  <div key={company.id} className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300 flex items-center gap-4 p-4">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0", logoColors[idx % logoColors.length])}>
                      {company.logo}
                    </div>
                    <div className="flex-1 min-w-0" onClick={() => router.visit(`/projects?company=${company.id}&companyName=${encodeURIComponent(company.name)}`)}>
                      <h3 className="font-display text-sm font-bold leading-tight truncate">{company.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{company.address}</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg shrink-0">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs font-semibold">{company.properties}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => openEdit(company)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => openDelete(company)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companies.map((company, idx) => (
                  <div
                    key={company.id}
                    className={cn(
                      "group relative bg-gradient-to-br border border-border rounded-2xl shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-all duration-500 cursor-pointer hover:-translate-y-1",
                      gradientColors[idx % gradientColors.length]
                    )}
                    onClick={() => router.visit(`/projects?company=${company.id}&companyName=${encodeURIComponent(company.name)}`)}
                  >
                    {/* Decorative accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="p-6 lg:p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 shadow-lg transition-transform duration-500 group-hover:scale-110", logoColors[idx % logoColors.length])}>
                            {company.logo}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-display text-xl font-bold truncate group-hover:text-primary transition-colors duration-300">{company.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{company.properties} Properties</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                          <Button variant="secondary" size="icon" className="h-9 w-9 rounded-xl shadow-sm hover:bg-background" onClick={(e) => { e.stopPropagation(); openEdit(company); }}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="secondary" size="icon" className="h-9 w-9 rounded-xl shadow-sm hover:bg-destructive hover:text-white" onClick={(e) => { e.stopPropagation(); openDelete(company); }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-[0.9375rem] text-muted-foreground/80 leading-relaxed mb-6 line-clamp-2 italic font-medium">
                        "{company.description}"
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                          <div className="w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center shrink-0 shadow-sm border border-border/50">
                            <MapPin className="w-4 h-4 text-primary/60" />
                          </div>
                          <span className="truncate font-medium">{company.address.split(',')[0]}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                          <div className="w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center shrink-0 shadow-sm border border-border/50">
                            <Phone className="w-4 h-4 text-primary/60" />
                          </div>
                          <span className="font-medium">{company.phone}</span>
                        </div>
                        {company.fax && (
                          <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                            <div className="w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center shrink-0 shadow-sm border border-border/50">
                              <Printer className="w-4 h-4 text-primary/60" />
                            </div>
                            <span className="font-medium">{company.fax}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 sm:col-span-2">
                          <div className="w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center shrink-0 shadow-sm border border-border/50">
                            <Mail className="w-4 h-4 text-primary/60" />
                          </div>
                          <span className="truncate font-medium">{company.email}</span>
                        </div>
                      </div>

                      {(company.rc || company.if || company.patent) && (
                        <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
                          {company.rc && (
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-semibold text-foreground/70 shrink-0">RC:</span>
                              <span className="truncate font-medium">{company.rc}</span>
                            </div>
                          )}
                          {company.if && (
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-semibold text-foreground/70 shrink-0">IF:</span>
                              <span className="truncate font-medium">{company.if}</span>
                            </div>
                          )}
                          {company.patent && (
                            <div className="flex items-center gap-1.5 min-w-0 col-span-2">
                              <span className="font-semibold text-foreground/70 shrink-0">Patent:</span>
                              <span className="truncate font-medium">{company.patent}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="px-6 py-4 bg-muted/30 border-t border-border/50 flex items-center justify-between group-hover:bg-primary/5 transition-colors duration-300">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary/40" />
                        <span className="text-xs font-bold text-primary/60 hover:text-primary transition-colors cursor-pointer">{company.website}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0">
                        View Projects
                        <Plus className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === "table" && (
              <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Properties</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((company) => (
                      <TableRow key={company.id} className="cursor-pointer" onClick={() => router.visit(`/projects?company=${company.id}`)}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={cn("w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold shrink-0", logoColors[companies.indexOf(company) % logoColors.length])}>
                              {company.logo}
                            </div>
                            <span className="font-semibold">{company.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{company.email}</TableCell>
                        <TableCell className="text-muted-foreground">{company.phone}</TableCell>
                        <TableCell className="font-semibold">{company.properties}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); openEdit(company); }}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); openDelete(company); }}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {companies.length === 0 && (
              <div className="text-center py-20">
                <Building2 className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-display text-lg font-bold mb-1">No companies yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Add your first company to get started.</p>
                <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                  <Plus className="w-4 h-4" /> Add Company
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{editing ? "Edit Company" : "New Company"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input id="name" value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="e.g. Keller Immobilien GmbH" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={e => updateField("description", e.target.value)} placeholder="Brief description of the company" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={e => updateField("email", e.target.value)} placeholder="info@company.de" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={e => updateField("phone", e.target.value)} placeholder="+49 89 123 456" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={form.address} onChange={e => updateField("address", e.target.value)} placeholder="Street, City, ZIP" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={form.website} onChange={e => updateField("website", e.target.value)} placeholder="company.de" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="properties">Properties</Label>
                <Input id="properties" type="number" value={form.properties} onChange={e => updateField("properties", parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rc">RC (Registre de Commerce)</Label>
                <Input id="rc" value={form.rc} onChange={e => updateField("rc", e.target.value)} placeholder="e.g. 123456" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="if">IF (Identifiant Fiscal)</Label>
                <Input id="if" value={form.if} onChange={e => updateField("if", e.target.value)} placeholder="e.g. 789012" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="patent">Patent</Label>
                <Input id="patent" value={form.patent} onChange={e => updateField("patent", e.target.value)} placeholder="e.g. 345678" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fax">Fax</Label>
                <Input id="fax" value={form.fax} onChange={e => updateField("fax", e.target.value)} placeholder="e.g. +49 89 123 457" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              {editing ? "Save Changes" : "Create Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The company and all associated data will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default Companies;
