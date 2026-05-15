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
import { Building2, Users, Plus, Upload, BarChart3, FileText, Trash2, UserPlus, ClipboardList, AlertTriangle, Phone, MessageCircle, Download, TrendingUp, Activity, Search, ChevronLeft, ChevronRight, ArrowLeft, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, ChevronUp as ChevronUpIcon, History, Mail } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { generateCompanyReportPdf } from '@/lib/companyReportPdf';
import { Loader2 } from 'lucide-react';
import { answerMapFromStored, aggregateCompany } from '@/lib/wellbeingIntelligence';
import { CompanyTriggersDashboard, CompanyActionPlan } from '@/components/business/CompanyInsights';
import PerQuestionEmployeeBreakdown from '@/components/business/PerQuestionEmployeeBreakdown';
import BusinessImpactSummary from '@/components/business/BusinessImpactSummary';
import { calculateBusinessImpact } from '@/lib/businessImpact';

interface Company {
  id: string;
  name: string;
  industry: string | null;
  employee_count: number | null;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  location: string | null;
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
  const [companyForm, setCompanyForm] = useState({ name: '', industry: '', employee_count: '', contact_person: '', contact_email: '', contact_phone: '', location: '' });
  const [employeeForm, setEmployeeForm] = useState({ name: '', email: '', phone: '', gender: '' });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [allScreenings, setAllScreenings] = useState<Screening[]>([]);
  const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set());

  // Pagination & search
  const [companyPage, setCompanyPage] = useState(1);
  const [employeePage, setEmployeePage] = useState(1);
  const [companySearch, setCompanySearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [sendingReport, setSendingReport] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Manual report builder
  const [serviceCatalog, setServiceCatalog] = useState<any[]>([]);
  const [observations, setObservations] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());
  const [serviceReasons, setServiceReasons] = useState<Record<string, string>>({});
  const [serviceInterests, setServiceInterests] = useState<any[]>([]);

  // Report history (sent / drafts) for the selected company
  const [pastReports, setPastReports] = useState<any[]>([]);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // 10-section report builder
  const REPORT_SECTIONS: { key: string; title: string; description: string }[] = [
    { key: 'cover', title: '1. Cover & Summary', description: 'Company name, period, total participants, headline wellbeing score' },
    { key: 'participation', title: '2. Participation & Demographics', description: 'Invited vs completed, gender breakdown, completion rate' },
    { key: 'overall_wellbeing', title: '3. Overall Wellbeing Score', description: 'WHO-5 average, severity bands, traffic-light distribution' },
    { key: 'per_question', title: '4. Per-Question Averages', description: 'Q1–Q8 averages with green/amber/red flags' },
    { key: 'triggered_clusters', title: '5. Triggered Clusters', description: 'Burnout / Anxiety / Depression-risk cluster detection' },
    { key: 'priority_areas', title: '6. Priority Focus Areas', description: 'Top 3 lowest-scoring questions company-wide' },
    { key: 'business_impact', title: '7. Business Impact', description: 'Productivity loss, days lost, ROI on EAP investment' },
    { key: 'recommended_services', title: '8. Recommended Services', description: 'InnerSpark services tailored to triggered patterns' },
    { key: 'action_plan', title: '9. 30-Day Action Plan', description: 'Concrete next steps for HR over the next month' },
    { key: 'consultant_notes', title: '10. Consultant Observations', description: 'Free-text notes from the InnerSpark consultant' },
  ];
  const [reportSections, setReportSections] = useState<Record<string, boolean>>(
    () => Object.fromEntries(REPORT_SECTIONS.map(s => [s.key, true]))
  );
  const [includeBusinessImpact, setIncludeBusinessImpact] = useState(true);
  const [baselineSalary, setBaselineSalary] = useState<number>(1_200_000);

  // Sorting
  const [companySortKey, setCompanySortKey] = useState<string>('');
  const [companySortDir, setCompanySortDir] = useState<'asc' | 'desc'>('asc');
  const [employeeSortKey, setEmployeeSortKey] = useState<string>('');
  const [employeeSortDir, setEmployeeSortDir] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (current: string, key: string, dir: 'asc' | 'desc', setKey: (k: string) => void, setDir: (d: 'asc' | 'desc') => void) => {
    if (current === key) setDir(dir === 'asc' ? 'desc' : 'asc');
    else { setKey(key); setDir('asc'); }
  };

  const SortIcon = ({ column, activeKey, activeDir }: { column: string; activeKey: string; activeDir: 'asc' | 'desc' }) => {
    if (activeKey !== column) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />;
    return activeDir === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />;
  };
  useEffect(() => {
    if (!roleLoading && !isAdmin) navigate('/auth');
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchCompanies();
      fetchAllGlobalData();
      fetchServiceCatalog();
      fetchServiceInterests();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedCompany) {
      fetchEmployees(selectedCompany.id);
      fetchScreenings(selectedCompany.id);
      fetchPastReports(selectedCompany.id);
      setEmployeePage(1);
      setEmployeeSearch('');
    }
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    const { data } = await supabase.from('corporate_companies').select('*').order('created_at', { ascending: false });
    setCompanies((data as any[]) || []);
    setLoading(false);
  };

  const fetchServiceCatalog = async () => {
    const { data } = await supabase.from('corporate_service_catalog').select('*').eq('is_active', true).order('sort_order');
    setServiceCatalog((data as any[]) || []);
  };

  const fetchServiceInterests = async () => {
    const { data } = await supabase.from('corporate_service_interests').select('*').order('clicked_at', { ascending: false }).limit(100);
    setServiceInterests((data as any[]) || []);
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
    const { data } = await supabase.from('corporate_screenings').select('*').eq('company_id', companyId).order('completed_at', { ascending: false });
    setScreenings((data as any[]) || []);
  };

  const fetchPastReports = async (companyId: string) => {
    const { data } = await supabase
      .from('corporate_reports')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(20);
    setPastReports((data as any[]) || []);
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
      location: companyForm.location || null,
      created_by: user?.id,
    });
    if (error) { toast.error('Failed to create company'); return; }
    toast.success('Company created');
    setShowCreateCompany(false);
    setCompanyForm({ name: '', industry: '', employee_count: '', contact_person: '', contact_email: '', contact_phone: '', location: '' });
    fetchCompanies();
  };

  const addEmployee = async () => {
    if (!selectedCompany || !employeeForm.name.trim() || !employeeForm.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    const { data: inserted, error } = await supabase.from('corporate_employees').insert({
      company_id: selectedCompany.id,
      name: employeeForm.name,
      email: employeeForm.email,
      phone: employeeForm.phone || null,
      gender: employeeForm.gender || null,
    }).select('id, name, email, access_code, secure_token').single();
    if (error) { toast.error('Failed to add employee'); return; }

    // Send branded invitation email with access code + secure URL (non-blocking)
    if (inserted) {
      const secureUrl = `${baseUrl}/corporate-wellbeing-check?token=${(inserted as any).secure_token}`;
      supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'b2b-employee-confirmation',
          recipientEmail: (inserted as any).email,
          idempotencyKey: `b2b-invite-${(inserted as any).id}`,
          templateData: {
            employee_name: (inserted as any).name,
            company_name: selectedCompany.name,
            access_code: (inserted as any).access_code,
            secure_url: secureUrl,
          },
        },
      }).catch(e => console.error('b2b-employee invitation email failed', e));
    }
    toast.success('Employee added — invitation email sent');
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

  // Build employee-screening map (latest screening per employee + full history)
  const employeeScreeningMap = new Map<string, Screening>();
  const employeeScreeningCount = new Map<string, number>();
  const employeeScreeningHistory = new Map<string, Screening[]>();
  // screenings are ordered by completed_at desc from fetch, so first match = latest
  screenings.forEach(s => {
    employeeScreeningCount.set(s.employee_id, (employeeScreeningCount.get(s.employee_id) || 0) + 1);
    if (!employeeScreeningMap.has(s.employee_id)) {
      employeeScreeningMap.set(s.employee_id, s);
    }
    const history = employeeScreeningHistory.get(s.employee_id) || [];
    history.push(s);
    employeeScreeningHistory.set(s.employee_id, history);
  });

  const toggleEmployeeExpand = (empId: string) => {
    setExpandedEmployees(prev => {
      const next = new Set(prev);
      if (next.has(empId)) next.delete(empId);
      else next.add(empId);
      return next;
    });
  };

  // Analytics — use unique employees (latest screening) for support counts, all screenings for totals
  const totalEmployees = employees.length;
  const uniqueScreenedEmployees = new Set(screenings.map(s => s.employee_id)).size;
  const completedScreenings = screenings.length;
  const participationRate = totalEmployees > 0 ? Math.round((uniqueScreenedEmployees / totalEmployees) * 100) : 0;
  const avgScore = completedScreenings > 0 ? Math.round(screenings.reduce((s, x) => s + x.who5_percentage, 0) / completedScreenings) : 0;
  // Count by latest screening per employee only
  const latestScreenings = Array.from(employeeScreeningMap.values());
  const greenCount = latestScreenings.filter(s => s.wellbeing_category === 'green').length;
  const yellowCount = latestScreenings.filter(s => s.wellbeing_category === 'yellow').length;
  const redCount = latestScreenings.filter(s => s.wellbeing_category === 'red').length;
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

  // Filtered, sorted & paginated companies
  const filteredCompanies = useMemo(() => {
    let result = companies;
    if (companySearch.trim()) {
      const q = companySearch.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.industry?.toLowerCase().includes(q) || c.contact_person?.toLowerCase().includes(q));
    }
    if (companySortKey) {
      result = [...result].sort((a, b) => {
        let va: any, vb: any;
        if (companySortKey === 'name') { va = a.name.toLowerCase(); vb = b.name.toLowerCase(); }
        else if (companySortKey === 'industry') { va = (a.industry || '').toLowerCase(); vb = (b.industry || '').toLowerCase(); }
        else if (companySortKey === 'contact') { va = (a.contact_person || '').toLowerCase(); vb = (b.contact_person || '').toLowerCase(); }
        else if (companySortKey === 'employees') { va = a.employee_count || 0; vb = b.employee_count || 0; }
        else if (companySortKey === 'created') { va = a.created_at; vb = b.created_at; }
        else return 0;
        if (va < vb) return companySortDir === 'asc' ? -1 : 1;
        if (va > vb) return companySortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [companies, companySearch, companySortKey, companySortDir]);

  const totalCompanyPages = Math.max(1, Math.ceil(filteredCompanies.length / COMPANIES_PER_PAGE));
  const paginatedCompanies = filteredCompanies.slice((companyPage - 1) * COMPANIES_PER_PAGE, companyPage * COMPANIES_PER_PAGE);

  // Filtered, sorted & paginated employees
  const filteredEmployees = useMemo(() => {
    let result = sortedEmployees;
    if (employeeSearch.trim()) {
      const q = employeeSearch.toLowerCase();
      result = result.filter(e => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.phone?.toLowerCase().includes(q));
    }
    if (employeeSortKey) {
      result = [...result].sort((a, b) => {
        let va: any, vb: any;
        const sa = employeeScreeningMap.get(a.id);
        const sb = employeeScreeningMap.get(b.id);
        if (employeeSortKey === 'name') { va = a.name.toLowerCase(); vb = b.name.toLowerCase(); }
        else if (employeeSortKey === 'email') { va = a.email.toLowerCase(); vb = b.email.toLowerCase(); }
        else if (employeeSortKey === 'phone') { va = (a.phone || '').toLowerCase(); vb = (b.phone || '').toLowerCase(); }
        else if (employeeSortKey === 'gender') { va = (a.gender || '').toLowerCase(); vb = (b.gender || '').toLowerCase(); }
        else if (employeeSortKey === 'status') { va = a.screening_completed ? 2 : a.invitation_sent ? 1 : 0; vb = b.screening_completed ? 2 : b.invitation_sent ? 1 : 0; }
        else if (employeeSortKey === 'date') { va = sa?.completed_at || ''; vb = sb?.completed_at || ''; }
        else return 0;
        if (va < vb) return employeeSortDir === 'asc' ? -1 : 1;
        if (va > vb) return employeeSortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [sortedEmployees, employeeSearch, employeeSortKey, employeeSortDir, screenings]);

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

  // Pagination component matching reference style
  const PaginationBar = ({ page, totalPages, totalItems, perPage, onPageChange }: { page: number; totalPages: number; totalItems: number; perPage: number; onPageChange: (p: number) => void }) => {
    const start = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, totalItems);
    return (
      <div className="flex items-center justify-between pt-3 px-4 pb-3 flex-wrap gap-2">
        <p className="text-xs text-muted-foreground">Showing {start} to {end} of {totalItems} entries</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </Button>
          {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 6) { pageNum = i + 1; }
            else if (page <= 3) { pageNum = i + 1; }
            else if (page >= totalPages - 2) { pageNum = totalPages - 5 + i; }
            else { pageNum = page - 2 + i; }
            return (
              <Button key={pageNum} variant={pageNum === page ? 'default' : 'outline'} size="sm" className="h-8 w-8 p-0 text-xs" onClick={() => onPageChange(pageNum)}>
                {pageNum}
              </Button>
            );
          })}
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    );
  };

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
              {selectedCompany ? (
                <Button onClick={() => setShowAddEmployee(true)}>
                  <UserPlus className="w-4 h-4 mr-2" /> Add Employee
                </Button>
              ) : (
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
                    <div><Label>Location</Label><Input value={companyForm.location} onChange={e => setCompanyForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Kampala, Uganda" /></div>
                    <Button onClick={createCompany} className="w-full">Create Company</Button>
                  </div>
                </DialogContent>
              </Dialog>
              )}
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
                          <th className="text-center p-3 font-medium w-12">#</th>
                          <th className="text-left p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort(companySortKey, 'name', companySortDir, setCompanySortKey, setCompanySortDir)}>
                            <span className="inline-flex items-center">Company<SortIcon column="name" activeKey={companySortKey} activeDir={companySortDir} /></span>
                          </th>
                          <th className="text-left p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort(companySortKey, 'industry', companySortDir, setCompanySortKey, setCompanySortDir)}>
                            <span className="inline-flex items-center">Industry<SortIcon column="industry" activeKey={companySortKey} activeDir={companySortDir} /></span>
                          </th>
                          <th className="text-left p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort(companySortKey, 'contact', companySortDir, setCompanySortKey, setCompanySortDir)}>
                            <span className="inline-flex items-center">Contact<SortIcon column="contact" activeKey={companySortKey} activeDir={companySortDir} /></span>
                          </th>
                          <th className="text-center p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort(companySortKey, 'employees', companySortDir, setCompanySortKey, setCompanySortDir)}>
                            <span className="inline-flex items-center">Employees<SortIcon column="employees" activeKey={companySortKey} activeDir={companySortDir} /></span>
                          </th>
                          <th className="text-center p-3 font-medium">Screened</th>
                          <th className="text-center p-3 font-medium">Avg Score</th>
                          <th className="text-center p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort(companySortKey, 'created', companySortDir, setCompanySortKey, setCompanySortDir)}>
                            <span className="inline-flex items-center">Created<SortIcon column="created" activeKey={companySortKey} activeDir={companySortDir} /></span>
                          </th>
                          <th className="text-right p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedCompanies.length === 0 ? (
                          <tr><td colSpan={9} className="p-6 text-center text-muted-foreground">
                            {companySearch ? 'No companies match your search.' : 'No companies yet. Create one to get started.'}
                          </td></tr>
                        ) : paginatedCompanies.map((c, idx) => {
                          const compEmps = allEmployees.filter(e => e.company_id === c.id);
                          const compScrs = allScreenings.filter(s => s.company_id === c.id);
                          const avg = compScrs.length > 0 ? Math.round(compScrs.reduce((s, x) => s + x.who5_percentage, 0) / compScrs.length) : 0;
                          const rowNum = (companyPage - 1) * COMPANIES_PER_PAGE + idx + 1;
                          return (
                            <tr key={c.id} className="border-b hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => { setSelectedCompany(c); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                              <td className="p-3 text-center text-muted-foreground">{rowNum}</td>
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
                  <PaginationBar page={companyPage} totalPages={totalCompanyPages} totalItems={filteredCompanies.length} perPage={COMPANIES_PER_PAGE} onPageChange={setCompanyPage} />
                </CardContent>
              </Card>
            </div>
          ) : (
            /* =================== COMPANY DETAIL VIEW =================== */
            <Tabs defaultValue="analytics">
              <TabsList className="mb-4">
                <TabsTrigger value="analytics"><BarChart3 className="w-4 h-4 mr-1" /> Analytics</TabsTrigger>
                <TabsTrigger value="insights"><Activity className="w-4 h-4 mr-1" /> Insights</TabsTrigger>
                <TabsTrigger value="employees"><Users className="w-4 h-4 mr-1" /> Employees ({totalEmployees})</TabsTrigger>
                <TabsTrigger value="report"><FileText className="w-4 h-4 mr-1" /> Report</TabsTrigger>
                <TabsTrigger value="interests"><Activity className="w-4 h-4 mr-1" /> Service Interests ({serviceInterests.filter(i => i.company_id === selectedCompany.id).length})</TabsTrigger>
              </TabsList>

              {/* INSIGHTS TAB — per-question intelligence */}
              <TabsContent value="insights">
                {(() => {
                  const records = screenings
                    .map((s: any) => answerMapFromStored(s.per_question))
                    .filter(Boolean) as any[];
                  const result = aggregateCompany(records);
                  return (
                    <div className="space-y-6">
                      <CompanyTriggersDashboard result={result} />
                      <CompanyActionPlan result={result} />
                    </div>
                  );
                })()}
              </TabsContent>

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

                {/* Business Impact */}
                {completedScreenings > 0 && (
                  <div className="mb-6">
                    <BusinessImpactSummary
                      result={calculateBusinessImpact(
                        { healthy: greenCount, at_risk: yellowCount, critical: redCount },
                        baselineSalary,
                      )}
                      companyName={selectedCompany.name}
                      defaultInclude={includeBusinessImpact}
                      onIncludeChange={setIncludeBusinessImpact}
                    />
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <Label className="text-xs">Baseline avg monthly salary (UGX):</Label>
                      <Input
                        type="number"
                        value={baselineSalary}
                        onChange={e => setBaselineSalary(Math.max(0, parseInt(e.target.value) || 0))}
                        className="h-7 w-32 text-xs"
                      />
                    </div>
                  </div>
                )}
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

                <Card className="mb-4 border-blue-200 bg-blue-50/40">
                  <CardContent className="pt-4 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-900 mb-2">Understanding Your Results</p>
                    <div className="grid md:grid-cols-3 gap-3 text-xs">
                      <div className="rounded-md bg-white border border-green-200 p-2">
                        <p className="font-bold text-green-700">🟢 HEALTHY (76–100%)</p>
                        <p className="text-muted-foreground mt-1">Above WHO clinical threshold. Sustain with regular check-ins and wellness resources.</p>
                      </div>
                      <div className="rounded-md bg-white border border-amber-200 p-2">
                        <p className="font-bold text-amber-700">🟡 AT RISK (36–75%)</p>
                        <p className="text-muted-foreground mt-1">Meaningful challenges present. Recommend counselling, EAP tools, and S.P.A.R.K™ programme.</p>
                      </div>
                      <div className="rounded-md bg-white border border-red-200 p-2">
                        <p className="font-bold text-red-700">🔴 CRITICAL (0–35%)</p>
                        <p className="text-muted-foreground mt-1">Below clinical concern threshold. InnerSpark initiates proactive outreach within 2 hours.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                            <th className="text-center p-3 font-medium w-12">#</th>
                            <th className="text-left p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort(employeeSortKey, 'name', employeeSortDir, setEmployeeSortKey, setEmployeeSortDir)}>
                              <span className="inline-flex items-center">Name<SortIcon column="name" activeKey={employeeSortKey} activeDir={employeeSortDir} /></span>
                            </th>
                            <th className="text-left p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort(employeeSortKey, 'email', employeeSortDir, setEmployeeSortKey, setEmployeeSortDir)}>
                              <span className="inline-flex items-center">Email<SortIcon column="email" activeKey={employeeSortKey} activeDir={employeeSortDir} /></span>
                            </th>
                            <th className="text-left p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort(employeeSortKey, 'phone', employeeSortDir, setEmployeeSortKey, setEmployeeSortDir)}>
                              <span className="inline-flex items-center">Phone<SortIcon column="phone" activeKey={employeeSortKey} activeDir={employeeSortDir} /></span>
                            </th>
                            <th className="text-left p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort(employeeSortKey, 'gender', employeeSortDir, setEmployeeSortKey, setEmployeeSortDir)}>
                              <span className="inline-flex items-center">Gender<SortIcon column="gender" activeKey={employeeSortKey} activeDir={employeeSortDir} /></span>
                            </th>
                            <th className="text-left p-3 font-medium">Code</th>
                            <th className="text-left p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort(employeeSortKey, 'status', employeeSortDir, setEmployeeSortKey, setEmployeeSortDir)}>
                              <span className="inline-flex items-center">Status<SortIcon column="status" activeKey={employeeSortKey} activeDir={employeeSortDir} /></span>
                            </th>
                            <th className="text-left p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort(employeeSortKey, 'date', employeeSortDir, setEmployeeSortKey, setEmployeeSortDir)}>
                              <span className="inline-flex items-center">Date<SortIcon column="date" activeKey={employeeSortKey} activeDir={employeeSortDir} /></span>
                            </th>
                            <th className="text-left p-3 font-medium">Score</th>
                            <th className="text-left p-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedEmployees.length === 0 ? (
                            <tr><td colSpan={10} className="p-6 text-center text-muted-foreground">
                              {employeeSearch ? 'No employees match your search.' : 'No employees added yet.'}
                            </td></tr>
                          ) : paginatedEmployees.map((emp, idx) => {
                            const screening = employeeScreeningMap.get(emp.id);
                            const isRed = screening?.wellbeing_category === 'red';
                            const isYellow = screening?.wellbeing_category === 'yellow';
                            const needsSupport = isRed || isYellow;
                            const empRowNum = (employeePage - 1) * EMPLOYEES_PER_PAGE + idx + 1;

                            return (
                              <>
                              <tr className={`border-b ${isRed ? 'bg-red-50/50' : isYellow ? 'bg-yellow-50/30' : ''}`}>
                                <td className="p-3 text-center text-muted-foreground">{empRowNum}</td>
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
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">Done</span>
                                      {(employeeScreeningCount.get(emp.id) || 0) >= 1 && (
                                        <button
                                          onClick={() => toggleEmployeeExpand(emp.id)}
                                          className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors cursor-pointer"
                                          title="View per-question breakdown & history"
                                        >
                                          <History className="w-2.5 h-2.5" />
                                          {employeeScreeningCount.get(emp.id)} check-in{(employeeScreeningCount.get(emp.id) || 0) > 1 ? 's' : ''}
                                          {expandedEmployees.has(emp.id) ? <ChevronUpIcon className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                                        </button>
                                      )}
                                    </div>
                                  ) : emp.invitation_sent ? (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">Invited</span>
                                  ) : (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">Pending</span>
                                  )}
                                </td>
                                <td className="p-3 text-xs text-muted-foreground">
                                  {screening ? new Date(screening.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
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
                                    {emp.screening_completed && screening && emp.email && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-blue-600"
                                        title={`Email results to ${emp.email}`}
                                        onClick={async () => {
                                          const totalPct = Math.round((screening.total_score / (8 * 5)) * 100);
                                          const tId = toast.loading(`Sending results to ${emp.email}...`);
                                          try {
                                            const { error } = await supabase.functions.invoke('send-transactional-email', {
                                              body: {
                                                templateName: 'b2b-employee-results',
                                                recipientEmail: emp.email,
                                                idempotencyKey: `b2b-emp-results-resend-${screening.id}-${Date.now()}`,
                                                templateData: {
                                                  employee_name: emp.name,
                                                  company_name: selectedCompany?.name,
                                                  who5_percentage: screening.who5_percentage,
                                                  total_percentage: totalPct,
                                                  wellbeing_category: screening.wellbeing_category,
                                                },
                                              },
                                            });
                                            if (error) throw error;
                                            toast.success(`Results emailed to ${emp.email}`, { id: tId });
                                          } catch (e: any) {
                                            toast.error(`Failed to send: ${e?.message || 'unknown error'}`, { id: tId });
                                          }
                                        }}
                                      >
                                        <Mail className="w-3 h-3" />
                                      </Button>
                                    )}
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
                              {/* Screening History Expansion Row */}
                              {expandedEmployees.has(emp.id) && (employeeScreeningHistory.get(emp.id) || []).length > 0 && (
                                <tr key={`${emp.id}-history`} className="bg-muted/30">
                                  <td colSpan={10} className="p-0">
                                    <div className="px-6 py-3">
                                      {/* Per-question breakdown for latest screening */}
                                      {(() => {
                                        const latest = employeeScreeningMap.get(emp.id);
                                        const ans = latest ? answerMapFromStored((latest as any).per_question) : null;
                                        if (!ans || !latest) return null;
                                        const history = employeeScreeningHistory.get(emp.id) || [];
                                        const prev = history[1];
                                        return (
                                          <div className="mb-4">
                                            <PerQuestionEmployeeBreakdown
                                              answers={ans}
                                              completedAt={latest.completed_at}
                                              attemptNumber={history.length}
                                              previousOverallPct={prev ? prev.who5_percentage : null}
                                              employeeLabel={`${emp.name} — Latest screening breakdown`}
                                            />
                                          </div>
                                        );
                                      })()}
                                      <div className="text-[11px] font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                                        <History className="w-3 h-3" />
                                        Screening History for {emp.name}
                                      </div>
                                      <div className="grid gap-1.5">
                                        {(employeeScreeningHistory.get(emp.id) || []).map((s, i) => {
                                          const cat = s.wellbeing_category;
                                          const prevScreening = (employeeScreeningHistory.get(emp.id) || [])[i + 1];
                                          const trend = prevScreening ? s.who5_percentage - prevScreening.who5_percentage : null;
                                          return (
                                            <div key={s.id} className="flex items-center gap-3 text-xs py-1.5 px-3 rounded-md bg-background border">
                                              <span className="font-medium text-muted-foreground w-6">#{(employeeScreeningHistory.get(emp.id) || []).length - i}</span>
                                              <span className="font-medium min-w-[100px]">
                                                {new Date(s.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                              </span>
                                              <span className="text-muted-foreground min-w-[60px]">
                                                {new Date(s.completed_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                              </span>
                                              <span className={`font-bold min-w-[50px] ${cat === 'red' ? 'text-red-600' : cat === 'yellow' ? 'text-yellow-600' : 'text-green-600'}`}>
                                                {s.who5_percentage}%
                                              </span>
                                              <Badge variant={cat === 'red' ? 'destructive' : cat === 'yellow' ? 'secondary' : 'default'} className="text-[9px] px-1.5 py-0">
                                                {cat === 'red' ? 'Critical' : cat === 'yellow' ? 'At Risk' : 'Good'}
                                              </Badge>
                                              {trend !== null && (
                                                <span className={`text-[10px] font-medium ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                                                  {trend > 0 ? `↑ +${trend}%` : trend < 0 ? `↓ ${trend}%` : '→ no change'}
                                                </span>
                                              )}
                                              {i === 0 && <Badge variant="outline" className="text-[9px] px-1 py-0 ml-auto">Latest</Badge>}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <PaginationBar page={employeePage} totalPages={totalEmployeePages} totalItems={filteredEmployees.length} perPage={EMPLOYEES_PER_PAGE} onPageChange={setEmployeePage} />
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

                        {/* 10-Section Report Builder */}
                        <div className="border-t pt-6 mt-2">
                          <h3 className="font-semibold mb-1 flex items-center gap-2">
                            🧱 10-Section Report Builder
                            <Badge variant="secondary" className="text-[10px]">Choose what HR sees</Badge>
                          </h3>
                          <p className="text-xs text-muted-foreground mb-4">
                            Toggle each section on or off. The selected sections (and their data) are saved with the report and embedded in the email sent to HR.
                          </p>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {REPORT_SECTIONS.map((s) => {
                              const on = !!reportSections[s.key];
                              return (
                                <label
                                  key={s.key}
                                  className={`flex items-start gap-2 p-3 rounded-md border cursor-pointer transition ${on ? 'border-primary bg-primary/5' : 'border-input bg-background'}`}
                                >
                                  <Checkbox
                                    checked={on}
                                    onCheckedChange={(v) => setReportSections(prev => ({ ...prev, [s.key]: !!v }))}
                                  />
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold">{s.title}</div>
                                    <div className="text-[11px] text-muted-foreground mt-0.5">{s.description}</div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-3">
                            {Object.values(reportSections).filter(Boolean).length} of {REPORT_SECTIONS.length} sections will be included.
                          </p>
                        </div>

                        {/* Manual Report Builder — adds human-written observations + service recommendations */}
                        <div className="border-t pt-6 mt-2">
                          <h3 className="font-semibold mb-1 flex items-center gap-2">✍️ Manual Report Builder <Badge variant="secondary" className="text-[10px]">Human layer</Badge></h3>
                          <p className="text-xs text-muted-foreground mb-4">Add your own observations and pick services to recommend. These appear inside the email sent to the company HR alongside the automated report. When HR clicks a service, you'll be alerted by email.</p>

                          <div className="space-y-2 mb-4">
                            <Label htmlFor="observations">Consultant's Observations</Label>
                            <Textarea
                              id="observations"
                              placeholder="e.g. The team shows high stress around Q3 deadlines. Several employees flagged anxiety and sleep issues. We recommend immediate manager training and a 1:1 therapy access window for critical cases…"
                              value={observations}
                              onChange={(e) => setObservations(e.target.value)}
                              rows={5}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Recommended Services</Label>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {serviceCatalog.map((s) => {
                                const checked = selectedServiceIds.has(s.id);
                                return (
                                  <div key={s.id} className={`p-3 rounded-md border transition ${checked ? 'border-primary bg-primary/5' : 'border-input'}`}>
                                    <label className="flex items-start gap-2 cursor-pointer">
                                      <Checkbox
                                        checked={checked}
                                        onCheckedChange={(v) => {
                                          const next = new Set(selectedServiceIds);
                                          if (v) next.add(s.id); else next.delete(s.id);
                                          setSelectedServiceIds(next);
                                        }}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium">{s.name}</div>
                                        {s.description && <div className="text-[11px] text-muted-foreground mt-0.5">{s.description}</div>}
                                        <div className="text-[11px] mt-1 font-medium text-primary">
                                          {s.physical_price ? `Physical: UGX ${Number(s.physical_price).toLocaleString()}` : ''}
                                          {s.physical_price && s.virtual_price ? ' • ' : ''}
                                          {s.virtual_price ? `Virtual: UGX ${Number(s.virtual_price).toLocaleString()}` : ''}
                                          {s.per_employee_price ? `UGX ${Number(s.per_employee_price).toLocaleString()} / ${s.unit_label || 'unit'}` : ''}
                                        </div>
                                      </div>
                                    </label>
                                    {checked && (
                                      <Textarea
                                        className="mt-2 text-xs"
                                        rows={2}
                                        placeholder="Why we recommend this for the team (shown to HR in the email)…"
                                        value={serviceReasons[s.id] || ''}
                                        onChange={(e) => setServiceReasons({ ...serviceReasons, [s.id]: e.target.value })}
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            {serviceCatalog.length === 0 && <p className="text-xs text-muted-foreground">No services in catalog yet.</p>}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
                          <FileText className="w-4 h-4 mr-2" /> Preview Report
                        </Button>
                        <Button variant="outline" disabled={downloadingPdf} onClick={async () => {
                          setDownloadingPdf(true);
                          try {
                            const period = new Date().toLocaleDateString('en-UG', { year: 'numeric', month: 'long' });
                            const businessImpact = includeBusinessImpact && completedScreenings > 0
                              ? calculateBusinessImpact(
                                  { healthy: greenCount, at_risk: yellowCount, critical: redCount },
                                  baselineSalary,
                                )
                              : null;
                            const recommended_services_pdf = serviceCatalog
                              .filter(s => selectedServiceIds.has(s.id))
                              .map(s => ({
                                name: s.name, description: s.description,
                                physical_price: s.physical_price, virtual_price: s.virtual_price,
                                per_employee_price: s.per_employee_price, unit_label: s.unit_label,
                                reason: serviceReasons[s.id]?.trim() || undefined,
                              }));
                            const blob = await generateCompanyReportPdf({
                              contact_name: selectedCompany.contact_person,
                              company_name: selectedCompany.name,
                              reporting_period: period,
                              total_employees: totalEmployees,
                              total_completed: completedScreenings,
                              completion_rate: participationRate,
                              avg_who5: avgScore,
                              high_count: greenCount,
                              moderate_count: yellowCount,
                              low_count: redCount,
                              high_wellbeing_pct: completedScreenings > 0 ? Math.round((greenCount / completedScreenings) * 100) : 0,
                              moderate_wellbeing_pct: completedScreenings > 0 ? Math.round((yellowCount / completedScreenings) * 100) : 0,
                              low_wellbeing_pct: completedScreenings > 0 ? Math.round((redCount / completedScreenings) * 100) : 0,
                              needs_support_count: needsSupportCount,
                              sections: reportSections,
                              observations: observations.trim() || null,
                              recommended_services: recommended_services_pdf,
                              business_impact: businessImpact as any,
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${selectedCompany.name.replace(/\s+/g, '_')}_wellbeing_report.pdf`;
                            a.click();
                            URL.revokeObjectURL(url);
                            toast.success('PDF report downloaded');
                          } catch (e: any) {
                            console.error('PDF generation failed', e);
                            toast.error('Could not generate PDF: ' + (e?.message || 'unknown'));
                          } finally {
                            setDownloadingPdf(false);
                          }
                        }}>
                          {downloadingPdf ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                          {downloadingPdf ? 'Generating PDF…' : 'Download PDF Report'}
                        </Button>
                        <Button disabled={sendingReport} onClick={async () => {
                          if (!selectedCompany?.contact_email) {
                            toast.error('Add a contact email to this company first (Manage tab → edit company)');
                            return;
                          }
                          // Section-completion checks: warn if a toggled-on section has no underlying data
                          const missingMsgs: string[] = [];
                          if (reportSections.participation && totalEmployees === 0) missingMsgs.push('Participation (no employees enrolled)');
                          if (reportSections.overall_wellbeing && completedScreenings === 0) missingMsgs.push('Overall Wellbeing (no completed screenings)');
                          if (reportSections.per_question && completedScreenings === 0) missingMsgs.push('Per-Question Averages (no screenings)');
                          if (reportSections.recommended_services && selectedServiceIds.size === 0) missingMsgs.push('Recommended Services (none selected)');
                          if (reportSections.consultant_notes && !observations.trim()) missingMsgs.push('Consultant Observations (empty)');
                          if (missingMsgs.length > 0) {
                            const ok = window.confirm(
                              `These selected sections have no data and will appear empty in the email:\n\n• ${missingMsgs.join('\n• ')}\n\nSend anyway?`
                            );
                            if (!ok) return;
                          }
                          setSendingReport(true);
                          try {
                            const period = new Date().toLocaleDateString('en-UG', { year: 'numeric', month: 'long' });

                            // Build manual layer (additive). Create report row first to get a stable id for tracked links.
                            const recommendedIds = Array.from(selectedServiceIds);
                            let reportId: string | null = null;
                            const businessImpact = includeBusinessImpact && completedScreenings > 0
                              ? calculateBusinessImpact(
                                  { healthy: greenCount, at_risk: yellowCount, critical: redCount },
                                  baselineSalary,
                                )
                              : null;
                            if (observations.trim() || recommendedIds.length > 0 || businessImpact) {
                              const notesObj: Record<string, string> = {};
                              recommendedIds.forEach(id => { if (serviceReasons[id]?.trim()) notesObj[id] = serviceReasons[id].trim(); });
                              const { data: reportRow, error: reportErr } = await supabase
                                .from('corporate_reports')
                                .insert({
                                  company_id: selectedCompany.id,
                                  period_label: period,
                                  observations: observations.trim() || null,
                                  recommended_service_ids: recommendedIds,
                                  service_notes: notesObj,
                                  sections: reportSections,
                                  business_impact: businessImpact as any,
                                  status: 'sent',
                                  sent_to_email: selectedCompany.contact_email,
                                  created_by: user?.id,
                                })
                                .select('id')
                                .single();
                              if (reportErr) console.error('Report row insert failed', reportErr);
                              reportId = (reportRow as any)?.id || null;
                            }

                            const projectRef = (import.meta as any).env.VITE_SUPABASE_PROJECT_ID;
                            const trackBase = `https://${projectRef}.supabase.co/functions/v1/track-service-interest`;
                            const buildTrackUrl = (sid: string) => reportId ? `${trackBase}?report_id=${reportId}&service_id=${sid}` : '';

                            const recommended_services = serviceCatalog
                              .filter(s => selectedServiceIds.has(s.id))
                              .map(s => ({
                                id: s.id, name: s.name, description: s.description,
                                physical_price: s.physical_price, virtual_price: s.virtual_price,
                                per_employee_price: s.per_employee_price, unit_label: s.unit_label,
                                track_url: buildTrackUrl(s.id),
                                reason: serviceReasons[s.id]?.trim() || undefined,
                              }));
                            const alternative_services = recommendedIds.length > 0 ? serviceCatalog
                              .filter(s => !selectedServiceIds.has(s.id))
                              .map(s => ({
                                id: s.id, name: s.name, description: s.description,
                                physical_price: s.physical_price, virtual_price: s.virtual_price,
                                per_employee_price: s.per_employee_price, unit_label: s.unit_label,
                                track_url: buildTrackUrl(s.id),
                              })) : [];

                            const { data, error: emailErr } = await supabase.functions.invoke('send-transactional-email', {
                              body: {
                                templateName: 'b2b-company-report',
                                recipientEmail: selectedCompany.contact_email,
                                idempotencyKey: `b2b-report-${selectedCompany.id}-${Date.now()}`,
                                templateData: {
                                  contact_name: selectedCompany.contact_person || undefined,
                                  company_name: selectedCompany.name,
                                  reporting_period: period,
                                  total_employees: totalEmployees,
                                  total_completed: completedScreenings,
                                  completion_rate: participationRate,
                                  avg_who5: avgScore,
                                  high_count: greenCount,
                                  moderate_count: yellowCount,
                                  low_count: redCount,
                                  high_wellbeing_pct: completedScreenings > 0 ? Math.round((greenCount / completedScreenings) * 100) : 0,
                                  moderate_wellbeing_pct: completedScreenings > 0 ? Math.round((yellowCount / completedScreenings) * 100) : 0,
                                  low_wellbeing_pct: completedScreenings > 0 ? Math.round((redCount / completedScreenings) * 100) : 0,
                                  needs_support_count: needsSupportCount,
                                  consultant_observations: observations.trim() || undefined,
                                  recommended_services: recommended_services.length > 0 ? recommended_services : undefined,
                                  alternative_services: alternative_services.length > 0 ? alternative_services : undefined,
                                },
                              },
                            });
                            if (emailErr) {
                              console.error('Send report error:', emailErr);
                              toast.error('Could not send report: ' + emailErr.message);
                            } else {
                              console.log('Report sent:', data);
                              toast.success(`Report sent to ${selectedCompany.contact_email}`);
                              if (reportId) {
                                await supabase.from('corporate_reports').update({ sent_at: new Date().toISOString() }).eq('id', reportId);
                              }
                              fetchPastReports(selectedCompany.id);
                            }
                          } catch (e: any) {
                            console.error('Send report exception:', e);
                            toast.error('Could not send report: ' + (e?.message || 'unknown'));
                          } finally {
                            setSendingReport(false);
                          }
                        }}>
                          {sendingReport ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                          {sendingReport ? 'Sending…' : 'Send Report to Company'}
                        </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SERVICE INTERESTS TAB — logs HR clicks on recommended services */}
              <TabsContent value="interests">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Service Interests</CardTitle>
                    <CardDescription>HR clicks on recommended services from {selectedCompany.name} reports.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {serviceInterests.filter(i => i.company_id === selectedCompany.id).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No service interest clicks yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {serviceInterests.filter(i => i.company_id === selectedCompany.id).map((i) => (
                          <div key={i.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                              <div className="font-medium text-sm">{i.service_name_snapshot}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(i.clicked_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                              </div>
                            </div>
                            <Badge>Interested</Badge>
                          </div>
                        ))}
                      </div>
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
