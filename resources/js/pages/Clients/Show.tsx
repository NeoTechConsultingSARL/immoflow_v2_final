import { router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Phone, Mail, Building2, MapPin, Users } from "lucide-react";
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
  "individual": "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700 shadow-lg shadow-blue-500/20",
  "company": "bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-700 shadow-lg shadow-purple-500/20",
  "lead": "bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 shadow-lg shadow-amber-500/20",
  "prospect": "bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-600 dark:text-green-400 border-green-300 dark:border-green-700 shadow-lg shadow-green-500/20",
  "owner": "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 shadow-lg shadow-emerald-500/20",
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

  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-gradient-to-r from-card to-card/95 backdrop-blur-sm border-b border-border/50 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <AppBreadcrumb />
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1200px] mx-auto w-full animate-in fade-in slide-in-from-bottom-1 duration-400 bg-gradient-to-b from-background to-background/50">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{client.full_name}</h2>
                <p className="text-[0.9375rem] text-muted-foreground">Client details and contract history.</p>
              </div>
              <Badge className={cn("text-xs font-semibold px-4 py-1.5 border backdrop-blur-sm", typeStyles[client.type] || "bg-muted")}>
                {typeLabels[client.type] || client.type}
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Client Information Card */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl shadow-lg shadow-primary/5 p-6 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  <h3 className="font-semibold text-lg border-b border-border/50 pb-3 mb-4 flex items-center gap-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    <Users className="w-5 h-5 text-primary" />
                    Client Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {client.email && (
                        <div className="group">
                          <p className="text-sm text-muted-foreground mb-1 group-hover:text-primary/70 transition-colors">Email</p>
                          <p className="font-medium flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" />
                            {client.email}
                          </p>
                        </div>
                      )}

                      {client.phone && (
                        <div className="group">
                          <p className="text-sm text-muted-foreground mb-1 group-hover:text-primary/70 transition-colors">Phone</p>
                          <p className="font-medium flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary" />
                            {client.phone}
                          </p>
                        </div>
                      )}

                      {client.identity_number && (
                        <div className="group">
                          <p className="text-sm text-muted-foreground mb-1 group-hover:text-primary/70 transition-colors">Identity Number</p>
                          <p className="font-medium flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-primary" />
                            {client.identity_number}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {client.address && (
                        <div className="group">
                          <p className="text-sm text-muted-foreground mb-1 group-hover:text-primary/70 transition-colors">Address</p>
                          <p className="font-medium flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-primary mt-0.5" />
                            {client.address}
                          </p>
                        </div>
                      )}

                      <div className="group">
                        <p className="text-sm text-muted-foreground mb-1 group-hover:text-primary/70 transition-colors">Added Date</p>
                        <p className="font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          {new Date(client.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Show;
