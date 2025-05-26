
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "./components/ui/tooltip";

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

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      retry: 1,
      networkMode: "online",
    },
  },
});

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider attribute="class">
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <Router>
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/events" element={<Index />} />
                  <Route path="/event/:id" element={<EventDetails />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/search/:query" element={<Search />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                  <Route path="/nearby" element={<Nearby />} />
                  <Route path="/organizer/:id" element={<OrganizerProfile />} />
                  <Route path="/organizers" element={<Organizers />} />

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
                  <Route 
                    path="/admin" 
                    element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} 
                  />

                  {/* Handle 404 */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </AuthProvider>
            </Router>
            <Toaster position="top-right" closeButton />
          </QueryClientProvider>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
