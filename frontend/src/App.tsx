import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarProvider } from "@/contexts/SidebarContext";
import Auth from "./pages/Auth";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import Sessions from "./pages/Sessions";
import Events from "./pages/Events";
import Realtime from "./pages/Realtime";
import Settings from "./pages/Settings";
import ApiKeys from "./pages/ApiKeys";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Users />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:userId" element={<UserDetails />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/events" element={<Events />} />
              <Route path="/realtime" element={<Realtime />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/api-keys" element={<ApiKeys />} />
              <Route path="/team" element={<Team />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
