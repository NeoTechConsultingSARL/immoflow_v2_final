import { router, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { FolderKanban, Plus, Pencil, Building2, MapPin, Calendar, Euro, LayoutGrid, FileText, ClipboardList, X, Rows3, Table as TableIcon } from "lucide-react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

interface Company {
  id: string;
  name: string;
}

interface ProjectsProps {
  projects: Project[];
  companies: Company[];
}

const propertyTypes = [
  "Apartments", "Villas", "Offices", "Retail Spaces", "Warehouses", "Parking Lots", "Land Plots", "Other"
];

const statusStyles: Record<string, string> = {
  "Planning": "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
  "In Progress": "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800",
  "Completed": "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800",
  "On Hold": "bg-muted text-muted-foreground border-border",
};

const gradientColors = [
  "from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10",
  "from-emerald-500/10 to-emerald-600/5 hover:from-emerald-500/20 hover:to-emerald-600/10",
  "from-amber-500/10 to-amber-600/5 hover:from-amber-500/20 hover:to-amber-600/10",
  "from-violet-500/10 to-violet-600/5 hover:from-violet-500/20 hover:to-violet-600/10",
  "from-rose-500/10 to-rose-600/5 hover:from-rose-500/20 hover:to-rose-600/10",
  "from-cyan-500/10 to-cyan-600/5 hover:from-cyan-500/20 hover:to-cyan-600/10",
];

type ViewMode = "card" | "grid" | "table";

const Projects = ({ projects, companies }: ProjectsProps) => {
  const { flash } = usePage().props as any;
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  
  const searchParams = new URLSearchParams(window.location.search);
  const [filterCompany, setFilterCompany] = useState<string>(searchParams.get("company") || "all");

  const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    name: "",
    company_id: "",
    address: "",
    description: "",
    status: "Planning" as Project["status"],
    budget: "",
    start_date: "",
    units: 0,
    property_allocations: [] as PropertyTypeAllocation[]
  });

  useEffect(() => {
    if (flash?.success) {
      toast({ title: flash.success });
    }
    if (flash?.error) {
      toast({ title: flash.error, variant: "destructive" });
    }
  }, [flash]);

  const openCreate = () => {
    setEditing(null);
    reset();
    clearErrors();
    
    // Pre-select company if present in query params
    const companyIdFromUrl = searchParams.get("company");
    if (companyIdFromUrl && companyIdFromUrl !== "all") {
        setData("company_id", companyIdFromUrl);
    }
    
    setDialogOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    clearErrors();
    setData({
      name: p.name,
      company_id: p.companyId,
      address: p.address,
      description: p.description,
      status: p.status,
      budget: p.budget,
      start_date: p.startDate,
      units: p.units,
      property_allocations: p.propertyAllocations || []
    });
    setDialogOpen(true);
  };



  useEffect(() => {
    const totalUnits = data.property_allocations.reduce((sum, a) => sum + a.units, 0);
    if (data.units !== totalUnits) {
        setData('units', totalUnits);
    }
  }, [data.property_allocations]);

  const handleSave = () => {
    if (editing) {
      put(route('projects.update', editing.id), {
        onSuccess: () => setDialogOpen(false),
      });
    } else {
      post(route('projects.store'), {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };



  const usedPropertyTypes = data.property_allocations.map(a => a.propertyType);
  const availablePropertyTypes = propertyTypes.filter(t => !usedPropertyTypes.includes(t));

  const addAllocation = () => {
    if (availablePropertyTypes.length === 0) return;
    setData('property_allocations', [...data.property_allocations, { propertyType: "", units: 1 }]);
  };

  const updateAllocation = (index: number, field: keyof PropertyTypeAllocation, value: string | number) => {
    const newAllocations = [...data.property_allocations];
    newAllocations[index] = { ...newAllocations[index], [field]: value };
    setData('property_allocations', newAllocations);
  };

  const removeAllocation = (index: number) => {
    setData('property_allocations', data.property_allocations.filter((_, i) => i !== index));
  };

  const filtered = filterCompany === "all" ? projects : projects.filter(p => p.companyId === filterCompany);

  const route = (window as any).route;

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
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <Select value={filterCompany} onValueChange={setFilterCompany}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
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
            </div>

            {/* Card View - single column */}
            {viewMode === "card" && (
              <div className="flex flex-col gap-3">
                {filtered.map((project) => (
                  <div key={project.id} className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300 flex items-center gap-4 p-4 cursor-pointer" onClick={() => router.visit(`/tranches?project=${project.id}`)}>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-sm font-bold leading-tight truncate">{project.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{project.companyName} · {project.address}</p>
                    </div>
                    <span className={cn("text-[0.625rem] font-semibold px-2 py-0.5 rounded-full shrink-0", statusStyles[project.status])}>
                      {project.status}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); openEdit(project); }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
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
            )}

            {/* Table View */}
            {viewMode === "table" && (
              <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((project) => (
                      <TableRow key={project.id} className="cursor-pointer" onClick={() => router.visit(`/tranches?project=${project.id}`)}>
                        <TableCell className="font-semibold">{project.name}</TableCell>
                        <TableCell className="text-muted-foreground">{project.companyName}</TableCell>
                        <TableCell>
                          <span className={cn("text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full", statusStyles[project.status])}>
                            {project.status}
                          </span>
                        </TableCell>
                        <TableCell>{project.budget}</TableCell>
                        <TableCell>{project.units}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); openEdit(project); }}>
                              <Pencil className="w-3.5 h-3.5" />
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
              <Input id="name" value={data.name} onChange={e => setData("name", e.target.value)} placeholder="e.g. Residenz am Park" />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Company *</Label>
              <Select value={data.company_id} onValueChange={v => setData("company_id", v)}>
                <SelectTrigger><SelectValue placeholder="Select a company" /></SelectTrigger>
                <SelectContent>
                  {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.company_id && <p className="text-xs text-destructive">{errors.company_id}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={data.description} onChange={e => setData("description", e.target.value)} placeholder="Brief project description" rows={2} />
              {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={data.status} onValueChange={v => setData("status", v as Project["status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget">Budget</Label>
                <Input id="budget" value={data.budget} onChange={e => setData("budget", e.target.value)} placeholder="€10M" />
                {errors.budget && <p className="text-xs text-destructive">{errors.budget}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={data.address} onChange={e => setData("address", e.target.value)} placeholder="Street, City" />
                {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" value={data.start_date} onChange={e => setData("start_date", e.target.value)} placeholder="Jan 2026" />
                {errors.start_date && <p className="text-xs text-destructive">{errors.start_date}</p>}
              </div>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label>Property Types</Label>
                {(availablePropertyTypes.length > 0 || data.property_allocations.some(a => !a.propertyType)) ? null : (
                  <span className="text-xs text-muted-foreground">All types assigned</span>
                )}
              </div>
              {data.property_allocations.map((allocation, index) => {
                const otherUsed = data.property_allocations.filter((_, i) => i !== index).map(a => a.propertyType).filter(Boolean);
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
              {(availablePropertyTypes.length > 0 || data.property_allocations.some(a => !a.propertyType)) && (
                <Button type="button" variant="outline" size="sm" className="gap-1.5 w-fit" onClick={addAllocation}>
                  <Plus className="w-3.5 h-3.5" /> Add Property Type
                </Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={processing}>Cancel</Button>
            <Button onClick={handleSave} style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }} disabled={processing}>
              {editing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </SidebarProvider>
  );
};

export default Projects;
