import { router } from "@inertiajs/react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Home, DollarSign, Users, XCircle, Briefcase, BarChart3, Building, Car, GitBranch, HardHat, FileText, ChevronRight } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";

const tiles = [
  { id: "properties", label: "List Properties", description: "Browse and manage all property units", icon: Home, bg: "bg-card", hoverBg: "hover:bg-gradient-to-br hover:from-emerald-500/80 hover:to-emerald-700/80", iconColor: "text-emerald-600", hoverIconColor: "group-hover:text-white", textColor: "text-foreground", hoverTextColor: "group-hover:text-white/90", subTextColor: "text-muted-foreground", hoverSubTextColor: "group-hover:text-white/60", iconWrapBg: "bg-emerald-500/10", hoverIconWrapBg: "group-hover:bg-white/10" },
  { id: "finance", label: "Project Finance", description: "Track budgets, expenses and revenue", icon: DollarSign, bg: "bg-card", hoverBg: "hover:bg-gradient-to-br hover:from-slate-500/80 hover:to-slate-700/80", iconColor: "text-slate-600", hoverIconColor: "group-hover:text-white", textColor: "text-foreground", hoverTextColor: "group-hover:text-white/90", subTextColor: "text-muted-foreground", hoverSubTextColor: "group-hover:text-white/60", iconWrapBg: "bg-slate-500/10", hoverIconWrapBg: "group-hover:bg-white/10" },
  { id: "clients", label: "Clients & Contracts", description: "Manage client relationships and agreements", icon: Users, bg: "bg-card", hoverBg: "hover:bg-gradient-to-br hover:from-blue-500/80 hover:to-blue-700/80", iconColor: "text-blue-600", hoverIconColor: "group-hover:text-white", textColor: "text-foreground", hoverTextColor: "group-hover:text-white/90", subTextColor: "text-muted-foreground", hoverSubTextColor: "group-hover:text-white/60", iconWrapBg: "bg-blue-500/10", hoverIconWrapBg: "group-hover:bg-white/10" },
  { id: "cancelled", label: "Cancelled Contracts", description: "Review and archive cancelled agreements", icon: XCircle, bg: "bg-card", hoverBg: "hover:bg-gradient-to-br hover:from-rose-400/80 hover:to-rose-600/80", iconColor: "text-rose-500", hoverIconColor: "group-hover:text-white", textColor: "text-foreground", hoverTextColor: "group-hover:text-white/90", subTextColor: "text-muted-foreground", hoverSubTextColor: "group-hover:text-white/60", iconWrapBg: "bg-rose-500/10", hoverIconWrapBg: "group-hover:bg-white/10" },
  { id: "employees", label: "Employee Contracts", description: "Oversee staff assignments and contracts", icon: Briefcase, bg: "bg-card", hoverBg: "hover:bg-gradient-to-br hover:from-amber-500/80 hover:to-amber-700/80", iconColor: "text-amber-600", hoverIconColor: "group-hover:text-white", textColor: "text-foreground", hoverTextColor: "group-hover:text-white/90", subTextColor: "text-muted-foreground", hoverSubTextColor: "group-hover:text-white/60", iconWrapBg: "bg-amber-500/10", hoverIconWrapBg: "group-hover:bg-white/10" },
  { id: "statistics", label: "Statistics", description: "View analytics and performance metrics", icon: BarChart3, bg: "bg-card", hoverBg: "hover:bg-gradient-to-br hover:from-teal-500/80 hover:to-teal-700/80", iconColor: "text-teal-600", hoverIconColor: "group-hover:text-white", textColor: "text-foreground", hoverTextColor: "group-hover:text-white/90", subTextColor: "text-muted-foreground", hoverSubTextColor: "group-hover:text-white/60", iconWrapBg: "bg-teal-500/10", hoverIconWrapBg: "group-hover:bg-white/10" },
  { id: "syndicats", label: "Syndicats Management", description: "Coordinate syndicate operations", icon: Building, bg: "bg-card", hoverBg: "hover:bg-gradient-to-br hover:from-violet-500/80 hover:to-violet-700/80", iconColor: "text-violet-600", hoverIconColor: "group-hover:text-white", textColor: "text-foreground", hoverTextColor: "group-hover:text-white/90", subTextColor: "text-muted-foreground", hoverSubTextColor: "group-hover:text-white/60", iconWrapBg: "bg-violet-500/10", hoverIconWrapBg: "group-hover:bg-white/10" },
  { id: "parking", label: "Parking", description: "Allocate and manage parking spaces", icon: Car, bg: "bg-card", hoverBg: "hover:bg-gradient-to-br hover:from-stone-500/80 hover:to-stone-700/80", iconColor: "text-stone-600", hoverIconColor: "group-hover:text-white", textColor: "text-foreground", hoverTextColor: "group-hover:text-white/90", subTextColor: "text-muted-foreground", hoverSubTextColor: "group-hover:text-white/60", iconWrapBg: "bg-stone-500/10", hoverIconWrapBg: "group-hover:bg-white/10" },
  { id: "eclatement", label: "Eclatement", description: "Handle project splits and breakdowns", icon: GitBranch, bg: "bg-card", hoverBg: "hover:bg-gradient-to-br hover:from-sky-500/80 hover:to-sky-700/80", iconColor: "text-sky-600", hoverIconColor: "group-hover:text-white", textColor: "text-foreground", hoverTextColor: "group-hover:text-white/90", subTextColor: "text-muted-foreground", hoverSubTextColor: "group-hover:text-white/60", iconWrapBg: "bg-sky-500/10", hoverIconWrapBg: "group-hover:bg-white/10" },
  { id: "construction", label: "Construction Site", description: "Monitor construction progress and site operations", icon: HardHat, bg: "bg-card", hoverBg: "hover:bg-gradient-to-br hover:from-orange-500/80 hover:to-orange-700/80", iconColor: "text-orange-600", hoverIconColor: "group-hover:text-white", textColor: "text-foreground", hoverTextColor: "group-hover:text-white/90", subTextColor: "text-muted-foreground", hoverSubTextColor: "group-hover:text-white/60", iconWrapBg: "bg-orange-500/10", hoverIconWrapBg: "group-hover:bg-white/10" },
  { id: "documents", label: "Project Documents", description: "Store and manage project files and documents", icon: FileText, bg: "bg-card", hoverBg: "hover:bg-gradient-to-br hover:from-indigo-500/80 hover:to-indigo-700/80", iconColor: "text-indigo-600", hoverIconColor: "group-hover:text-white", textColor: "text-foreground", hoverTextColor: "group-hover:text-white/90", subTextColor: "text-muted-foreground", hoverSubTextColor: "group-hover:text-white/60", iconWrapBg: "bg-indigo-500/10", hoverIconWrapBg: "group-hover:bg-white/10" },
];

const ProjectManagement = () => {
  const searchParams = new URLSearchParams(window.location.search);
  
  const projectId = searchParams.get("project") || "";
  const projectName = searchParams.get("name") || "Project";
  const companyId = searchParams.get("company") || "";
  const companyName = searchParams.get("companyName") || "";
  const trancheId = searchParams.get("tranche") || "";
  const trancheName = searchParams.get("trancheName") || "";
  const blocId = searchParams.get("bloc") || "";
  const blocName = searchParams.get("blocName") || "";

  const companyQuery = companyId ? `&company=${companyId}&companyName=${encodeURIComponent(companyName)}` : "";
  const trancheQuery = trancheId ? `&tranche=${trancheId}&trancheName=${encodeURIComponent(trancheName)}` : "";
  const blocQuery = blocId ? `&bloc=${blocId}&blocName=${encodeURIComponent(blocName)}` : "";

  const handleTileClick = (tileId: string) => {
    if (tileId === "properties") {
      router.visit(`/property-types?project=${projectId}&name=${encodeURIComponent(projectName)}${companyQuery}${trancheQuery}${blocQuery}`);
    }
    // Other tiles can be wired up later
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
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="mb-8">
              <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">{decodeURIComponent(projectName)}</h2>
              <p className="text-[0.9375rem] text-muted-foreground">Select a management area below.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiles.map((tile, index) => (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile.id)}
                  className={`group relative ${tile.bg} ${tile.hoverBg} border border-border hover:border-transparent rounded-2xl p-5 flex items-center gap-4 shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 cursor-pointer text-left overflow-hidden`}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Icon */}
                  <div className={`relative w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${tile.iconWrapBg} ${tile.hoverIconWrapBg} transition-all duration-500 group-hover:scale-110`}>
                    <tile.icon className={`w-5 h-5 ${tile.iconColor} ${tile.hoverIconColor} transition-colors duration-500`} />
                  </div>

                  {/* Content */}
                  <div className="relative flex-1 min-w-0">
                    <h3 className={`font-display font-bold text-[0.9375rem] leading-tight ${tile.textColor} ${tile.hoverTextColor} transition-colors duration-500`}>{tile.label}</h3>
                    <p className={`mt-0.5 text-xs leading-snug truncate ${tile.subTextColor} ${tile.hoverSubTextColor} transition-colors duration-500`}>{tile.description}</p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 text-white/40 group-hover:text-primary transition-all duration-300 group-hover:translate-x-0.5`} />
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProjectManagement;
