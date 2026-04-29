import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Trash2, Shield, Copy, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { ADMIN_PAGES } from "@/hooks/usePagePermissions";

type AppRole = "admin" | "finance_admin" | "operations_admin" | "content_admin";
const ROLE_OPTIONS: { value: AppRole; label: string; description: string }[] = [
  { value: "admin", label: "Super Admin", description: "Full access to everything" },
  { value: "finance_admin", label: "Finance Admin", description: "Finance & accounts" },
  { value: "operations_admin", label: "Operations Admin", description: "Day-to-day operations" },
  { value: "content_admin", label: "Content Admin", description: "Trainings, blogs, events" },
];

const PAGE_KEYS = Object.values(ADMIN_PAGES).filter((p) => !("superOnly" in p && p.superOnly));

interface AdminUser {
  id: string;
  display_name: string | null;
  created_at: string;
  email?: string | null;
  roles: AppRole[];
  pages: string[];
}

const generatePassword = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let p = "";
  for (let i = 0; i < 12; i++) p += chars[Math.floor(Math.random() * chars.length)];
  return p + "!@";
};

const AdminUsersTab = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Create form
  const [form, setForm] = useState({ full_name: "", email: "", password: generatePassword(), roles: [] as AppRole[], pages: [] as string[] });

  // Edit form
  const [editRoles, setEditRoles] = useState<AppRole[]>([]);
  const [editPages, setEditPages] = useState<string[]>([]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data: roleRows } = await supabase.from("user_roles").select("user_id, role");
    const userIds = Array.from(new Set((roleRows || []).map((r) => r.user_id)));
    if (userIds.length === 0) {
      setUsers([]);
      setLoading(false);
      return;
    }
    const { data: profiles } = await supabase.from("profiles").select("id, display_name, created_at").in("id", userIds);
    const { data: perms } = await supabase.from("admin_page_permissions").select("user_id, page_key").in("user_id", userIds);

    const merged: AdminUser[] = (profiles || []).map((p) => ({
      id: p.id,
      display_name: p.display_name,
      created_at: p.created_at,
      roles: (roleRows || []).filter((r) => r.user_id === p.id).map((r) => r.role as AppRole),
      pages: (perms || []).filter((pm) => pm.user_id === p.id).map((pm) => pm.page_key),
    }));
    // Include users with roles but no profile row
    userIds.forEach((id) => {
      if (!merged.find((u) => u.id === id)) {
        merged.push({
          id,
          display_name: null,
          created_at: new Date().toISOString(),
          roles: (roleRows || []).filter((r) => r.user_id === id).map((r) => r.role as AppRole),
          pages: (perms || []).filter((pm) => pm.user_id === id).map((pm) => pm.page_key),
        });
      }
    });
    setUsers(merged.sort((a, b) => (a.display_name || "").localeCompare(b.display_name || "")));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async () => {
    if (!form.full_name.trim() || !form.email.trim() || form.password.length < 8) {
      toast.error("Name, email and 8+ char password are required");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("admin-create-user", {
      body: {
        action: "create",
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        roles: form.roles,
        pages: form.pages,
      },
    });
    setSubmitting(false);
    if (error || (data as { error?: string })?.error) {
      toast.error((data as { error?: string })?.error || error?.message || "Failed to create user");
      return;
    }
    toast.success("Admin user created");
    setCreateOpen(false);
    setForm({ full_name: "", email: "", password: generatePassword(), roles: [], pages: [] });
    fetchUsers();
  };

  const handleSaveAccess = async () => {
    if (!editing) return;
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("admin-create-user", {
      body: { action: "update_access", user_id: editing.id, roles: editRoles, pages: editPages },
    });
    setSubmitting(false);
    if (error || (data as { error?: string })?.error) {
      toast.error((data as { error?: string })?.error || error?.message || "Failed to update access");
      return;
    }
    toast.success("Access updated");
    setEditing(null);
    fetchUsers();
  };

  const handleDelete = async (u: AdminUser) => {
    if (!confirm(`Remove all admin access for ${u.display_name || u.id}? This cannot be undone.`)) return;
    const { data, error } = await supabase.functions.invoke("admin-create-user", {
      body: { action: "delete", user_id: u.id },
    });
    if (error || (data as { error?: string })?.error) {
      toast.error((data as { error?: string })?.error || error?.message || "Failed to delete");
      return;
    }
    toast.success("User removed");
    fetchUsers();
  };

  const copyCreds = () => {
    navigator.clipboard.writeText(`Email: ${form.email}\nPassword: ${form.password}`);
    toast.success("Credentials copied");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Users & Roles
            </CardTitle>
            <CardDescription>Onboard admins, assign roles, and grant per-page access.</CardDescription>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setForm({ ...form, password: generatePassword() })}>
                <Plus className="h-4 w-4 mr-2" /> New Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Admin User</DialogTitle>
                <DialogDescription>The user will be able to log in with the email and password below.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase() })} />
                  </div>
                </div>
                <div>
                  <Label>Password</Label>
                  <div className="flex gap-2">
                    <Input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <Button type="button" variant="outline" size="icon" onClick={() => setForm({ ...form, password: generatePassword() })}>
                      <KeyRound className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" onClick={copyCreds}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Roles</Label>
                  <div className="space-y-2">
                    {ROLE_OPTIONS.map((r) => (
                      <label key={r.value} className="flex items-start gap-2 p-2 rounded border hover:bg-muted/50 cursor-pointer">
                        <Checkbox
                          checked={form.roles.includes(r.value)}
                          onCheckedChange={(c) =>
                            setForm({
                              ...form,
                              roles: c ? [...form.roles, r.value] : form.roles.filter((x) => x !== r.value),
                            })
                          }
                        />
                        <div>
                          <div className="text-sm font-medium">{r.label}</div>
                          <div className="text-xs text-muted-foreground">{r.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Page Access (in addition to role)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAGE_KEYS.map((p) => (
                      <label key={p.key} className="flex items-center gap-2 text-sm p-2 rounded border hover:bg-muted/50 cursor-pointer">
                        <Checkbox
                          checked={form.pages.includes(p.key)}
                          onCheckedChange={(c) =>
                            setForm({
                              ...form,
                              pages: c ? [...form.pages, p.key] : form.pages.filter((x) => x !== p.key),
                            })
                          }
                        />
                        <span>{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No admin users yet. Click "New Admin" to onboard your first.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Page Access</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="font-medium">{u.display_name || "—"}</div>
                      <div className="text-xs text-muted-foreground font-mono">{u.id.substring(0, 8)}…</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.roles.length === 0 ? <span className="text-xs text-muted-foreground">—</span> : u.roles.map((r) => (
                          <Badge key={r} variant={r === "admin" ? "default" : "secondary"}>{r}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {u.roles.includes("admin") ? (
                        <Badge variant="outline">All pages</Badge>
                      ) : u.pages.length === 0 ? (
                        <span className="text-xs text-muted-foreground">None</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {u.pages.map((p) => (
                            <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(u);
                          setEditRoles(u.roles);
                          setEditPages(u.pages);
                        }}
                      >
                        Edit Access
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(u)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Access — {editing?.display_name || editing?.id.substring(0, 8)}</DialogTitle>
            <DialogDescription>Update roles and page-level permissions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Roles</Label>
              <div className="space-y-2">
                {ROLE_OPTIONS.map((r) => (
                  <label key={r.value} className="flex items-start gap-2 p-2 rounded border hover:bg-muted/50 cursor-pointer">
                    <Checkbox
                      checked={editRoles.includes(r.value)}
                      onCheckedChange={(c) => setEditRoles(c ? [...editRoles, r.value] : editRoles.filter((x) => x !== r.value))}
                    />
                    <div>
                      <div className="text-sm font-medium">{r.label}</div>
                      <div className="text-xs text-muted-foreground">{r.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Page Access</Label>
              <div className="grid grid-cols-2 gap-2">
                {PAGE_KEYS.map((p) => (
                  <label key={p.key} className="flex items-center gap-2 text-sm p-2 rounded border hover:bg-muted/50 cursor-pointer">
                    <Checkbox
                      checked={editPages.includes(p.key)}
                      onCheckedChange={(c) => setEditPages(c ? [...editPages, p.key] : editPages.filter((x) => x !== p.key))}
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={handleSaveAccess} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersTab;