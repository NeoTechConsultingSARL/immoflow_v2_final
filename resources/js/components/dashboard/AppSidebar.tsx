import { router, usePage } from "@inertiajs/react";
import {
  LayoutDashboard, Settings, HelpCircle, Building2, ShoppingCart, Truck, Wallet, Contact, LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getNavSections = (user: any) => {
  const sections = [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      ],
    },
  ];

  // Add management items for admin and manager roles
  if (user?.role === 'admin' || user?.role === 'manager') {
    sections.push({
      label: "Management",
      items: [
        { title: "Companies", url: "/companies", icon: Building2 },
        { title: "Projects", url: "/projects", icon: ShoppingCart },
        { title: "Tranches", url: "/tranches", icon: Truck },
        { title: "Blocs", url: "/blocs", icon: Wallet },
      ],
    });
  }

  // Add admin-only items
  if (user?.role === 'admin') {
    sections.push({
      label: "Administration",
      items: [
        { title: "Properties", url: "/properties", icon: Building2 },
        { title: "Property Types", url: "/property-types", icon: ShoppingCart },
        { title: "Settings", url: "/settings", icon: Settings },
      ],
    });
  }

  // Add common items for all authenticated users
  sections.push({
    label: "General",
    items: [
      { title: "History", url: "/history", icon: ShoppingCart },
      { title: "News", url: "/news", icon: Contact },
    ],
  });

  return sections;
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { url, props } = usePage();
  const location = { pathname: new URL(url || "/", window.location.origin).pathname };
  const user = props.auth?.user as any;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "hsl(var(--accent))" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
              <path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/>
              <path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>
            </svg>
          </div>
          {!collapsed && <span className="text-lg font-bold tracking-tight">ImmoFlow</span>}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4 px-3">
        {getNavSections(user).map((section: any) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="text-[0.6875rem] uppercase tracking-wider font-semibold text-muted-foreground px-3 mb-1">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item: any) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-accent/10 text-accent-foreground font-semibold">
                        <item.icon className="w-[1.125rem] h-[1.125rem] mr-2 shrink-0" />
                        {!collapsed && <span className="flex-1">{item.title}</span>}
                        {"badge" in item && !collapsed && (item as any).badge && (
                          <Badge variant="destructive" className="ml-auto text-[0.6875rem] h-5 min-w-5 px-1.5">
                            {(item as any).badge}
                          </Badge>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex-1 flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-sidebar-accent/50 cursor-pointer transition-all duration-300 group border border-transparent hover:border-sidebar-border/50 shadow-sm hover:shadow-md min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 shadow-inner">
                  {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                </div>
                {!collapsed && (
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[0.875rem] font-bold truncate text-sidebar-foreground group-hover:text-primary transition-colors">{user?.name || 'User'}</p>
                      <p className="text-[0.625rem] text-sidebar-foreground/60 truncate font-medium">{user?.email || ''}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.post(route('logout'));
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all duration-200"
                      title="Se déconnecter"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-64 p-2 rounded-xl border-sidebar-border/50 bg-background/95 backdrop-blur-md shadow-xl animate-in zoom-in-95 duration-200">
              <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-sidebar-border/50" />
              <div className="px-3 py-3 mb-1">
                <p className="text-sm font-bold text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-sidebar-border/50" />
              <DropdownMenuItem 
                onClick={() => router.post(route('logout'))} 
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="font-semibold">Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {!collapsed && (
            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl hover:bg-sidebar-accent/50 transition-colors border border-transparent hover:border-sidebar-border/50">
              <ThemeToggle />
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
