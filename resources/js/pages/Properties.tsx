import { useState } from "react";
import { Home, Plus, Pencil, Trash2, MapPin, BedDouble, Bath, Ruler, Euro, LayoutGrid, Rows3, Table as TableIcon } from "lucide-react";
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
  projectId: string;
  projectName: string;
  name: string;
  type: "Apartment" | "Penthouse" | "Studio" | "Duplex" | "Villa" | "Land" | "Store" | "Office";
  floor: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  status: "Available" | "Reserved" | "Sold";
}

const projects = [
  { id: "1", name: "Residenz am Englischen Garten" },
  { id: "2", name: "Spree Lofts" },
  { id: "3", name: "Alster Terrassen" },
  { id: "4", name: "Maintor Quartier" },
  { id: "5", name: "Viktualien Höfe" },
  { id: "6", name: "Prenzlauer Berg Studios" },
];

const initialProperties: Property[] = [
  // Apartments (5)
  { id: "1", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Unit A1", type: "Apartment", floor: "1st", area: "92 m²", bedrooms: 3, bathrooms: 2, price: "€485,000", status: "Sold" },
  { id: "5", projectId: "2", projectName: "Spree Lofts", name: "Loft 101", type: "Apartment", floor: "1st", area: "78 m²", bedrooms: 2, bathrooms: 1, price: "€390,000", status: "Available" },
  { id: "8", projectId: "3", projectName: "Alster Terrassen", name: "Unit 302", type: "Apartment", floor: "3rd", area: "88 m²", bedrooms: 2, bathrooms: 2, price: "€520,000", status: "Available" },
  { id: "9", projectId: "4", projectName: "Maintor Quartier", name: "Skyline A1", type: "Apartment", floor: "12th", area: "105 m²", bedrooms: 3, bathrooms: 2, price: "€680,000", status: "Available" },
  { id: "11", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Unit C3", type: "Apartment", floor: "2nd", area: "74 m²", bedrooms: 2, bathrooms: 1, price: "€395,000", status: "Reserved" },
  // Villas (5)
  { id: "12", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Villa Rosengarten", type: "Villa", floor: "Ground", area: "320 m²", bedrooms: 5, bathrooms: 4, price: "€2,100,000", status: "Available" },
  { id: "13", projectId: "2", projectName: "Spree Lofts", name: "Villa am Ufer", type: "Villa", floor: "Ground", area: "280 m²", bedrooms: 4, bathrooms: 3, price: "€1,850,000", status: "Reserved" },
  { id: "14", projectId: "3", projectName: "Alster Terrassen", name: "Alster Villa", type: "Villa", floor: "Ground", area: "350 m²", bedrooms: 6, bathrooms: 4, price: "€2,500,000", status: "Sold" },
  { id: "15", projectId: "4", projectName: "Maintor Quartier", name: "Main Villa", type: "Villa", floor: "Ground", area: "290 m²", bedrooms: 4, bathrooms: 3, price: "€1,950,000", status: "Available" },
  { id: "16", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Villa Sonnenhof", type: "Villa", floor: "Ground", area: "310 m²", bedrooms: 5, bathrooms: 4, price: "€2,250,000", status: "Available" },
  // Land (5)
  { id: "17", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Plot A-12", type: "Land", floor: "—", area: "500 m²", bedrooms: 0, bathrooms: 0, price: "€320,000", status: "Available" },
  { id: "18", projectId: "2", projectName: "Spree Lofts", name: "Plot B-7", type: "Land", floor: "—", area: "750 m²", bedrooms: 0, bathrooms: 0, price: "€480,000", status: "Sold" },
  { id: "19", projectId: "3", projectName: "Alster Terrassen", name: "Waterfront Plot", type: "Land", floor: "—", area: "1,200 m²", bedrooms: 0, bathrooms: 0, price: "€890,000", status: "Reserved" },
  { id: "20", projectId: "4", projectName: "Maintor Quartier", name: "Corner Plot C3", type: "Land", floor: "—", area: "600 m²", bedrooms: 0, bathrooms: 0, price: "€410,000", status: "Available" },
  { id: "21", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Garden Plot D1", type: "Land", floor: "—", area: "450 m²", bedrooms: 0, bathrooms: 0, price: "€290,000", status: "Available" },
  // Duplexes (5)
  { id: "4", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Unit B2", type: "Duplex", floor: "4th-5th", area: "135 m²", bedrooms: 3, bathrooms: 2, price: "€720,000", status: "Available" },
  { id: "10", projectId: "4", projectName: "Maintor Quartier", name: "Skyline B3", type: "Duplex", floor: "10th-11th", area: "155 m²", bedrooms: 4, bathrooms: 3, price: "€950,000", status: "Sold" },
  { id: "22", projectId: "2", projectName: "Spree Lofts", name: "Spree Duplex 1", type: "Duplex", floor: "3rd-4th", area: "140 m²", bedrooms: 3, bathrooms: 2, price: "€680,000", status: "Available" },
  { id: "23", projectId: "3", projectName: "Alster Terrassen", name: "Terrace Duplex", type: "Duplex", floor: "5th-6th", area: "160 m²", bedrooms: 4, bathrooms: 3, price: "€820,000", status: "Reserved" },
  { id: "24", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Garden Duplex", type: "Duplex", floor: "1st-2nd", area: "125 m²", bedrooms: 3, bathrooms: 2, price: "€650,000", status: "Available" },
  // Stores (5)
  { id: "25", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Shop A1", type: "Store", floor: "Ground", area: "65 m²", bedrooms: 0, bathrooms: 1, price: "€280,000", status: "Available" },
  { id: "26", projectId: "2", projectName: "Spree Lofts", name: "Retail Space 1", type: "Store", floor: "Ground", area: "120 m²", bedrooms: 0, bathrooms: 1, price: "€520,000", status: "Sold" },
  { id: "27", projectId: "3", projectName: "Alster Terrassen", name: "Corner Shop", type: "Store", floor: "Ground", area: "85 m²", bedrooms: 0, bathrooms: 1, price: "€350,000", status: "Available" },
  { id: "28", projectId: "4", projectName: "Maintor Quartier", name: "Main Street Shop", type: "Store", floor: "Ground", area: "95 m²", bedrooms: 0, bathrooms: 1, price: "€410,000", status: "Reserved" },
  { id: "29", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Boutique B2", type: "Store", floor: "Ground", area: "55 m²", bedrooms: 0, bathrooms: 1, price: "€220,000", status: "Available" },
  // Offices (5)
  { id: "30", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Office 101", type: "Office", floor: "1st", area: "110 m²", bedrooms: 0, bathrooms: 1, price: "€450,000", status: "Available" },
  { id: "31", projectId: "2", projectName: "Spree Lofts", name: "Co-Working Suite", type: "Office", floor: "3rd", area: "200 m²", bedrooms: 0, bathrooms: 2, price: "€780,000", status: "Reserved" },
  { id: "32", projectId: "3", projectName: "Alster Terrassen", name: "Executive Office", type: "Office", floor: "7th", area: "150 m²", bedrooms: 0, bathrooms: 2, price: "€620,000", status: "Sold" },
  { id: "33", projectId: "4", projectName: "Maintor Quartier", name: "Skyline Office", type: "Office", floor: "15th", area: "180 m²", bedrooms: 0, bathrooms: 2, price: "€850,000", status: "Available" },
  { id: "34", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Studio Office", type: "Office", floor: "2nd", area: "75 m²", bedrooms: 0, bathrooms: 1, price: "€320,000", status: "Available" },
  // Penthouses (5)
  { id: "3", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Unit B1", type: "Penthouse", floor: "6th", area: "180 m²", bedrooms: 4, bathrooms: 3, price: "€1,250,000", status: "Reserved" },
  { id: "7", projectId: "3", projectName: "Alster Terrassen", name: "Terrace Suite 1", type: "Penthouse", floor: "8th", area: "210 m²", bedrooms: 5, bathrooms: 3, price: "€1,800,000", status: "Reserved" },
  { id: "35", projectId: "2", projectName: "Spree Lofts", name: "Sky Penthouse", type: "Penthouse", floor: "10th", area: "195 m²", bedrooms: 4, bathrooms: 3, price: "€1,450,000", status: "Available" },
  { id: "36", projectId: "4", projectName: "Maintor Quartier", name: "Main Penthouse", type: "Penthouse", floor: "20th", area: "240 m²", bedrooms: 5, bathrooms: 4, price: "€2,200,000", status: "Sold" },
  { id: "37", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Garden Penthouse", type: "Penthouse", floor: "7th", area: "200 m²", bedrooms: 4, bathrooms: 3, price: "€1,380,000", status: "Available" },
  // Studios (5)
  { id: "2", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Unit A2", type: "Studio", floor: "1st", area: "45 m²", bedrooms: 1, bathrooms: 1, price: "€245,000", status: "Available" },
  { id: "6", projectId: "2", projectName: "Spree Lofts", name: "Loft 201", type: "Studio", floor: "2nd", area: "55 m²", bedrooms: 1, bathrooms: 1, price: "€275,000", status: "Sold" },
  { id: "38", projectId: "3", projectName: "Alster Terrassen", name: "Compact Studio", type: "Studio", floor: "4th", area: "38 m²", bedrooms: 1, bathrooms: 1, price: "€195,000", status: "Available" },
  { id: "39", projectId: "4", projectName: "Maintor Quartier", name: "City Studio", type: "Studio", floor: "6th", area: "42 m²", bedrooms: 1, bathrooms: 1, price: "€230,000", status: "Reserved" },
  { id: "40", projectId: "1", projectName: "Residenz am Englischen Garten", name: "Garden Studio", type: "Studio", floor: "Ground", area: "48 m²", bedrooms: 1, bathrooms: 1, price: "€260,000", status: "Available" },
];

const statusStyles: Record<string, string> = {
  Available: "bg-emerald-500/10 text-emerald-600",
  Reserved: "bg-amber-500/10 text-amber-600",
  Sold: "bg-muted text-muted-foreground",
};

const typeIcons: Record<string, string> = {
  Apartment: "🏢",
  Penthouse: "🌆",
  Studio: "🏠",
  Duplex: "🏘️",
  Villa: "🏡",
  Land: "🌍",
  Store: "🏪",
  Office: "💼",
};

type ViewMode = "card" | "grid" | "table";

const emptyForm = { name: "", projectId: "", type: "Apartment" as Property["type"], floor: "", area: "", bedrooms: 0, bathrooms: 0, price: "", status: "Available" as Property["status"] };

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState<Property | null>(null);
  const [form, setForm] = useState(emptyForm);
  const searchParams = new URLSearchParams(window.location.search);
  
  const filterProject = searchParams.get("project") || "all";
  const filterType = searchParams.get("type") || "all";

  const currentProject = projects.find(p => p.id === filterProject);

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm, projectId: filterProject !== "all" ? filterProject : "" }); setDialogOpen(true); };

  const openEdit = (p: Property) => {
    setEditing(p);
    setForm({ name: p.name, projectId: p.projectId, type: p.type, floor: p.floor, area: p.area, bedrooms: p.bedrooms, bathrooms: p.bathrooms, price: p.price, status: p.status });
    setDialogOpen(true);
  };

  const openDelete = (p: Property) => { setDeleting(p); setDeleteOpen(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.projectId) {
      toast({ title: "Name and project are required", variant: "destructive" });
      return;
    }
    const projectName = projects.find(p => p.id === form.projectId)?.name || "";
    if (editing) {
      setProperties(prev => prev.map(p => p.id === editing.id ? { ...p, ...form, projectName } : p));
      toast({ title: "Property updated" });
    } else {
      setProperties(prev => [...prev, { ...form, projectName, id: crypto.randomUUID() }]);
      toast({ title: "Property created" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleting) { setProperties(prev => prev.filter(p => p.id !== deleting.id)); toast({ title: "Property deleted" }); }
    setDeleteOpen(false); setDeleting(null);
  };

  const updateField = (field: keyof typeof form, value: string | number) => setForm(prev => ({ ...prev, [field]: value }));

  let filtered = filterProject === "all" ? properties : properties.filter(p => p.projectId === filterProject);
  if (filterType !== "all") {
    filtered = filtered.filter(p => p.type === filterType);
  }

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
                  {filterType !== "all" ? `${filterType}s` : currentProject ? currentProject.name : "All Properties"}
                </h2>
                <p className="text-[0.9375rem] text-muted-foreground">
                  {filterType !== "all" ? `Showing all ${filterType.toLowerCase()} properties` : currentProject ? "Properties in this project" : "Browse all properties across projects."}
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
                {filtered.map((property) => (
                  <div key={property.id} className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300 flex items-center gap-4 p-4">
                    <span className="text-2xl shrink-0">{typeIcons[property.type]}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-sm font-bold leading-tight truncate">{property.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{property.type} · {property.floor} Floor</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                      <span className="flex items-center gap-1"><Ruler className="w-3 h-3" />{property.area}</span>
                      <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{property.bedrooms}</span>
                      <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{property.bathrooms}</span>
                    </div>
                    <span className="text-sm font-semibold shrink-0">{property.price}</span>
                    <span className={cn("text-[0.625rem] font-semibold px-2 py-0.5 rounded-full shrink-0", statusStyles[property.status])}>
                      {property.status}
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
                ))}
              </div>
            )}

            {/* Grid View - multi-column cards */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((property) => (
                  <div key={property.id} className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300 flex flex-col">
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{typeIcons[property.type]}</span>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => openEdit(property)}>
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => openDelete(property)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-display text-base font-bold leading-tight">{property.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 mb-3">{property.type} · {property.floor} Floor</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Ruler className="w-3 h-3" />{property.area}</span>
                        <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{property.bedrooms}</span>
                        <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{property.bathrooms}</span>
                      </div>
                    </div>
                    <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
                      <span className="text-sm font-semibold">{property.price}</span>
                      <span className={cn("text-[0.625rem] font-semibold px-2 py-0.5 rounded-full", statusStyles[property.status])}>
                        {property.status}
                      </span>
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
                      <TableHead>Floor</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead className="text-center">Beds</TableHead>
                      <TableHead className="text-center">Baths</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-semibold">{property.name}</TableCell>
                        <TableCell><span className="mr-1.5">{typeIcons[property.type]}</span>{property.type}</TableCell>
                        <TableCell>{property.floor}</TableCell>
                        <TableCell>{property.area}</TableCell>
                        <TableCell className="text-center">{property.bedrooms}</TableCell>
                        <TableCell className="text-center">{property.bathrooms}</TableCell>
                        <TableCell className="font-semibold">{property.price}</TableCell>
                        <TableCell>
                          <span className={cn("text-[0.625rem] font-semibold px-2 py-0.5 rounded-full", statusStyles[property.status])}>
                            {property.status}
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

            {filtered.length === 0 && (
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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="Unit A1" />
              </div>
              <div className="grid gap-2">
                <Label>Project *</Label>
                <Select value={form.projectId} onValueChange={v => updateField("projectId", v)}>
                  <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => updateField("type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Duplex">Duplex</SelectItem>
                    <SelectItem value="Land">Land</SelectItem>
                    <SelectItem value="Store">Store</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="floor">Floor</Label>
                <Input id="floor" value={form.floor} onChange={e => updateField("floor", e.target.value)} placeholder="1st" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="area">Area</Label>
                <Input id="area" value={form.area} onChange={e => updateField("area", e.target.value)} placeholder="92 m²" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input id="bedrooms" type="number" value={form.bedrooms} onChange={e => updateField("bedrooms", parseInt(e.target.value) || 0)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input id="bathrooms" type="number" value={form.bathrooms} onChange={e => updateField("bathrooms", parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" value={form.price} onChange={e => updateField("price", e.target.value)} placeholder="€485,000" />
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => updateField("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              {editing ? "Save Changes" : "Create Property"}
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default Properties;
