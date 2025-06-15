import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "./components/ui/tooltip";
import { NotFoundRedirect } from "./components/NotFoundRedirect";
import { ProductionLayout } from "./components/layout/ProductionLayout";
import { OfflineBanner } from "./components/ui/offline-banner";
import { useAnalytics } from "./hooks/useAnalytics";

// Main Pages
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import EventDetails from "./pages/EventDetails";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";
import CreateEvent from "./pages/CreateEvent";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Nearby from "./pages/Nearby";
import ResetPassword from "./pages/ResetPassword";
import OrganizerProfile from "./pages/OrganizerProfile";
import Organizers from "./pages/Organizers";
import NotificationsPage from "./pages/NotificationsPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProductionAuditPage from "./pages/ProductionAuditPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import SystemTest from "./pages/SystemTest";

// Create a client with production-ready settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
      networkMode: "online",
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
      networkMode: "online",
    },
  },
});

const AppContent = () => {
  useAnalytics();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/events" element={<Index />} />
      <Route path="/event/:id" element={<EventDetails />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/search/:query" element={<Search />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/nearby" element={<Nearby />} />
      <Route path="/organizer/:id" element={<OrganizerProfile />} />
      <Route path="/organizers" element={<Organizers />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      {/* Protected Routes */}
      <Route 
        path="/profile" 
        element={<ProtectedRoute><Profile /></ProtectedRoute>} 
      />
      <Route 
        path="/profile/edit" 
        element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} 
      />
      <Route 
        path="/create-event" 
        element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} 
      />
      <Route 
        path="/settings" 
        element={<ProtectedRoute><Settings /></ProtectedRoute>} 
      />
      <Route 
        path="/notifications" 
        element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} 
      />
      
      {/* Admin Only Routes */}
      <Route 
        path="/admin" 
        element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/production-audit" 
        element={<ProtectedRoute adminOnly={true}><ProductionAuditPage /></ProtectedRoute>} 
      />
      <Route 
        path="/system-test" 
        element={<ProtectedRoute adminOnly={true}><SystemTest /></ProtectedRoute>} 
      />

      {/* 404 Handling */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={
        <>
          <NotFoundRedirect />
          <NotFound />
        </>
      } />
    </Routes>
  );
};

export default function App() {
  return (
    <ProductionLayout>
      <HelmetProvider>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TooltipProvider>
            <QueryClientProvider client={queryClient}>
              <Router>
                <AuthProvider>
                  <OfflineBanner />
                  <AppContent />
                  <Toaster 
                    position="top-right" 
                    closeButton 
                    duration={4000}
                    richColors
                  />
                </AuthProvider>
              </Router>
            </QueryClientProvider>
          </TooltipProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ProductionLayout>
  );
}
