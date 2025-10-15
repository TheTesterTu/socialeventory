
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { emailSchema, passwordSchema } from "@/lib/utils/validation";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // After checking the session, if user is still authenticated
      // fetch any additional profile data if needed
      if (session?.user) {
        // Use setTimeout to prevent potential deadlocks
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      // Store additional user data if needed
      // This would be used for storing permissions, preferences, etc.
      if (data) {
        // Profile data available for future use
      }
    } catch (error) {
      // Silent profile fetch error
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Validate email
      emailSchema.parse(email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please check your credentials and try again.");
        }
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Please verify your email address before signing in. Check your inbox for the confirmation link.");
        }
        throw error;
      }
      
      toast.success("Welcome back!");
    } catch (error: any) {
      const message = error.message || "Failed to sign in. Please try again.";
      toast.error(message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string, fullName: string) => {
    try {
      // Validate inputs
      emailSchema.parse(email);
      passwordSchema.parse(password);
      
      if (!username || username.length < 3) {
        throw new Error("Username must be at least 3 characters long");
      }
      
      if (!fullName || fullName.length < 2) {
        throw new Error("Full name is required");
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username,
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes("User already registered")) {
          throw new Error("An account with this email already exists. Please sign in instead.");
        }
        if (error.message.includes("Password should be")) {
          throw new Error("Password must be at least 6 characters long");
        }
        throw error;
      }
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        toast.success("Account created! Please check your email to verify your account before signing in.", {
          duration: 6000,
        });
      } else {
        toast.success("Welcome to SocialEventory! Your account has been created.");
      }
    } catch (error: any) {
      const message = error.message || "Failed to create account. Please try again.";
      toast.error(message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user and session state
      setUser(null);
      setSession(null);
      
      // Navigate to auth page
      navigate("/auth");
      toast.success("Successfully signed out!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      // Validate email
      emailSchema.parse(email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset instructions have been sent to your email. Please check your inbox.");
    } catch (error: any) {
      const message = error.message || "Failed to send password reset email. Please try again.";
      toast.error(message);
      throw error;
    }
  };
  
  const updatePassword = async (password: string) => {
    try {
      // Validate password strength
      passwordSchema.parse(password);
      
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      toast.success("Your password has been updated successfully!");
    } catch (error: any) {
      const message = error.message || "Failed to update password. Please try again.";
      toast.error(message);
      throw error;
    }
  };
  
  const refreshSession = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
    } catch (error: any) {
      // Don't throw here to avoid breaking the app flow
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      resetPassword,
      updatePassword,
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
