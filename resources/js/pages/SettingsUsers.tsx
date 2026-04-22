import { useState } from "react";
import { Plus, UserPlus, Pencil, Trash2, Shield, Eye, EyeOff } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  login: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

const availableRoles = [
  { id: "1", name: "Administrator" },
  { id: "2", name: "Property Manager" },
  { id: "3", name: "GCC Accountant" },
];

const initialUsers: User[] = [
  { id: "1", firstName: "Ahmed", lastName: "Benali", login: "ahmed.benali", email: "ahmed@immoflow.ma", role: "Administrator", active: true, createdAt: "2024-01-10" },
  { id: "2", firstName: "Sara", lastName: "El Amrani", login: "sara.elamrani", email: "sara@immoflow.ma", role: "Property Manager", active: true, createdAt: "2024-02-15" },
  { id: "3", firstName: "Youssef", lastName: "Idrissi", login: "youssef.idrissi", email: "", role: "GCC Accountant", active: false, createdAt: "2024-03-20" },
];

const emptyForm = { firstName: "", lastName: "", login: "", email: "", password: "", role: "" };

const SettingsUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setShowPassword(false);
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      login: user.login,
      email: user.email,
      password: "",
      role: user.role,
    });
    setShowPassword(false);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.login.trim() || !form.role) {
      toast({ title: "First name, last name, login and role are required", variant: "destructive" });
      return;
    }
    if (!editingUser && !form.password.trim()) {
      toast({ title: "Password is required for new users", variant: "destructive" });
      return;
    }

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, firstName: form.firstName, lastName: form.lastName, login: form.login, email: form.email, role: form.role }
            : u
        )
      );
      toast({ title: "User updated", description: `${form.firstName} ${form.lastName} has been updated.` });
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        firstName: form.firstName,
        lastName: form.lastName,
        login: form.login,
        email: form.email,
        role: form.role,
        active: true,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsers((prev) => [...prev, newUser]);
      toast({ title: "User created", description: `${newUser.firstName} ${newUser.lastName} added as ${newUser.role}.` });
    }

    setForm(emptyForm);
    setEditingUser(null);
    setDialogOpen(false);
  };

  const toggleActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const next = { ...u, active: !u.active };
        toast({
          title: next.active ? "User activated" : "User deactivated",
          description: `${u.firstName} ${u.lastName} is now ${next.active ? "active" : "inactive"}.`,
        });
        return next;
      })
    );
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
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
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Users</h2>
                <p className="text-[0.9375rem] text-muted-foreground">Manage platform users and their assigned roles.</p>
              </div>
              <Button onClick={openCreate} className="gap-2">
                <Plus className="w-4 h-4" /> New User
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {users.map((user) => (
                <Card
                  key={user.id}
                  className={`group hover:shadow-md transition-all ${!user.active ? "opacity-60" : ""}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${user.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-base">{user.firstName} {user.lastName}</h3>
                          <p className="text-xs text-muted-foreground font-mono">@{user.login}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(user)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    {user.email && (
                      <p className="text-xs text-muted-foreground mb-2">{user.email}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">{user.role}</Badge>
                      <div className="ml-auto flex items-center gap-2">
                        <Badge variant={user.active ? "default" : "outline"} className="text-xs">
                          {user.active ? "Active" : "Inactive"}
                        </Badge>
                        <Switch
                          checked={user.active}
                          onCheckedChange={() => toggleActive(user.id)}
                          className="scale-75"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Create/Edit User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              {editingUser ? "Edit User" : "Create New User"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>First Name <span className="text-destructive">*</span></Label>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Ahmed" />
              </div>
              <div>
                <Label>Last Name <span className="text-destructive">*</span></Label>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Benali" />
              </div>
            </div>
            <div>
              <Label>Login <span className="text-destructive">*</span></Label>
              <Input value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} placeholder="ahmed.benali" />
              <p className="text-xs text-muted-foreground mt-1">Used to sign in to the platform.</p>
            </div>
            <div>
              <Label>Email <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ahmed@immoflow.ma" />
            </div>
            <div>
              <Label>
                {editingUser ? "New Password" : "Password"} {!editingUser && <span className="text-destructive">*</span>}
                {editingUser && <span className="text-muted-foreground text-xs">(leave blank to keep current)</span>}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={editingUser ? "••••••••" : "Set initial password"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {!editingUser && (
                <p className="text-xs text-muted-foreground mt-1">The user can change this from their account settings.</p>
              )}
            </div>
            <div>
              <Label>Assign Role <span className="text-destructive">*</span></Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role..." />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingUser ? "Save Changes" : "Create User"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default SettingsUsers;
