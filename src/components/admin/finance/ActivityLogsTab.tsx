import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ActivityLogsTab = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(200);
      if (data) setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading activity logs...</div>;

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Entity ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No activity yet</TableCell></TableRow>
          ) : logs.map((log, i) => (
            <TableRow key={log.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell className="text-sm">{new Date(log.created_at).toLocaleString()}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell><span className="text-xs px-2 py-0.5 rounded-full bg-muted">{log.entity_type}</span></TableCell>
              <TableCell className="text-xs text-muted-foreground">{log.entity_id ? log.entity_id.substring(0, 8) + '...' : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ActivityLogsTab;
