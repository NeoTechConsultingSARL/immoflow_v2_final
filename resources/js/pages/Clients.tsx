import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Users, Plus, Pencil, MapPin, Phone, Mail, IdCard, LayoutGrid, Rows3, Table as TableIcon } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Client {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  identity_number: string;
  address: string | null;
  type: "Lead" | "Prospect" | "Owner";
  created_at: string;
}

interface Props {
  clients: Client[];
}

type ViewMode = "card" | "grid" | "table";

const typeColors = {
  Lead: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  Prospect: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  Owner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
};

const Clients = ({ clients }: Props) => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    full_name: "",
    email: "",
    phone: "",
    identity_number: "",
    address: "",
    type: "Lead",
  });

  const openCreate = () => {
    setEditing(null);
    reset();
    clearErrors();
    setDialogOpen(true);
  };

  const openEdit = (client: Client, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditing(client);
    clearErrors();
    setDialogOpen(true);
  };

  // Update form data when editing client changes
  useEffect(() => {
    if (editing) {
      setData('full_name', editing.full_name);
      setData('email', editing.email);
      setData('phone', editing.phone || "");
      setData('identity_number', editing.identity_number);
      setData('address', editing.address || "");
      setData('type', editing.type);
    } else if (!dialogOpen) {
      // Reset form when dialog is closed and not editing
      setData('full_name', "");
      setData('email', "");
      setData('phone', "");
      setData('identity_number', "");
      setData('address', "");
      setData('type', "Lead");
    }
  }, [editing, dialogOpen]);

  const handleSave = () => {
    if (editing) {
      put(route("clients.update", editing.id), {
        onSuccess: () => {
          setDialogOpen(false);
          toast({ title: "Client updated successfully" });
        },
      });
    } else {
      post(route("clients.store"), {
        onSuccess: () => {
          setDialogOpen(false);
          toast({ title: "Client created successfully" });
        },
      });
    }
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
              <Plus className="w-4 h-4" /> Add Client
            </Button>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Global Clients Directory</h2>
                <p className="text-[0.9375rem] text-muted-foreground">Manage all individuals interacting with the system globally.</p>
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

            {/* Card View */}
            {viewMode === "card" && (
              <div className="flex flex-col gap-3">
                {clients?.map((client) => (
                  <div key={client.id} className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300 flex items-center gap-4 p-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-sm font-bold leading-tight truncate">{client.full_name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{client.email} · {client.phone}</p>
                    </div>
                    <div className={cn("px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shrink-0", typeColors[client.type])}>
                      {client.type}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-4">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => openEdit(client, e)}>
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
                {clients?.map((client, index) => (
                  <div
                    key={client.id}
                    className="group bg-card border border-border rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                          <Users className="w-6 h-6 text-accent-foreground" />
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button variant="ghost" size="icon" className="h-8 w-8 bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted" onClick={(e) => openEdit(client, e)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h3 className="font-display text-xl font-bold leading-tight mb-2">{client.full_name}</h3>
                        <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", typeColors[client.type])}>
                          {client.type}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 shrink-0" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 shrink-0" />
                          <span>{client.phone || "No phone provided"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IdCard className="w-4 h-4 shrink-0" />
                          <span>{client.identity_number}</span>
                        </div>
                        {client.address && (
                          <div className="flex items-start gap-2 pt-1">
                            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{client.address}</span>
                          </div>
                        )}
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
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Identity No.</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients?.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-semibold">{client.full_name}</TableCell>
                        <TableCell className="text-muted-foreground">{client.email}</TableCell>
                        <TableCell className="text-muted-foreground">{client.phone || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">{client.identity_number}</TableCell>
                        <TableCell>
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", typeColors[client.type])}>
                            {client.type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => openEdit(client, e)}>
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

            {(!clients || clients.length === 0) && (
              <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">No clients found</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Create your first client to start building your directory.</p>
                <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                  <Plus className="w-4 h-4" /> Add Client
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md border-border/60 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold">{editing ? "Edit Client" : "New Client"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid gap-2">
              <Label htmlFor="full_name" className="text-sm font-semibold">Full Name *</Label>
              <Input 
                id="full_name" 
                value={data.full_name} 
                onChange={e => setData("full_name", e.target.value)} 
                placeholder="e.g. John Doe" 
                className={errors.full_name ? "border-destructive ring-destructive/20" : ""}
              />
              {errors.full_name && <p className="text-[12px] font-medium text-destructive mt-1">{errors.full_name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
              <Input 
                id="email" 
                type="email"
                value={data.email} 
                onChange={e => setData("email", e.target.value)} 
                placeholder="john@example.com" 
                className={errors.email ? "border-destructive ring-destructive/20" : ""}
              />
              {errors.email && <p className="text-[12px] font-medium text-destructive mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-sm font-semibold">Phone</Label>
                <Input 
                  id="phone" 
                  value={data.phone} 
                  onChange={e => setData("phone", e.target.value)} 
                  placeholder="+212 600 000 000" 
                  className={errors.phone ? "border-destructive ring-destructive/20" : ""}
                />
                {errors.phone && <p className="text-[12px] font-medium text-destructive mt-1">{errors.phone}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="identity_number" className="text-sm font-semibold">Identity No. (CIN/Passport) *</Label>
                <Input 
                  id="identity_number" 
                  value={data.identity_number} 
                  onChange={e => setData("identity_number", e.target.value)} 
                  placeholder="AB123456" 
                  className={errors.identity_number ? "border-destructive ring-destructive/20" : ""}
                />
                {errors.identity_number && <p className="text-[12px] font-medium text-destructive mt-1">{errors.identity_number}</p>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type" className="text-sm font-semibold">Type *</Label>
              <Select 
                value={data.type} 
                onValueChange={(value: "Lead" | "Prospect" | "Owner") => setData("type", value)}
              >
                <SelectTrigger className={errors.type ? "border-destructive ring-destructive/20" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Prospect">Prospect</SelectItem>
                  <SelectItem value="Owner">Owner</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-[12px] font-medium text-destructive mt-1">{errors.type}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address" className="text-sm font-semibold">Address</Label>
              <Textarea 
                id="address" 
                value={data.address} 
                onChange={e => setData("address", e.target.value)} 
                placeholder="Client's full address" 
                rows={3} 
                className={errors.address ? "border-destructive ring-destructive/20" : ""}
              />
              {errors.address && <p className="text-[12px] font-medium text-destructive mt-1">{errors.address}</p>}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/40 mt-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} disabled={processing}>Cancel</Button>
            <Button onClick={handleSave} disabled={processing} className="px-8 shadow-sm" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              {processing ? "Saving..." : editing ? "Save Changes" : "Create Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Clients;
