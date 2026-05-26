import { useState, useEffect } from "react";
import { router, Link, usePage } from "@inertiajs/react";
import { Users, Plus, Pencil, Trash2, FileText, Calendar, Euro, Phone, Mail, LayoutGrid, Rows3, Table as TableIcon, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ClientContract {
  id: string;
  contractNumber: string;
  clientName: string;
  email: string;
  phone: string;
  property: string;
  type: "Sale" | "Rental" | "Reservation";
  startDate: string;
  endDate: string;
  amount: string;
  status: "Active" | "Pending" | "Completed" | "Expired";
  clientId?: string;
  propertyId?: string;
  blocId?: string;
}

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-600",
  Pending: "bg-amber-500/10 text-amber-600",
  Completed: "bg-blue-500/10 text-blue-600",
  Expired: "bg-muted text-muted-foreground",
};

const typeStyles: Record<string, string> = {
  Sale: "bg-violet-500/10 text-violet-600",
  Rental: "bg-sky-500/10 text-sky-600",
  Reservation: "bg-orange-500/10 text-orange-600",
};

type ViewMode = "list" | "grid" | "table";

const emptyForm = {
  // Client
  clientMode: "new" as "new" | "existing",
  existingClientId: "",
  firstName: "",
  lastName: "",
  idNumber: "",
  birthdate: "",
  email: "",
  phone: "",
  address: "",
  // Contract
  contractNumber: "",
  propertyType: "",
  property: "",
  type: "Sale" as ClientContract["type"],
  startDate: "",
  endDate: "",
  amount: "",
  status: "Active" as ClientContract["status"],
};

const existingClients: any[] = [];

const propertiesByType: Record<string, string[]> = {
  Apartment: ["Unit A1 — Residenz am Englischen Garten", "Unit B1 — Residenz am Englischen Garten", "Loft 101 — Spree Lofts", "Studio 201 — Spree Lofts"],
  Villa: ["Villa Rosengarten", "Villa Seeblick", "Villa am Park"],
  Penthouse: ["Sky Penthouse — Spree Lofts", "Crown Penthouse — Tower One"],
  Office: ["Office 101", "Office 204", "Office Suite 5A"],
  Land: ["Plot B-7 — Spree Lofts", "Plot C-12 — Greenfield"],
};

interface ClientContractsProps {
  dbContracts?: ClientContract[];
}

const ClientContracts = ({ dbContracts = [] }: ClientContractsProps) => {
  const [contracts, setContracts] = useState<ClientContract[]>(dbContracts);

  useEffect(() => {
    setContracts(dbContracts);
  }, [dbContracts]);

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<ClientContract | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { url } = usePage();
  const location = new URL(url || "/", window.location.origin);
  const searchParams = location.searchParams;
  const projectName = searchParams.get("name") || "";

  const openContract = (c: ClientContract) => {
    const qs = searchParams.toString();
    router.visit(`/blocs/${c.blocId}/contracts/${c.id}${qs ? `?${qs}` : ""}`);
  };
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const openCreate = () => {
    const qs = searchParams.toString();
    router.visit(`/contract-create${qs ? `?${qs}` : ""}`);
  };

  const openEdit = (c: ClientContract) => {
    const qs = searchParams.toString();
    router.visit(`/contracts/${c.id}/edit${qs ? `?${qs}` : ""}`);
  };

  const openDelete = (c: ClientContract) => { setDeleting(c); setDeleteOpen(true); };

  const handleDelete = () => {
    if (deleting) {
      router.delete(`/blocs/${deleting.blocId}/contracts/${deleting.id}`, {
        onSuccess: () => {
          toast({ title: "Contract deleted" });
          setDeleteOpen(false);
          setDeleting(null);
        },
        onError: (err) => {
          toast({ title: "Failed to delete contract", variant: "destructive" });
        }
      });
    }
  };

  const filtered = filterStatus === "all" ? contracts : contracts.filter(c => c.status === filterStatus);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const goTo = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));
  const pageNumbers: (number | "ellipsis")[] = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const arr: (number | "ellipsis")[] = [1];
    if (currentPage > 3) arr.push("ellipsis");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) arr.push(i);
    if (currentPage < totalPages - 2) arr.push("ellipsis");
    arr.push(totalPages);
    return arr;
  })();

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
              <Plus className="w-4 h-4" /> New Contract
            </Button>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Clients & Contracts</h2>
                <p className="text-[0.9375rem] text-muted-foreground">
                  {projectName ? `Manage contracts for ${decodeURIComponent(projectName)}` : "Manage all client contracts and agreements"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as ViewMode)} className="bg-muted rounded-lg p-0.5">
                  <ToggleGroupItem value="list" aria-label="List view" className="px-2.5 py-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md">
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

            {/* List View */}
            {viewMode === "list" && (
              <div className="flex flex-col gap-3">
                {paged.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => openContract(c)}
                    className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:border-accent/40 transition-all duration-300 flex items-center gap-4 p-4 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-sm font-bold leading-tight truncate">{c.clientName}</h3>
                        <span className="text-xs text-muted-foreground">· {c.contractNumber}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.property}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{c.startDate}</span>
                      <span className={cn("text-[0.625rem] font-semibold px-2 py-0.5 rounded-full", typeStyles[c.type])}>{c.type}</span>
                    </div>
                    <span className="text-sm font-semibold shrink-0">{c.amount}</span>
                    <span className={cn("text-[0.625rem] font-semibold px-2 py-0.5 rounded-full shrink-0", statusStyles[c.status])}>
                      {c.status}
                    </span>
                    <div className="flex items-center gap-1 shrink-0" onClick={stop}>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => openEdit(c)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => openDelete(c)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paged.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => openContract(c)}
                    className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elevated)] hover:border-accent/40 transition-all duration-300 flex flex-col cursor-pointer"
                  >
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-1" onClick={stop}>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => openEdit(c)}>
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => openDelete(c)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-display text-base font-bold leading-tight">{c.clientName}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.contractNumber}</p>
                      <p className="text-xs text-foreground/80 mt-2 line-clamp-1">{c.property}</p>
                      <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mt-3">
                        <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /><span className="truncate">{c.email}</span></span>
                        <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{c.phone}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{c.startDate} → {c.endDate}</span>
                      </div>
                      <div className="mt-3">
                        <span className={cn("text-[0.625rem] font-semibold px-2 py-0.5 rounded-full", typeStyles[c.type])}>{c.type}</span>
                      </div>
                    </div>
                    <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
                      <span className="text-sm font-semibold flex items-center gap-1"><Euro className="w-3.5 h-3.5" />{c.amount.replace("€", "")}</span>
                      <span className={cn("text-[0.625rem] font-semibold px-2 py-0.5 rounded-full", statusStyles[c.status])}>
                        {c.status}
                      </span>
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
                      <TableHead>Contract #</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paged.map((c) => (
                      <TableRow key={c.id} onClick={() => openContract(c)} className="cursor-pointer">
                        <TableCell className="font-mono text-xs">{c.contractNumber}</TableCell>
                        <TableCell className="font-semibold">{c.clientName}</TableCell>
                        <TableCell className="max-w-[220px] truncate">{c.property}</TableCell>
                        <TableCell>
                          <span className={cn("text-[0.625rem] font-semibold px-2 py-0.5 rounded-full", typeStyles[c.type])}>{c.type}</span>
                        </TableCell>
                        <TableCell>{c.startDate}</TableCell>
                        <TableCell>{c.endDate}</TableCell>
                        <TableCell className="font-semibold">{c.amount}</TableCell>
                        <TableCell>
                          <span className={cn("text-[0.625rem] font-semibold px-2 py-0.5 rounded-full", statusStyles[c.status])}>
                            {c.status}
                          </span>
                        </TableCell>
                        <TableCell onClick={stop}>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => openEdit(c)}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => openDelete(c)}>
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


            {filtered.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>
                    Showing <span className="font-semibold text-foreground">{(currentPage - 1) * pageSize + 1}</span>–
                    <span className="font-semibold text-foreground">{Math.min(currentPage * pageSize, filtered.length)}</span> of{" "}
                    <span className="font-semibold text-foreground">{filtered.length}</span>
                  </span>
                  <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                    <SelectTrigger className="w-[110px] h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 / page</SelectItem>
                      <SelectItem value="10">10 / page</SelectItem>
                      <SelectItem value="20">20 / page</SelectItem>
                      <SelectItem value="50">50 / page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Pagination className="mx-0 w-auto justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => { e.preventDefault(); goTo(currentPage - 1); }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {pageNumbers.map((p, i) =>
                      p === "ellipsis" ? (
                        <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
                      ) : (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href="#"
                            isActive={p === currentPage}
                            onClick={(e) => { e.preventDefault(); goTo(p); }}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => { e.preventDefault(); goTo(currentPage + 1); }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <Users className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-display text-lg font-bold mb-1">No contracts found</h3>
                <p className="text-sm text-muted-foreground mb-4">Add a contract to get started.</p>
                <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                  <Plus className="w-4 h-4" /> New Contract
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete contract {deleting?.contractNumber}?</AlertDialogTitle>
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

export default ClientContracts;
