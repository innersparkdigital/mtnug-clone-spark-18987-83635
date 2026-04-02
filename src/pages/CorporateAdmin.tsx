import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Building2, Users, Plus, Upload, BarChart3, FileText, Trash2, UserPlus, ClipboardList, AlertTriangle, Phone, MessageCircle, Download, TrendingUp, Activity, Search, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Company {
  id: string;
  name: string;
  industry: string | null;
  employee_count: number | null;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
}

interface Employee {
  id: string;
  company_id: string;
  name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  access_code: string;
  secure_token: string;
  invitation_sent: boolean;
  screening_completed: boolean;
}

interface Screening {
  id: string;
  employee_id: string;
  company_id: string;
  who5_score: number;
  who5_percentage: number;
  workplace_responses: any;
  total_score: number;
  wellbeing_category: string;
  completed_at: string;
}

const COMPANIES_PER_PAGE = 10;
const EMPLOYEES_PER_PAGE = 15;

const CorporateAdmin = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateCompany, setShowCreateCompany] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [companyForm, setCompanyForm] = useState({ name: '', industry: '', employee_count: '', contact_person: '', contact_email: '', contact_phone: '' });
  const [employeeForm, setEmployeeForm] = useState({ name: '', email: '', phone: '', gender: '' });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [allScreenings, setAllScreenings] = useState<Screening[]>([]);

  // Pagination & search
  const [companyPage, setCompanyPage] = useState(1);
  const [employeePage, setEmployeePage] = useState(1);
  const [companySearch, setCompanySearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');

  useEffect(() => {
    if (!roleLoading && !isAdmin) navigate('/auth');
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchCompanies();
      fetchAllGlobalData();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedCompany) {
      fetchEmployees(selectedCompany.id);
      fetchScreenings(selectedCompany.id);
      setEmployeePage(1);
      setEmployeeSearch('');
    }
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    const { data } = await supabase.from('corporate_companies').select('*').order('created_at', { ascending: false });
    setCompanies((data as any[]) || []);
    setLoading(false);
  };

  const fetchAllGlobalData = async () => {
    const [empRes, scrRes] = await Promise.all([
      supabase.from('corporate_employees').select('*'),
      supabase.from('corporate_screenings').select('*'),
    ]);
    setAllEmployees((empRes.data as any[]) || []);
    setAllScreenings((scrRes.data as any[]) || []);
  };

  const fetchEmployees = async (companyId: string) => {
    const { data } = await supabase.from('corporate_employees').select('*').eq('company_id', companyId);
    setEmployees((data as any[]) || []);
  };

  const fetchScreenings = async (companyId: string) => {
    const { data } = await supabase.from('corporate_screenings').select('*').eq('company_id', companyId);
    setScreenings((data as any[]) || []);
  };

  const createCompany = async () => {
    if (!companyForm.name.trim()) { toast.error('Company name is required'); return; }
    const { error } = await supabase.from('corporate_companies').insert({
      name: companyForm.name,
      industry: companyForm.industry || null,
      employee_count: companyForm.employee_count ? parseInt(companyForm.employee_count) : null,
      contact_person: companyForm.contact_person || null,
      contact_email: companyForm.contact_email || null,
      contact_phone: companyForm.contact_phone || null,
      created_by: user?.id,
    });
    if (error) { toast.error('Failed to create company'); return; }
    toast.success('Company created');
    setShowCreateCompany(false);
    setCompanyForm({ name: '', industry: '', employee_count: '', contact_person: '', contact_email: '', contact_phone: '' });
    fetchCompanies();
  };

  const addEmployee = async () => {
    if (!selectedCompany || !employeeForm.name.trim() || !employeeForm.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    const { error } = await supabase.from('corporate_employees').insert({
      company_id: selectedCompany.id,
      name: employeeForm.name,
      email: employeeForm.email,
      phone: employeeForm.phone || null,
      gender: employeeForm.gender || null,
    });
    if (error) { toast.error('Failed to add employee'); return; }
    toast.success('Employee added');
    setShowAddEmployee(false);
    setEmployeeForm({ name: '', email: '', phone: '', gender: '' });
    fetchEmployees(selectedCompany.id);
    fetchAllGlobalData();
  };

  const handleCsvUpload = async () => {
    if (!csvFile || !selectedCompany) return;
    const text = await csvFile.text();
    const rows = text.split('\n').slice(1).filter(r => r.trim());
    const parsed = rows.map(row => {
      const cols = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      return { company_id: selectedCompany.id, name: cols[0] || '', email: cols[1] || '', phone: cols[2] || null, gender: cols[3] || null };
    }).filter(e => e.name && e.email);
    if (parsed.length === 0) { toast.error('No valid rows found in CSV'); return; }
    const { error } = await supabase.from('corporate_employees').insert(parsed);
    if (error) { toast.error('Upload failed'); return; }
    toast.success(`${parsed.length} employees added`);
    setCsvFile(null);
    fetchEmployees(selectedCompany.id);
  };

  const deleteCompany = async (id: string) => {
    await supabase.from('corporate_companies').delete().eq('id', id);
    toast.success('Company deleted');
    if (selectedCompany?.id === id) setSelectedCompany(null);
    fetchCompanies();
  };

  // Build employee-screening map
  const employeeScreeningMap = new Map<string, Screening>();
  screenings.forEach(s => employeeScreeningMap.set(s.employee_id, s));

  // Analytics
  const totalEmployees = employees.length;
  const completedScreenings = screenings.length;
  const participationRate = totalEmployees > 0 ? Math.round((completedScreenings / totalEmployees) * 100) : 0;
  const avgScore = completedScreenings > 0 ? Math.round(screenings.reduce((s, x) => s + x.who5_percentage, 0) / completedScreenings) : 0;
  const greenCount = screenings.filter(s => s.wellbeing_category === 'green').length;
  const yellowCount = screenings.filter(s => s.wellbeing_category === 'yellow').length;
  const redCount = screenings.filter(s => s.wellbeing_category === 'red').length;
  const needsSupportCount = redCount + yellowCount;

  // Sort employees: red first, then yellow, then others
  const sortedEmployees = useMemo(() => [...employees].sort((a, b) => {
    const sa = employeeScreeningMap.get(a.id);
    const sb = employeeScreeningMap.get(b.id);
    const priority = (s: Screening | undefined) => {
      if (!s) return 3;
      if (s.wellbeing_category === 'red') return 0;
      if (s.wellbeing_category === 'yellow') return 1;
      return 2;
    };
    return priority(sa) - priority(sb);
  }), [employees, screenings]);

  // Filtered & paginated companies
  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) return companies;
    const q = companySearch.toLowerCase();
    return companies.filter(c => c.name.toLowerCase().includes(q) || c.industry?.toLowerCase().includes(q) || c.contact_person?.toLowerCase().includes(q));
  }, [companies, companySearch]);

  const totalCompanyPages = Math.max(1, Math.ceil(filteredCompanies.length / COMPANIES_PER_PAGE));
  const paginatedCompanies = filteredCompanies.slice((companyPage - 1) * COMPANIES_PER_PAGE, companyPage * COMPANIES_PER_PAGE);

  // Filtered & paginated employees
  const filteredEmployees = useMemo(() => {
    if (!employeeSearch.trim()) return sortedEmployees;
    const q = employeeSearch.toLowerCase();
    return sortedEmployees.filter(e => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.phone?.toLowerCase().includes(q));
  }, [sortedEmployees, employeeSearch]);

  const totalEmployeePages = Math.max(1, Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE));
  const paginatedEmployees = filteredEmployees.slice((employeePage - 1) * EMPLOYEES_PER_PAGE, employeePage * EMPLOYEES_PER_PAGE);

  // Reset page when search changes
  useEffect(() => { setCompanyPage(1); }, [companySearch]);
  useEffect(() => { setEmployeePage(1); }, [employeeSearch]);

  const exportToCSV = () => {
    if (!selectedCompany) return;
    const headers = ['Name', 'Email', 'Phone', 'Gender', 'Access Code', 'Screening Status', 'Date Taken', 'WHO-5 Score', 'WHO-5 %', 'Wellbeing Category'];
    const rows = sortedEmployees.map(emp => {
      const screening = employeeScreeningMap.get(emp.id);
      return [emp.name, emp.email, emp.phone || '', emp.gender || '', emp.access_code,
        emp.screening_completed ? 'Completed' : emp.invitation_sent ? 'Invited' : 'Pending',
        screening ? new Date(screening.completed_at).toLocaleDateString('en-GB') : '',
        screening ? screening.who5_score : '', screening ? screening.who5_percentage + '%' : '',
        screening ? screening.wellbeing_category : '',
      ].map(v => `"${v}"`).join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCompany.name.replace(/\s+/g, '_')}_employees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  const exportAllCompanies = () => {
    if (companies.length === 0) return;
    const headers = ['Company', 'Industry', 'Contact Person', 'Contact Email', 'Contact Phone', 'Employee Count', 'Created'];
    const rows = companies.map(c => [c.name, c.industry || '', c.contact_person || '', c.contact_email || '', c.contact_phone || '', c.employee_count || '', new Date(c.created_at).toLocaleDateString('en-GB')].map(v => `"${v}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_companies_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Companies CSV exported');
  };

  const baseUrl = window.location.origin;

  if (roleLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  if (!isAdmin) return null;

  // Pagination component
  const Pagination = ({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) => (
    <div className="flex items-center justify-between pt-3 px-1">
      <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 5) { pageNum = i + 1; }
          else if (page <= 3) { pageNum = i + 1; }
          else if (page >= totalPages - 2) { pageNum = totalPages - 4 + i; }
          else { pageNum = page - 2 + i; }
          return (
            <Button key={pageNum} variant={pageNum === page ? 'default' : 'outline'} size="sm" className="h-7 w-7 p-0 text-xs" onClick={() => onPageChange(pageNum)}>
              {pageNum}
            </Button>
          );
        })}
        <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Corporate Wellbeing Admin | InnerSpark Africa</title></Helmet>
      <Header />
      <div className="min-h-screen bg-muted/30 pt-4 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {selectedCompany && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedCompany(null)}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-primary" />
                  {selectedCompany ? selectedCompany.name : 'Corporate Wellbeing Admin'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {selectedCompany ? `${selectedCompany.industry || 'Company'} • ${totalEmployees} employees` : 'Manage companies, employees, and screening analytics'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!selectedCompany && companies.length > 0 && (
                <Button variant="outline" size="sm" onClick={exportAllCompanies}>
                  <Download className="w-4 h-4 mr-1" /> Export All
                </Button>
              )}
              <Dialog open={showCreateCompany} onOpenChange={setShowCreateCompany}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Create Company</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Create Company</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div><Label>Company Name *</Label><Input value={companyForm.name} onChange={e => setCompanyForm(p => ({ ...p, name: e.target.value }))} /></div>
                    <div><Label>Industry</Label><Input value={companyForm.industry} onChange={e => setCompanyForm(p => ({ ...p, industry: e.target.value }))} /></div>
                    <div><Label>Number of Employees</Label><Input type="number" value={companyForm.employee_count} onChange={e => setCompanyForm(p => ({ ...p, employee_count: e.target.value }))} /></div>
                    <div><Label>Contact Person</Label><Input value={companyForm.contact_person} onChange={e => setCompanyForm(p => ({ ...p, contact_person: e.target.value }))} /></div>
                    <div><Label>Contact Email</Label><Input type="email" value={companyForm.contact_email} onChange={e => setCompanyForm(p => ({ ...p, contact_email: e.target.value }))} /></div>
                    <div><Label>Contact Phone</Label><Input type="tel" value={companyForm.contact_phone} onChange={e => setCompanyForm(p => ({ ...p, contact_phone: e.target.value }))} /></div>
                    <Button onClick={createCompany} className="w-full">Create Company</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* =================== OVERVIEW (no company selected) =================== */}
          {!selectedCompany ? (
            <div className="space-y-6">
              {/* Global Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-foreground">{companies.length}</div><p className="text-xs text-muted-foreground">Total Companies</p></CardContent></Card>
                <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-primary">{allEmployees.length}</div><p className="text-xs text-muted-foreground">Total Employees</p></CardContent></Card>
                <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-foreground">{allScreenings.length}</div><p className="text-xs text-muted-foreground">Screenings Completed</p></CardContent></Card>
                <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-foreground">{allEmployees.length > 0 ? Math.round((allScreenings.length / allEmployees.length) * 100) : 0}%</div><p className="text-xs text-muted-foreground">Overall Participation</p></CardContent></Card>
              </div>

              {/* Analytics Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gender Distribution */}
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4" /> Gender Distribution</CardTitle></CardHeader>
                  <CardContent>
                    {(() => {
                      const genderCounts: Record<string, number> = {};
                      allEmployees.forEach(e => {
                        const g = e.gender ? e.gender.charAt(0).toUpperCase() + e.gender.slice(1).toLowerCase() : 'Not Specified';
                        genderCounts[g] = (genderCounts[g] || 0) + 1;
                      });
                      const total = allEmployees.length;
                      if (total === 0) return <p className="text-sm text-muted-foreground">No employees registered yet.</p>;
                      return (
                        <div className="space-y-3">
                          {Object.entries(genderCounts).sort((a, b) => b[1] - a[1]).map(([gender, count]) => (
                            <div key={gender}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{gender}</span>
                                <span>{count} ({Math.round((count / total) * 100)}%)</span>
                              </div>
                              <Progress value={(count / total) * 100} className="h-2" />
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* Overall Risk Distribution */}
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Activity className="w-4 h-4" /> Overall Risk Distribution</CardTitle></CardHeader>
                  <CardContent>
                    {(() => {
                      const total = allScreenings.length;
                      if (total === 0) return <p className="text-sm text-muted-foreground">No screening data yet.</p>;
                      const gGreen = allScreenings.filter(s => s.wellbeing_category === 'green').length;
                      const gYellow = allScreenings.filter(s => s.wellbeing_category === 'yellow').length;
                      const gRed = allScreenings.filter(s => s.wellbeing_category === 'red').length;
                      const avgWellbeing = Math.round(allScreenings.reduce((s, x) => s + x.who5_percentage, 0) / total);
                      return (
                        <div className="space-y-3">
                          <div className="text-center mb-2">
                            <div className="text-3xl font-bold text-primary">{avgWellbeing}%</div>
                            <p className="text-xs text-muted-foreground">Average Wellbeing</p>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1"><span className="font-medium">🟢 Healthy</span><span>{gGreen} ({Math.round((gGreen / total) * 100)}%)</span></div>
                            <Progress value={(gGreen / total) * 100} className="h-2.5 [&>div]:bg-green-500" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1"><span className="font-medium">🟡 At Risk</span><span>{gYellow} ({Math.round((gYellow / total) * 100)}%)</span></div>
                            <Progress value={(gYellow / total) * 100} className="h-2.5 [&>div]:bg-yellow-500" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1"><span className="font-medium">🔴 Critical</span><span>{gRed} ({Math.round((gRed / total) * 100)}%)</span></div>
                            <Progress value={(gRed / total) * 100} className="h-2.5 [&>div]:bg-red-500" />
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>

              {/* Wellbeing by Gender Table */}
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Wellbeing by Gender</CardTitle></CardHeader>
                <CardContent>
                  {(() => {
                    const genderMap: Record<string, { total: number; score: number; red: number; yellow: number; green: number }> = {};
                    allScreenings.forEach(s => {
                      const emp = allEmployees.find(e => e.id === s.employee_id);
                      const g = emp?.gender ? emp.gender.charAt(0).toUpperCase() + emp.gender.slice(1).toLowerCase() : 'Not Specified';
                      if (!genderMap[g]) genderMap[g] = { total: 0, score: 0, red: 0, yellow: 0, green: 0 };
                      genderMap[g].total++;
                      genderMap[g].score += s.who5_percentage;
                      if (s.wellbeing_category === 'red') genderMap[g].red++;
                      else if (s.wellbeing_category === 'yellow') genderMap[g].yellow++;
                      else genderMap[g].green++;
                    });
                    if (Object.keys(genderMap).length === 0) return <p className="text-sm text-muted-foreground">No screening data yet.</p>;
                    return (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead><tr className="border-b bg-muted/50">
                            <th className="text-left p-2 font-medium">Gender</th>
                            <th className="text-center p-2 font-medium">Screened</th>
                            <th className="text-center p-2 font-medium">Avg Score</th>
                            <th className="text-center p-2 font-medium">🟢</th>
                            <th className="text-center p-2 font-medium">🟡</th>
                            <th className="text-center p-2 font-medium">🔴</th>
                          </tr></thead>
                          <tbody>
                            {Object.entries(genderMap).map(([gender, data]) => (
                              <tr key={gender} className="border-b">
                                <td className="p-2 font-medium">{gender}</td>
                                <td className="p-2 text-center">{data.total}</td>
                                <td className="p-2 text-center font-semibold">{Math.round(data.score / data.total)}%</td>
                                <td className="p-2 text-center">{data.green}</td>
                                <td className="p-2 text-center">{data.yellow}</td>
                                <td className="p-2 text-center">{data.red}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Companies Table with Pagination */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4" /> All Companies ({filteredCompanies.length})</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input placeholder="Search companies..." value={companySearch} onChange={e => setCompanySearch(e.target.value)} className="pl-8 h-8 text-xs w-[200px]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-3 font-medium">Company</th>
                          <th className="text-left p-3 font-medium">Industry</th>
                          <th className="text-left p-3 font-medium">Contact</th>
                          <th className="text-center p-3 font-medium">Employees</th>
                          <th className="text-center p-3 font-medium">Screened</th>
                          <th className="text-center p-3 font-medium">Avg Score</th>
                          <th className="text-center p-3 font-medium">Created</th>
                          <th className="text-right p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedCompanies.length === 0 ? (
                          <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">
                            {companySearch ? 'No companies match your search.' : 'No companies yet. Create one to get started.'}
                          </td></tr>
                        ) : paginatedCompanies.map(c => {
                          const compEmps = allEmployees.filter(e => e.company_id === c.id);
                          const compScrs = allScreenings.filter(s => s.company_id === c.id);
                          const avg = compScrs.length > 0 ? Math.round(compScrs.reduce((s, x) => s + x.who5_percentage, 0) / compScrs.length) : 0;
                          return (
                            <tr key={c.id} className="border-b hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => setSelectedCompany(c)}>
                              <td className="p-3">
                                <span className="font-medium">{c.name}</span>
                              </td>
                              <td className="p-3 text-muted-foreground">{c.industry || '—'}</td>
                              <td className="p-3">
                                <div className="text-xs">
                                  {c.contact_person && <div className="font-medium">{c.contact_person}</div>}
                                  {c.contact_email && <div className="text-muted-foreground">{c.contact_email}</div>}
                                  {c.contact_phone && <div className="text-muted-foreground">{c.contact_phone}</div>}
                                </div>
                              </td>
                              <td className="p-3 text-center"><Badge variant="outline">{compEmps.length}</Badge></td>
                              <td className="p-3 text-center">{compScrs.length}</td>
                              <td className="p-3 text-center">
                                {compScrs.length > 0 ? <span className="font-semibold">{avg}%</span> : <span className="text-muted-foreground">—</span>}
                              </td>
                              <td className="p-3 text-center text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                              <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete {c.name}?</AlertDialogTitle>
                                      <AlertDialogDescription>This will delete all employees and screenings for this company.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deleteCompany(c.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {filteredCompanies.length > COMPANIES_PER_PAGE && (
                    <div className="px-3 pb-3">
                      <Pagination page={companyPage} totalPages={totalCompanyPages} onPageChange={setCompanyPage} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* =================== COMPANY DETAIL VIEW =================== */
            <Tabs defaultValue="analytics">
              <TabsList className="mb-4">
                <TabsTrigger value="analytics"><BarChart3 className="w-4 h-4 mr-1" /> Analytics</TabsTrigger>
                <TabsTrigger value="employees"><Users className="w-4 h-4 mr-1" /> Employees ({totalEmployees})</TabsTrigger>
                <TabsTrigger value="report"><FileText className="w-4 h-4 mr-1" /> Report</TabsTrigger>
              </TabsList>

              {/* ANALYTICS TAB */}
              <TabsContent value="analytics">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-foreground">{totalEmployees}</div><p className="text-xs text-muted-foreground">Total Employees</p></CardContent></Card>
                  <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-primary">{participationRate}%</div><p className="text-xs text-muted-foreground">Participation</p></CardContent></Card>
                  <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-foreground">{avgScore}%</div><p className="text-xs text-muted-foreground">Avg Wellbeing</p></CardContent></Card>
                  <Card><CardContent className="pt-4 text-center"><div className="text-2xl font-bold text-foreground">{completedScreenings}</div><p className="text-xs text-muted-foreground">Completed</p></CardContent></Card>
                </div>

                <Card className="mb-6">
                  <CardHeader><CardTitle className="text-sm">Risk Segmentation</CardTitle></CardHeader>
                  <CardContent>
                    {completedScreenings === 0 ? (
                      <p className="text-sm text-muted-foreground">No screening data yet.</p>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1"><span className="font-medium">🟢 Healthy</span><span>{greenCount} ({Math.round((greenCount / completedScreenings) * 100)}%)</span></div>
                          <Progress value={(greenCount / completedScreenings) * 100} className="h-3 [&>div]:bg-green-500" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1"><span className="font-medium">🟡 At Risk</span><span>{yellowCount} ({Math.round((yellowCount / completedScreenings) * 100)}%)</span></div>
                          <Progress value={(yellowCount / completedScreenings) * 100} className="h-3 [&>div]:bg-yellow-500" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1"><span className="font-medium">🔴 Critical</span><span>{redCount} ({Math.round((redCount / completedScreenings) * 100)}%)</span></div>
                          <Progress value={(redCount / completedScreenings) * 100} className="h-3 [&>div]:bg-red-500" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* EMPLOYEES TAB */}
              <TabsContent value="employees">
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
                      <DialogTrigger asChild>
                        <Button size="sm"><UserPlus className="w-4 h-4 mr-1" /> Add Employee</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Add Employee</DialogTitle></DialogHeader>
                        <div className="space-y-3">
                          <div><Label>Full Name *</Label><Input value={employeeForm.name} onChange={e => setEmployeeForm(p => ({ ...p, name: e.target.value }))} /></div>
                          <div><Label>Email *</Label><Input type="email" value={employeeForm.email} onChange={e => setEmployeeForm(p => ({ ...p, email: e.target.value }))} /></div>
                          <div><Label>Phone</Label><Input value={employeeForm.phone} onChange={e => setEmployeeForm(p => ({ ...p, phone: e.target.value }))} /></div>
                          <div>
                            <Label>Gender</Label>
                            <Select value={employeeForm.gender} onValueChange={v => setEmployeeForm(p => ({ ...p, gender: v }))}>
                              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={addEmployee} className="w-full">Add Employee</Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <div className="flex items-center gap-2">
                      <Input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files?.[0] || null)} className="max-w-[180px] text-xs" />
                      {csvFile && <Button size="sm" variant="outline" onClick={handleCsvUpload}><Upload className="w-4 h-4 mr-1" /> Upload</Button>}
                    </div>

                    {employees.length > 0 && (
                      <Button size="sm" variant="outline" onClick={exportToCSV}>
                        <Download className="w-4 h-4 mr-1" /> Export
                      </Button>
                    )}
                  </div>

                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input placeholder="Search employees..." value={employeeSearch} onChange={e => setEmployeeSearch(e.target.value)} className="pl-8 h-8 text-xs w-[200px]" />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-3">CSV format: Name, Email, Phone, Gender (one per row, skip header)</p>

                {needsSupportCount > 0 && (
                  <Card className="mb-4 border-destructive/30 bg-destructive/5">
                    <CardContent className="pt-4 pb-3 flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {needsSupportCount} employee{needsSupportCount > 1 ? 's' : ''} flagged for support
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {redCount > 0 && `${redCount} critical`}{redCount > 0 && yellowCount > 0 && ', '}{yellowCount > 0 && `${yellowCount} at risk`} — consider reaching out.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-3 font-medium">Name</th>
                            <th className="text-left p-3 font-medium">Email</th>
                            <th className="text-left p-3 font-medium">Phone</th>
                            <th className="text-left p-3 font-medium">Gender</th>
                            <th className="text-left p-3 font-medium">Code</th>
                            <th className="text-left p-3 font-medium">Status</th>
                            <th className="text-left p-3 font-medium">Date</th>
                            <th className="text-left p-3 font-medium">Score</th>
                            <th className="text-left p-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedEmployees.length === 0 ? (
                            <tr><td colSpan={9} className="p-6 text-center text-muted-foreground">
                              {employeeSearch ? 'No employees match your search.' : 'No employees added yet.'}
                            </td></tr>
                          ) : paginatedEmployees.map(emp => {
                            const screening = employeeScreeningMap.get(emp.id);
                            const isRed = screening?.wellbeing_category === 'red';
                            const isYellow = screening?.wellbeing_category === 'yellow';
                            const needsSupport = isRed || isYellow;

                            return (
                              <tr key={emp.id} className={`border-b ${isRed ? 'bg-red-50/50' : isYellow ? 'bg-yellow-50/30' : ''}`}>
                                <td className="p-3">
                                  <div className="flex items-center gap-1.5">
                                    {needsSupport && <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${isRed ? 'text-red-500' : 'text-yellow-500'}`} />}
                                    <span className="font-medium text-xs">{emp.name}</span>
                                    {needsSupport && (
                                      <Badge variant={isRed ? 'destructive' : 'secondary'} className="text-[9px] px-1 py-0 leading-tight">
                                        {isRed ? 'Critical' : 'At Risk'}
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 text-xs text-muted-foreground">{emp.email}</td>
                                <td className="p-3 text-xs text-muted-foreground">{emp.phone || '—'}</td>
                                <td className="p-3 text-xs text-muted-foreground">{emp.gender || '—'}</td>
                                <td className="p-3 font-mono text-xs">{emp.access_code}</td>
                                <td className="p-3">
                                  {emp.screening_completed ? (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">Done</span>
                                  ) : emp.invitation_sent ? (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">Invited</span>
                                  ) : (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">Pending</span>
                                  )}
                                </td>
                                <td className="p-3 text-xs text-muted-foreground">
                                  {screening ? new Date(screening.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                                </td>
                                <td className="p-3">
                                  {screening ? (
                                    <span className={`text-xs font-bold ${isRed ? 'text-red-600' : isYellow ? 'text-yellow-600' : 'text-green-600'}`}>
                                      {screening.who5_percentage}% {isRed ? '🔴' : isYellow ? '🟡' : '🟢'}
                                    </span>
                                  ) : <span className="text-xs text-muted-foreground">—</span>}
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-0.5">
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => { navigator.clipboard.writeText(`${baseUrl}/corporate-wellbeing-check?token=${emp.secure_token}`); toast.success('Link copied!'); }} title="Copy link">
                                      <ClipboardList className="w-3 h-3" />
                                    </Button>
                                    {needsSupport && emp.phone && (
                                      <>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-green-600" onClick={() => { const msg = encodeURIComponent(`Hi ${emp.name}, this is InnerSpark Africa. We noticed from our wellbeing check that you might benefit from some support. We're here for you — would you like to chat with one of our counselors?`); window.open(`https://wa.me/${emp.phone?.replace(/\D/g, '')}?text=${msg}`, '_blank'); }} title="WhatsApp">
                                          <MessageCircle className="w-3 h-3" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-primary" onClick={() => window.open(`tel:${emp.phone}`, '_self')} title="Call">
                                          <Phone className="w-3 h-3" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {filteredEmployees.length > EMPLOYEES_PER_PAGE && (
                      <div className="px-3 pb-3">
                        <Pagination page={employeePage} totalPages={totalEmployeePages} onPageChange={setEmployeePage} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* REPORT TAB */}
              <TabsContent value="report">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Company Mental Health Report</CardTitle>
                    <CardDescription>{selectedCompany.name} — Generated {new Date().toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {completedScreenings === 0 ? (
                      <p className="text-muted-foreground">No screenings completed yet. Report will be generated once employees complete their checks.</p>
                    ) : (
                      <>
                        <div>
                          <h3 className="font-semibold mb-2">📊 Summary</h3>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• {totalEmployees} employees enrolled, {completedScreenings} completed ({participationRate}% participation)</li>
                            <li>• Average wellbeing score: {avgScore}%</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">🚦 Risk Distribution</h3>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>🟢 Healthy: {greenCount} employees ({Math.round((greenCount / completedScreenings) * 100)}%)</li>
                            <li>🟡 At Risk: {yellowCount} employees ({Math.round((yellowCount / completedScreenings) * 100)}%)</li>
                            <li>🔴 Critical: {redCount} employees ({Math.round((redCount / completedScreenings) * 100)}%)</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">💡 Recommendations</h3>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {redCount > 0 && <li>• Consider providing EAP (Employee Assistance Programme) access for staff needing immediate support</li>}
                            {yellowCount > 0 && <li>• Organize wellness workshops or stress management sessions</li>}
                            <li>• Encourage regular wellbeing check-ins every 30–90 days</li>
                            <li>• Partner with InnerSpark Africa for ongoing corporate wellness support</li>
                          </ul>
                        </div>
                        <Button variant="outline" onClick={() => {
                          const report = `COMPANY MENTAL HEALTH REPORT\n${selectedCompany.name}\nGenerated: ${new Date().toLocaleDateString()}\n\nSUMMARY\n- Employees: ${totalEmployees}\n- Completed: ${completedScreenings} (${participationRate}%)\n- Avg Score: ${avgScore}%\n\nRISK DISTRIBUTION\n- Healthy: ${greenCount}\n- At Risk: ${yellowCount}\n- Critical: ${redCount}\n`;
                          const blob = new Blob([report], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${selectedCompany.name.replace(/\s+/g, '_')}_wellbeing_report.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}>
                          <FileText className="w-4 h-4 mr-2" /> Download Report
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CorporateAdmin;
