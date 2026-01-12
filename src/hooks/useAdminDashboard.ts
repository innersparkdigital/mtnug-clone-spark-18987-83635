import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from './useUserRole';

interface UserWithProgress {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  enrollments: {
    course_id: string;
    enrolled_at: string;
    completed_at: string | null;
  }[];
  lessonProgress: {
    course_id: string;
    module_id: string;
    lesson_id: string;
    completed: boolean;
    quiz_score: number | null;
  }[];
}

interface DashboardStats {
  totalUsers: number;
  totalEnrollments: number;
  totalCompletions: number;
  averageProgress: number;
}

export const useAdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [users, setUsers] = useState<UserWithProgress[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEnrollments: 0,
    totalCompletions: 0,
    averageProgress: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchAdminData = useCallback(async () => {
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }

    try {
      // Fetch all profiles (admin can see all)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Fetch all enrollments
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select('*');

      if (enrollmentsError) throw enrollmentsError;

      // Fetch all lesson progress
      const { data: progress, error: progressError } = await supabase
        .from('lesson_progress')
        .select('*');

      if (progressError) throw progressError;

      // Combine data per user
      const usersWithProgress: UserWithProgress[] = (profiles || []).map(profile => ({
        id: profile.id,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        enrollments: (enrollments || [])
          .filter(e => e.user_id === profile.id)
          .map(e => ({
            course_id: e.course_id,
            enrolled_at: e.enrolled_at,
            completed_at: e.completed_at
          })),
        lessonProgress: (progress || [])
          .filter(p => p.user_id === profile.id)
          .map(p => ({
            course_id: p.course_id,
            module_id: p.module_id,
            lesson_id: p.lesson_id,
            completed: p.completed || false,
            quiz_score: p.quiz_score
          }))
      }));

      setUsers(usersWithProgress);

      // Calculate stats
      const totalEnrollments = enrollments?.length || 0;
      const totalCompletions = enrollments?.filter(e => e.completed_at)?.length || 0;
      const completedLessons = progress?.filter(p => p.completed)?.length || 0;
      const totalLessons = progress?.length || 0;
      const averageProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      setStats({
        totalUsers: profiles?.length || 0,
        totalEnrollments,
        totalCompletions,
        averageProgress
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [fetchAdminData, isAdmin]);

  return {
    users,
    stats,
    loading,
    refetch: fetchAdminData
  };
};
