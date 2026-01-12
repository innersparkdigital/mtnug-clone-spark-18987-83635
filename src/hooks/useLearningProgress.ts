import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LessonProgress {
  id: string;
  course_id: string;
  module_id: string;
  lesson_id: string;
  completed: boolean;
  last_slide: number;
  quiz_score: number | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface CourseEnrollment {
  id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
}

export const useLearningProgress = (courseId?: string) => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's enrollments and progress
  const fetchProgress = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch enrollments
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', user.id);

      if (enrollmentError) throw enrollmentError;
      setEnrollments(enrollmentData || []);

      // Fetch lesson progress
      let progressQuery = supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id);

      if (courseId) {
        progressQuery = progressQuery.eq('course_id', courseId);
      }

      const { data: progressData, error: progressError } = await progressQuery;
      if (progressError) throw progressError;
      setLessonProgress(progressData || []);
    } catch (error) {
      console.error('Error fetching learning progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user, courseId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Enroll in a course
  const enrollInCourse = async (courseIdToEnroll: string) => {
    if (!user) {
      toast.error('Please sign in to enroll in courses');
      return false;
    }

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .upsert({
          user_id: user.id,
          course_id: courseIdToEnroll
        }, {
          onConflict: 'user_id,course_id'
        });

      if (error) throw error;
      
      toast.success('Successfully enrolled in course!');
      await fetchProgress();
      return true;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
      return false;
    }
  };

  // Check if enrolled in a course
  const isEnrolled = (checkCourseId: string) => {
    return enrollments.some(e => e.course_id === checkCourseId);
  };

  // Update lesson progress
  const updateLessonProgress = async (
    progressCourseId: string,
    moduleId: string,
    lessonId: string,
    currentSlide: number,
    completed: boolean = false,
    quizScore?: number
  ) => {
    if (!user) return false;

    try {
      const updateData: any = {
        user_id: user.id,
        course_id: progressCourseId,
        module_id: moduleId,
        lesson_id: lessonId,
        last_slide: currentSlide,
        completed,
        quiz_score: quizScore
      };

      if (completed) {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('lesson_progress')
        .upsert(updateData, {
          onConflict: 'user_id,course_id,module_id,lesson_id'
        });

      if (error) throw error;
      
      await fetchProgress();
      return true;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      return false;
    }
  };

  // Get progress for a specific lesson
  const getLessonProgress = (moduleId: string, lessonId: string) => {
    return lessonProgress.find(
      p => p.module_id === moduleId && p.lesson_id === lessonId
    );
  };

  // Calculate course completion percentage
  const getCourseProgress = (checkCourseId: string, totalLessons: number) => {
    const completedLessons = lessonProgress.filter(
      p => p.course_id === checkCourseId && p.completed
    ).length;
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  // Get completed lesson count for a module
  const getModuleProgress = (moduleId: string) => {
    return lessonProgress.filter(
      p => p.module_id === moduleId && p.completed
    ).length;
  };

  // Mark course as completed
  const markCourseCompleted = async (completeCourseId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .update({ completed_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('course_id', completeCourseId);

      if (error) throw error;
      
      toast.success('Congratulations! You completed the course!');
      await fetchProgress();
      return true;
    } catch (error) {
      console.error('Error marking course complete:', error);
      return false;
    }
  };

  return {
    enrollments,
    lessonProgress,
    loading,
    enrollInCourse,
    isEnrolled,
    updateLessonProgress,
    getLessonProgress,
    getCourseProgress,
    getModuleProgress,
    markCourseCompleted,
    refetch: fetchProgress
  };
};
