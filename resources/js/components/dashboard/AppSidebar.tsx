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

const navSections = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Companies", url: "/companies", icon: Building2 },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Orders", url: "/orders", icon: ShoppingCart },
      { title: "Deliveries", url: "/deliveries", icon: Truck },
      { title: "Funds", url: "/funds", icon: Wallet },
      { title: "Contacts", url: "/contacts", icon: Contact },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", url: "/settings", icon: Settings },
      { title: "Help & Support", url: "/help", icon: HelpCircle },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { url } = usePage();
  const location = { pathname: new URL(url || "/", window.location.origin).pathname };

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
        {navSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="text-[0.6875rem] uppercase tracking-wider font-semibold text-muted-foreground px-3 mb-1">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
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
