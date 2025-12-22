
// import type { Metadata } from 'next'; // Removed
// import { cookies } from 'next/headers'; // Removed
// import { NuqsAdapter } from 'nuqs/adapters/next/app'; // Shimmed
import { NuqsAdapter } from '@/lib/shims/nuqs-adapter';
import { DashboardHeader } from '@/app/dashboard/header';
import { DashboardSidebar } from '@/app/dashboard/sidebar';
import { AuthRedirect } from '@/components/auth-redirect';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/lib/queries/query-provider';
// import { createMetadata, siteConfig } from '@/lib/seo'; // Removed
import { ThemeProvider } from '@/lib/theme-provider';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
    // const cookieStore = await cookies();
    // const sidebarState = cookieStore.get('sidebar_state');
    // const defaultOpen = sidebarState?.value === 'true';
    const defaultOpen = true; // Default to open in client-side

    return (
        <QueryProvider>
            <AuthRedirect requireAuth>
                <NuqsAdapter>
                    <SidebarProvider defaultOpen={defaultOpen}>
                        <DashboardSidebar />
                        <SidebarInset>
                            <ThemeProvider>
                                <DashboardHeader>
                                    <Outlet />
                                </DashboardHeader>
                            </ThemeProvider>
                        </SidebarInset>
                    </SidebarProvider>
                </NuqsAdapter>
            </AuthRedirect>
            <Toaster
                duration={5000}
                position="top-center"
                richColors
                visibleToasts={3}
            />
        </QueryProvider>
    );
}
