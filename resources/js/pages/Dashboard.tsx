import { Building2, Users, DollarSign, Wrench, Bell, Search, TrendingUp, ShoppingCart } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Input } from "@/components/ui/input";
import KPICard from "@/components/dashboard/KPICard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ChargesChart from "@/components/dashboard/ChargesChart";
import ClientsChart from "@/components/dashboard/ClientsChart";
import PaymentsChart from "@/components/dashboard/PaymentsChart";
import OrdersChart from "@/components/dashboard/OrdersChart";
import OccupancyGauge from "@/components/dashboard/OccupancyGauge";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import PaymentsTable from "@/components/dashboard/PaymentsTable";

const kpis = [
  { label: "Total Properties", value: "124", change: "+12%", trend: "up" as const, icon: Building2, accentClass: "bg-blue-500/10 text-blue-500" },
  { label: "Total Clients", value: "312", change: "+8%", trend: "up" as const, icon: Users, accentClass: "bg-emerald-500/10 text-emerald-500" },
  { label: "Monthly Revenue", value: "€186K", change: "+8.5%", trend: "up" as const, icon: DollarSign, accentClass: "bg-amber-500/10 text-amber-500" },
  { label: "Total Charges", value: "€97K", change: "-3.2%", trend: "down" as const, icon: TrendingUp, accentClass: "bg-purple-500/10 text-purple-500" },
  { label: "Pending Payments", value: "€24K", change: "-15%", trend: "down" as const, icon: ShoppingCart, accentClass: "bg-rose-500/10 text-rose-500" },
  { label: "Open Work Orders", value: "17", change: "-3", trend: "down" as const, icon: Wrench, accentClass: "bg-destructive/10 text-destructive" },
];

const Dashboard = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <AppBreadcrumb />
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 h-8 px-3 border border-border rounded-lg bg-background min-w-[12rem]">
              <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <Input className="border-0 bg-transparent shadow-none h-full p-0 text-xs focus-visible:ring-0" placeholder="Search…" />
            </div>
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive border-2 border-card rounded-full" />
            </button>
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold cursor-pointer">
              MK
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-400 bg-background">
          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {kpis.map((k) => <KPICard key={k.label} {...k} />)}
          </div>

          {/* Row 1: Revenue + Charges + Occupancy */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-4">
            <RevenueChart />
            <ChargesChart />
            <OccupancyGauge />
          </div>

          {/* Row 2: Clients + Payments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ClientsChart />
            <PaymentsChart />
          </div>

          {/* Row 3: Orders + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <OrdersChart />
            <ActivityFeed />
          </div>

          {/* Row 4: Payments Table */}
          <PaymentsTable />
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default Dashboard;
