
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ShieldCheck } from "lucide-react";

export const AdminTools = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Admin Tools</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Production tools locked
          </CardTitle>
          <CardDescription>
            Demo event loaders were removed so admins cannot pollute production data from the UI.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Use the event creation flow or approved imports for real events only.
        </CardContent>
      </Card>
    </div>
  );
};
