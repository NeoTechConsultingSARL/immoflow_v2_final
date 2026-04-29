import { useState } from "react";
import { router } from "@inertiajs/react";
import { Layers, Plus, Pencil, Trash2, ChevronRight } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface Tranche {
  id: string;
  name: string;
  description: string;
  blocsCount: number;
  unitsCount: number;
}

const initialTranches: Record<string, Tranche[]> = {
  "1": [
    { id: "t1", name: "Tranche A", description: "First phase — residential wing north", blocsCount: 3, unitsCount: 12 },
    { id: "t2", name: "Tranche B", description: "Second phase — residential wing south", blocsCount: 2, unitsCount: 8 },
    { id: "t3", name: "Tranche C", description: "Third phase — commercial ground floor", blocsCount: 1, unitsCount: 4 },
  ],
  "2": [
    { id: "t4", name: "Tranche 1", description: "Loft conversion — building east", blocsCount: 2, unitsCount: 10 },
    { id: "t5", name: "Tranche 2", description: "Loft conversion — building west", blocsCount: 2, unitsCount: 8 },
  ],
  "3": [
    { id: "t6", name: "Phase Alpha", description: "Waterfront premium apartments", blocsCount: 4, unitsCount: 20 },
    { id: "t7", name: "Phase Beta", description: "Waterfront standard apartments", blocsCount: 3, unitsCount: 16 },
  ],
  "4": [
    { id: "t8", name: "Tranche Office", description: "Office tower floors 1–10", blocsCount: 2, unitsCount: 20 },
    { id: "t9", name: "Tranche Residential", description: "Residential tower floors 11–22", blocsCount: 3, unitsCount: 22 },
  ],
  "5": [
    { id: "t10", name: "Tranche Unique", description: "Single-phase boutique project", blocsCount: 2, unitsCount: 12 },
  ],
  "6": [
    { id: "t11", name: "Tranche Nord", description: "North wing studios", blocsCount: 2, unitsCount: 15 },
    { id: "t12", name: "Tranche Süd", description: "South wing studios", blocsCount: 2, unitsCount: 15 },
  ],
};

const emptyForm = { name: "", description: "" };

const Tranches = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const projectId = searchParams.get("project") || "";
  const projectName = searchParams.get("name") || "Project";
  const companyId = searchParams.get("company") || "";
  const companyName = searchParams.get("companyName") || "";

  const [tranches, setTranches] = useState<Tranche[]>(initialTranches[projectId] || [
    { id: "t-default-1", name: "Tranche 1", description: "Default tranche", blocsCount: 2, unitsCount: 10 },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Tranche | null>(null);
  const [deleting, setDeleting] = useState<Tranche | null>(null);
  const [form, setForm] = useState(emptyForm);

  const companyQuery = companyId ? `&company=${companyId}&companyName=${encodeURIComponent(companyName)}` : "";
  const projectQuery = `project=${projectId}&name=${encodeURIComponent(projectName)}`;

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (t: Tranche, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(t);
    setForm({ name: t.name, description: t.description });
    setDialogOpen(true);
  };
  const openDelete = (t: Tranche, e: React.MouseEvent) => { e.stopPropagation(); setDeleting(t); setDeleteOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    if (editing) {
      setTranches(prev => prev.map(t => t.id === editing.id ? { ...t, ...form } : t));
      toast({ title: "Tranche updated" });
    } else {
      setTranches(prev => [...prev, { ...form, id: crypto.randomUUID(), blocsCount: 0, unitsCount: 0 }]);
      toast({ title: "Tranche created" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleting) { setTranches(prev => prev.filter(t => t.id !== deleting.id)); toast({ title: "Tranche deleted" }); }
    setDeleteOpen(false); setDeleting(null);
  };

  const handleTrancheClick = (tranche: Tranche) => {
    router.visit(`/projects/${projectId}/blocs?${projectQuery}${companyQuery}&tranche=${tranche.id}&trancheName=${encodeURIComponent(tranche.name)}`);
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
              <Plus className="w-4 h-4" /> Add Tranche
            </Button>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="mb-8">
              <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">{decodeURIComponent(projectName)} — Tranches</h2>
              <p className="text-[0.9375rem] text-muted-foreground">Manage project tranches. Click a tranche to view its blocs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tranches.map((tranche, index) => (
                <div
                  key={tranche.id}
                  onClick={() => handleTrancheClick(tranche)}
                  className="group bg-card border border-border rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => openEdit(tranche, e)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => openDelete(tranche, e)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-bold leading-tight mb-1">{tranche.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{tranche.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{tranche.blocsCount} blocs</span>
                      <span>·</span>
                      <span>{tranche.unitsCount} units</span>
                    </div>
                  </div>
                  <div className="relative px-6 py-3 border-t border-border bg-muted/30 group-hover:bg-primary/10 flex items-center justify-between text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 overflow-hidden">
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
                    <span>View blocs</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {tranches.length === 0 && (
              <div className="text-center py-20">
                <Layers className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-display text-lg font-bold mb-1">No tranches yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Create a tranche to organize this project.</p>
                <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                  <Plus className="w-4 h-4" /> Add Tranche
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{editing ? "Edit Tranche" : "New Tranche"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tranche-name">Tranche Name *</Label>
              <Input id="tranche-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Tranche A" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tranche-desc">Description</Label>
              <Textarea id="tranche-desc" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>{editing ? "Save Changes" : "Create Tranche"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleting?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. All blocs within this tranche will also be removed.</AlertDialogDescription>
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

export default Tranches;
