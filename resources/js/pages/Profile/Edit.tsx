import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import TwoFactorAuthenticationForm from './Partials/TwoFactorAuthenticationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col min-w-0 bg-background">
                    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="lg:hidden" />
                            <AppBreadcrumb />
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-1 duration-400 space-y-6">
                        <Head title="Mon Compte" />
                        
                        <div className="mb-6">
                            <h2 className="font-display text-[1.75rem] xl:text-[2rem] font-bold">
                                Mon Compte
                            </h2>
                            <p className="text-[0.9375rem] text-muted-foreground">
                                Gérer les informations de votre profil et renforcer la sécurité de votre compte.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 max-w-4xl">
                            {/* Profile Info Card */}
                            <div className="bg-card border border-border p-6 shadow-[var(--shadow-card)] rounded-xl hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-xl"
                                />
                            </div>

                            {/* Change Password Card */}
                            <div className="bg-card border border-border p-6 shadow-[var(--shadow-card)] rounded-xl hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300">
                                <UpdatePasswordForm className="max-w-xl" />
                            </div>

                            {/* 2FA Security Card */}
                            <div className="bg-card border border-border p-6 shadow-[var(--shadow-card)] rounded-xl hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300">
                                <TwoFactorAuthenticationForm className="max-w-xl" />
                            </div>

                            {/* Danger Zone / Delete Card */}
                            <div className="bg-card/50 border border-destructive/20 p-6 shadow-[var(--shadow-card)] rounded-xl border-l-4 border-l-destructive">
                                <DeleteUserForm className="max-w-xl" />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
