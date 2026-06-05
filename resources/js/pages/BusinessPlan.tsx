import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Calculator, Pencil, Plus, Trash2 } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useCalculatedAmount } from "@/hooks/useCalculatedAmount";
import { formatCurrency, formatPercentage } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface LineItem {
  id: string;
  type: string;
  landSize: number | null;
  unitPrice: number | null;
  amount: number;
  description: string;
  blocId: string;
}

interface DistributionRow {
  name: string;
  contribution: number;
  percentage: number;
  dividend: number;
}

interface Summary {
  totalProducts: number;
  totalCosts: number;
  estimatedProfit: number;
  totalShareholderCapital: number;
  companyGap: number;
  companyName: string;
  shareholderDistributions: DistributionRow[];
  companyDistribution: DistributionRow;
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
  products: LineItem[];
  costs: LineItem[];
  productTypes: string[];
  costTypes: string[];
  summary: Summary;
}

const emptyLineForm = {
  product_type: "",
  cost_type: "",
  land_size: "",
  unit_price: "",
  amount: "",
  description: "",
};

function KpiStrip({ summary }: { summary: Summary }) {
  const profitPositive = summary.estimatedProfit >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-xl bg-card border border-border px-6 py-5 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Charges</p>
        <p className="text-2xl font-bold mt-1 text-foreground">{formatCurrency(summary.totalCosts)}</p>
      </div>
      <div className="rounded-xl bg-card border border-border px-6 py-5 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Produits</p>
        <p className="text-2xl font-bold mt-1 text-foreground">{formatCurrency(summary.totalProducts)}</p>
      </div>
      <div className="rounded-xl bg-card border border-border px-6 py-5 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Profit</p>
        <p className={cn("text-2xl font-bold mt-1", profitPositive ? "text-emerald-500" : "text-rose-500")}>
          {formatCurrency(summary.estimatedProfit)}
        </p>
      </div>
    </div>
  );
}

interface LineSectionProps {
  title: string;
  addLabel: string;
  typeLabel: string;
  typeField: "product_type" | "cost_type";
  types: string[];
  items: LineItem[];
  storeRoute: string;
  updateRoute: (id: string) => string;
  destroyRoute: (id: string) => string;
  blocId: string;
  accentClass: string;
}

function LineSection({
  title,
  addLabel,
  typeLabel,
  typeField,
  types,
  items,
  storeRoute,
  updateRoute,
  destroyRoute,
  blocId,
  accentClass,
}: LineSectionProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<LineItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<LineItem | null>(null);

  const form = useForm({
    ...emptyLineForm,
    [typeField]: types[0] ?? "",
  });

  const editForm = useForm({
    ...emptyLineForm,
    [typeField]: "",
  });

  const { delete: destroy, processing: deleteProcessing } = useForm({});

  const createCalc = useCalculatedAmount(
    {
      land_size: form.data.land_size,
      unit_price: form.data.unit_price,
      amount: form.data.amount,
    },
    form.setData,
  );

  const editCalc = useCalculatedAmount(
    {
      land_size: editForm.data.land_size,
      unit_price: editForm.data.unit_price,
      amount: editForm.data.amount,
    },
    editForm.setData,
  );

  const submitPayload = (data: typeof form.data) => ({
    [typeField]: data[typeField as keyof typeof data],
    land_size: data.land_size || null,
    unit_price: data.unit_price || null,
    amount: data.amount,
    description: data.description || null,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    form.transform(() => submitPayload(form.data));
    form.post(storeRoute, {
      preserveScroll: true,
      onSuccess: () => {
        form.reset();
        form.setData(typeField, types[0] ?? "");
        createCalc.resetManualAmount();
        toast({ title: `${addLabel} added` });
      },
    });
  };

  const openEdit = (row: LineItem) => {
    setEditing(row);
    editForm.setData({
      product_type: row.type,
      cost_type: row.type,
      land_size: row.landSize !== null ? String(row.landSize) : "",
      unit_price: row.unitPrice !== null ? String(row.unitPrice) : "",
      amount: String(row.amount),
      description: row.description,
    });
    editForm.setData(typeField, row.type);
    editCalc.resetManualAmount();
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!editing) return;
    editForm.transform(() => submitPayload(editForm.data));
    editForm.put(updateRoute(editing.id), {
      preserveScroll: true,
      onSuccess: () => {
        setEditOpen(false);
        setEditing(null);
        editForm.reset();
        toast({ title: `${addLabel} updated` });
      },
    });
  };

  const handleDelete = () => {
    if (!deleting) return;
    destroy(destroyRoute(deleting.id), {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteOpen(false);
        setDeleting(null);
        toast({ title: `${addLabel} deleted` });
      },
    });
  };

  return (
    <div className="mt-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-2 lg:col-span-1">
            <Label>{typeLabel}</Label>
            <Select
              value={form.data[typeField]}
              onValueChange={(v) => form.setData(typeField, v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.errors[typeField] && (
              <p className="text-sm text-destructive">{form.errors[typeField]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Superficie</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.data.land_size}
              onChange={(e) => {
                createCalc.resetManualAmount();
                form.setData("land_size", e.target.value);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Prix unitaire</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.data.unit_price}
              onChange={(e) => {
                createCalc.resetManualAmount();
                form.setData("unit_price", e.target.value);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Montant</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.data.amount}
              onChange={(e) => createCalc.onAmountChange(e.target.value)}
            />
            {form.errors.amount && <p className="text-sm text-destructive">{form.errors.amount}</p>}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={form.data.description}
              onChange={(e) => form.setData("description", e.target.value)}
              rows={2}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex gap-2">
            <Button type="submit" disabled={form.processing} className="shadow-sm font-semibold border-0 gap-2" style={{ backgroundColor: "#f59e0b", color: "#1e1e1e" }}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                form.setData(typeField, types[0] ?? "");
                createCalc.resetManualAmount();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
        </CardContent>
      </Card>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display text-xl font-bold">{typeLabel}s</h3>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{typeLabel}</TableHead>
              <TableHead>Superficie</TableHead>
              <TableHead>Prix unitaire</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[90px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                  No entries yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.type}</TableCell>
                  <TableCell>{row.landSize !== null ? row.landSize.toFixed(2) : "—"}</TableCell>
                  <TableCell>{row.unitPrice !== null ? formatCurrency(row.unitPrice) : "—"}</TableCell>
                  <TableCell>{formatCurrency(row.amount)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{row.description || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(row)} aria-label="Edit">
                        <Pencil className="w-4 h-4" />
                      </Button>
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
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit {addLabel}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>{typeLabel}</Label>
              <Select
                value={editForm.data[typeField]}
                onValueChange={(v) => editForm.setData(typeField, v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Superficie</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.data.land_size}
                  onChange={(e) => {
                    editCalc.resetManualAmount();
                    editForm.setData("land_size", e.target.value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Prix unitaire</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.data.unit_price}
                  onChange={(e) => {
                    editCalc.resetManualAmount();
                    editForm.setData("unit_price", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Montant</Label>
              <Input
                type="number"
                step="0.01"
                value={editForm.data.amount}
                onChange={(e) => editCalc.onAmountChange(e.target.value)}
              />
              {editForm.errors.amount && (
                <p className="text-sm text-destructive">{editForm.errors.amount}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editForm.data.description}
                onChange={(e) => editForm.setData("description", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={editForm.processing} className="shadow-sm font-semibold border-0" style={{ backgroundColor: "#f59e0b", color: "#1e1e1e" }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this line?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteProcessing}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const BusinessPlan = ({ bloc, products, costs, productTypes, costTypes, summary }: Props) => {
  const distributionRows: DistributionRow[] = [
    ...summary.shareholderDistributions,
    summary.companyDistribution,
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-card border-b border-border flex items-center px-6 sticky top-0 z-40">
            <SidebarTrigger className="lg:hidden mr-4" />
            <AppBreadcrumb />
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] space-y-8 animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div>
              <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold flex items-center gap-2">
                <Calculator className="w-7 h-7 text-primary" />
                Etude Provisoire
              </h2>
              <p className="text-[0.9375rem] text-muted-foreground mt-1">
                {bloc.projectName} — {bloc.trancheName} — {bloc.name}
              </p>
            </div>

            <KpiStrip summary={summary} />

            <LineSection
              title="Ajouter PRODUIT"
              addLabel="Product"
              typeLabel="Type produit"
              typeField="product_type"
              types={productTypes}
              items={products}
              storeRoute={route("blocs.business-plan.products.store", bloc.id)}
              updateRoute={(id) => route("business-plan.products.update", id)}
              destroyRoute={(id) => route("business-plan.products.destroy", id)}
              blocId={bloc.id}
              accentClass="bg-blue-600"
            />

            <LineSection
              title="Ajouter CHARGE"
              addLabel="Cost"
              typeLabel="Type charge"
              typeField="cost_type"
              types={costTypes}
              items={costs}
              storeRoute={route("blocs.business-plan.costs.store", bloc.id)}
              updateRoute={(id) => route("business-plan.costs.update", id)}
              destroyRoute={(id) => route("business-plan.costs.destroy", id)}
              blocId={bloc.id}
              accentClass="bg-red-600"
            />

            <div className="mt-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display text-xl font-bold">Les apports des associés — Répartition du bénéfice</h3>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Associé</TableHead>
                      <TableHead>Apport</TableHead>
                      <TableHead>Pourcentage</TableHead>
                      <TableHead>Bénéfice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {distributionRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                          No shareholder or company allocation data.
                        </TableCell>
                      </TableRow>
                    ) : (
                      distributionRows.map((row, index) => (
                        <TableRow key={`${row.name}-${index}`}>
                          <TableCell className="font-medium">{row.name}</TableCell>
                          <TableCell>{formatCurrency(row.contribution)}</TableCell>
                          <TableCell>{formatPercentage(row.percentage)}</TableCell>
                          <TableCell>{formatCurrency(row.dividend)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BusinessPlan;
