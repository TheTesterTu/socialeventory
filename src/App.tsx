
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Nearby from "./pages/Nearby";
import CreateEvent from "./pages/CreateEvent";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import OrganizerProfile from "./pages/OrganizerProfile";
import Organizers from "./pages/Organizers";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import NotificationsPage from "./pages/NotificationsPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AdminDashboard from "./pages/AdminDashboard";
import ProductionAuditPage from "./pages/ProductionAuditPage";
import SystemTest from "./pages/SystemTest";
import NotFound from "./pages/NotFound";
import Events from './pages/Events';
import EventDetails from "./pages/EventDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/events",
    element: <Events />,
  },
  {
    path: "/event/:id",
    element: <EventDetails />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/nearby",
    element: <Nearby />,
  },
  {
    path: "/create",
    element: <CreateEvent />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/profile/:id",
    element: <OrganizerProfile />,
  },
  {
    path: "/profile/edit",
    element: <ProfileEdit />,
  },
  {
    path: "/organizers",
    element: <Organizers />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:slug",
    element: <BlogPost />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/notifications",
    element: <NotificationsPage />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/production-audit",
    element: <ProductionAuditPage />,
  },
  {
    path: "/admin/system-test",
    element: <SystemTest />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
