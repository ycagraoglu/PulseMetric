import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './providers/ThemeProvider';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Sessions from './pages/Sessions';
import Activity from './pages/Activity';
import Realtime from './pages/Realtime';

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Toaster position="top-right" richColors />
                <Routes>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="users" element={<Users />} />
                        <Route path="users/:id" element={<UserDetail />} />
                        <Route path="sessions" element={<Sessions />} />
                        <Route path="activity" element={<Activity />} />
                        <Route path="realtime" element={<Realtime />} />
                        {/* Application routes */}
                        <Route path="settings" element={<PlaceholderPage title="Settings" />} />
                        <Route path="api-keys" element={<PlaceholderPage title="API Keys" />} />
                        <Route path="team" element={<PlaceholderPage title="Team" />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

// Simple placeholder for routes we haven't implemented yet
function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">This page is coming soon.</p>
        </div>
    );
}

export default App;
