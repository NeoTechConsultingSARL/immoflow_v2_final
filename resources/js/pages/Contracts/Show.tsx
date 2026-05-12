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
  "active": "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 shadow-lg shadow-emerald-500/20",
  "completed": "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700 shadow-lg shadow-blue-500/20",
  "cancelled": "bg-gradient-to-r from-rose-500/20 to-rose-600/20 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-700 shadow-lg shadow-rose-500/20",
  "draft": "bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 shadow-lg shadow-amber-500/20",
};

const Show = ({ contract, path }: ContractProps) => {
  const parts = path.split(' > ');

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
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => window.open(route('contracts.pdf', contract.id), '_blank')} className="gap-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 shadow-md hover:shadow-lg">
                    <FileText className="w-4 h-4" /> Generate PDF
                </Button>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8 max-w-[1000px] mx-auto w-full animate-in fade-in slide-in-from-bottom-1 duration-400 bg-gradient-to-b from-background to-background/50">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Contract #{contract.id}</h2>
                <p className="text-[0.9375rem] text-muted-foreground">Contract details and property hierarchy.</p>
              </div>
              <span className={cn("px-4 py-1.5 rounded-full font-semibold text-sm border backdrop-blur-sm", statusStyles[contract.status] || "bg-muted")}>
                {contract.status.toUpperCase()}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Property Hierarchy Card */}
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl shadow-lg shadow-primary/5 p-6 md:col-span-2 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                    <h3 className="font-semibold text-lg border-b border-border/50 pb-3 mb-4 flex items-center gap-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        <Building2 className="w-5 h-5 text-primary" /> Property Hierarchy
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-sm md:text-base font-medium p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                        {parts.map((part, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span className={idx === parts.length - 1 ? "text-primary font-bold bg-primary/10 px-3 py-1 rounded-lg" : "text-muted-foreground"}>{part}</span>
                                {idx < parts.length - 1 && <ChevronRight className="w-4 h-4 text-primary/50" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Client Details */}
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl shadow-lg shadow-primary/5 p-6 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                    <h3 className="font-semibold text-lg border-b border-border/50 pb-3 mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Client Details</h3>
                    <div className="space-y-4">
                        <div className="group">
                            <p className="text-sm text-muted-foreground mb-1 group-hover:text-primary/70 transition-colors">Full Name</p>
                            <p className="font-medium text-lg">{contract.client.full_name}</p>
                        </div>
                        <div className="group">
                            <p className="text-sm text-muted-foreground mb-1 group-hover:text-primary/70 transition-colors">Email</p>
                            <p className="font-medium">{contract.client.email || 'N/A'}</p>
                        </div>
                        <div className="group">
                            <p className="text-sm text-muted-foreground mb-1 group-hover:text-primary/70 transition-colors">Phone</p>
                            <p className="font-medium">{contract.client.phone || 'N/A'}</p>
                        </div>
                        <div className="group">
                            <p className="text-sm text-muted-foreground mb-1 group-hover:text-primary/70 transition-colors">Identity Number</p>
                            <p className="font-medium">{contract.client.identity_number || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Contract Details */}
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl shadow-lg shadow-primary/5 p-6 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                    <h3 className="font-semibold text-lg border-b border-border/50 pb-3 mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Contract Information</h3>
                    <div className="space-y-4">
                        <div className="group">
                            <p className="text-sm text-muted-foreground mb-1 group-hover:text-primary/70 transition-colors">Agreed Price</p>
                            <p className="font-medium text-xl flex items-center gap-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                <Euro className="w-5 h-5 text-primary" />
                                {contract.price ? parseFloat(contract.price).toLocaleString() : 'N/A'}
                            </p>
                        </div>
                        <div className="group">
                            <p className="text-sm text-muted-foreground mb-1 group-hover:text-primary/70 transition-colors">Contract Date</p>
                            <p className="font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                {contract.date || 'N/A'}
                            </p>
                        </div>
                        <div className="group">
                            <p className="text-sm text-muted-foreground mb-1 group-hover:text-primary/70 transition-colors">Property Original Price</p>
                            <p className="font-medium text-lg">€{contract.property?.price}</p>
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
