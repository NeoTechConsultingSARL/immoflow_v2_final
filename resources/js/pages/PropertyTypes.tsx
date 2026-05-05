import { router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Building2, Home, Landmark, Store, Briefcase, LayoutGrid, Warehouse, Plus, LucideIcon, Hotel, Factory, TreePine, Castle, Tent, School, Church, Hospital, Eye, Pencil, Trash2, Layers, Rows3, Table as TableIcon } from "lucide-react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
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
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  propertiesCount: number;
}

interface Props {
  propertyTypes: PropertyType[];
}

type ViewMode = "card" | "grid" | "table";

const PropertyTypes = ({ propertyTypes: initialTypes }: Props) => {
  const searchParams = new URLSearchParams(window.location.search);
  
  const filterProject = searchParams.get("project");
  const projectName = searchParams.get("name") || "";
  const companyId = searchParams.get("company") || "";
  const companyName = searchParams.get("companyName") || "";
  const trancheId = searchParams.get("tranche") || "";
  const trancheName = searchParams.get("trancheName") || "";
  const blocId = searchParams.get("bloc") || "";
  const blocName = searchParams.get("blocName") || "";

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PropertyType | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<PropertyType | null>(null);

  const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    name: "",
    description: "",
    icon: "Building",
  });

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
    reset();
    clearErrors();
    setDialogOpen(true);
  };

  const openEdit = (type: PropertyType, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(type);
    setData({
      name: type.name,
      description: type.description || "",
      icon: type.icon || "Building",
    });
    clearErrors();
    setDialogOpen(true);
  };

  const openDelete = (type: PropertyType, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleting(type);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      put(route("property-types.update", editing.id), {
        onSuccess: () => {
          setDialogOpen(false);
          toast({ title: "Property type updated successfully" });
        },
      });
    } else {
      post(route("property-types.store"), {
        onSuccess: () => {
          setDialogOpen(false);
          toast({ title: "Property type created successfully" });
        },
      });
    }
  };

  const handleDelete = () => {
    if (deleting) {
      destroy(route("property-types.destroy", deleting.id), {
        onSuccess: () => {
          setDeleteOpen(false);
          setDeleting(null);
          toast({ title: "Property type deleted successfully" });
        },
      });
    }
  };

  const getIconComponent = (iconName: string | null, typeName?: string): LucideIcon => {
    // Direct mapping by type name for consistency
    if (typeName === "Apartment") return Building2;
    if (typeName === "Duplex") return Layers;
    if (typeName === "Land") return Landmark;
    if (typeName === "Office") return Briefcase;
    if (typeName === "Penthouse") return Hotel;
    if (typeName === "Store") return Store;
    if (typeName === "Studio") return Home;
    if (typeName === "Villa") return Castle;

    const iconMap: Record<string, LucideIcon> = {
      Building: Building2,
      Home: Home,
      MapPin: Landmark,
      Building2: Building2,
      Store: Store,
      Briefcase: Briefcase,
      Layout: LayoutGrid,
      Warehouse: Warehouse,
      Hotel: Hotel,
      Factory: Factory,
      Tree: TreePine,
      Castle: Castle,
      Tent: Tent,
      School: School,
      Church: Church,
      Hospital: Hospital,
      Star: Building2,
      Bed: Building2,
      House: Building2,
      Layers: LayoutGrid,
    };
    return iconMap[iconName || "Building"] || Building2;
  };

  const getColorForIndex = (index: number) => {
    return {
      color: gradientColors[index % gradientColors.length],
      iconColor: iconColors[index % iconColors.length],
      borderColor: `hover:border-${['blue', 'emerald', 'amber', 'violet', 'rose', 'cyan', 'indigo', 'teal', 'orange', 'pink'][index % 10]}-500/30`,
    };
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
            <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              <Plus className="w-4 h-4" /> New Property Type
            </Button>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">
                  {projectName ? decodeURIComponent(projectName) : "Property Types"}
                </h2>
                <p className="text-[0.9375rem] text-muted-foreground">Select a property type to browse listings.</p>
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
                {initialTypes.map((type, index) => {
                  const Icon = getIconComponent(type.icon, type.name);
                  const colors = getColorForIndex(index);
                  return (
                    <div 
                      key={type.id} 
                      className={cn("bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300 flex items-center gap-4 p-4 cursor-pointer", colors.color)}
                      onClick={() => handleTypeClick(type.name)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-background/80 flex items-center justify-center shadow-sm shrink-0">
                        <Icon className={cn("w-5 h-5", colors.iconColor)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-sm font-bold leading-tight truncate">{type.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{type.description || "No description"}</p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-background/50 rounded-lg shrink-0 text-xs font-semibold">
                        {type.propertiesCount} Props
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => openEdit(type, e)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {initialTypes.map((type, index) => {
                  const Icon = getIconComponent(type.icon, type.name);
                  const colors = getColorForIndex(index);
                  return (
                    <div
                      key={type.id}
                      className={`group bg-gradient-to-br ${colors.color} border border-border ${colors.borderColor} rounded-xl p-6 text-left transition-all duration-300 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-background/80 flex items-center justify-center shadow-sm">
                          <Icon className={`w-6 h-6 ${colors.iconColor}`} />
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); handleTypeClick(type.name); }}>
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
                      <button onClick={() => handleTypeClick(type.name)} className="text-left w-full">
                        <h3 className="font-display text-lg font-bold mb-1">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">{type.description || "No description"}</p>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Table View */}
            {viewMode === "table" && (
              <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Properties</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialTypes.map((type, index) => {
                      const Icon = getIconComponent(type.icon, type.name);
                      const colors = getColorForIndex(index);
                      return (
                        <TableRow key={type.id} className="cursor-pointer" onClick={() => handleTypeClick(type.name)}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={cn("w-8 h-8 rounded flex items-center justify-center shadow-sm", colors.color)}>
                                <Icon className={cn("w-4 h-4", colors.iconColor)} />
                              </div>
                              <span className="font-semibold">{type.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-xs truncate">{type.description || "No description"}</TableCell>
                          <TableCell className="font-medium">{type.propertiesCount}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => openEdit(type, e)}>
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => openDelete(type, e)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
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
              <Input 
                id="type-name" 
                value={data.name} 
                onChange={e => setData("name", e.target.value)} 
                placeholder="e.g. Townhouse" 
                className={errors.name ? "border-destructive ring-destructive/20" : ""}
              />
              {errors.name && <p className="text-[12px] font-medium text-destructive mt-1">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type-desc">Description</Label>
              <Textarea 
                id="type-desc" 
                value={data.description} 
                onChange={e => setData("description", e.target.value)} 
                placeholder="Brief description of this property type" 
                rows={3}
                className={errors.description ? "border-destructive ring-destructive/20" : ""}
              />
              {errors.description && <p className="text-[12px] font-medium text-destructive mt-1">{errors.description}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Icon</Label>
              <Select value={data.icon} onValueChange={value => setData("icon", value)}>
                <SelectTrigger className={errors.icon ? "border-destructive ring-destructive/20" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map(opt => (
                    <SelectItem key={opt.name} value={opt.name}>{opt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.icon && <p className="text-[12px] font-medium text-destructive mt-1">{errors.icon}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={processing}>Cancel</Button>
            <Button onClick={handleSave} disabled={processing} style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              {processing ? "Saving..." : editing ? "Save Changes" : "Create Type"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleting?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={processing} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {processing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default PropertyTypes;
