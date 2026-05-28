import { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
import { Car, Plus, Pencil, Trash2, Search, LayoutGrid, Rows3, Table as TableIcon } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Parking {
  id: string;
  name: string;
  status: string;
  blocId: string;
  blocName: string;
  trancheName: string;
  projectName: string;
}

interface Bloc {
  id: string;
  name: string;
  trancheName: string;
  projectName: string;
}

interface Props {
  parkings: Parking[];
  bloc: Bloc | null;
  filters: {
    bloc: string | null;
    search: string | null;
  };
}

type ViewMode = "card" | "grid" | "table";

const Parkings = ({ parkings, bloc, filters }: Props) => {
  const searchParams = new URLSearchParams(window.location.search);
  const initialBlocId = filters?.bloc || "";
  const initialSearch = filters?.search || "";

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Parking | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Parking | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    bloc_id: initialBlocId,
    count: 1,
    status: 'free',
  });

  const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors, reset: editReset, clearErrors: editClearErrors } = useForm({
    name: "",
    status: "free",
  });

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm !== initialSearch) {
        const params: Record<string, string> = {};
        if (initialBlocId) params.bloc = initialBlocId;
        if (searchTerm) params.search = searchTerm;
        router.get('/parkings', params, { preserveState: true });
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, initialBlocId, initialSearch]);

  const openCreate = () => {
    reset();
    clearErrors();
    setData("bloc_id", initialBlocId);
    setDialogOpen(true);
  };

  const openEdit = (p: Parking, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(p);
    setEditData("name", p.name);
    setEditData("status", p.status);
    setEditOpen(true);
  };

  const openDelete = (p: Parking, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleting(p);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    post(route("parkings.store"), {
      onSuccess: () => {
        setDialogOpen(false);
        toast({ title: "Parking spaces created successfully" });
      },
    });
  };

  const handleEdit = () => {
    if (editing) {
      editPut(route("parkings.update", editing.id), {
        onSuccess: () => {
          setEditOpen(false);
          setEditing(null);
          editReset();
          toast({ title: "Parking updated successfully" });
        },
      });
    }
  };

  const handleDelete = () => {
    if (deleting) {
      destroy(route("parkings.destroy", deleting.id), {
        onSuccess: () => {
          setDeleteOpen(false);
          setDeleting(null);
          toast({ title: "Parking deleted successfully" });
        },
      });
    }
  };

  const handleStatusToggle = (parking: Parking) => {
    const newStatus = parking.status === 'free' ? 'reserved' : 'free';
    router.put(route("parkings.update", parking.id), { status: newStatus }, {
      onSuccess: () => {
        toast({ title: `Parking marked as ${newStatus}` });
      },
    });
  };

  // Generate prefix preview
  const generatePrefixPreview = () => {
    if (!bloc) return "";
    const projectName = bloc.projectName || "Project";
    const trancheName = bloc.trancheName || "T";
    const blocName = bloc.name || "B";
    const projectAbbr = projectName.substring(0, 2) + projectName.substring(projectName.length - 2);
    
    // Extract meaningful part from tranche name (letters or numbers)
    let trancheAbbr = trancheName.replace(/[^A-Za-z0-9]/g, "") || "1";
    // If it's a word like "Tranche", extract the last letter/number
    const trancheMatch = trancheName.match(/[A-Za-z0-9]$/);
    if (trancheMatch) {
      trancheAbbr = trancheMatch[0];
    }
    
    // Extract meaningful part from bloc name (letters or numbers)
    let blocAbbr = blocName.replace(/[^A-Za-z0-9]/g, "") || "1";
    // If it's a word like "Bloc", extract the last letter/number
    const blocMatch = blocName.match(/[A-Za-z0-9]$/);
    if (blocMatch) {
      blocAbbr = blocMatch[0];
    }
    
    return `${projectAbbr}_T${trancheAbbr}_B${blocAbbr}`;
  };

  const prefix = generatePrefixPreview();

  // Determine display title
  let displayTitle = "All Parkings";
  if (bloc) {
    displayTitle = `${bloc.name} — Parkings`;
  }

  const getStatusBadge = (status: string) => {
    return status === 'free' 
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
      : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
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
              <Plus className="w-4 h-4" /> Add Parking
            </Button>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">{displayTitle}</h2>
                  {initialBlocId && (
                    <Button variant="ghost" size="sm" onClick={() => router.visit('/parkings')} className="text-muted-foreground hover:text-foreground h-7 px-2">
                      Show All
                    </Button>
                  )}
                </div>
                <p className="text-[0.9375rem] text-muted-foreground">Manage parking spaces for this bloc. Click to toggle status.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search parkings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
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
            </div>

            {/* Card View - single column */}
            {viewMode === "card" && (
              <div className="flex flex-col gap-3">
                {parkings?.map((parking) => (
                  <div key={parking.id} className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300 flex items-center gap-4 p-4 cursor-pointer" onClick={() => handleStatusToggle(parking)}>
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <Car className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-sm font-bold leading-tight truncate">{parking.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{parking.projectName} · {parking.trancheName} · {parking.blocName}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg shrink-0 text-xs font-bold uppercase tracking-wider ${getStatusBadge(parking.status)}`}>
                      {parking.status}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => openEdit(parking, e)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => openDelete(parking, e)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {parkings?.map((parking, index) => (
                  <div
                    key={parking.id}
                    onClick={() => handleStatusToggle(parking)}
                    className="group bg-card border border-border rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                          <Car className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => openEdit(parking, e)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => openDelete(parking, e)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display text-lg font-bold leading-tight">{parking.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(parking.status)}`}>
                            {parking.status}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          {parking.projectName} <span className="mx-1 text-border/60">›</span> {parking.trancheName} <span className="mx-1 text-border/60">›</span> {parking.blocName}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">Click to toggle status</p>
                    </div>
                    <div className="relative px-6 py-3 border-t border-border bg-muted/30 group-hover:bg-primary/10 flex items-center justify-between text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 overflow-hidden">
                      <div
                        className="absolute top-0 left-0 right-0 h-[3px]"
                        style={{ background: [
                          'linear-gradient(90deg, hsl(200 60% 50%), hsl(220 55% 55%))',
                          'linear-gradient(90deg, hsl(25 80% 55%), hsl(45 90% 55%))',
                          'linear-gradient(90deg, hsl(160 50% 45%), hsl(190 60% 50%))',
                          'linear-gradient(90deg, hsl(270 50% 55%), hsl(300 50% 55%))',
                          'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))',
                          'linear-gradient(90deg, hsl(340 55% 50%), hsl(10 60% 55%))',
                        ][index % 6] }}
                      />
                      <span>Toggle status</span>
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
                      <TableHead>Parking</TableHead>
                      <TableHead>Project / Tranche / Bloc</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parkings?.map((parking) => (
                      <TableRow key={parking.id} className="cursor-pointer" onClick={() => handleStatusToggle(parking)}>
                        <TableCell className="font-semibold">{parking.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {parking.projectName} / {parking.trancheName} / {parking.blocName}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(parking.status)}`}>
                            {parking.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => openEdit(parking, e)}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => openDelete(parking, e)}>
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

            {(!parkings || parkings.length === 0) && (
              <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                  <Car className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">No parking spaces found</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Create parking spaces for this bloc to start managing them.</p>
                <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                  <Plus className="w-4 h-4" /> Add Parking
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md border-border/60 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold">Add Parking Spaces</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6 max-h-[70vh] overflow-y-auto px-1">
            {bloc && (
              <div className="grid gap-2">
                <Label className="text-sm font-semibold">Prefix (Auto-generated)</Label>
                <div className="p-3 bg-muted/50 rounded-lg text-sm font-mono">
                  {prefix}
                </div>
                <p className="text-xs text-muted-foreground">Based on: {bloc.projectName} → {bloc.trancheName} → {bloc.name}</p>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="parking-count" className="text-sm font-semibold">Number of Parking Spaces *</Label>
              <Input 
                id="parking-count" 
                type="number" 
                min={1} 
                max={100}
                value={data.count} 
                onChange={e => setData("count", parseInt(e.target.value) || 1)} 
                placeholder="e.g. 20" 
                className={errors.count ? "border-destructive ring-destructive/20" : ""}
              />
              {errors.count && <p className="text-[12px] font-medium text-destructive mt-1">{errors.count}</p>}
              {bloc && (
                <p className="text-xs text-muted-foreground mt-1">
                  Will generate: {prefix}_1 to {prefix}_{data.count}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="parking-status" className="text-sm font-semibold">Status *</Label>
              <select
                id="parking-status"
                value={data.status}
                onChange={e => setData("status", e.target.value)}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  errors.status ? "border-destructive ring-destructive/20" : ""
                )}
              >
                <option value="free">Free</option>
                <option value="reserved">Reserved</option>
              </select>
              {errors.status && <p className="text-[12px] font-medium text-destructive mt-1">{errors.status}</p>}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/40 mt-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} disabled={processing}>Cancel</Button>
            <Button onClick={handleSave} disabled={processing} className="px-8 shadow-sm" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              {processing ? "Creating..." : "Create Parking Spaces"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md border-border/60 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold">Edit Parking</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-sm font-semibold">Name *</Label>
              <Input 
                id="edit-name" 
                value={editData.name} 
                onChange={e => setEditData("name", e.target.value)} 
                placeholder="e.g. PrSA_T1_B1_1" 
                className={editErrors.name ? "border-destructive ring-destructive/20" : ""}
              />
              {editErrors.name && <p className="text-[12px] font-medium text-destructive mt-1">{editErrors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-status" className="text-sm font-semibold">Status *</Label>
              <select
                id="edit-status"
                value={editData.status}
                onChange={e => setEditData("status", e.target.value)}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  editErrors.status ? "border-destructive ring-destructive/20" : ""
                )}
              >
                <option value="free">Free</option>
                <option value="reserved">Reserved</option>
              </select>
              {editErrors.status && <p className="text-[12px] font-medium text-destructive mt-1">{editErrors.status}</p>}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/40 mt-2">
            <Button variant="ghost" onClick={() => setEditOpen(false)} disabled={editProcessing}>Cancel</Button>
            <Button onClick={handleEdit} disabled={editProcessing} className="px-8 shadow-sm" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              {editProcessing ? "Updating..." : "Update Parking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border-border/60 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl font-bold">Delete "{deleting?.name}"?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground pt-2">
              This action cannot be undone. This parking space will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
            >
              {processing ? "Deleting..." : "Delete Parking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default Parkings;
