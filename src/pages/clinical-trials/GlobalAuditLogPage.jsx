import React, { useEffect, useState, useMemo } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Bell, FileText, CheckCircle2, Clock, ListChecks } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext'; // Uncomment if you have an auth context

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const ACTIONS = [
  { value: '', label: 'All Actions', color: 'bg-gray-200 text-gray-700' },
  { value: 'create', label: 'Create', color: 'bg-green-100 text-green-700' },
  { value: 'update', label: 'Update', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'delete', label: 'Delete', color: 'bg-red-100 text-red-700' },
  { value: 'view', label: 'View', color: 'bg-blue-100 text-blue-700' },
];

export default function GlobalAuditLogPage() {
  // const { user } = useAuth();
  // Dummy RBAC: Only allow admin/compliance
  const user = { role: 'admin' }; // Replace with real user context
  if (!['admin', 'compliance'].includes(user.role)) {
    return <div className="p-8 text-red-600 font-bold">Forbidden: You do not have access to audit logs.</div>;
  }

  // Hooks at the top
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('');
  const [entityIdFilter, setEntityIdFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selectedLog, setSelectedLog] = useState(null);

  // Fetch logs
  useEffect(() => {
    setLoading(true);
    api.get('/api/audit-logs')
      .then(res => setLogs(res.data.data))
      .catch(() => setError('Failed to load audit logs'))
      .finally(() => setLoading(false));
  }, []);

  // Unique filter options
  const uniqueUsers = useMemo(() => Array.from(new Set(logs.map(log => log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'))), [logs]);
  const uniqueActions = useMemo(() => Array.from(new Set(logs.map(log => log.action))), [logs]);
  const uniqueEntityTypes = useMemo(() => Array.from(new Set(logs.map(log => log.entityType).filter(Boolean))), [logs]);
  const uniqueEntityIds = useMemo(() => Array.from(new Set(logs.map(log => log.entityId).filter(Boolean))), [logs]);

  // Filtering
  const filtered = useMemo(() => logs.filter(log => {
    const who = log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System';
    const action = log.action;
    const when = new Date(log.createdAt);
    return (
      (!search || who.toLowerCase().includes(search.toLowerCase()) || action.toLowerCase().includes(search.toLowerCase()) || (log.entityType || '').toLowerCase().includes(search.toLowerCase()) || (log.entityId || '').toLowerCase().includes(search.toLowerCase())) &&
      (!userFilter || who === userFilter) &&
      (!actionFilter || action === actionFilter) &&
      (!entityTypeFilter || log.entityType === entityTypeFilter) &&
      (!entityIdFilter || log.entityId === entityIdFilter) &&
      (!startDate || when >= new Date(startDate)) &&
      (!endDate || when <= new Date(endDate))
    );
  }), [logs, search, userFilter, actionFilter, entityTypeFilter, entityIdFilter, startDate, endDate]);

  // Pagination logic
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Export handlers
  const handleExport = async (format = 'csv') => {
    const params = new URLSearchParams({
      user: userFilter,
      action: actionFilter,
      entityType: entityTypeFilter,
      entityId: entityIdFilter,
      from: startDate || '',
      to: endDate || '',
      format
    });
    const res = await fetch(`/api/audit-logs/export?${params.toString()}`);
    if (format === 'json') {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audit-logs.json';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const text = await res.text();
      const blob = new Blob([text], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audit-logs.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Nav */}
      <header className="h-16 flex items-center justify-between px-8 bg-white border-b shadow-sm z-10">
        <div className="flex items-center gap-4">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
          <span className="font-bold text-xl tracking-tight text-blue-900">NeuroDoc Vault</span>
        </div>
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-blue-700" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</span>
          </Button>
          <div className="flex items-center gap-2">
            <img src="/avatars/01.png" alt="User" className="h-8 w-8 rounded-full" />
            <span className="font-medium text-gray-700">{user.role}</span>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-sm flex flex-col py-8 px-4">
          <nav className="flex flex-col gap-2">
            <a href="/clinical-trials" className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-700 bg-blue-50 font-semibold"><FileText className="h-5 w-5" /> Documents</a>
            <a href="/reviews" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50"><ListChecks className="h-5 w-5" /> Reviews</a>
            <a href="/audit-log" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50"><Clock className="h-5 w-5" /> Audit Log</a>
            {/* Remove Users from sidebar if not needed */}
            <a href="/notifications" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50"><Bell className="h-5 w-5" /> Notifications</a>
          </nav>
          <div className="mt-auto pt-8">
            <span className="text-xs text-gray-400">© 2025 NeuroDoc</span>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Audit Log Table Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold text-blue-900">Audit Log</h2>
              <div className="flex flex-wrap gap-2 items-center">
                <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-40" />
                <select value={userFilter} onChange={e => setUserFilter(e.target.value)} className="border rounded px-2 h-9">
                  <option value="">All Users</option>
                  {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="border rounded px-2 h-9">
                  {ACTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
                <select value={entityTypeFilter} onChange={e => setEntityTypeFilter(e.target.value)} className="border rounded px-2 h-9">
                  <option value="">All Entity Types</option>
                  {uniqueEntityTypes.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <select value={entityIdFilter} onChange={e => setEntityIdFilter(e.target.value)} className="border rounded px-2 h-9">
                  <option value="">All Entity IDs</option>
                  {uniqueEntityIds.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <Calendar selected={startDate} onSelect={setStartDate} />
                <span className="self-center">to</span>
                <Calendar selected={endDate} onSelect={setEndDate} />
                <Button onClick={() => handleExport('csv')} disabled={!filtered.length}>Export CSV</Button>
                <Button onClick={() => handleExport('json')} disabled={!filtered.length}>Export JSON</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-gray-400">Loading audit logs</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : filtered.length === 0 ? (
                <div className="text-gray-400">No audit log entries found.</div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">When</th>
                      <th className="text-left py-2 px-2">Who</th>
                      <th className="text-left py-2 px-2">Action</th>
                      <th className="text-left py-2 px-2">Entity Type</th>
                      <th className="text-left py-2 px-2">Entity ID</th>
                      <th className="text-left py-2 px-2">Details</th>
                      <th className="text-left py-2 px-2">IP</th>
                      <th className="text-left py-2 px-2">Tamper Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map(log => (
                      <tr key={log._id} className="border-b last:border-0 hover:bg-blue-50 cursor-pointer" onClick={() => setSelectedLog(log)}>
                        <td className="py-2 px-2 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="py-2 px-2 whitespace-nowrap">{log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'}</td>
                        <td className="py-2 px-2 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${ACTIONS.find(a => a.value === log.action)?.color || 'bg-gray-200 text-gray-700'}`}>{ACTIONS.find(a => a.value === log.action)?.label || log.action}</span>
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap">{log.entityType || '-'}</td>
                        <td className="py-2 px-2 whitespace-nowrap">{log.entityId || '-'}</td>
                        <td className="py-2 px-2 whitespace-pre-wrap max-w-xs overflow-x-auto">{log.details ? JSON.stringify(log.details) : '-'}</td>
                        <td className="py-2 px-2 whitespace-nowrap">{log.ipAddress || '-'}</td>
                        <td className="py-2 px-2 whitespace-nowrap font-mono text-xs">{log.tamperHash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Pagination Controls */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <span>Rows per page:</span>
              <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 h-8">
                {PAGE_SIZE_OPTIONS.map(size => <option key={size} value={size}>{size}</option>)}
              </select>
              <Button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
              <span>Page {page} of {totalPages || 1}</span>
              <Button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
          {/* Details Modal */}
          {selectedLog && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-900" onClick={() => setSelectedLog(null)}>&times;</button>
                <h3 className="text-lg font-bold mb-2">Audit Log Details</h3>
                <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto max-h-96">{JSON.stringify(selectedLog, null, 2)}</pre>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 