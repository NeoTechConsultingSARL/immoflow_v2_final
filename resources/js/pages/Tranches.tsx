import { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
import { Layers, Plus, Pencil, Trash2, ChevronRight, LayoutGrid } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  projectName: string;
  status: string;
  blocsCount: number;
  unitsCount: number;
}

interface Props {
  tranches: Tranche[];
  projects: Project[];
  filters: {
    project: string | null;
  };
}

const Tranches = ({ tranches, projects, filters }: Props) => {
  const searchParams = new URLSearchParams(window.location.search);
  const initialProjectId = filters.project || "";
  const projectName = searchParams.get("name") || "";


  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Tranche | null>(null);
  const [deleting, setDeleting] = useState<Tranche | null>(null);

  const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    name: "",
    project_id: initialProjectId,
    status: "active",
  });

  const openCreate = () => {
    setEditing(null);
    reset();
    clearErrors();
    setData("project_id", initialProjectId);
    setDialogOpen(true);
  };

  const openEdit = (t: Tranche, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(t);
    setData({
      name: t.name,
      project_id: t.projectId,
      status: t.status,
    });
    clearErrors();
    setDialogOpen(true);
  };

  const openDelete = (t: Tranche, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleting(t);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      put(route("tranches.update", editing.id), {
        onSuccess: () => {
          setDialogOpen(false);
          toast({ title: "Tranche updated successfully" });
        },
      });
    } else {
      post(route("tranches.store"), {
        onSuccess: () => {
          setDialogOpen(false);
          toast({ title: "Tranche created successfully" });
        },
      });
    }
  };

  const handleDelete = () => {
    if (deleting) {
      destroy(route("tranches.destroy", deleting.id), {
        onSuccess: () => {
          setDeleteOpen(false);
          setDeleting(null);
          toast({ title: "Tranche deleted successfully" });
        },
      });
    }
  };

  const handleTrancheClick = (tranche: Tranche) => {
    router.visit(`/projects/${tranche.projectId}/blocs?project=${tranche.projectId}&name=${encodeURIComponent(tranche.projectName)}&tranche=${tranche.id}&trancheName=${encodeURIComponent(tranche.name)}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background/50">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <AppBreadcrumb />
            </div>
            <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              <Plus className="w-4 h-4" /> Add Tranche
            </Button>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold text-foreground">
                  {projectName ? `Project: ${projectName}` : "All Tranches"}
                </h2>
                {projectName && (
                    <Button variant="ghost" size="sm" onClick={() => router.visit('/tranches')} className="text-muted-foreground hover:text-foreground h-7 px-2">
                        Show All
                    </Button>
                )}
              </div>
              <p className="text-[0.9375rem] text-muted-foreground">
                {projectName ? `Viewing phases for ${projectName}.` : "Manage project phases and sections across all projects."} Click a tranche to manage its blocs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tranches.map((tranche, index) => (
                <div
                  key={tranche.id}
                  onClick={() => handleTrancheClick(tranche)}
                  className="group bg-card border border-border/60 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted" onClick={(e) => openEdit(tranche, e)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={(e) => openDelete(tranche, e)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display text-lg font-bold leading-tight text-foreground">{tranche.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          tranche.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-muted text-muted-foreground'
                        }`}>
                          {tranche.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>{tranche.projectName}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 py-3 border-t border-border/40">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase tracking-tight">Blocs</span>
                        <span className="text-sm font-semibold">{tranche.blocsCount}</span>
                      </div>
                      <div className="w-px h-8 bg-border/40" />
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase tracking-tight">Units</span>
                        <span className="text-sm font-semibold">{tranche.unitsCount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative px-6 py-3 border-t border-border/40 bg-muted/20 group-hover:bg-primary/5 flex items-center justify-between text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px]"
                      style={{ background: [
                        'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                        'linear-gradient(90deg, #f59e0b, #ef4444)',
                        'linear-gradient(90deg, #10b981, #3b82f6)',
                        'linear-gradient(90deg, #8b5cf6, #ec4899)',
                        'linear-gradient(90deg, #06b6d4, #3b82f6)',
                      ][index % 5] }}
                    />
                    <span>Manage phase</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {tranches.length === 0 && (
              <div className="text-center py-24 bg-card border border-dashed border-border rounded-2xl animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                  <Layers className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">No tranches found</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Create your first tranche to start organizing project phases and buildings.</p>
                <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                  <Plus className="w-4 h-4" /> Add Tranche
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md border-border/60 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold">{editing ? "Edit Tranche" : "New Tranche"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6">
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
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.project_id && <p className="text-[12px] font-medium text-destructive mt-1">{errors.project_id}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tranche-name" className="text-sm font-semibold">Tranche Name *</Label>
              <Input 
                id="tranche-name" 
                value={data.name} 
                onChange={e => setData("name", e.target.value)} 
                placeholder="e.g. Tranche A or Phase 1" 
                className={errors.name ? "border-destructive ring-destructive/20" : ""}
              />
              {errors.name && <p className="text-[12px] font-medium text-destructive mt-1">{errors.name}</p>}
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
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} disabled={processing}>Cancel</Button>
            <Button onClick={handleSave} disabled={processing} className="px-8 shadow-sm" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              {processing ? "Saving..." : editing ? "Save Changes" : "Create Tranche"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border-border/60 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl font-bold">Delete "{deleting?.name}"?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground pt-2">
              This action cannot be undone. All blocs and associated data within this tranche will also be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
            >
              {processing ? "Deleting..." : "Delete Tranche"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default Tranches;
