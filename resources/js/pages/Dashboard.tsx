import { Building2, Users, DollarSign, Wrench, Bell, Search, TrendingUp, ShoppingCart, LogOut, User } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Input } from "@/components/ui/input";
import { Link, router, usePage } from '@inertiajs/react';
import KPICard from "@/components/dashboard/KPICard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ChargesChart from "@/components/dashboard/ChargesChart";
import ClientsChart from "@/components/dashboard/ClientsChart";
import PaymentsChart from "@/components/dashboard/PaymentsChart";
import OrdersChart from "@/components/dashboard/OrdersChart";
import OccupancyGauge from "@/components/dashboard/OccupancyGauge";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import PaymentsTable from "@/components/dashboard/PaymentsTable";
import { AuthUser } from "@/types/auth";

const kpis = [
  { label: "Total Properties", value: "124", change: "+12%", trend: "up" as const, icon: Building2, accentClass: "bg-blue-500/10 text-blue-500" },
  { label: "Total Clients", value: "312", change: "+8%", trend: "up" as const, icon: Users, accentClass: "bg-emerald-500/10 text-emerald-500" },
  { label: "Monthly Revenue", value: "€186K", change: "+8.5%", trend: "up" as const, icon: DollarSign, accentClass: "bg-amber-500/10 text-amber-500" },
  { label: "Total Charges", value: "€97K", change: "-3.2%", trend: "down" as const, icon: TrendingUp, accentClass: "bg-purple-500/10 text-purple-500" },
  { label: "Pending Payments", value: "€24K", change: "-15%", trend: "down" as const, icon: ShoppingCart, accentClass: "bg-rose-500/10 text-rose-500" },
  { label: "Open Work Orders", value: "17", change: "-3", trend: "down" as const, icon: Wrench, accentClass: "bg-destructive/10 text-destructive" },
];

const Dashboard = () => {
  const { props } = usePage();
  const user = props.auth?.user as AuthUser | undefined;

  const handleLogout = () => {
    router.post(route('logout'));
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
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
            
            {/* User Menu with Logout */}
            <div className="relative group">
              <button className="flex items-center gap-2 h-8 px-2 rounded-lg hover:bg-muted transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                  {user?.name ? getUserInitials(user.name) : 'MK'}
                </div>
                <User className="w-4 h-4 text-muted-foreground" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                  <p className="text-xs text-primary mt-1">
                    Role: {user?.role || 'user'}
                  </p>
                </div>
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnecter
                  </button>
                </div>
              </div>
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
};

export default Dashboard;
