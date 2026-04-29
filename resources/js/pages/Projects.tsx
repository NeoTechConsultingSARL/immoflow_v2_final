import { router } from "@inertiajs/react";
import { useState } from "react";
import { FolderKanban, Plus, Pencil, Trash2, Building2, MapPin, Calendar, Euro, LayoutGrid, FileText, ClipboardList, X } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface PropertyTypeAllocation {
  propertyType: string;
  units: number;
}

interface Project {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  address: string;
  description: string;
  status: "Planning" | "In Progress" | "Completed" | "On Hold";
  budget: string;
  startDate: string;
  units: number;
  propertyAllocations: PropertyTypeAllocation[];
}

const propertyTypes = [
  "Apartments", "Villas", "Offices", "Retail Spaces", "Warehouses", "Parking Lots", "Land Plots", "Other"
];

const companies = [
  { id: "1", name: "Keller Immobilien GmbH" },
  { id: "2", name: "BerlinWohnen AG" },
  { id: "3", name: "Hanseatische Hausverwaltung" },
  { id: "4", name: "Rhein-Main Properties" },
];

const initialProjects: Project[] = [
  { id: "1", name: "Residenz am Englischen Garten", companyId: "1", companyName: "Keller Immobilien GmbH", address: "Lerchenfeldstraße 11, Munich", description: "Luxury residential complex with 24 units, underground parking, and rooftop terrace.", status: "In Progress", budget: "€12.5M", startDate: "Jan 2025", units: 24, propertyAllocations: [{ propertyType: "Apartments", units: 20 }, { propertyType: "Parking Lots", units: 4 }] },
  { id: "2", name: "Spree Lofts", companyId: "2", companyName: "BerlinWohnen AG", address: "Köpenicker Str. 40, Berlin", description: "Industrial loft conversion into modern living spaces along the Spree river.", status: "Planning", budget: "€8.2M", startDate: "Apr 2026", units: 18, propertyAllocations: [{ propertyType: "Apartments", units: 18 }] },
  { id: "3", name: "Alster Terrassen", companyId: "3", companyName: "Hanseatische Hausverwaltung", address: "An der Alster 28, Hamburg", description: "Waterfront apartments with panoramic views of the Alster lake.", status: "Completed", budget: "€15.0M", startDate: "Mar 2023", units: 36, propertyAllocations: [{ propertyType: "Apartments", units: 30 }, { propertyType: "Villas", units: 6 }] },
  { id: "4", name: "Maintor Quartier", companyId: "4", companyName: "Rhein-Main Properties", address: "Mainzer Landstraße 78, Frankfurt", description: "Mixed-use development combining office and residential space in the financial district.", status: "In Progress", budget: "€22.0M", startDate: "Sep 2024", units: 42, propertyAllocations: [{ propertyType: "Offices", units: 20 }, { propertyType: "Apartments", units: 22 }] },
  { id: "5", name: "Viktualien Höfe", companyId: "1", companyName: "Keller Immobilien GmbH", address: "Frauenstraße 9, Munich", description: "Boutique residential project near the Viktualienmarkt with traditional Bavarian charm.", status: "On Hold", budget: "€6.8M", startDate: "Jul 2025", units: 12, propertyAllocations: [{ propertyType: "Apartments", units: 12 }] },
  { id: "6", name: "Prenzlauer Berg Studios", companyId: "2", companyName: "BerlinWohnen AG", address: "Schönhauser Allee 55, Berlin", description: "Compact studio apartments designed for young professionals and creatives.", status: "Planning", budget: "€4.1M", startDate: "Jun 2026", units: 30, propertyAllocations: [{ propertyType: "Apartments", units: 30 }] },
];

const statusStyles: Record<string, string> = {
  "Planning": "bg-blue-500/10 text-blue-600",
  "In Progress": "bg-amber-500/10 text-amber-600",
  "Completed": "bg-emerald-500/10 text-emerald-600",
  "On Hold": "bg-muted text-muted-foreground",
};

const emptyForm: { name: string; companyId: string; address: string; description: string; status: Project["status"]; budget: string; startDate: string; units: number; propertyAllocations: PropertyTypeAllocation[] } = { name: "", companyId: "", address: "", description: "", status: "Planning", budget: "", startDate: "", units: 0, propertyAllocations: [] };

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const searchParams = new URLSearchParams(window.location.search);
  const [filterCompany, setFilterCompany] = useState<string>(searchParams.get("company") || "all");
  const companyName = searchParams.get("companyName") || "";
  const companyId = searchParams.get("company") || "";
  

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ name: p.name, companyId: p.companyId, address: p.address, description: p.description, status: p.status, budget: p.budget, startDate: p.startDate, units: p.units, propertyAllocations: p.propertyAllocations || [] });
    setDialogOpen(true);
  };

  const openDelete = (p: Project) => { setDeleting(p); setDeleteOpen(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.companyId) {
      toast({ title: "Name and company are required", variant: "destructive" });
      return;
    }
    const companyName = companies.find(c => c.id === form.companyId)?.name || "";
    const totalUnits = form.propertyAllocations.reduce((sum, a) => sum + a.units, 0);
    const saveData = { ...form, units: totalUnits };
    if (editing) {
      setProjects(prev => prev.map(p => p.id === editing.id ? { ...p, ...saveData, companyName } : p));
      toast({ title: "Project updated" });
    } else {
      setProjects(prev => [...prev, { ...saveData, companyName, id: crypto.randomUUID() }]);
      toast({ title: "Project created" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleting) { setProjects(prev => prev.filter(p => p.id !== deleting.id)); toast({ title: "Project deleted" }); }
    setDeleteOpen(false); setDeleting(null);
  };

  const updateField = (field: keyof typeof form, value: string | number | PropertyTypeAllocation[]) => setForm(prev => ({ ...prev, [field]: value }));

  const usedPropertyTypes = form.propertyAllocations.map(a => a.propertyType);
  const availablePropertyTypes = propertyTypes.filter(t => !usedPropertyTypes.includes(t));

  const addAllocation = () => {
    if (availablePropertyTypes.length === 0) return;
    setForm(prev => ({
      ...prev,
      propertyAllocations: [...prev.propertyAllocations, { propertyType: "", units: 1 }]
    }));
  };

  const updateAllocation = (index: number, field: keyof PropertyTypeAllocation, value: string | number) => {
    setForm(prev => ({
      ...prev,
      propertyAllocations: prev.propertyAllocations.map((a, i) => i === index ? { ...a, [field]: value } : a)
    }));
  };

  const removeAllocation = (index: number) => {
    setForm(prev => ({
      ...prev,
      propertyAllocations: prev.propertyAllocations.filter((_, i) => i !== index)
    }));
  };

  const filtered = filterCompany === "all" ? projects : projects.filter(p => p.companyId === filterCompany);

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
              <Plus className="w-4 h-4" /> Add Project
            </Button>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">All Projects</h2>
                <p className="text-[0.9375rem] text-muted-foreground">Track development projects across your companies.</p>
              </div>
              <Select value={filterCompany} onValueChange={setFilterCompany}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Filter by company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((project, index) => (
                <div
                  key={project.id}
                  className="group bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300 flex flex-col cursor-pointer"
                  onClick={() => router.visit(`/tranches?project=${project.id}&name=${encodeURIComponent(project.name)}&company=${project.companyId}&companyName=${encodeURIComponent(project.companyName)}`)}
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <span className={cn("text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full", statusStyles[project.status])}>
                        {project.status}
                      </span>
                      <div className="flex items-center gap-1">
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); router.visit(`/tranches?project=${project.id}&name=${encodeURIComponent(project.name)}&company=${project.companyId}&companyName=${encodeURIComponent(project.companyName)}`); }}>
                                <LayoutGrid className="w-3.5 h-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Project Management</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); toast({ title: "Printing construction contract..." }); }}>
                                <FileText className="w-3.5 h-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Print Construction Contract</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); toast({ title: "Printing project technical sheet..." }); }}>
                                <ClipboardList className="w-3.5 h-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Print Project Technical Sheet</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); openEdit(project); }}>
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Project</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); openDelete(project); }}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Project</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    <h3 className="font-display text-lg font-bold leading-tight mb-1">{project.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4 shrink-0" />
                        <span className="truncate">{project.companyName}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate">{project.address}</span>
                      </div>
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
                      <span className="font-semibold">{project.budget}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{project.startDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FolderKanban className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{project.units} units</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <FolderKanban className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-display text-lg font-bold mb-1">No projects found</h3>
                <p className="text-sm text-muted-foreground mb-4">Create a project or adjust your filter.</p>
                <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                  <Plus className="w-4 h-4" /> Add Project
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{editing ? "Edit Project" : "New Project"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input id="name" value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="e.g. Residenz am Park" />
            </div>
            <div className="grid gap-2">
              <Label>Company *</Label>
              <Select value={form.companyId} onValueChange={v => updateField("companyId", v)}>
                <SelectTrigger><SelectValue placeholder="Select a company" /></SelectTrigger>
                <SelectContent>
                  {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={form.description} onChange={e => updateField("description", e.target.value)} placeholder="Brief project description" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => updateField("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget">Budget</Label>
                <Input id="budget" value={form.budget} onChange={e => updateField("budget", e.target.value)} placeholder="€10M" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={form.address} onChange={e => updateField("address", e.target.value)} placeholder="Street, City" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" value={form.startDate} onChange={e => updateField("startDate", e.target.value)} placeholder="Jan 2026" />
              </div>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label>Property Types</Label>
                {(availablePropertyTypes.length > 0 || form.propertyAllocations.some(a => !a.propertyType)) ? null : (
                  <span className="text-xs text-muted-foreground">All types assigned</span>
                )}
              </div>
              {form.propertyAllocations.map((allocation, index) => {
                const otherUsed = form.propertyAllocations.filter((_, i) => i !== index).map(a => a.propertyType).filter(Boolean);
                const optionsForThis = propertyTypes.filter(t => !otherUsed.includes(t));
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Select value={allocation.propertyType} onValueChange={v => updateAllocation(index, "propertyType", v)}>
                      <SelectTrigger className="flex-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {optionsForThis.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min={1}
                      className="w-24"
                      value={allocation.units}
                      onChange={e => updateAllocation(index, "units", parseInt(e.target.value) || 0)}
                      placeholder="Units"
                    />
                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeAllocation(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
              {(availablePropertyTypes.length > 0 || form.propertyAllocations.some(a => !a.propertyType)) && (
                <Button type="button" variant="outline" size="sm" className="gap-1.5 w-fit" onClick={addAllocation}>
                  <Plus className="w-3.5 h-3.5" /> Add Property Type
                </Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              {editing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The project will be permanently removed.</AlertDialogDescription>
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

export default Projects;
