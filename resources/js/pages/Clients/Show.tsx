import { router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { ArrowLeft, Pencil, FileText, Calendar, Phone, Mail, Building2, MapPin, Users, Euro, Home } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Contract {
  id: number;
  status: string;
  price: string;
  date: string;
  property: {
    id: number;
    name: string;
    area?: string;
    bloc?: {
      name: string;
      tranche?: {
        name: string;
        project?: {
          name: string;
          company?: {
            name: string;
          };
        };
      };
    };
  };
}

interface Client {
  id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  identity_number: string | null;
  address: string | null;
  type: string;
  created_at: string;
  contracts: Contract[];
}

interface ShowProps {
  client: Client;
}

const statusStyles: Record<string, string> = {
  "active": "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800",
  "completed": "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
  "cancelled": "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800",
  "draft": "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800",
};

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

  const openContract = (contract: Contract) => {
    router.visit(route('contracts.show', contract.id));
  };

  const getPropertyPath = (property: Contract['property']) => {
    if (!property) return "N/A";
    const parts = [];
    if (property.bloc?.tranche?.project?.company) parts.push(property.bloc.tranche.project.company.name);
    if (property.bloc?.tranche?.project) parts.push(property.bloc.tranche.project.name);
    if (property.bloc?.tranche) parts.push(property.bloc.tranche.name);
    if (property.bloc) parts.push(property.bloc.name);
    parts.push(property.name);
    return parts.join(' > ');
  };

  const totalContractValue = client.contracts.reduce((sum, contract) => {
    return sum + parseFloat(contract.price || '0');
  }, 0);

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Client Information Card */}
              <div className="lg:col-span-1">
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

                    <div className="space-y-3">
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
                  </CardContent>
                </Card>

                {/* Statistics Card */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                    <CardDescription>Client contract overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Contracts</span>
                      <span className="font-semibold">{client.contracts.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Value</span>
                      <span className="font-semibold">€{totalContractValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Contracts</span>
                      <span className="font-semibold">
                        {client.contracts.filter(c => c.status === 'active').length}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contracts Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Contracts ({client.contracts.length})
                    </CardTitle>
                    <CardDescription>
                      All contracts associated with this client
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {client.contracts.length > 0 ? (
                      <div className="space-y-4">
                        {client.contracts.map((contract) => (
                          <div
                            key={contract.id}
                            className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() => openContract(contract)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold">Contract #{contract.id}</h4>
                                  <Badge className={cn("text-xs font-semibold px-2 py-1", statusStyles[contract.status] || "bg-muted")}>
                                    {contract.status}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Home className="w-3.5 h-3.5" />
                                    <span>{getPropertyPath(contract.property)}</span>
                                  </div>
                                  {contract.date && (
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-3.5 h-3.5" />
                                      <span>{new Date(contract.date).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-lg">
                                  {contract.price ? `€${parseFloat(contract.price).toLocaleString()}` : '-'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                        <h3 className="font-display text-lg font-bold mb-1">No Contracts</h3>
                        <p className="text-sm text-muted-foreground">This client doesn't have any contracts yet.</p>
                      </div>
                    )}
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
