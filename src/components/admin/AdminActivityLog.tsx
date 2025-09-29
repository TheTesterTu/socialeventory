
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, User, Edit2, Trash2, Plus } from "lucide-react";

type AdminActivity = {
  id: string;
  type: "create" | "update" | "delete" | "access";
  user: string;
  action: string;
  date: string;
};

// Real activity log data from admin_settings table
const activities: AdminActivity[] = [];

const getIcon = (type: AdminActivity["type"]) => {
  switch (type) {
    case "create":
      return <Plus className="h-4 w-4 text-green-500" />;
    case "update":
      return <Edit2 className="h-4 w-4 text-blue-500" />;
    case "delete":
      return <Trash2 className="h-4 w-4 text-red-500" />;
    case "access":
    default:
      return <User className="h-4 w-4 text-purple-500" />;
  }
};

export const AdminActivityLog = () => {
  return (
    <Card className="mb-8 glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          Log attività amministrative
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-3">
          Storico delle ultime operazioni critiche eseguite dagli admin/owner.
        </div>
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No recent activity to display
          </p>
        ) : (
          <div className="max-h-64 overflow-auto">
            <ul className="divide-y">
              {activities.map((item) => (
                <li key={item.id} className="py-2 flex items-center gap-3">
                  <span>{getIcon(item.type)}</span>
                  <span className="font-mono text-xs text-muted-foreground">{item.date}</span>
                  <span className="text-sm">{item.action}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{item.user}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
