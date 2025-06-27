
import { useProductionReady } from '@/hooks/useProductionReady';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Database, Shield, HardDrive, Zap } from 'lucide-react';

export const ProductionReadyBanner = () => {
  const { isReady, checks } = useProductionReady();

  if (isReady) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-green-700 font-medium">Production Ready</span>
          <Badge variant="outline" className="text-green-600 border-green-600">
            All Systems Operational
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-yellow-500" />
          <span className="text-yellow-700 font-medium">System Status</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span className={checks.database ? 'text-green-600' : 'text-red-600'}>
              Database
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span className={checks.auth ? 'text-green-600' : 'text-red-600'}>
              Auth
            </span>
          </div>
          <div className="flex items-center gap-1">
            <HardDrive className="h-4 w-4" />
            <span className={checks.storage ? 'text-green-600' : 'text-red-600'}>
              Storage
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            <span className={checks.realtime ? 'text-green-600' : 'text-red-600'}>
              Realtime
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
