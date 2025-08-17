import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  Settings,
  Shield
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminActivityLog } from "@/components/admin/AdminActivityLog";
import { EventApprovalCard } from "@/components/admin/EventApprovalCard";
import { useProductionStats } from "@/hooks/useProductionStats";
import { useAdminData } from "@/hooks/useAdminData";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";

const AdminDashboard = () => {
  const stats = useProductionStats();
  const { pendingEvents, recentUsers, loading, error, approveEvent, rejectEvent, deleteEvent } = useAdminData();

  if (loading) {
    return (
      <AppLayout
        pageTitle="Admin Dashboard"
        pageDescription="Manage your platform and monitor activity"
      >
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout
        pageTitle="Admin Dashboard"
        pageDescription="Manage your platform and monitor activity"
      >
        <div className="text-center text-red-500">
          Error loading admin data: {error}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      pageTitle="Admin Dashboard"
      pageDescription="Manage your platform and monitor activity"
    >
      {/* -- NOVITÀ: OVERVIEW ADMIN -- */}
      <AdminOverview />

      {/* -- NOVITÀ: LOG ATTIVITÀ ADMIN -- */}
      <AdminActivityLog />

      <div className="space-y-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { 
              title: "Total Users", 
              value: stats.totalUsers.toLocaleString(), 
              icon: Users, 
              trend: stats.loading ? "Loading..." : "Active",
              color: "text-blue-500"
            },
            { 
              title: "Total Events", 
              value: stats.totalEvents.toLocaleString(), 
              icon: Calendar, 
              trend: stats.loading ? "Loading..." : "All Time",
              color: "text-green-500" 
            },
            { 
              title: "Live Events", 
              value: stats.liveEvents.toLocaleString(), 
              icon: TrendingUp, 
              trend: "Right Now",
              color: "text-purple-500"
            },
            { 
              title: "Pending Approvals", 
              value: pendingEvents.length.toLocaleString(), 
              icon: AlertCircle, 
              trend: "Needs Review",
              color: "text-orange-500"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className={`text-sm ${stat.color} font-medium`}>{stat.trend}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="events" className="space-y-6">
            <TabsList className="glass-card">
              <TabsTrigger value="events">Events Management</TabsTrigger>
              <TabsTrigger value="users">Users Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Events Pending Approval ({pendingEvents.length})</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Review and approve or reject events submitted by users
                  </p>
                </CardHeader>
                <CardContent>
                  {pendingEvents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No events pending approval
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingEvents.map((event) => (
                        <EventApprovalCard
                          key={event.id}
                          event={event}
                          onApprove={approveEvent}
                          onReject={rejectEvent}
                          onDelete={deleteEvent}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Recent Users ({recentUsers.length})</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Latest users who joined the platform
                  </p>
                </CardHeader>
                <CardContent>
                  {recentUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No users found
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 glass-card rounded-lg">
                          <div className="flex items-center gap-3">
                            {user.avatar_url && (
                              <img 
                                src={user.avatar_url} 
                                alt={user.full_name || user.username || 'User'}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div className="space-y-1">
                              <h4 className="font-semibold">
                                {user.full_name || user.username || `User ${user.id.slice(0, 8)}`}
                              </h4>
                              <p className="text-sm text-muted-foreground">@{user.username || 'no-username'}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                                <span>{user.eventsCreated} events created</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      User Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Analytics charts would be implemented here</p>
                      <p className="text-sm text-muted-foreground mt-2">Integration with charts library needed</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Event Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Event performance metrics</p>
                      <p className="text-sm text-muted-foreground mt-2">Real-time data visualization</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Platform Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Site Name</label>
                      <input 
                        type="text" 
                        defaultValue="SocialEventory" 
                        className="w-full p-2 rounded glass-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Contact Email</label>
                      <input 
                        type="email" 
                        defaultValue="admin@socialeventory.com" 
                        className="w-full p-2 rounded glass-input"
                      />
                    </div>
                    <Button className="gradient-primary">Save Settings</Button>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Auto-approve events</label>
                      <select className="w-full p-2 rounded glass-input">
                        <option>Require manual approval</option>
                        <option>Auto-approve verified organizers</option>
                        <option>Auto-approve all events</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">User registration</label>
                      <select className="w-full p-2 rounded glass-input">
                        <option>Open registration</option>
                        <option>Invite only</option>
                        <option>Admin approval required</option>
                      </select>
                    </div>
                    <Button className="gradient-primary">Update Security</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
