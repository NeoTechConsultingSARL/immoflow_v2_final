import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import * as ReactDOMServer from 'react-dom/server';
import { RouteName } from 'ziggy-js';
import { route } from '../../vendor/tightenco/ziggy';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const queryClient = new QueryClient();

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./pages/${name}.tsx`,
                import.meta.glob('./pages/**/*.tsx'),
            ),
        setup: ({ App, props }) => {
            /* eslint-disable */
            // @ts-expect-error
            global.route<RouteName> = (name, params, absolute) =>
                route(name, params as any, absolute, {
                    ...page.props.ziggy,
                    location: new URL(page.props.ziggy.location),
                });
            /* eslint-enable */

            return (
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
        },
    }),
);
