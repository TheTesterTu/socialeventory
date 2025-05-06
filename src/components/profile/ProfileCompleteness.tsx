
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

interface ProfileCompletenessProps {
  user: SupabaseUser | null;
}

export const ProfileCompleteness = ({ user }: ProfileCompletenessProps) => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [missingItems, setMissingItems] = useState<string[]>([]);
  
  useEffect(() => {
    if (!user) {
      setScore(0);
      setMissingItems([]);
      return;
    }
    
    // Calculate profile completeness
    const checkItems = [
      { name: "Profile picture", completed: !!user.user_metadata?.avatar_url },
      { name: "Full name", completed: !!user.user_metadata?.full_name },
      { name: "Username", completed: !!user.user_metadata?.username },
      { name: "Bio", completed: !!user.user_metadata?.bio },
      { name: "Location", completed: !!user.user_metadata?.location },
    ];
    
    const completed = checkItems.filter(item => item.completed).length;
    const missing = checkItems.filter(item => !item.completed).map(item => item.name);
    
    setScore(Math.round((completed / checkItems.length) * 100));
    setMissingItems(missing);
  }, [user]);
  
  if (!user) return null;
  
  if (score === 100) {
    return (
      <Card className="border-green-200 bg-green-50 shadow-sm dark:border-green-900/30 dark:bg-green-900/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="font-medium text-green-800 dark:text-green-300">Profile Complete!</h3>
                <p className="text-sm text-green-600 dark:text-green-400">Your profile is 100% complete.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-amber-200 bg-amber-50 shadow-sm dark:border-amber-900/30 dark:bg-amber-900/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-amber-800 dark:text-amber-300">Complete Your Profile</CardTitle>
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">{score}%</span>
        </div>
        <CardDescription className="text-amber-700 dark:text-amber-400">
          A complete profile helps you connect with others
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <Progress value={score} className="h-2 bg-amber-200 dark:bg-amber-900/50" />
        
        <div className="mt-4 space-y-3">
          {missingItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Missing information:</p>
              <ul className="text-xs space-y-1 text-amber-700 dark:text-amber-400">
                {missingItems.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3" />
                    <span>{item}</span>
                  </li>
                ))}
                {missingItems.length > 3 && (
                  <li className="flex items-center gap-2">
                    <span>+{missingItems.length - 3} more</span>
                  </li>
                )}
              </ul>
            </div>
          )}
          
          <Button 
            size="sm"
            variant="outline"
            onClick={() => navigate('/settings')}
            className="mt-3 w-full border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50"
          >
            <User className="mr-2 h-4 w-4" />
            Complete Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
