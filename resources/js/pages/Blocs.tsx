import { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
import { Box, Plus, Pencil, Trash2, ChevronRight } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
}

interface Tranche {
  id: string;
  name: string;
  projectId: string;
}

interface Bloc {
  id: string;
  name: string;
  description: string;
  floors: number;
  status: string;
  trancheId: string;
  trancheName: string;
  projectId: string;
  projectName: string;
  unitsCount: number;
}

interface Props {
  blocs: Bloc[];
  projects: Project[];
  tranches: Tranche[];
  filters: {
    project: string | null;
    tranche: string | null;
  };
}

const Blocs = ({ blocs, projects, tranches, filters }: Props) => {
  const searchParams = new URLSearchParams(window.location.search);
  const initialProjectId = filters?.project || "";
  const initialTrancheId = filters?.tranche || "";
  const companyId = searchParams.get("company") || "";
  const companyName = searchParams.get("companyName") || "";
  const projectName = searchParams.get("name") || "";
  const trancheName = searchParams.get("trancheName") || "";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Bloc | null>(null);
  const [deleting, setDeleting] = useState<Bloc | null>(null);

  const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    name: "",
    description: "",
    floors: 1,
    status: "active",
    project_id: initialProjectId,
    tranche_id: initialTrancheId,
  });

  const availableTranches = tranches?.filter(t => t.projectId === data.project_id) || [];

  useEffect(() => {
    // If selected project changes, clear tranche_id if it doesn't belong to the new project
    if (data.project_id && data.tranche_id) {
      const trancheBelongsToProject = tranches?.some(t => t.id === data.tranche_id && t.projectId === data.project_id);
      if (!trancheBelongsToProject) {
        setData("tranche_id", "");
      }
    }
  }, [data.project_id]);

  const openCreate = () => {
    setEditing(null);
    reset();
    clearErrors();
    setData("project_id", initialProjectId);
    setData("tranche_id", initialTrancheId);
    setDialogOpen(true);
  };

  const openEdit = (b: Bloc, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(b);
    setData({
      name: b.name,
      description: b.description || "",
      floors: b.floors,
      status: b.status || "active",
      project_id: b.projectId,
      tranche_id: b.trancheId,
    });
    clearErrors();
    setDialogOpen(true);
  };

  const openDelete = (b: Bloc, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleting(b);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      put(route("blocs.update", editing.id), {
        onSuccess: () => {
          setDialogOpen(false);
          toast({ title: "Bloc updated successfully" });
        },
      });
    } else {
      post(route("blocs.store"), {
        onSuccess: () => {
          setDialogOpen(false);
          toast({ title: "Bloc created successfully" });
        },
      });
    }
  };

  const handleDelete = () => {
    if (deleting) {
      destroy(route("blocs.destroy", deleting.id), {
        onSuccess: () => {
          setDeleteOpen(false);
          setDeleting(null);
          toast({ title: "Bloc deleted successfully" });
        },
      });
    }
  };

  const handleBlocClick = (bloc: Bloc) => {
    const projectQuery = `project=${bloc.projectId}&name=${encodeURIComponent(bloc.projectName)}`;
    const companyQuery = companyId ? `&company=${companyId}&companyName=${encodeURIComponent(companyName)}` : "";
    const trancheQuery = `&tranche=${bloc.trancheId}&trancheName=${encodeURIComponent(bloc.trancheName)}`;
    router.visit(`/management/${bloc.projectId}?${projectQuery}${companyQuery}${trancheQuery}&bloc=${bloc.id}&blocName=${encodeURIComponent(bloc.name)}`);
  };

  // Determine display title
  let displayTitle = "All Blocs";
  if (trancheName) {
    displayTitle = `${decodeURIComponent(trancheName)} — Blocs`;
  } else if (projectName) {
    displayTitle = `Project: ${decodeURIComponent(projectName)} — Blocs`;
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
              <Plus className="w-4 h-4" /> Add Bloc
            </Button>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">{displayTitle}</h2>
                {(initialProjectId || initialTrancheId) && (
                    <Button variant="ghost" size="sm" onClick={() => router.visit('/blocs')} className="text-muted-foreground hover:text-foreground h-7 px-2">
                        Show All
                    </Button>
                )}
              </div>
              <p className="text-[0.9375rem] text-muted-foreground">Manage blocs across your project phases. Click a bloc to access project management.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {blocs?.map((bloc, index) => (
                <div
                  key={bloc.id}
                  onClick={() => handleBlocClick(bloc)}
                  className="group bg-card border border-border rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Box className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => openEdit(bloc, e)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => openDelete(bloc, e)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display text-lg font-bold leading-tight">{bloc.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          bloc.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-muted text-muted-foreground'
                        }`}>
                          {bloc.status}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                         {bloc.projectName} <span className="mx-1 text-border/60">›</span> {bloc.trancheName}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">{bloc.description || "No description provided."}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{bloc.floors} floors</span>
                      <span>·</span>
                      <span>{bloc.unitsCount} units</span>
                    </div>
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
                    <span>Project management</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {(!blocs || blocs.length === 0) && (
              <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                  <Box className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">No blocs found</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Create your first bloc to start organizing this tranche.</p>
                <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                  <Plus className="w-4 h-4" /> Add Bloc
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md border-border/60 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold">{editing ? "Edit Bloc" : "New Bloc"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid gap-2">
              <Label htmlFor="project_id" className="text-sm font-semibold">Project *</Label>
              <Select 
                value={data.project_id} 
                onValueChange={value => setData("project_id", value)}
              >
                <SelectTrigger className={errors.project_id ? "border-destructive ring-destructive/20" : ""}>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.project_id && <p className="text-[12px] font-medium text-destructive mt-1">{errors.project_id}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tranche_id" className="text-sm font-semibold">Tranche *</Label>
              <Select 
                value={data.tranche_id} 
                onValueChange={value => setData("tranche_id", value)}
                disabled={!data.project_id}
              >
                <SelectTrigger className={errors.tranche_id ? "border-destructive ring-destructive/20" : ""}>
                  <SelectValue placeholder={data.project_id ? "Select a tranche" : "Select a project first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableTranches.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                  {availableTranches.length === 0 && data.project_id && (
                     <SelectItem value="none" disabled>No tranches in this project</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.tranche_id && <p className="text-[12px] font-medium text-destructive mt-1">{errors.tranche_id}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bloc-name" className="text-sm font-semibold">Bloc Name *</Label>
              <Input 
                id="bloc-name" 
                value={data.name} 
                onChange={e => setData("name", e.target.value)} 
                placeholder="e.g. Bloc A1" 
                className={errors.name ? "border-destructive ring-destructive/20" : ""}
              />
              {errors.name && <p className="text-[12px] font-medium text-destructive mt-1">{errors.name}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bloc-floors" className="text-sm font-semibold">Number of Floors</Label>
              <Input 
                id="bloc-floors" 
                type="number" 
                min={1} 
                value={data.floors} 
                onChange={e => setData("floors", parseInt(e.target.value) || 1)} 
                className={errors.floors ? "border-destructive ring-destructive/20" : ""}
              />
              {errors.floors && <p className="text-[12px] font-medium text-destructive mt-1">{errors.floors}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status" className="text-sm font-semibold">Status</Label>
              <Select value={data.status} onValueChange={value => setData("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bloc-desc" className="text-sm font-semibold">Description</Label>
              <Textarea 
                id="bloc-desc" 
                value={data.description} 
                onChange={e => setData("description", e.target.value)} 
                placeholder="Brief description" 
                rows={3} 
                className={errors.description ? "border-destructive ring-destructive/20" : ""}
              />
              {errors.description && <p className="text-[12px] font-medium text-destructive mt-1">{errors.description}</p>}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/40 mt-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} disabled={processing}>Cancel</Button>
            <Button onClick={handleSave} disabled={processing} className="px-8 shadow-sm" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              {processing ? "Saving..." : editing ? "Save Changes" : "Create Bloc"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border-border/60 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl font-bold">Delete "{deleting?.name}"?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground pt-2">
              This action cannot be undone. All units and associated data within this bloc will also be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
            >
              {processing ? "Deleting..." : "Delete Bloc"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default Blocs;
