import { router } from "@inertiajs/react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { DollarSign, Users, TrendingUp, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
}

const financeTiles = [
  {
    id: "shareholders",
    label: "Shareholders",
    description: "Manage associate contributions and equity shares",
    icon: Users,
    hoverBg: "hover:bg-gradient-to-br hover:from-emerald-500/80 hover:to-emerald-700/80",
    iconColor: "text-emerald-600",
    iconWrapBg: "bg-emerald-500/10",
  },
  {
    id: "estimation",
    label: "Financial Project Estimation",
    description: "Plan and review project financial estimates",
    icon: DollarSign,
    hoverBg: "hover:bg-gradient-to-br hover:from-slate-500/80 hover:to-slate-700/80",
    iconColor: "text-slate-600",
    iconWrapBg: "bg-slate-500/10",
  },
  {
    id: "roi",
    label: "Financial Project ROI",
    description: "Track return on investment metrics",
    icon: TrendingUp,
    hoverBg: "hover:bg-gradient-to-br hover:from-blue-500/80 hover:to-blue-700/80",
    iconColor: "text-blue-600",
    iconWrapBg: "bg-blue-500/10",
  },
];

const buildHierarchyQuery = (bloc: BlocContext) => {
  const params = new URLSearchParams();
  if (bloc.companyId) {
    params.set("company", bloc.companyId);
    params.set("companyName", bloc.companyName);
  }
  if (bloc.projectId) {
    params.set("project", bloc.projectId);
    params.set("name", bloc.projectName);
  }
  if (bloc.trancheId) {
    params.set("tranche", bloc.trancheId);
    params.set("trancheName", bloc.trancheName);
  }
  params.set("bloc", bloc.id);
  params.set("blocName", bloc.name);
  return params.toString();
};

const ProjectFinance = ({ bloc }: Props) => {
  const hierarchyQuery = buildHierarchyQuery(bloc);

  const handleTileClick = (tileId: string) => {
    if (tileId === "shareholders") {
      router.visit(`/blocs/${bloc.id}/shareholders?${hierarchyQuery}`);
      return;
    }
    if (tileId === "estimation") {
      router.visit(`/blocs/${bloc.id}/business-plan?${hierarchyQuery}`);
      return;
    }
    toast({
      title: "Coming soon",
      description: "This financial module is not available yet.",
    });
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
              <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Project Finance</h2>
              <p className="text-[0.9375rem] text-muted-foreground">
                {bloc.projectName} — {bloc.trancheName} — {bloc.name}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {financeTiles.map((tile, index) => (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => handleTileClick(tile.id)}
                  className={`group relative bg-card ${tile.hoverBg} border border-border hover:border-transparent rounded-2xl p-5 flex items-center gap-4 shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 cursor-pointer text-left overflow-hidden`}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div
                    className={`relative w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${tile.iconWrapBg} group-hover:bg-white/10 transition-all duration-500 group-hover:scale-110`}
                  >
                    <tile.icon className={`w-5 h-5 ${tile.iconColor} group-hover:text-white transition-colors duration-500`} />
                  </div>
                  <div className="relative flex-1 min-w-0">
                    <h3 className="font-display font-bold text-[0.9375rem] leading-tight text-foreground group-hover:text-white transition-colors duration-500">
                      {tile.label}
                    </h3>
                    <p className="mt-0.5 text-xs leading-snug truncate text-muted-foreground group-hover:text-white/60 transition-colors duration-500">
                      {tile.description}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0 text-white/40 group-hover:text-primary transition-all duration-300 group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProjectFinance;
