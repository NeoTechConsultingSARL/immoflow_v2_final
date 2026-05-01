import { router, usePage, useForm } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { useState, useEffect } from "react";
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
  
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
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
    reset();
    clearErrors();
    setDialogOpen(true);
  };

  const openEdit = (company: Company) => {
    setEditing(company);
    setData({
      name: company.name,
      status: company.status,
      description: company.description || "",
      email: company.email || "",
      address: company.address || "",
      phone: company.phone || "",
      website: company.website || "",
      properties: company.properties,
    });
    clearErrors();
    setDialogOpen(true);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!data.name.trim()) {
      return;
    }

    if (editing) {
      put(`/companies/${editing.id}`, {
        onSuccess: () => {
          setDialogOpen(false);
        },
      });
    } else {
      post("/companies", {
        onSuccess: () => {
          setDialogOpen(false);
        },
      });
    }
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
              <Input 
                id="name" 
                value={data.name} 
                onChange={e => setData("name", e.target.value)} 
                placeholder="e.g. Keller Immobilien GmbH" 
                className={cn(errors.name && "border-destructive")}
                required 
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={data.status} onValueChange={(value) => setData("status", value)}>
                <SelectTrigger className={cn(errors.status && "border-destructive")}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(props.statusOptions).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={data.description} 
                onChange={e => setData("description", e.target.value)} 
                placeholder="Brief description of the company" 
                className={cn(errors.description && "border-destructive")}
                rows={2} 
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={data.email} 
                  onChange={e => setData("email", e.target.value)} 
                  placeholder="info@company.de" 
                  className={cn(errors.email && "border-destructive")}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={data.phone} 
                  onChange={e => setData("phone", e.target.value)} 
                  placeholder="+49 89 123 456" 
                  className={cn(errors.phone && "border-destructive")}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={data.address} 
                onChange={e => setData("address", e.target.value)} 
                placeholder="Street, City, ZIP" 
                className={cn(errors.address && "border-destructive")}
              />
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  value={data.website} 
                  onChange={e => setData("website", e.target.value)} 
                  placeholder="https://company.de" 
                  className={cn(errors.website && "border-destructive")}
                />
                {errors.website && <p className="text-xs text-destructive">{errors.website}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="properties">Properties</Label>
                <Input 
                  id="properties" 
                  type="number" 
                  value={data.properties} 
                  onChange={e => setData("properties", parseInt(e.target.value) || 0)} 
                  min="0" 
                  placeholder="0" 
                  className={cn(errors.properties && "border-destructive")}
                />
                {errors.properties && <p className="text-xs text-destructive">{errors.properties}</p>}
              </div>
            </div>
            {/* Submit button inside form for accessibility, hidden or same as footer */}
            <button type="submit" className="hidden" />
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              disabled={processing}
              onClick={() => handleSave()} 
              style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
            >
              {processing ? "Saving..." : (editing ? "Save Changes" : "Create Company")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </SidebarProvider>
  );
};

export default Companies;