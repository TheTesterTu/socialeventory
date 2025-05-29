
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, FileText, Users, Calendar } from "lucide-react";

export const DataSourceAudit = () => {
  const dataSources = [
    {
      name: "Events",
      icon: <Calendar className="h-5 w-5" />,
      status: "Mixed",
      details: "Real Supabase data + Mock fallback",
      tables: ["events", "event_likes", "event_attendees"],
      mockFiles: ["mock-data.ts"],
      percentage: 70
    },
    {
      name: "Users & Profiles", 
      icon: <Users className="h-5 w-5" />,
      status: "Supabase",
      details: "Fully integrated with Supabase Auth",
      tables: ["profiles", "auth.users"],
      mockFiles: [],
      percentage: 100
    },
    {
      name: "Comments & Chat",
      icon: <FileText className="h-5 w-5" />,
      status: "Supabase",
      details: "Real-time comments via Supabase",
      tables: ["comments"],
      mockFiles: [],
      percentage: 100
    },
    {
      name: "Blog Posts",
      icon: <FileText className="h-5 w-5" />,
      status: "Mock",
      details: "Using mock data, needs migration",
      tables: ["blog_posts"],
      mockFiles: ["blog-data.ts"],
      percentage: 20
    },
    {
      name: "Categories",
      icon: <Database className="h-5 w-5" />,
      status: "Mixed",
      details: "Static categories + DB structure ready",
      tables: ["categories"],
      mockFiles: ["constants.ts"],
      percentage: 50
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Supabase': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Mixed': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Mock': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const overallMigration = Math.round(
    dataSources.reduce((acc, source) => acc + source.percentage, 0) / dataSources.length
  );

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Source Migration Status
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Overall Supabase Integration: <span className="font-medium text-primary">{overallMigration}%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {dataSources.map((source) => (
          <div key={source.name} className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
            <div className="p-2 rounded-lg bg-primary/10">
              {source.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium">{source.name}</h3>
                <Badge className={getStatusColor(source.status)}>
                  {source.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {source.percentage}% migrated
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{source.details}</p>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-medium text-green-600">Supabase Tables:</span>
                  <div className="mt-1">
                    {source.tables.length > 0 ? (
                      source.tables.map(table => (
                        <div key={table} className="text-muted-foreground">• {table}</div>
                      ))
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-orange-600">Mock Files:</span>
                  <div className="mt-1">
                    {source.mockFiles.length > 0 ? (
                      source.mockFiles.map(file => (
                        <div key={file} className="text-muted-foreground">• {file}</div>
                      ))
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
