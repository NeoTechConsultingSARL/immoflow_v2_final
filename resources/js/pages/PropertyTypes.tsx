import { router } from "@inertiajs/react";
import { useState } from "react";
import { Building2, Home, Landmark, Store, Briefcase, LayoutGrid, Warehouse, Plus, LucideIcon, Hotel, Factory, TreePine, Castle, Tent, School, Church, Hospital, Eye, Pencil, Trash2 } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

const iconOptions: { name: string; icon: LucideIcon }[] = [
  { name: "Building", icon: Building2 },
  { name: "Home", icon: Home },
  { name: "Landmark", icon: Landmark },
  { name: "Store", icon: Store },
  { name: "Briefcase", icon: Briefcase },
  { name: "Layout", icon: LayoutGrid },
  { name: "Warehouse", icon: Warehouse },
  { name: "Hotel", icon: Hotel },
  { name: "Factory", icon: Factory },
  { name: "Tree", icon: TreePine },
  { name: "Castle", icon: Castle },
  { name: "Tent", icon: Tent },
  { name: "School", icon: School },
  { name: "Church", icon: Church },
  { name: "Hospital", icon: Hospital },
];

const gradientColors = [
  "from-blue-500/15 to-blue-600/5 hover:from-blue-500/25 hover:to-blue-600/15",
  "from-emerald-500/15 to-emerald-600/5 hover:from-emerald-500/25 hover:to-emerald-600/15",
  "from-amber-500/15 to-amber-600/5 hover:from-amber-500/25 hover:to-amber-600/15",
  "from-violet-500/15 to-violet-600/5 hover:from-violet-500/25 hover:to-violet-600/15",
  "from-rose-500/15 to-rose-600/5 hover:from-rose-500/25 hover:to-rose-600/15",
  "from-cyan-500/15 to-cyan-600/5 hover:from-cyan-500/25 hover:to-cyan-600/15",
  "from-indigo-500/15 to-indigo-600/5 hover:from-indigo-500/25 hover:to-indigo-600/15",
  "from-teal-500/15 to-teal-600/5 hover:from-teal-500/25 hover:to-teal-600/15",
  "from-orange-500/15 to-orange-600/5 hover:from-orange-500/25 hover:to-orange-600/15",
  "from-pink-500/15 to-pink-600/5 hover:from-pink-500/25 hover:to-pink-600/15",
];

const iconColors = [
  "text-blue-600 dark:text-blue-400",
  "text-emerald-600 dark:text-emerald-400",
  "text-amber-600 dark:text-amber-400",
  "text-violet-600 dark:text-violet-400",
  "text-rose-600 dark:text-rose-400",
  "text-cyan-600 dark:text-cyan-400",
  "text-indigo-600 dark:text-indigo-400",
  "text-teal-600 dark:text-teal-400",
  "text-orange-600 dark:text-orange-400",
  "text-pink-600 dark:text-pink-400",
];

interface PropertyType {
  key: string;
  label: string;
  iconName: string;
  icon: LucideIcon;
  description: string;
  color: string;
  iconColor: string;
  borderColor: string;
}

const defaultTypes: PropertyType[] = [
  { key: "Apartment", label: "Apartments", iconName: "Building", icon: Building2, description: "Residential apartments and flats", color: gradientColors[0], iconColor: iconColors[0], borderColor: "hover:border-blue-500/30" },
  { key: "Villa", label: "Villas", iconName: "Home", icon: Home, description: "Luxury standalone houses", color: gradientColors[1], iconColor: iconColors[1], borderColor: "hover:border-emerald-500/30" },
  { key: "Land", label: "Land", iconName: "Landmark", icon: Landmark, description: "Plots and parcels of land", color: gradientColors[2], iconColor: iconColors[2], borderColor: "hover:border-amber-500/30" },
  { key: "Duplex", label: "Duplexes", iconName: "Layout", icon: LayoutGrid, description: "Multi-level residential units", color: gradientColors[3], iconColor: iconColors[3], borderColor: "hover:border-violet-500/30" },
  { key: "Store", label: "Stores", iconName: "Store", icon: Store, description: "Commercial retail spaces", color: gradientColors[4], iconColor: iconColors[4], borderColor: "hover:border-rose-500/30" },
  { key: "Office", label: "Offices", iconName: "Briefcase", icon: Briefcase, description: "Professional office spaces", color: gradientColors[5], iconColor: iconColors[5], borderColor: "hover:border-cyan-500/30" },
  { key: "Penthouse", label: "Penthouses", iconName: "Warehouse", icon: Warehouse, description: "Top-floor luxury apartments", color: gradientColors[6], iconColor: iconColors[6], borderColor: "hover:border-indigo-500/30" },
  { key: "Studio", label: "Studios", iconName: "Home", icon: Home, description: "Compact single-room units", color: gradientColors[7], iconColor: iconColors[7], borderColor: "hover:border-teal-500/30" },
];

const PropertyTypes = () => {
  const searchParams = new URLSearchParams(window.location.search);
  
  const filterProject = searchParams.get("project");
  const projectName = searchParams.get("name") || "";
  const companyId = searchParams.get("company") || "";
  const companyName = searchParams.get("companyName") || "";
  const trancheId = searchParams.get("tranche") || "";
  const trancheName = searchParams.get("trancheName") || "";
  const blocId = searchParams.get("bloc") || "";
  const blocName = searchParams.get("blocName") || "";

  const [types, setTypes] = useState<PropertyType[]>(defaultTypes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PropertyType | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<PropertyType | null>(null);
  const [form, setForm] = useState({ name: "", description: "", iconName: "Building" });

  const handleTypeClick = (typeKey: string) => {
    const params = new URLSearchParams();
    if (filterProject) params.set("project", filterProject);
    if (projectName) params.set("name", projectName);
    if (companyId) params.set("company", companyId);
    if (companyName) params.set("companyName", companyName);
    if (trancheId) params.set("tranche", trancheId);
    if (trancheName) params.set("trancheName", trancheName);
    if (blocId) params.set("bloc", blocId);
    if (blocName) params.set("blocName", blocName);
    params.set("type", typeKey);
    router.visit(`/properties?${params.toString()}`);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", iconName: "Building" });
    setDialogOpen(true);
  };

  const openEdit = (type: PropertyType, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(type);
    setForm({ name: type.label, description: type.description, iconName: type.iconName });
    setDialogOpen(true);
  };

  const openDelete = (type: PropertyType, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleting(type);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    const iconOption = iconOptions.find(i => i.name === form.iconName) || iconOptions[0];
    if (editing) {
      setTypes(prev => prev.map(t => t.key === editing.key ? { ...t, label: form.name.trim(), description: form.description.trim(), iconName: form.iconName, icon: iconOption.icon } : t));
      toast({ title: "Property type updated" });
    } else {
      const colorIndex = types.length % gradientColors.length;
      const newType: PropertyType = {
        key: form.name.trim(),
        label: form.name.trim(),
        iconName: form.iconName,
        icon: iconOption.icon,
        description: form.description.trim(),
        color: gradientColors[colorIndex],
        iconColor: iconColors[colorIndex],
        borderColor: "hover:border-muted-foreground/30",
      };
      setTypes(prev => [...prev, newType]);
      toast({ title: "Property type created" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleting) {
      setTypes(prev => prev.filter(t => t.key !== deleting.key));
      toast({ title: "Property type deleted" });
    }
    setDeleteOpen(false);
    setDeleting(null);
  };

  const selectedIcon = iconOptions.find(i => i.name === form.iconName)?.icon;

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
            <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              <Plus className="w-4 h-4" /> New Property Type
            </Button>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="mb-8">
              <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">
                {projectName ? decodeURIComponent(projectName) : "Property Types"}
              </h2>
              <p className="text-[0.9375rem] text-muted-foreground">Select a property type to browse listings.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {types.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.key}
                    className={`group bg-gradient-to-br ${type.color} border border-border ${type.borderColor} rounded-xl p-6 text-left transition-all duration-300 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-background/80 flex items-center justify-center shadow-sm">
                        <Icon className={`w-6 h-6 ${type.iconColor}`} />
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); handleTypeClick(type.key); }}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => openEdit(type, e)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => openDelete(type, e)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <button onClick={() => handleTypeClick(type.key)} className="text-left w-full">
                      <h3 className="font-display text-lg font-bold mb-1">{type.label}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </button>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{editing ? "Edit Property Type" : "New Property Type"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type-name">Name *</Label>
              <Input id="type-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Townhouse" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type-desc">Description</Label>
              <Textarea id="type-desc" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of this property type" rows={3} />
            </div>
            <div className="grid gap-2">
              <Label>Icon</Label>
              <Select value={form.iconName} onValueChange={v => setForm(f => ({ ...f, iconName: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map(opt => {
                    const OptIcon = opt.icon;
                    return (
                      <SelectItem key={opt.name} value={opt.name}>
                        <span className="flex items-center gap-2">
                          <OptIcon className="w-4 h-4" /> {opt.name}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {selectedIcon && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span>Preview:</span>
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    {(() => { const P = selectedIcon; return <P className="w-5 h-5" />; })()}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              {editing ? "Save Changes" : "Create Type"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.label}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
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

export default PropertyTypes;
