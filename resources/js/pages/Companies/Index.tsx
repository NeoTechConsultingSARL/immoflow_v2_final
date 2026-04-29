import React from "react";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Building2, Plus, Pencil, Trash2 } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface Company {
  id: string;
  name: string;
  status: string;
  status_label: string;
  created_at: string;
}

interface PageProps {
  [key: string]: any;
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
  ziggy: any;
  companies: Company[];
  statusOptions: Record<string, string>;
  flash?: {
    success?: string;
    error?: string;
  };
}

const Companies = () => {
  const { props } = usePage<PageProps>();
  const { companies, statusOptions, flash } = props;
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [deleting, setDeleting] = useState<Company | null>(null);
  const [form, setForm] = useState({ name: '', status: 'active' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Show flash messages
  React.useEffect(() => {
    if (flash?.success) {
      toast({ title: flash.success });
    }
    if (flash?.error) {
      toast({ title: flash.error, variant: "destructive" });
    }
  }, [flash]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', status: 'active' });
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (company: Company) => {
    setEditing(company);
    setForm({ name: company.name, status: company.status });
    setErrors({});
    setDialogOpen(true);
  };

  const openDelete = (company: Company) => {
    setDeleting(company);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    const url = editing ? `/companies/${editing.id}` : '/companies';
    const method = editing ? 'put' : 'post';
    
    router[method](url, form, {
      onSuccess: () => {
        setDialogOpen(false);
        setErrors({});
      },
      onError: (errors) => {
        setErrors(errors);
      },
    });
  };

  const handleDelete = () => {
    if (deleting) {
      router.delete(`/companies/${deleting.id}`, {
        onSuccess: () => {
          setDeleteOpen(false);
          setDeleting(null);
        },
      });
    }
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <AppBreadcrumb />
            </div>
            <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              <Plus className="w-4 h-4" />
              Add Company
            </Button>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="mb-6">
              <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Manage Companies</h2>
              <p className="text-[0.9375rem] text-muted-foreground">View, create, edit, and remove companies from your portfolio.</p>
            </div>

            {/* Companies Table */}
            <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 font-semibold text-sm">Name</th>
                      <th className="text-left p-4 font-semibold text-sm">Status</th>
                      <th className="text-left p-4 font-semibold text-sm">Created</th>
                      <th className="text-right p-4 font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((company) => (
                      <tr key={company.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold">
                              {company.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{company.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            company.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                          }`}>
                            {company.status_label}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{company.created_at}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-foreground" 
                              onClick={() => openEdit(company)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {companies.length === 0 && (
                <div className="text-center py-20">
                  <Building2 className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                  <h3 className="font-display text-lg font-bold mb-1">No companies yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add your first company to get started.</p>
                  <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                    <Plus className="w-4 h-4" /> Add Company
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{editing ? "Edit Company" : "New Company"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input 
                id="name" 
                value={form.name} 
                onChange={e => updateField("name", e.target.value)} 
                placeholder="e.g. Keller Immobilien GmbH" 
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={form.status} onValueChange={(value) => updateField("status", value)}>
                <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusOptions).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
              {editing ? "Save Changes" : "Create Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The company and all associated data will be permanently removed.
            </AlertDialogDescription>
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

export default Companies;
