import { usePage } from "@inertiajs/react";
import {
  LayoutDashboard, Settings, HelpCircle, Building2, ShoppingCart, Truck, Wallet, Contact,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

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
        { title: "Users", url: "/settings/users", icon: Contact },
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

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
            MK
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[0.8125rem] font-semibold truncate">Max Keller</p>
              <p className="text-[0.6875rem] text-muted-foreground truncate">max@immoflow.de</p>
            </div>
          )}
          {!collapsed && <ThemeToggle />}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
