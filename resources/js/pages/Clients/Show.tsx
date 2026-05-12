import { router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { ArrowLeft, Pencil, Calendar, Phone, Mail, Building2, MapPin, Users } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Client {
  id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  identity_number: string | null;
  address: string | null;
  type: string;
  created_at: string;
}

interface ShowProps {
  client: Client;
}


const typeStyles: Record<string, string> = {
  "individual": "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
  "company": "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800",
  "lead": "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800",
  "prospect": "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800",
  "owner": "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800",
};

const typeLabels: Record<string, string> = {
  "individual": "Individual",
  "company": "Company",
  "lead": "Lead",
  "prospect": "Prospect",
  "owner": "Owner",
};

const Show = ({ client }: ShowProps) => {
  const { flash } = usePage().props as any;

  useEffect(() => {
    if (flash?.success) {
      toast({ title: flash.success });
    }
    if (flash?.error) {
      toast({ title: flash.error, variant: "destructive" });
    }
  }, [flash]);

  const goBack = () => {
    router.visit(route('clients.index'));
  };

  const openEdit = () => {
    router.visit(route('clients.edit', client.id));
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
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={goBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Clients
              </Button>
              <Button onClick={openEdit} className="gap-2">
                <Pencil className="w-4 h-4" /> Edit Client
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1200px] animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="mb-6">
              <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">{client.full_name}</h2>
              <p className="text-[0.9375rem] text-muted-foreground">Client details and contract history.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Client Information Card */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Client Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs font-semibold px-2 py-1", typeStyles[client.type] || "bg-muted")}>
                        {typeLabels[client.type] || client.type}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {client.email && (
                          <div className="flex items-center gap-3 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{client.email}</span>
                          </div>
                        )}

                        {client.phone && (
                          <div className="flex items-center gap-3 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{client.phone}</span>
                          </div>
                        )}

                        {client.identity_number && (
                          <div className="flex items-center gap-3 text-sm">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span>ID: {client.identity_number}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        {client.address && (
                          <div className="flex items-start gap-3 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <span>{client.address}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Added {new Date(client.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Show;
