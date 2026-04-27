import { useState, useEffect } from "react";
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
import { useForm, router } from "@inertiajs/react";
import { Head } from "@inertiajs/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  created_at: string;
}

interface SettingsUsersProps {
  users: User[];
}

const availableRoles = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Property Manager" },
  { value: "user", label: "GCC Accountant" },
];



const SettingsUsers = ({ users: initialUsers }: SettingsUsersProps) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const createForm = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
  });

  const updateForm = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
  });

  const openCreate = () => {
    setEditingUser(null);
    createForm.reset();
    setShowPassword(false);
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    updateForm.setData({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      role: user.role,
    });
    setShowPassword(false);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    createForm.post(route('users.store'), {
      onSuccess: () => {
        setDialogOpen(false);
        createForm.reset();
        toast({ title: "User created successfully" });
        // Reload the page to get updated users list
        router.reload();
      },
      onError: (errors) => {
        Object.entries(errors).forEach(([field, message]) => {
          toast({ title: message as string, variant: "destructive" });
        });
      },
    });
  };

  const handleUpdate = () => {
    if (!editingUser) return;

    updateForm.put(route('users.update', editingUser.id), {
      onSuccess: () => {
        setDialogOpen(false);
        updateForm.reset();
        setEditingUser(null);
        toast({ title: "User updated successfully" });
        // Reload the page to get updated users list
        router.reload();
      },
      onError: (errors) => {
        Object.entries(errors).forEach(([field, message]) => {
          toast({ title: message as string, variant: "destructive" });
        });
      },
    });
  };

  const toggleActive = (user: User) => {
    router.patch(route('users.toggle-active', user.id), {}, {
      onSuccess: () => {
        toast({ title: user.active ? "User deactivated" : "User activated" });
        router.reload();
      },
    });
  };

  const handleDelete = (user: User) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      router.delete(route('users.destroy', user.id), {
        onSuccess: () => {
          toast({ title: "User deleted successfully" });
          router.reload();
        },
      });
    }
  };

  return (
    <SidebarProvider>
      <Head title="Users" />
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
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-base">{user.name}</h3>
                          <p className="text-xs text-muted-foreground font-mono">{user.email}</p>
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
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">
                        {availableRoles.find(r => r.value === user.role)?.label || user.role}
                      </Badge>
                      <div className="ml-auto flex items-center gap-2">
                        <Badge variant={user.active ? "default" : "outline"} className="text-xs">
                          {user.active ? "Active" : "Inactive"}
                        </Badge>
                        <Switch
                          checked={user.active}
                          onCheckedChange={() => toggleActive(user)}
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
            <div>
              <Label>Name <span className="text-destructive">*</span></Label>
              <Input 
                value={editingUser ? updateForm.data.name : createForm.data.name} 
                onChange={(e) => editingUser 
                  ? updateForm.setData('name', e.target.value)
                  : createForm.setData('name', e.target.value)
                } 
                placeholder="Name" 
              />
              {(editingUser ? updateForm.errors.name : createForm.errors.name) && (
                <p className="text-sm text-destructive mt-1">
                  {editingUser ? updateForm.errors.name : createForm.errors.name}
                </p>
              )}
            </div>
            <div>
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input 
                type="email"
                value={editingUser ? updateForm.data.email : createForm.data.email} 
                onChange={(e) => editingUser 
                  ? updateForm.setData('email', e.target.value)
                  : createForm.setData('email', e.target.value)
                } 
                placeholder="email@example.com" 
              />
              {(editingUser ? updateForm.errors.email : createForm.errors.email) && (
                <p className="text-sm text-destructive mt-1">
                  {editingUser ? updateForm.errors.email : createForm.errors.email}
                </p>
              )}
            </div>
            <div>
              <Label>
                {editingUser ? "New Password" : "Password"} {!editingUser && <span className="text-destructive">*</span>}
                {editingUser && <span className="text-muted-foreground text-xs">(leave blank to keep current)</span>}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={editingUser ? updateForm.data.password : createForm.data.password}
                  onChange={(e) => editingUser 
                    ? updateForm.setData('password', e.target.value)
                    : createForm.setData('password', e.target.value)
                  }
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
              {(editingUser ? updateForm.errors.password : createForm.errors.password) && (
                <p className="text-sm text-destructive mt-1">
                  {editingUser ? updateForm.errors.password : createForm.errors.password}
                </p>
              )}
              {!editingUser && (
                <p className="text-xs text-muted-foreground mt-1">The user can change this from their account settings.</p>
              )}
            </div>
            <div>
              <Label>
                {editingUser ? "Confirm New Password" : "Confirm Password"} 
                {(!editingUser || updateForm.data.password) && <span className="text-destructive">*</span>}
              </Label>
              <Input
                type="password"
                value={editingUser ? updateForm.data.password_confirmation : createForm.data.password_confirmation}
                onChange={(e) => editingUser 
                  ? updateForm.setData('password_confirmation', e.target.value)
                  : createForm.setData('password_confirmation', e.target.value)
                }
                placeholder={editingUser ? "Confirm new password" : "Confirm password"}
              />
              {(editingUser ? updateForm.errors.password_confirmation : createForm.errors.password_confirmation) && (
                <p className="text-sm text-destructive mt-1">
                  {editingUser ? updateForm.errors.password_confirmation : createForm.errors.password_confirmation}
                </p>
              )}
            </div>
            <div>
              <Label>Assign Role <span className="text-destructive">*</span></Label>
              <Select 
                value={editingUser ? updateForm.data.role : createForm.data.role} 
                onValueChange={(v) => editingUser 
                  ? updateForm.setData('role', v)
                  : createForm.setData('role', v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role..." />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(editingUser ? updateForm.errors.role : createForm.errors.role) && (
                <p className="text-sm text-destructive mt-1">
                  {editingUser ? updateForm.errors.role : createForm.errors.role}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={editingUser ? handleUpdate : handleCreate}
              disabled={editingUser ? updateForm.processing : createForm.processing}
            >
              {editingUser ? (updateForm.processing ? "Saving..." : "Save Changes") : (createForm.processing ? "Creating..." : "Create User")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default SettingsUsers;
