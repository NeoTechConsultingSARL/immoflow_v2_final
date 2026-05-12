import { router, usePage, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { FolderKanban, Plus, Pencil, Building2, MapPin, Calendar, Euro, LayoutGrid, FileText, ClipboardList, X, Rows3, Table as TableIcon, Eye } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Contract {
  id: number;
  client_id: number;
  property_id: number;
  status: string;
  price: string;
  date: string;
  client: { id: number; full_name: string; };
  property: {
    id: number;
    name: string;
    bloc?: {
      name: string;
      tranche?: {
        name: string;
        project?: {
          name: string;
          company?: {
            name: string;
          }
        }
      }
    }
  };
}

interface ContractsProps {
  contracts: { data: Contract[]; current_page: number; last_page: number; };
}

const statusStyles: Record<string, string> = {
  "active": "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800",
  "completed": "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
  "cancelled": "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800",
  "draft": "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800",
};

const Index = ({ contracts }: ContractsProps) => {
  const { flash } = usePage().props as any;
  const [viewMode, setViewMode] = useState<"card" | "table">("table");

  useEffect(() => {
    if (flash?.success) {
      toast({ title: flash.success });
    }
    if (flash?.error) {
      toast({ title: flash.error, variant: "destructive" });
    }
  }, [flash]);

  const openCreate = () => {
    router.visit(route('contracts.create'));
  };

  const getFullPropertyPath = (property: Contract['property']) => {
    if (!property) return "N/A";
    const parts = [];
    if (property.bloc?.tranche?.project?.company) parts.push(property.bloc.tranche.project.company.name);
    if (property.bloc?.tranche?.project) parts.push(property.bloc.tranche.project.name);
    if (property.bloc?.tranche) parts.push(property.bloc.tranche.name);
    if (property.bloc) parts.push(property.bloc.name);
    parts.push(property.name);
    return parts.join(' > ');
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
              <Plus className="w-4 h-4" /> Add Contract
            </Button>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Contracts</h2>
                <p className="text-[0.9375rem] text-muted-foreground">Manage client contracts and property reservations.</p>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as "card" | "table")} className="bg-muted rounded-lg p-0.5">
                  <ToggleGroupItem value="card" aria-label="Card view" className="px-2.5 py-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md">
                    <Rows3 className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="table" aria-label="Table view" className="px-2.5 py-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md">
                    <TableIcon className="w-4 h-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {viewMode === "card" && (
              <div className="flex flex-col gap-3">
                {contracts.data.map((contract) => (
                  <div key={contract.id} className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300 flex items-center gap-4 p-4 cursor-pointer" onClick={() => router.visit(route('contracts.show', contract.id))}>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-sm font-bold leading-tight truncate">{contract.client?.full_name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{getFullPropertyPath(contract.property)}</p>
                    </div>
                    <div className="text-sm font-semibold">{contract.price ? `€${contract.price}` : '-'}</div>
                    <span className={cn("text-[0.625rem] font-semibold px-2 py-0.5 rounded-full shrink-0", statusStyles[contract.status.toLowerCase()] || "bg-muted")}>
                      {contract.status}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); router.visit(route('contracts.edit', contract.id)); }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === "table" && (
              <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.data.map((contract) => (
                      <TableRow key={contract.id} className="cursor-pointer" onClick={() => router.visit(route('contracts.show', contract.id))}>
                        <TableCell className="font-semibold">{contract.client?.full_name}</TableCell>
                        <TableCell className="text-muted-foreground max-w-[300px] truncate" title={getFullPropertyPath(contract.property)}>
                          {getFullPropertyPath(contract.property)}
                        </TableCell>
                        <TableCell>
                          <span className={cn("text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full", statusStyles[contract.status.toLowerCase()] || "bg-muted")}>
                            {contract.status}
                          </span>
                        </TableCell>
                        <TableCell>{contract.price ? `€${contract.price}` : '-'}</TableCell>
                        <TableCell>{contract.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); router.visit(route('contracts.edit', contract.id)); }}>
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

            {contracts.data.length === 0 && (
              <div className="text-center py-20">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-display text-lg font-bold mb-1">No contracts found</h3>
                <p className="text-sm text-muted-foreground mb-4">Create a contract to link a client to a property.</p>
                <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                  <Plus className="w-4 h-4" /> Add Contract
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
