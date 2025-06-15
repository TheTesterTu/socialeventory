import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Shield, Database } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminAPIConfigs } from "@/services/api-config";
import { toast } from "sonner";

interface ConfigItem {
  key: string,
  value: string,
  description?: string,
  is_public: boolean
}

export const AdminOverview = () => {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAPIConfigs().then(setConfigs).catch(() => {
      toast.error("Errore nel caricamento configurazioni API");
    }).finally(() => setLoading(false));
  }, []);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Gestione App (Owner)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          Impostazioni critiche e overview di sistema per owner/admin.
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold flex items-center gap-1 mb-2">
              <Settings className="h-4 w-4" /> Configurazioni API
            </h4>
            {loading ? (
              <div className="text-muted-foreground">Caricamento...</div>
            ) : configs.length === 0 ? (
              <div className="text-muted-foreground">Nessuna configurazione trovata</div>
            ) : (
              <ul className="space-y-2">
                {configs.map(cfg => (
                  <li key={cfg.key} className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs">{cfg.key}</span>
                    {cfg.is_public && <Badge variant="secondary">Pubblico</Badge>}
                    <span className="truncate text-xs bg-muted/50 rounded px-2 py-1">{`${cfg.value}`}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h4 className="font-semibold flex items-center gap-1 mb-2">
              <Database className="h-4 w-4" /> Stato Sistema
            </h4>
            <ul className="text-xs space-y-1">
              <li>
                <span className="font-semibold">Supabase:</span>{" "}
                <Badge variant="default">✓ Online</Badge>
              </li>
              <li><span className="font-semibold">Utenti:</span> Solo admin può vedere questa sezione</li>
              <li className="text-muted-foreground">Per logs avanzati integrare edge functions.</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
