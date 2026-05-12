import { router } from "@inertiajs/react";
import { ArrowLeft, Building2, MapPin, Euro, Calendar, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContractProps {
  contract: any;
  path: string;
}

const statusStyles: Record<string, string> = {
  "active": "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800",
  "completed": "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
  "cancelled": "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800",
  "draft": "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800",
};

const Show = ({ contract, path }: ContractProps) => {
  const parts = path.split(' > ');

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
                <Button variant="outline" onClick={() => router.visit(route('contracts.index'))} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Contracts
                </Button>
                <Button variant="outline" onClick={() => window.open(route('contracts.pdf', contract.id), '_blank')} className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <FileText className="w-4 h-4" /> Generate PDF
                </Button>
                <Button onClick={() => router.visit(route('contracts.edit', contract.id))} className="gap-2" style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                    Edit Contract
                </Button>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1000px] mx-auto w-full animate-in fade-in slide-in-from-bottom-1 duration-400">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">Contract #{contract.id}</h2>
                <p className="text-[0.9375rem] text-muted-foreground">Contract details and property hierarchy.</p>
              </div>
              <span className={cn("px-4 py-1.5 rounded-full font-semibold text-sm border", statusStyles[contract.status] || "bg-muted")}>
                {contract.status.toUpperCase()}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Property Hierarchy Card */}
                <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] p-6 md:col-span-2">
                    <h3 className="font-semibold text-lg border-b pb-3 mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" /> Property Hierarchy
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-2 text-sm md:text-base font-medium p-4 bg-muted/30 rounded-lg border border-border/50">
                        {parts.map((part, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span className={idx === parts.length - 1 ? "text-primary font-bold" : "text-muted-foreground"}>{part}</span>
                                {idx < parts.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Client Details */}
                <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] p-6">
                    <h3 className="font-semibold text-lg border-b pb-3 mb-4">Client Details</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                            <p className="font-medium">{contract.client.full_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Email</p>
                            <p className="font-medium">{contract.client.email || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Phone</p>
                            <p className="font-medium">{contract.client.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Identity Number</p>
                            <p className="font-medium">{contract.client.identity_number || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Contract Details */}
                <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] p-6">
                    <h3 className="font-semibold text-lg border-b pb-3 mb-4">Contract Information</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Agreed Price</p>
                            <p className="font-medium text-lg flex items-center gap-1">
                                <Euro className="w-4 h-4 text-primary" />
                                {contract.price ? parseFloat(contract.price).toLocaleString() : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Contract Date</p>
                            <p className="font-medium flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-primary" />
                                {contract.date || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Property Original Price</p>
                            <p className="font-medium">€{contract.property?.price}</p>
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
