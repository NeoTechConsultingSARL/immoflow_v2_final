import { router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { ArrowLeft, Save, User, Mail, Phone, Building2, MapPin, Users } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Client {
  id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  identity_number: string | null;
  address: string | null;
  type: string;
}

interface CreateProps {
  client?: Client;
}

const typeOptions = [
  { value: "individual", label: "Individual" },
  { value: "company", label: "Company" },
  { value: "lead", label: "Lead" },
  { value: "prospect", label: "Prospect" },
  { value: "owner", label: "Owner" },
];

const Create = ({ client }: CreateProps) => {
  const { flash } = usePage().props as any;
  const isEditing = !!client;

  const { data, setData, post, put, processing, errors, reset } = useForm({
    full_name: client?.full_name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    identity_number: client?.identity_number || "",
    address: client?.address || "",
    type: client?.type || "individual",
  });

  useEffect(() => {
    if (flash?.success) {
      toast({ title: flash.success });
    }
    if (flash?.error) {
      toast({ title: flash.error, variant: "destructive" });
    }
  }, [flash]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      put(route('clients.update', client.id), {
        onSuccess: () => reset(),
      });
    } else {
      post(route('clients.store'), {
        onSuccess: () => reset(),
      });
    }
  };

  const goBack = () => {
    router.visit(route('clients.index'));
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
            <Button variant="ghost" onClick={goBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Clients
            </Button>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[800px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="mb-6">
              <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">
                {isEditing ? "Edit Client" : "Create New Client"}
              </h2>
              <p className="text-[0.9375rem] text-muted-foreground">
                {isEditing ? "Update client information and contact details." : "Add a new client to your directory."}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Client Information
                  </CardTitle>
                  <CardDescription>
                    Basic information about the client. Fields marked with * are required.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name *
                      </Label>
                      <Input
                        id="full_name"
                        type="text"
                        value={data.full_name}
                        onChange={(e) => setData('full_name', e.target.value)}
                        placeholder="John Doe"
                        className={errors.full_name ? 'border-red-500' : ''}
                      />
                      {errors.full_name && (
                        <p className="text-sm text-red-500">{errors.full_name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Client Type *</Label>
                      <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                        <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select client type" />
                        </SelectTrigger>
                        <SelectContent>
                          {typeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.type && (
                        <p className="text-sm text-red-500">{errors.type}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="john@example.com"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="+1 234 567 8900"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="identity_number" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Identity Number (CIN/Passport)
                    </Label>
                    <Input
                      id="identity_number"
                      type="text"
                      value={data.identity_number}
                      onChange={(e) => setData('identity_number', e.target.value)}
                      placeholder="AB123456"
                      className={errors.identity_number ? 'border-red-500' : ''}
                    />
                    {errors.identity_number && (
                      <p className="text-sm text-red-500">{errors.identity_number}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      placeholder="123 Main Street, City, Country"
                      rows={3}
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">{errors.address}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-4 mt-6">
                <Button
                  type="submit"
                  disabled={processing}
                  className="gap-2"
                  style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                >
                  <Save className="w-4 h-4" />
                  {processing ? 'Saving...' : (isEditing ? 'Update Client' : 'Create Client')}
                </Button>
                <Button type="button" variant="outline" onClick={goBack}>
                  Cancel
                </Button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Create;
