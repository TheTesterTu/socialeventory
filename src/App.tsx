
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Search from "./pages/Search";
import SearchPage from "./pages/SearchPage";
import Nearby from "./pages/Nearby";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Landing from "./pages/Landing";
import OrganizerProfile from "./pages/OrganizerProfile";
import Organizers from "./pages/Organizers";
import NotFound from "./pages/NotFound";
import NotificationsPage from "./pages/NotificationsPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProductionStatus from "./pages/ProductionStatus";
import ProductionAuditPage from "./pages/ProductionAuditPage";
import SystemTest from "./pages/SystemTest";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { PERFORMANCE_CONFIG } from "@/utils/productionConfig";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: PERFORMANCE_CONFIG.QUERY_STALE_TIME,
      gcTime: PERFORMANCE_CONFIG.CACHE_TIME, // React Query v5 uses gcTime instead of cacheTime
      refetchOnWindowFocus: false, // Optimize for production
      retry: (failureCount, error) => {
        if (error && typeof error === 'object' && 'status' in error) {
          const status = error.status as number;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < PERFORMANCE_CONFIG.RETRY_COUNT;
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AuthProvider>
                <TooltipProvider>
                  <div className="min-h-screen bg-background font-sans antialiased">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/landing" element={<Landing />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/events/:id" element={<EventDetails />} />
                      <Route path="/event/:id" element={<EventDetails />} />
                      <Route path="/create-event" element={<CreateEvent />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/profile/edit" element={<ProfileEdit />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/search-page" element={<SearchPage />} />
                      <Route path="/nearby" element={<Nearby />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="/organizers" element={<Organizers />} />
                      <Route path="/organizers/:id" element={<OrganizerProfile />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                      <Route path="/admin/production-audit" element={<ProtectedAdminRoute><ProductionAuditPage /></ProtectedAdminRoute>} />
                      <Route path="/production-status" element={<ProtectedAdminRoute><ProductionStatus /></ProtectedAdminRoute>} />
                      <Route path="/system-test" element={<ProtectedAdminRoute><SystemTest /></ProtectedAdminRoute>} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster />
                  </div>
                </TooltipProvider>
              </AuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
