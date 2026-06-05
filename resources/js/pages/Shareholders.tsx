import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

interface ShareholderRow {
  id: string;
  name: string;
  amount: number;
  blocId: string;
}

interface BlocContext {
  id: string;
  name: string;
  trancheId: string;
  trancheName: string;
  projectId: string;
  projectName: string;
  companyId: string;
  companyName: string;
}

interface Props {
  bloc: BlocContext;
  shareholders: ShareholderRow[];
  totalCapital: number;
}

const formatAmount = (value: number) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatPercentage = (amount: number, total: number) => {
  if (total <= 0) {
    return "0.00%";
  }
  return `${((amount / total) * 100).toFixed(2)}%`;
};

const Shareholders = ({ bloc, shareholders, totalCapital }: Props) => {
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<ShareholderRow | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<ShareholderRow | null>(null);

  const {
    data,
    setData,
    post,
    processing,
    errors,
    reset,
    clearErrors,
  } = useForm({
    name: "",
    amount: "",
  });

  const {
    data: editData,
    setData: setEditData,
    put: editPut,
    processing: editProcessing,
    errors: editErrors,
    reset: editReset,
    clearErrors: editClearErrors,
  } = useForm({
    name: "",
    amount: "",
  });

  const { delete: destroy, processing: deleteProcessing } = useForm({});

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("blocs.shareholders.store", bloc.id), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        clearErrors();
        toast({ title: "Associate contribution added" });
      },
    });
  };

  const openEdit = (row: ShareholderRow) => {
    setEditing(row);
    setEditData({
      name: row.name,
      amount: String(row.amount),
    });
    editClearErrors();
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!editing) {
      return;
    }
    editPut(route("shareholders.update", editing.id), {
      preserveScroll: true,
      onSuccess: () => {
        setEditOpen(false);
        setEditing(null);
        editReset();
        toast({ title: "Associate contribution updated" });
      },
    });
  };

  const handleDelete = () => {
    if (!deleting) {
      return;
    }
    destroy(route("shareholders.destroy", deleting.id), {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteOpen(false);
        setDeleting(null);
        toast({ title: "Associate contribution deleted" });
      },
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-card border-b border-border flex items-center px-6 sticky top-0 z-40">
            <SidebarTrigger className="lg:hidden mr-4" />
            <AppBreadcrumb />
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1200px] space-y-6 animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div>
              <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold flex items-center gap-2">
                <Users className="w-7 h-7 text-primary" />
                Associate Contributions
              </h2>
              <p className="text-[0.9375rem] text-muted-foreground mt-1">
                Apports des associés — {bloc.projectName} / {bloc.trancheName} / {bloc.name}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add an associate</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Associate</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                      placeholder="Associate name"
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Contribution (DH)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={data.amount}
                      onChange={(e) => setData("amount", e.target.value)}
                      placeholder="0.00"
                    />
                    {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <Button type="submit" disabled={processing} className="gap-2 shadow-sm font-semibold border-0" style={{ backgroundColor: "#f59e0b", color: "#1e1e1e" }}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        reset();
                        clearErrors();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-8 mb-4">
                <div>
                    <h3 className="font-display text-xl font-bold">Associate contributions</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total bloc capital: <span className="font-semibold text-foreground">{formatAmount(totalCapital)}</span>
                    </p>
                </div>
            </div>
            
            <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Associate</TableHead>
                      <TableHead>Contribution</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead className="w-[100px]">Edit</TableHead>
                      <TableHead className="w-[100px]">Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shareholders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No associate contributions yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      shareholders.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.name}</TableCell>
                          <TableCell>{formatAmount(row.amount)}</TableCell>
                          <TableCell>{formatPercentage(row.amount, totalCapital)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => openEdit(row)} aria-label="Edit">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setDeleting(row);
                                setDeleteOpen(true);
                              }}
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
            </div>
          </main>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit associate contribution</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Associate</Label>
              <Input
                id="edit-name"
                value={editData.name}
                onChange={(e) => setEditData("name", e.target.value)}
              />
              {editErrors.name && <p className="text-sm text-destructive">{editErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Contribution (DH)</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                min="0.01"
                value={editData.amount}
                onChange={(e) => setEditData("amount", e.target.value)}
              />
              {editErrors.amount && <p className="text-sm text-destructive">{editErrors.amount}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={editProcessing} className="shadow-sm font-semibold border-0" style={{ backgroundColor: "#f59e0b", color: "#1e1e1e" }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete contribution?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {deleting?.name}&apos;s contribution from this bloc.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteProcessing}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default Shareholders;
