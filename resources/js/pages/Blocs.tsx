import { useState } from "react";
import { router } from "@inertiajs/react";
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
import { toast } from "@/hooks/use-toast";

interface Bloc {
  id: string;
  name: string;
  description: string;
  floors: number;
  unitsCount: number;
}

const initialBlocs: Record<string, Bloc[]> = {
  "t1": [
    { id: "b1", name: "Bloc A1", description: "North wing — ground to 4th floor", floors: 5, unitsCount: 4 },
    { id: "b2", name: "Bloc A2", description: "North wing — 5th to 8th floor", floors: 4, unitsCount: 4 },
    { id: "b3", name: "Bloc A3", description: "North wing — penthouse level", floors: 2, unitsCount: 4 },
  ],
  "t2": [
    { id: "b4", name: "Bloc B1", description: "South wing — lower section", floors: 4, unitsCount: 4 },
    { id: "b5", name: "Bloc B2", description: "South wing — upper section", floors: 4, unitsCount: 4 },
  ],
  "t3": [
    { id: "b6", name: "Bloc C1", description: "Commercial ground floor units", floors: 1, unitsCount: 4 },
  ],
  "t4": [
    { id: "b7", name: "East Wing A", description: "Loft units — east building lower", floors: 3, unitsCount: 5 },
    { id: "b8", name: "East Wing B", description: "Loft units — east building upper", floors: 3, unitsCount: 5 },
  ],
  "t5": [
    { id: "b9", name: "West Wing A", description: "Loft units — west building lower", floors: 3, unitsCount: 4 },
    { id: "b10", name: "West Wing B", description: "Loft units — west building upper", floors: 3, unitsCount: 4 },
  ],
};

const emptyForm = { name: "", description: "", floors: 1 };

const Blocs = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const projectId = searchParams.get("project") || "";
  const projectName = searchParams.get("name") || "Project";
  const companyId = searchParams.get("company") || "";
  const companyName = searchParams.get("companyName") || "";
  const trancheId = searchParams.get("tranche") || "";
  const trancheName = searchParams.get("trancheName") || "Tranche";

  const [blocs, setBlocs] = useState<Bloc[]>(initialBlocs[trancheId] || [
    { id: "b-default-1", name: "Bloc 1", description: "Default bloc", floors: 3, unitsCount: 6 },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Bloc | null>(null);
  const [deleting, setDeleting] = useState<Bloc | null>(null);
  const [form, setForm] = useState(emptyForm);

  const companyQuery = companyId ? `&company=${companyId}&companyName=${encodeURIComponent(companyName)}` : "";
  const projectQuery = `project=${projectId}&name=${encodeURIComponent(projectName)}`;
  const trancheQuery = `&tranche=${trancheId}&trancheName=${encodeURIComponent(trancheName)}`;

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (b: Bloc, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(b);
    setForm({ name: b.name, description: b.description, floors: b.floors });
    setDialogOpen(true);
  };
  const openDelete = (b: Bloc, e: React.MouseEvent) => { e.stopPropagation(); setDeleting(b); setDeleteOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    if (editing) {
      setBlocs(prev => prev.map(b => b.id === editing.id ? { ...b, ...form } : b));
      toast({ title: "Bloc updated" });
    } else {
      setBlocs(prev => [...prev, { ...form, id: crypto.randomUUID(), unitsCount: 0 }]);
      toast({ title: "Bloc created" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleting) { setBlocs(prev => prev.filter(b => b.id !== deleting.id)); toast({ title: "Bloc deleted" }); }
    setDeleteOpen(false); setDeleting(null);
  };

  const handleBlocClick = (bloc: Bloc) => {
    router.visit(`/management/${projectId}?${projectQuery}${companyQuery}${trancheQuery}&bloc=${bloc.id}&blocName=${encodeURIComponent(bloc.name)}`);
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
              <Plus className="w-4 h-4" /> Add Bloc
            </Button>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="mb-8">
              <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">{decodeURIComponent(trancheName)} — Blocs</h2>
              <p className="text-[0.9375rem] text-muted-foreground">Manage blocs in this tranche. Click a bloc to access project management.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {blocs.map((bloc, index) => (
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
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => openEdit(bloc, e)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => openDelete(bloc, e)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-bold leading-tight mb-1">{bloc.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{bloc.description}</p>
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

            {blocs.length === 0 && (
              <div className="text-center py-20">
                <Box className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-display text-lg font-bold mb-1">No blocs yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Create a bloc to organize this tranche.</p>
                <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                  <Plus className="w-4 h-4" /> Add Bloc
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{editing ? "Edit Bloc" : "New Bloc"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bloc-name">Bloc Name *</Label>
              <Input id="bloc-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Bloc A1" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bloc-desc">Description</Label>
              <Textarea id="bloc-desc" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" rows={3} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bloc-floors">Number of Floors</Label>
              <Input id="bloc-floors" type="number" min={1} value={form.floors} onChange={e => setForm(f => ({ ...f, floors: parseInt(e.target.value) || 1 }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>{editing ? "Save Changes" : "Create Bloc"}</Button>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default Blocs;
