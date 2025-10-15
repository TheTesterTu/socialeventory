import { useState } from 'react';
import { Shield, Settings, Users, Calendar, BarChart, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSecureAdmin } from '@/hooks/useSecureAdmin';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const AdminQuickAccess = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, loading } = useSecureAdmin();

  // Only show for admin users
  if (loading || !isAdmin) {
    return null;
  }

  const adminActions = [
    {
      icon: Calendar,
      label: 'Events Dashboard',
      path: '/admin',
      color: 'text-blue-500 hover:bg-blue-50'
    },
    {
      icon: BarChart,
      label: 'Production Audit',
      path: '/production-audit',
      color: 'text-green-500 hover:bg-green-50'
    },
    {
      icon: Users,
      label: 'User Management',
      path: '/admin#users',
      color: 'text-purple-500 hover:bg-purple-50'
    },
    {
      icon: Settings,
      label: 'System Settings',
      path: '/admin#settings',
      color: 'text-orange-500 hover:bg-orange-50'
    }
  ];

  return (
    <TooltipProvider>
      <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end space-y-2">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col space-y-2"
            >
              {adminActions.map((action, index) => (
                <motion.div
                  key={action.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigate(action.path);
                          setIsExpanded(false);
                        }}
                        className={`w-12 h-12 rounded-full shadow-lg bg-white border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 ${action.color}`}
                      >
                        <action.icon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>{action.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main admin button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-14 h-14 rounded-full shadow-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 transition-all duration-200 hover:scale-105"
            >
              {isExpanded ? (
                <ChevronUp className="h-6 w-6" />
              ) : (
                <Shield className="h-6 w-6" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{isExpanded ? 'Close Admin Menu' : 'Admin Quick Access'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};