import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { lazy, Suspense, useEffect } from "react";
import { PageLoader } from "@/components/loading/PageLoader";
import { preloadCriticalRoutes } from "@/utils/routePreloader";

// Lazy load all page components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Events = lazy(() => import("./pages/Events"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const Profile = lazy(() => import("./pages/Profile"));
const ProfileEdit = lazy(() => import("./pages/ProfileEdit"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const Nearby = lazy(() => import("./pages/Nearby"));
const Settings = lazy(() => import("./pages/Settings"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Landing = lazy(() => import("./pages/Landing"));
const OrganizerProfile = lazy(() => import("./pages/OrganizerProfile"));
const Organizers = lazy(() => import("./pages/Organizers"));
const NotFound = lazy(() => import("./pages/NotFound"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

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
  // Preload critical routes on mount
  useEffect(() => {
    preloadCriticalRoutes();
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AuthProvider>
                <TooltipProvider>
                  <div className="min-h-screen bg-background font-sans antialiased">
                    <Suspense fallback={<PageLoader />}>
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
                        <Route path="/search" element={<SearchPage />} />
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
                        
                        <Route path="*" element={<NotFound />} />
                        {/* 404 catch-all */}
                      </Routes>
                    </Suspense>
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
