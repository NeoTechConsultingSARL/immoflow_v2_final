import { router, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { useState } from "react";
import { Building2, Plus, Pencil, MapPin, Phone, Mail, Globe } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Company {
  id: string;
  name: string;
  status: string;
  status_label: string;
  description?: string;
  email?: string;
  address?: string;
  phone?: string;
  website?: string;
  properties: number;
  created_at: string;
}

interface PageProps extends InertiaPageProps {
  companies: Company[];
  statusOptions: Record<string, string>;
  flash?: {
    success?: string;
    error?: string;
  };
}

const logoColors = [
  "bg-blue-500/10 text-blue-600",
  "bg-emerald-500/10 text-emerald-600",
  "bg-amber-500/10 text-amber-600",
  "bg-rose-500/10 text-rose-600",
  "bg-violet-500/10 text-violet-600",
  "bg-cyan-500/10 text-cyan-600",
];

const Companies = () => {
  const { props } = usePage<PageProps>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [form, setForm] = useState({
    name: "",
    status: "active",
    description: "",
    email: "",
    address: "",
    phone: "",
    website: "",
    properties: 0,
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", status: "active", description: "", email: "", address: "", phone: "", website: "", properties: 0 });
    setDialogOpen(true);
  };

  const openEdit = (company: Company) => {
    setEditing(company);
    setForm({
      name: company.name,
      status: company.status,
      description: company.description || "",
      email: company.email || "",
      address: company.address || "",
      phone: company.phone || "",
      website: company.website || "",
      properties: company.properties,
    });
    setDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      return;
    }

    const data = {
      ...form,
      name: form.name.trim(),
      status: form.status as "active" | "inactive",
    };

    if (editing) {
      router.put(`/companies/${editing.id}`, data, {
        onSuccess: () => {
          setDialogOpen(false);
        },
      });
    } else {
      router.post("/companies", data, {
        onSuccess: () => {
          setDialogOpen(false);
        },
      });
    }
  };

  const updateField = (field: keyof typeof form, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

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
              <Plus className="w-4 h-4" /> Add Company
            </Button>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="mb-6">
              <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Manage Companies</h2>
              <p className="text-[0.9375rem] text-muted-foreground">View, create, edit, and remove companies from your portfolio.</p>
            </div>

            {/* Company Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {props.companies.map((company, idx) => (
                <div
                  key={company.id}
                  className="group bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300 cursor-pointer"
                  onClick={() => router.visit(`/projects?company=${company.id}&companyName=${encodeURIComponent(company.name)}`)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold shrink-0", logoColors[idx % logoColors.length])}>
                        {company.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg font-bold truncate">{company.name}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{company.description || 'No description available'}</p>
                      </div>
                    </div>

                    <div className="space-y-2.5 mb-5">
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <span className={cn("text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full", 
                          company.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-muted text-muted-foreground'
                        )}>
                          {company.status_label}
                        </span>
                      </div>
                      {company.address && (
                        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="truncate">{company.address}</span>
                        </div>
                      )}
                      {company.phone && (
                        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4 shrink-0" />
                          <span>{company.phone}</span>
                        </div>
                      )}
                      {company.email && (
                        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4 shrink-0" />
                          <span className="truncate">{company.email}</span>
                        </div>
                      )}
                      {company.website && (
                        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <Globe className="w-4 h-4 shrink-0" />
                          <span>{company.website}</span>
                        </div>
                      )}
                    </div>

                    <div className="relative flex items-center justify-between pt-4 border-t border-border rounded-b-xl -mx-6 px-6 -mb-6 pb-6 group-hover:bg-primary/10 transition-colors duration-300 overflow-hidden">
                      <div
                        className="absolute top-0 left-0 right-0 h-[3px]"
                        style={{ background: [
                          'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))',
                          'linear-gradient(90deg, hsl(25 80% 55%), hsl(45 90% 55%))',
                          'linear-gradient(90deg, hsl(160 50% 45%), hsl(190 60% 50%))',
                          'linear-gradient(90deg, hsl(270 50% 55%), hsl(300 50% 55%))',
                          'linear-gradient(90deg, hsl(200 60% 50%), hsl(220 55% 55%))',
                          'linear-gradient(90deg, hsl(340 55% 50%), hsl(10 60% 55%))',
                        ][idx % 6] }}
                      />
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">{company.properties} properties</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); openEdit(company); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {props.companies.length === 0 && (
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
        <DialogContent className="sm:max-w-xl fixed left-[calc(50%+var(--sidebar-width,0px)/2)] -translate-x-1/2">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{editing ? "Edit Company" : "New Company"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input id="name" value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="e.g. Keller Immobilien GmbH" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={form.status} onValueChange={(value) => updateField("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(props.statusOptions).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Input id="properties" type="number" value={form.properties} onChange={e => updateField("properties", parseInt(e.target.value) || 0)} min="0" placeholder="0" />
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              {editing ? "Save Changes" : "Create Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Companies;