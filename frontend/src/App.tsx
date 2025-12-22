import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'

// Layouts
import DashboardLayout from './layouts/DashboardLayout'

// Pages
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import SessionsPage from './pages/SessionsPage'
import EventsPage from './pages/EventsPage'
import RealtimePage from './pages/RealtimePage'

function App() {
    return (
        <>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Dashboard routes */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="analytics/users" element={<UsersPage />} />
                    <Route path="analytics/sessions" element={<SessionsPage />} />
                    <Route path="analytics/events" element={<EventsPage />} />
                    <Route path="analytics/realtime" element={<RealtimePage />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Toaster
                position="top-center"
                richColors
                duration={5000}
            />
        </>
    )
}

export default App
