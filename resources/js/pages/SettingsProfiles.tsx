import { router } from "@inertiajs/react";
import { useState } from "react";
import { Plus, Shield, Pencil, Trash2 } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Role {
  id: string;
  name: string;
  permissions: Record<string, Record<string, boolean>>;
  createdAt: string;
}

const initialRoles: Role[] = [
  {
    id: "1",
    name: "Administrator",
    permissions: {
      properties: { view: true, create: true, update: true, delete: true },
      leases: { view: true, create: true, update: true, delete: true },
      payments: { view: true, create: true, update: true, delete: true },
      deliveries: { view: true, create: true, update: true, delete: true },
      users: { view: true, create: true, update: true, delete: true },
    },
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Property Manager",
    permissions: {
      properties: { view: true, create: true, update: true, delete: false },
      leases: { view: true, create: true, update: true, delete: false },
      payments: { view: true, create: false, update: false, delete: false },
      deliveries: { view: true, create: true, update: true, delete: false },
      users: { view: false, create: false, update: false, delete: false },
    },
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "GCC Accountant",
    permissions: {
      properties: { view: true, create: false, update: false, delete: false },
      leases: { view: true, create: false, update: false, delete: false },
      payments: { view: true, create: true, update: true, delete: false },
      deliveries: { view: false, create: false, update: false, delete: false },
      users: { view: false, create: false, update: false, delete: false },
    },
    createdAt: "2024-03-10",
  },
];

const countPermissions = (perms: Record<string, Record<string, boolean>>) => {
  let total = 0;
  let active = 0;
  Object.values(perms).forEach((actions) => {
    Object.values(actions).forEach((v) => {
      total++;
      if (v) active++;
    });
  });
  return { total, active };
};

const SettingsProfiles = () => {
  
  const [roles, setRoles] = useState<Role[]>(initialRoles);

  const handleDelete = (id: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Profiles & Roles</h2>
                <p className="text-[0.9375rem] text-muted-foreground">
                  Manage user roles and their permission sets.
                </p>
              </div>
              <Button onClick={() => router.visit("/settings/profiles/create")} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Role
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {roles.map((role) => {
                const { total, active } = countPermissions(role.permissions);
                return (
                  <Card key={role.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base">{role.name}</h3>
                            <p className="text-xs text-muted-foreground">Created {role.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => router.visit(`/settings/profiles/edit/${role.id}`)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(role.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {active}/{total} permissions
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SettingsProfiles;
