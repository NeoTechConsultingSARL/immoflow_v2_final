import { router, usePage, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Users, Plus, Pencil, Phone, Mail, Building2, MapPin, Search, Filter, Eye, LayoutGrid, Table as TableIcon, Rows3 } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Client {
  id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  identity_number: string | null;
  address: string | null;
  type: string;
  created_at: string;
}

interface ClientsProps {
  clients: { data: Client[]; current_page: number; last_page: number; };
  filters: {
    search?: string;
    type?: string;
  };
}

const typeStyles: Record<string, string> = {
  "individual": "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
  "company": "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800",
  "lead": "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800",
  "prospect": "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800",
  "owner": "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800",
};

const typeLabels: Record<string, string> = {
  "individual": "Individual",
  "company": "Company",
  "lead": "Lead",
  "prospect": "Prospect",
  "owner": "Owner",
};

const Index = ({ clients, filters }: ClientsProps) => {
  const { flash } = usePage().props as any;
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [typeFilter, setTypeFilter] = useState(filters.type || "");

  useEffect(() => {
    if (flash?.success) {
      toast({ title: flash.success });
    }
    if (flash?.error) {
      toast({ title: flash.error, variant: "destructive" });
    }
  }, [flash]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (typeFilter) params.append('type', typeFilter);
    
    router.get(route('clients.index'), params.toString(), {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const openCreate = () => {
    router.visit(route('clients.create'));
  };

  const openEdit = (client: Client) => {
    router.visit(route('clients.edit', client.id));
  };

  const openShow = (client: Client) => {
    router.visit(route('clients.show', client.id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Clients</h2>
                <p className="text-[0.9375rem] text-muted-foreground">Manage your client directory and contact information.</p>
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {Object.entries(typeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch} variant="outline" className="gap-2">
                <Filter className="w-4 h-4" /> Filter
              </Button>
            </div>

            {viewMode === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.data.map((client) => (
                  <div key={client.id} className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-accent-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg leading-tight">{client.full_name}</h3>
                            <span className={cn("text-[0.625rem] font-semibold px-2 py-0.5 rounded-full inline-block mt-1", typeStyles[client.type] || "bg-muted")}>
                              {typeLabels[client.type] || client.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {client.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="truncate">{client.email}</span>
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                        {client.identity_number && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>ID: {client.identity_number}</span>
                          </div>
                        )}
                        {client.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate">{client.address}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                        <Button variant="ghost" size="sm" className="gap-1 flex-1" onClick={() => openShow(client)}>
                          <Eye className="w-3.5 h-3.5" /> View
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 flex-1" onClick={() => openEdit(client)}>
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </Button>
                      </div>
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
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>ID Number</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.data.map((client) => (
                      <TableRow key={client.id} className="cursor-pointer" onClick={() => openShow(client)}>
                        <TableCell className="font-semibold">{client.full_name}</TableCell>
                        <TableCell>
                          <span className={cn("text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full", typeStyles[client.type] || "bg-muted")}>
                            {typeLabels[client.type] || client.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{client.email || '-'}</TableCell>
                        <TableCell className="text-muted-foreground">{client.phone || '-'}</TableCell>
                        <TableCell className="text-muted-foreground">{client.identity_number || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); openEdit(client); }}>
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

            {clients.data.length === 0 && (
              <div className="text-center py-20">
                <Users className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-display text-lg font-bold mb-1">No clients found</h3>
                <p className="text-sm text-muted-foreground mb-4">Get started by adding your first client to the directory.</p>
                <Button onClick={openCreate} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                  <Plus className="w-4 h-4" /> Add Client
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
