import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Building2, Home, Landmark, Store, Briefcase, LayoutGrid, Warehouse, Hotel, Factory, TreePine, Castle, Tent, School, Church, Hospital, Plus, Pencil, Trash2, MapPin, Euro, Rows3, Table as TableIcon, LucideIcon, Layers } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Property {
  id: string;
  name: string;
  blocId: string;
  blocName: string;
  trancheName: string;
  projectName: string;
  propertyTypeId: string;
  propertyTypeName: string;
  propertyTypeIcon: string | null;
  price: number;
  status: string;
}

interface Bloc {
  id: string;
  name: string;
  trancheName: string;
  projectName: string;
}

interface PropertyType {
  id: string;
  name: string;
  icon: string | null;
}

interface Props {
  properties: Property[];
  blocs: Bloc[];
  propertyTypes: PropertyType[];
  filters: {
    bloc?: string;
    project?: string;
    projectName?: string;
    tranche?: string;
    blocName?: string;
    type?: string;
  };
}

const statusStyles: Record<string, string> = {
  available: "bg-emerald-500/10 text-emerald-600",
  reserved: "bg-amber-500/10 text-amber-600",
  sold: "bg-muted text-muted-foreground",
};

const iconColors = [
  "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  "text-violet-600 dark:text-violet-400 bg-violet-500/10",
  "text-rose-600 dark:text-rose-400 bg-rose-500/10",
  "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
  "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
  "text-teal-600 dark:text-teal-400 bg-teal-500/10",
  "text-orange-600 dark:text-orange-400 bg-orange-500/10",
  "text-pink-600 dark:text-pink-400 bg-pink-500/10",
];

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
    Layers: Layers,
  };
  return iconMap[iconName || "Building"] || Building2;
};

const getColorByType = (typeName: string, allTypes: PropertyType[]) => {
  const index = allTypes.findIndex(t => t.name === typeName);
  return iconColors[index % iconColors.length] || iconColors[0];
};

type ViewMode = "card" | "grid" | "table";

const Properties = ({ properties: initialProperties, blocs, propertyTypes, filters }: Props) => {
  const pageTitle = filters.projectName
    ? decodeURIComponent(filters.projectName)
    : filters.blocName
      ? decodeURIComponent(filters.blocName)
      : "All Properties";
  const pageSubtitle = filters.projectName
    ? `Properties in ${decodeURIComponent(filters.projectName)}`
    : filters.blocName
      ? `Properties in ${decodeURIComponent(filters.blocName)}`
      : "Browse all properties across projects.";

  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState<Property | null>(null);

  const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    name: "",
    bloc_id: "",
    property_type_id: "",
    price: "",
    status: "available",
  });

  const openCreate = () => {
    setEditing(null);
    reset();
    clearErrors();
    if (filters.bloc) setData("bloc_id", filters.bloc);
    setDialogOpen(true);
  };

  const openEdit = (property: Property) => {
    setEditing(property);
    setData({
      name: property.name,
      bloc_id: property.blocId,
      property_type_id: property.propertyTypeId,
      price: property.price.toString(),
      status: property.status,
    });
    clearErrors();
    setDialogOpen(true);
  };

  const openDelete = (property: Property) => {
    setDeleting(property);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      put(route("properties.update", editing.id), {
        onSuccess: () => {
          setDialogOpen(false);
          toast({ title: "Property updated successfully" });
          router.reload();
        },
        onError: (errors) => {
          console.error("Update errors:", errors);
          toast({ title: "Error updating property", variant: "destructive" });
        },
      });
    } else {
      post(route("properties.store"), {
        onSuccess: () => {
          setDialogOpen(false);
          toast({ title: "Property created successfully" });
          router.reload();
        },
        onError: (errors) => {
          console.error("Create errors:", errors);
          toast({ title: "Error creating property", variant: "destructive" });
        },
      });
    }
  };

  const handleDelete = () => {
    if (deleting) {
      destroy(route("properties.destroy", deleting.id), {
        onSuccess: () => {
          setDeleteOpen(false);
          setDeleting(null);
          toast({ title: "Property deleted successfully" });
          router.reload();
        },
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD" }).format(price);
  };

  const capitalizeStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
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
              <Plus className="w-4 h-4" /> Add Property
            </Button>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">
                  {pageTitle}
                </h2>
                <p className="text-[0.9375rem] text-muted-foreground">
                  {pageSubtitle}
                </p>
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
                {initialProperties.map((property) => {
                  const Icon = getIconComponent(property.propertyTypeIcon, property.propertyTypeName);
                  const colorClass = getColorByType(property.propertyTypeName, propertyTypes);
                  return (
                    <div key={property.id} className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300 flex items-center gap-4 p-4">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm", colorClass)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-sm font-bold leading-tight truncate">{property.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{property.propertyTypeName} · {property.blocName}</p>
                      </div>
                      <span className="text-sm font-semibold shrink-0">{formatPrice(property.price)}</span>
                      <span className={cn("text-[0.625rem] font-semibold px-2 py-0.5 rounded-full shrink-0", statusStyles[property.status] || "bg-muted text-muted-foreground")}>
                        {capitalizeStatus(property.status)}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => openEdit(property)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => openDelete(property)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Grid View - multi-column cards */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {initialProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className="group bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300 flex flex-col cursor-pointer"
                    onClick={() => openEdit(property)}
                  >
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <span className={cn("text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full", 
                          property.status === 'available' 
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : property.status === 'reserved'
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-muted text-muted-foreground'
                        )}>
                          {capitalizeStatus(property.status)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={(e) => { e.stopPropagation(); openEdit(property); }}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-display text-lg font-bold leading-tight mb-1 px-6">{property.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 px-6">{property.propertyTypeName} Property</p>

                    <div className="space-y-2 px-6">
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm", getColorByType(property.propertyTypeName, propertyTypes))}>
                          {(() => {
                            const Icon = getIconComponent(property.propertyTypeIcon, property.propertyTypeName);
                            return <Icon className="w-4 h-4" />;
                          })()}
                        </div>
                        <span className="truncate">{property.propertyTypeName}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate">{property.projectName} - {property.trancheName} - {property.blocName}</span>
                      </div>
                    </div>

                    <div className="relative px-6 py-4 border-t border-border bg-muted/30 group-hover:bg-primary/10 flex items-center justify-between text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 overflow-hidden">
                      <div
                        className="absolute top-0 left-0 right-0 h-[3px]"
                        style={{ background: [
                          'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))',
                          'linear-gradient(90deg, hsl(25 80% 55%), hsl(45 90% 55%))',
                          'linear-gradient(90deg, hsl(160 50% 45%), hsl(190 60% 50%))',
                          'linear-gradient(90deg, hsl(270 50% 55%), hsl(300 50% 55%))',
                          'linear-gradient(90deg, hsl(200 60% 50%), hsl(220 55% 55%))',
                          'linear-gradient(90deg, hsl(340 55% 50%), hsl(10 60% 55%))',
                        ][index % 6] }}
                      />
                      <div className="flex items-center gap-1.5">
                        <Euro className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-semibold">{formatPrice(property.price)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="truncate">{property.name}</span>
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
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Tranche</TableHead>
                      <TableHead>Bloc</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-semibold">{property.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={cn("w-7 h-7 rounded flex items-center justify-center shrink-0 shadow-sm", getColorByType(property.propertyTypeName, propertyTypes))}>
                              {(() => {
                                const Icon = getIconComponent(property.propertyTypeIcon, property.propertyTypeName);
                                return <Icon className="w-3.5 h-3.5" />;
                              })()}
                            </div>
                            <span>{property.propertyTypeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{property.projectName}</TableCell>
                        <TableCell>{property.trancheName}</TableCell>
                        <TableCell>{property.blocName}</TableCell>
                        <TableCell className="font-semibold">{formatPrice(property.price)}</TableCell>
                        <TableCell>
                          <span className={cn("text-[0.625rem] font-semibold px-2 py-0.5 rounded-full", statusStyles[property.status] || "bg-muted text-muted-foreground")}>
                            {capitalizeStatus(property.status)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => openEdit(property)}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => openDelete(property)}>
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

            {initialProperties.length === 0 && (
              <div className="text-center py-20">
                <Home className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-display text-lg font-bold mb-1">No properties found</h3>
                <p className="text-sm text-muted-foreground mb-4">Add a property to get started.</p>
                <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                  <Plus className="w-4 h-4" /> Add Property
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{editing ? "Edit Property" : "New Property"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input 
                id="name" 
                value={data.name} 
                onChange={e => setData("name", e.target.value)} 
                placeholder="Unit A1" 
                className={errors.name ? "border-destructive ring-destructive/20" : ""}
              />
              {errors.name && <p className="text-[12px] font-medium text-destructive mt-1">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Bloc *</Label>
              <Select value={data.bloc_id} onValueChange={value => setData("bloc_id", value)}>
                <SelectTrigger className={errors.bloc_id ? "border-destructive ring-destructive/20" : ""}>
                  <SelectValue placeholder="Select bloc" />
                </SelectTrigger>
                <SelectContent>
                  {blocs.map(bloc => (
                    <SelectItem key={bloc.id} value={bloc.id}>
                      {bloc.name} ({bloc.projectName} - {bloc.trancheName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bloc_id && <p className="text-[12px] font-medium text-destructive mt-1">{errors.bloc_id}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Property Type *</Label>
              <Select value={data.property_type_id} onValueChange={value => setData("property_type_id", value)}>
                <SelectTrigger className={errors.property_type_id ? "border-destructive ring-destructive/20" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.property_type_id && <p className="text-[12px] font-medium text-destructive mt-1">{errors.property_type_id}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price *</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01"
                  value={data.price} 
                  onChange={e => setData("price", e.target.value)} 
                  placeholder="485000" 
                  className={errors.price ? "border-destructive ring-destructive/20" : ""}
                />
                {errors.price && <p className="text-[12px] font-medium text-destructive mt-1">{errors.price}</p>}
              </div>
              <div className="grid gap-2">
                <Label>Status *</Label>
                <Select value={data.status} onValueChange={value => setData("status", value)}>
                  <SelectTrigger className={errors.status ? "border-destructive ring-destructive/20" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-[12px] font-medium text-destructive mt-1">{errors.status}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={processing}>Cancel</Button>
            <Button onClick={handleSave} disabled={processing} style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              {processing ? "Saving..." : editing ? "Save Changes" : "Create Property"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.name}?</AlertDialogTitle>
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

export default Properties;
