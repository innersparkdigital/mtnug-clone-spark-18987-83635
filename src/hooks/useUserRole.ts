import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type AppRole = 'admin' | 'moderator' | 'user';

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export const useUserRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchRoles = useCallback(async () => {
    if (!user) {
      setRoles([]);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Type assertion since we know the structure from our migration
      const typedData = (data || []) as unknown as UserRole[];
      setRoles(typedData);
      setIsAdmin(typedData.some(r => r.role === 'admin'));
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setRoles([]);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const hasRole = useCallback((role: AppRole): boolean => {
    return roles.some(r => r.role === role);
  }, [roles]);

  return {
    roles,
    loading,
    isAdmin,
    hasRole,
    refetch: fetchRoles
  };
};
