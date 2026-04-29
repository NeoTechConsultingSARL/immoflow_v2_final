import { useState, useMemo } from "react";
import { UserPlus, Building2, FileText, Trash2, Pencil, Plus, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { format } from "date-fns";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface HistoryEntry {
  id: string;
  action: string;
  icon: React.ElementType;
  createdBy: string;
  date: Date;
  category: "client" | "property" | "project" | "user" | "settings";
}

const mockHistory: HistoryEntry[] = [
  { id: "1", action: "New client created: Al Futtaim Group", icon: UserPlus, createdBy: "Admin", date: new Date(2026, 2, 5, 12, 8), category: "client" },
  { id: "2", action: "Property added: Unit 204, Tower B", icon: Plus, createdBy: "Admin", date: new Date(2026, 2, 5, 11, 45), category: "property" },
  { id: "3", action: "Project updated: Residenz am Englischen Garten", icon: Pencil, createdBy: "Sarah Miller", date: new Date(2026, 2, 5, 10, 30), category: "project" },
  { id: "4", action: "Property type deleted: Warehouse", icon: Trash2, createdBy: "Admin", date: new Date(2026, 2, 5, 9, 15), category: "settings" },
  { id: "5", action: "New user registered: Sarah Miller", icon: UserPlus, createdBy: "System", date: new Date(2026, 2, 4, 16, 22), category: "user" },
  { id: "6", action: "Project created: Marina Heights", icon: Plus, createdBy: "Admin", date: new Date(2026, 2, 4, 14, 10), category: "project" },
  { id: "7", action: "Client updated: Emaar Properties", icon: Pencil, createdBy: "Sarah Miller", date: new Date(2026, 2, 4, 11, 5), category: "client" },
  { id: "8", action: "Property sold: Villa 12, Palm Jumeirah", icon: FileText, createdBy: "Admin", date: new Date(2026, 2, 3, 15, 40), category: "property" },
  { id: "9", action: "New property type created: Townhouse", icon: Plus, createdBy: "John Doe", date: new Date(2026, 2, 3, 13, 20), category: "settings" },
  { id: "10", action: "New client created: Dubai Holdings", icon: UserPlus, createdBy: "Admin", date: new Date(2026, 2, 3, 9, 0), category: "client" },
  { id: "11", action: "Project deleted: Old Archive", icon: Trash2, createdBy: "John Doe", date: new Date(2026, 2, 2, 17, 30), category: "project" },
  { id: "12", action: "Property updated: Apt 501, Creek Tower", icon: Pencil, createdBy: "Sarah Miller", date: new Date(2026, 2, 2, 10, 15), category: "property" },
  { id: "13", action: "User role changed: John Doe → Admin", icon: UserPlus, createdBy: "Admin", date: new Date(2026, 2, 1, 14, 0), category: "user" },
  { id: "14", action: "Property added: Unit 101, Bay Tower", icon: Plus, createdBy: "John Doe", date: new Date(2026, 2, 1, 11, 30), category: "property" },
  { id: "15", action: "Client created: Nakheel Group", icon: UserPlus, createdBy: "Admin", date: new Date(2026, 2, 1, 9, 45), category: "client" },
];

const categoryColors: Record<string, string> = {
  client: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-transparent",
  property: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-transparent",
  project: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-transparent",
  user: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-transparent",
  settings: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-transparent",
};

function formatDateTime(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const entryDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (entryDay.getTime() === today.getTime()) return `Today ${time}`;
  if (entryDay.getTime() === yesterday.getTime()) return `Yesterday ${time}`;
  return `${format(date, "dd MMM yyyy")} ${time}`;
}

const History = () => {
  
  const [userFilter, setUserFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [page, setPage] = useState(1);
  const perPage = 10;

  const uniqueUsers = useMemo(() => {
    const users = new Set(mockHistory.map(e => e.createdBy));
    return Array.from(users).sort();
  }, []);

  const filtered = useMemo(() => {
    return mockHistory.filter(entry => {
      if (userFilter !== "all" && entry.createdBy !== userFilter) return false;
      if (dateFrom) {
        const from = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate());
        if (entry.date < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 23, 59, 59);
        if (entry.date > to) return false;
      }
      return true;
    });
  }, [userFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Reset page when filters change
  useMemo(() => { setPage(1); }, [userFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setUserFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasFilters = userFilter !== "all" || dateFrom || dateTo;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-card border-b border-border flex items-center px-6 sticky top-0 z-40">
            <SidebarTrigger className="lg:hidden mr-4" />
            <AppBreadcrumb />
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1100px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="mb-6">
              <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Activity History</h2>
              <p className="text-[0.9375rem] text-muted-foreground">A log of all actions performed in the system.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map(u => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[160px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd MMM yyyy") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[160px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd MMM yyyy") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>

              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                  Clear filters
                </Button>
              )}
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((entry) => {
                    const Icon = entry.icon;
                    return (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${categoryColors[entry.category]}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-medium">{entry.action}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className={cn("capitalize text-xs", categoryColors[entry.category])}>
                            {entry.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{entry.createdBy}</TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                          {formatDateTime(entry.date)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {paginated.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No activity found matching the selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-muted-foreground">
                Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} entries
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8 text-xs"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default History;
