import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Bell, FileText, Users, CheckCircle2, Clock, ListChecks } from 'lucide-react';
import api from '@/services/api';

const PANELS = [
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'reviews', label: 'Reviews', icon: ListChecks },
  { key: 'audit', label: 'Audit Logs', icon: Clock },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'notifications', label: 'Notifications', icon: Bell },
];

export default function DashboardPage() {
  // All hooks at the top!
  const [activePanel, setActivePanel] = useState('audit');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (activePanel === 'audit') {
      setLoading(true);
      api.get('/api/audit-logs')
        .then(res => {
          if (Array.isArray(res.data.data) && res.data.data.length > 0) {
            setLogs(res.data.data);
          } else {
            // Dummy data for development/demo
            setLogs([
              {
                _id: '1',
                createdAt: new Date().toISOString(),
                user: { firstName: 'Alice', lastName: 'Smith' },
                action: 'create',
                details: { field: 'Document', value: 'Protocol.pdf' },
                ipAddress: '192.168.1.1',
              },
              {
                _id: '2',
                createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
                user: { firstName: 'Bob', lastName: 'Jones' },
                action: 'update',
                details: { field: 'Status', value: 'Approved' },
                ipAddress: '192.168.1.2',
              },
              {
                _id: '3',
                createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
                user: { firstName: 'Carol', lastName: 'Lee' },
                action: 'delete',
                details: { field: 'Document', value: 'OldFile.docx' },
                ipAddress: '192.168.1.3',
              },
            ]);
          }
        })
        .catch(() => setError('Failed to load audit logs'))
        .finally(() => setLoading(false));
    }
  }, [activePanel]);

  const filtered = logs.filter(log => {
    const who = log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System';
    const action = log.action.replace(/_/g, ' ');
    const when = new Date(log.createdAt);
    return (
      (!search || who.toLowerCase().includes(search.toLowerCase()) || action.toLowerCase().includes(search.toLowerCase())) &&
      (!userFilter || who === userFilter) &&
      (!actionFilter || action === actionFilter) &&
      (!startDate || when >= new Date(startDate)) &&
      (!endDate || when <= new Date(endDate))
    );
  });

  const uniqueUsers = Array.from(new Set(logs.map(log => log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System')));
  const uniqueActions = Array.from(new Set(logs.map(log => log.action.replace(/_/g, ' '))));

  // Dashboard metrics (mocked for now)
  const totalDocs = 128;
  const inReview = 24;
  const approved = 67;
  const users = 12;

  function exportToCSV(logs) {
    if (!logs.length) return;
    const headers = ['When', 'Who', 'Action', 'Details', 'IP'];
    const rows = logs.map(log => [
      new Date(log.createdAt).toLocaleString(),
      log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System',
      log.action.replace(/_/g, ' '),
      log.details ? JSON.stringify(log.details) : '-',
      log.ipAddress || '-'
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'global_audit_log.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

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
            <span className="font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-sm flex flex-col py-8 px-4">
          <nav className="flex flex-col gap-2">
            {PANELS.map(panel => (
              <button
                key={panel.key}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition text-left ${activePanel === panel.key ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-blue-50'}`}
                onClick={() => setActivePanel(panel.key)}
              >
                <panel.icon className="h-5 w-5" /> {panel.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-8">
            <span className="text-xs text-gray-400">© 2025 NeuroDoc</span>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Dashboard Widgets (show on Audit Log panel for now) */}
          {activePanel === 'audit' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2 text-blue-700"><FileText className="h-5 w-5" /> <span className="font-semibold">Documents</span></div>
                  <div className="text-3xl font-bold text-blue-900">{totalDocs}</div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2 text-yellow-600"><Clock className="h-5 w-5" /> <span className="font-semibold">In Review</span></div>
                  <div className="text-3xl font-bold text-yellow-700">{inReview}</div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2 text-green-700"><CheckCircle2 className="h-5 w-5" /> <span className="font-semibold">Approved</span></div>
                  <div className="text-3xl font-bold text-green-800">{approved}</div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2 text-gray-700"><Users className="h-5 w-5" /> <span className="font-semibold">Users</span></div>
                  <div className="text-3xl font-bold text-gray-800">{users}</div>
                </div>
              </div>
              {/* Audit Log Table Card */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <h2 className="text-xl font-bold text-blue-900">Audit Logs</h2>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-40" />
                    <select value={userFilter} onChange={e => setUserFilter(e.target.value)} className="border rounded px-2 h-9">
                      <option value="">All Users</option>
                      {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="border rounded px-2 h-9">
                      <option value="">All Actions</option>
                      {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <Calendar selected={startDate} onSelect={setStartDate} />
                    <span className="self-center">to</span>
                    <Calendar selected={endDate} onSelect={setEndDate} />
                    <Button onClick={() => exportToCSV(filtered)} disabled={!filtered.length}>Export CSV</Button>
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
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2">When</th>
                          <th className="text-left py-2 px-2">Who</th>
                          <th className="text-left py-2 px-2">Action</th>
                          <th className="text-left py-2 px-2">Details</th>
                          <th className="text-left py-2 px-2">IP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map(log => (
                          <tr key={log._id} className="border-b last:border-0">
                            <td className="py-2 px-2 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{log.action.replace(/_/g, ' ')}</td>
                            <td className="py-2 px-2 whitespace-pre-wrap">{log.details ? JSON.stringify(log.details) : '-'}</td>
                            <td className="py-2 px-2 whitespace-nowrap">{log.ipAddress || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}
          {activePanel === 'documents' && (
            <div className="bg-white rounded-xl shadow p-8 text-gray-500 text-center text-lg">Documents panel coming soon...</div>
          )}
          {activePanel === 'reviews' && (
            <div className="bg-white rounded-xl shadow p-8 text-gray-500 text-center text-lg">Reviews panel coming soon...</div>
          )}
          {activePanel === 'users' && (
            <div className="bg-white rounded-xl shadow p-8 text-gray-500 text-center text-lg">Users panel coming soon...</div>
          )}
          {activePanel === 'notifications' && (
            <div className="bg-white rounded-xl shadow p-8 text-gray-500 text-center text-lg">Notifications panel coming soon...</div>
          )}
        </main>
      </div>
    </div>
  );
} 