import { router } from "@inertiajs/react";
import { Users, UserCircle, Building2, History } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";

const settingsTiles = [
  { key: "users", label: "Users", icon: Users, color: "from-blue-500/15 to-blue-600/5 hover:from-blue-500/25 hover:to-blue-600/15", iconColor: "text-blue-600 dark:text-blue-400", borderColor: "hover:border-blue-500/30" },
  { key: "profiles", label: "Profiles", icon: UserCircle, color: "from-emerald-500/15 to-emerald-600/5 hover:from-emerald-500/25 hover:to-emerald-600/15", iconColor: "text-emerald-600 dark:text-emerald-400", borderColor: "hover:border-emerald-500/30" },
  { key: "property-types", label: "Property Types", icon: Building2, color: "from-amber-500/15 to-amber-600/5 hover:from-amber-500/25 hover:to-amber-600/15", iconColor: "text-amber-600 dark:text-amber-400", borderColor: "hover:border-amber-500/30" },
  { key: "history", label: "History", icon: History, color: "from-violet-500/15 to-violet-600/5 hover:from-violet-500/25 hover:to-violet-600/15", iconColor: "text-violet-600 dark:text-violet-400", borderColor: "hover:border-violet-500/30" },
];

const Settings = () => {
  

  const handleTileClick = (key: string) => {
    if (key === "property-types") router.visit("/settings/property-types");
    if (key === "users") router.visit("/settings/users");
    if (key === "profiles") router.visit("/settings/profiles");
    if (key === "history") router.visit("/history");
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

          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="mb-8">
              <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Settings</h2>
              <p className="text-[0.9375rem] text-muted-foreground">Manage your application settings.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {settingsTiles.map((tile) => {
                const Icon = tile.icon;
                return (
                  <button
                    key={tile.key}
                    onClick={() => handleTileClick(tile.key)}
                    className={`group bg-gradient-to-br ${tile.color} border border-border ${tile.borderColor} rounded-xl p-6 text-left transition-all duration-300 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-background/80 flex items-center justify-center shadow-sm">
                        <Icon className={`w-6 h-6 ${tile.iconColor}`} />
                      </div>
                      <h3 className="font-display text-lg font-bold">{tile.label}</h3>
                    </div>
                  </button>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
