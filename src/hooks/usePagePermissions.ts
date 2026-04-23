import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "./useUserRole";

export const ADMIN_PAGES = {
  learning: { key: "learning", label: "Learning Analytics" },
  registrations: { key: "registrations", label: "Training Registrations" },
  newsletter: { key: "newsletter", label: "Newsletter" },
  referrals: { key: "referrals", label: "Referrals" },
  finance: { key: "finance", label: "Finance & Accounts", sensitive: true },
  mindcheck: { key: "mindcheck", label: "Mind Check Analytics", sensitive: true },
  corporate: { key: "corporate", label: "Corporate Wellbeing" },
  content: { key: "content", label: "Content (Trainings/Blogs/Events)" },
  users: { key: "users", label: "Admin Users & Roles", superOnly: true },
} as const;

export type AdminPageKey = keyof typeof ADMIN_PAGES;

export const usePagePermissions = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = useCallback(async () => {
    if (!user) {
      setPages([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("admin_page_permissions")
      .select("page_key")
      .eq("user_id", user.id);
    if (!error && data) setPages(data.map((r) => r.page_key));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const hasPageAccess = useCallback(
    (pageKey: AdminPageKey | string): boolean => {
      // Super-only pages (like user management) require full admin
      const meta = (ADMIN_PAGES as Record<string, { superOnly?: boolean }>)[pageKey];
      if (meta?.superOnly) return isAdmin;
      if (isAdmin) return true;
      return pages.includes(pageKey);
    },
    [isAdmin, pages],
  );

  return {
    isAdmin,
    loading: loading || roleLoading,
    pages,
    hasPageAccess,
    refetch: fetchPages,
  };
};