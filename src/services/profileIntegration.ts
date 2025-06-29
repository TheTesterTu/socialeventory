
import { supabase } from '@/integrations/supabase/client';

export interface ProfileData {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export const profileIntegrationService = {
  async ensureProfileExists(userId: string): Promise<{ success: boolean; error?: string; profile?: ProfileData }> {
    try {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        return { success: false, error: `Profile fetch error: ${fetchError.message}` };
      }

      if (existingProfile) {
        return { success: true, profile: existingProfile };
      }

      // Create profile if it doesn't exist
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const newProfile = {
        id: userId,
        username: user.email?.split('@')[0] || `user_${userId.slice(0, 8)}`,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        avatar_url: user.user_metadata?.avatar_url || null,
        bio: null,
        role: 'user'
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (createError) {
        return { success: false, error: `Profile creation error: ${createError.message}` };
      }

      return { success: true, profile: createdProfile };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  async syncUserWithProfile(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        return { success: false, error: `Auth error: ${userError.message}` };
      }

      if (!user) {
        return { success: false, error: 'No authenticated user' };
      }

      const result = await this.ensureProfileExists(user.id);
      return result;
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  async testProfileIntegration(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'No authenticated user for testing' };
      }

      // Test profile creation/retrieval
      const profileResult = await this.ensureProfileExists(user.id);
      if (!profileResult.success) {
        return { success: false, error: profileResult.error };
      }

      // Test profile update
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) {
        return { success: false, error: `Profile update test failed: ${updateError.message}` };
      }

      return { 
        success: true, 
        details: {
          userId: user.id,
          profileExists: true,
          canUpdate: true
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
};
