import { router } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { Save, X } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const MODULES = [
  { slug: "properties", label: "Properties" },
  { slug: "leases", label: "Leases" },
  { slug: "payments", label: "Payments" },
  { slug: "deliveries", label: "Deliveries" },
  { slug: "users", label: "Users" },
  { slug: "companies", label: "Companies" },
  { slug: "projects", label: "Projects" },
  { slug: "contacts", label: "Contacts" },
  { slug: "funds", label: "Funds" },
  { slug: "orders", label: "Orders" },
];

const ACTIONS = ["view", "create", "update", "delete"] as const;
type Action = (typeof ACTIONS)[number];

type Permissions = Record<string, Record<Action, boolean>>;

const buildEmptyPermissions = (): Permissions =>
  Object.fromEntries(
    MODULES.map((m) => [
      m.slug,
      Object.fromEntries(ACTIONS.map((a) => [a, false])) as Record<Action, boolean>,
    ])
  );

const CreateEditRole = () => {
  
  const { toast } = useToast();
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<Permissions>(buildEmptyPermissions);

  const togglePermission = (module: string, action: Action) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action],
      },
    }));
  };

  const isModuleAllChecked = (module: string) =>
    ACTIONS.every((a) => permissions[module][a]);

  const isModuleSomeChecked = (module: string) =>
    ACTIONS.some((a) => permissions[module][a]) && !isModuleAllChecked(module);

  const toggleModule = (module: string) => {
    const allChecked = isModuleAllChecked(module);
    setPermissions((prev) => ({
      ...prev,
      [module]: Object.fromEntries(ACTIONS.map((a) => [a, !allChecked])) as Record<Action, boolean>,
    }));
  };

  const permissionCount = useMemo(() => {
    let active = 0;
    Object.values(permissions).forEach((acts) =>
      Object.values(acts).forEach((v) => { if (v) active++; })
    );
    return active;
  }, [permissions]);

  const handleSave = () => {
    if (!roleName.trim()) {
      toast({ title: "Role name is required", variant: "destructive" });
      return;
    }
    toast({ title: "Role saved", description: `"${roleName}" with ${permissionCount} permissions.` });
    router.visit("/settings/profiles");
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

          <main className="flex-1 p-6 lg:p-8 max-w-[1000px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">
                Create New Role
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.visit("/settings/profiles")} className="gap-2">
                  <X className="w-4 h-4" /> Cancel
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" /> Save Role
                </Button>
              </div>
            </div>

            {/* Role name */}
            <div className="mb-8">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Role Name
              </label>
              <Input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder='e.g. "Property Manager", "GCC Accountant"'
                className="text-lg h-12 max-w-md"
              />
            </div>

            {/* Permission Matrix */}
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[250px] font-semibold">Module</TableHead>
                    {ACTIONS.map((a) => (
                      <TableHead key={a} className="text-center font-semibold capitalize w-[100px]">
                        {a}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MODULES.map((mod, idx) => (
                    <TableRow
                      key={mod.slug}
                      className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isModuleAllChecked(mod.slug)}
                            // @ts-ignore indeterminate support
                            data-state={
                              isModuleSomeChecked(mod.slug)
                                ? "indeterminate"
                                : isModuleAllChecked(mod.slug)
                                ? "checked"
                                : "unchecked"
                            }
                            onCheckedChange={() => toggleModule(mod.slug)}
                          />
                          <span>{mod.label}</span>
                        </div>
                      </TableCell>
                      {ACTIONS.map((action) => (
                        <TableCell key={action} className="text-center">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={permissions[mod.slug][action]}
                              onCheckedChange={() => togglePermission(mod.slug, action)}
                            />
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              {permissionCount} permission{permissionCount !== 1 ? "s" : ""} selected across {MODULES.length} modules.
            </p>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CreateEditRole;
