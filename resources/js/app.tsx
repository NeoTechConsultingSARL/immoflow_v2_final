import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const queryClient = new QueryClient();

createInertiaApp({
    title: (title: string) => `${title} - ${appName}`,
    resolve: (name: string) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }: any) {
        const root = (
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <App {...props} />
                    </TooltipProvider>
                </ThemeProvider>
            </QueryClientProvider>
        );

        if (import.meta.env.SSR) {
            hydrateRoot(el, root);
            return;
        }

        createRoot(el).render(root);
    },
    progress: {
        color: '#4B5563',
    },
});
