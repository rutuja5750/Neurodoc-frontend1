import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Bell, FileText, Users, CheckCircle2, Clock, ListChecks, Search } from 'lucide-react';
import UploadDocumentDialog from './components/UploadDocumentDialog';
import DocumentPreview from './components/DocumentPreview';
import DocumentWorkflow from './components/DocumentWorkflow';
import WorkflowTimeline from '@/components/documents/WorkflowTimeline';
import AuditTrail from '@/components/documents/AuditTrail';
import ReviewList from '@/components/review/ReviewList';
import CreateReviewForm from '@/components/review/CreateReviewForm';
import DocumentList from '@/pages/documents/DocumentList';
import { TableCell } from '@/components/ui/table';
import DocumentActionsMenu from '@/components/documents/DocumentActionsMenu';

const PANELS = [
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'reviews', label: 'Reviews', icon: ListChecks },
  { key: 'audit', label: 'Audit Logs', icon: Clock },
  { key: 'notifications', label: 'Notifications', icon: Bell },
];

const PAGE_SIZE_OPTIONS = [5, 10, 25];
const ACTIONS = [
  { value: '', label: 'All Actions', color: 'bg-gray-200 text-gray-700' },
  { value: 'create', label: 'Create', color: 'bg-green-100 text-green-700' },
  { value: 'update', label: 'Update', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'delete', label: 'Delete', color: 'bg-red-100 text-red-700' },
  { value: 'view', label: 'View', color: 'bg-blue-100 text-blue-700' },
];

export default function ClinicalTrialsPage() {
  const [activePanel, setActivePanel] = useState('audit');

  // Audit log state
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Dashboard metrics (mocked for now)
  const totalDocs = 128;
  const inReview = 24;
  const approved = 67;
  const users = 12;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState(['when', 'who', 'action', 'details', 'ip']);
  const [selectedRows, setSelectedRows] = useState([]);
  const [userMulti, setUserMulti] = useState([]);
  const [actionMulti, setActionMulti] = useState([]);
  const userDropdownRef = useRef(null);
  const actionDropdownRef = useRef(null);
  const [showColMenu, setShowColMenu] = useState(false);

  useEffect(() => {
    if (activePanel === 'audit') {
      setLoading(true);
      // Always use mock data for demo
      setTimeout(() => {
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
          {
            _id: '4',
            createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
            user: { firstName: 'David', lastName: 'Kim' },
            action: 'view',
            details: { field: 'Document', value: 'ConsentForm.pdf' },
            ipAddress: '192.168.1.4',
          },
          {
            _id: '5',
            createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
            user: { firstName: 'Eva', lastName: 'Martinez' },
            action: 'create',
            details: { field: 'Document', value: 'LabResults.xlsx' },
            ipAddress: '192.168.1.5',
          },
        ]);
        setLoading(false);
      }, 500); // Simulate network delay
    }
  }, [activePanel]);

  // Unique filter options
  const uniqueUsers = useMemo(() => Array.from(new Set(logs.map(log => log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'))), [logs]);

  // Filtering
  const filtered = useMemo(() => logs.filter(log => {
    const who = log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System';
    const action = log.action;
    return (
      (!search || who.toLowerCase().includes(search.toLowerCase()) || action.toLowerCase().includes(search.toLowerCase()) || (log.details ? JSON.stringify(log.details).toLowerCase().includes(search.toLowerCase()) : false)) &&
      (userMulti.length === 0 || userMulti.includes(who)) &&
      (actionMulti.length === 0 || actionMulti.includes(action))
    );
  }), [logs, search, userMulti, actionMulti]);

  // Pagination logic
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Column definitions
  const columns = [
    { key: 'when', label: 'When' },
    { key: 'who', label: 'Who' },
    { key: 'action', label: 'Action' },
    { key: 'details', label: 'Details' },
    { key: 'ip', label: 'IP' },
  ];

  // Export selected rows
  function exportSelectedToCSV() {
    if (!selectedRows.length) return;
    const headers = columns.filter(col => visibleColumns.includes(col.key)).map(col => col.label);
    const rows = selectedRows.map(log =>
      columns.filter(col => visibleColumns.includes(col.key)).map(col => {
        if (col.key === 'when') return new Date(log.createdAt).toLocaleString();
        if (col.key === 'who') return log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System';
        if (col.key === 'action') return log.action;
        if (col.key === 'details') return log.details ? JSON.stringify(log.details) : '-';
        if (col.key === 'ip') return log.ipAddress || '-';
        return '';
      })
    );
    const csvContent = [headers, ...rows].map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected_audit_logs.csv';
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
              {/* Advanced Audit Log Table Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
                {/* Column customization menu */}
                <div className="flex justify-end mb-2">
                  <button className="text-sm text-blue-700 underline" onClick={() => setShowColMenu(v => !v)}>Columns</button>
                  {showColMenu && (
                    <div className="absolute bg-white border rounded shadow p-3 mt-8 z-50">
                      {columns.map(col => (
                        <label key={col.key} className="flex items-center gap-2 mb-1">
                          <input type="checkbox" checked={visibleColumns.includes(col.key)} onChange={() => {
                            setVisibleColumns(v => v.includes(col.key) ? v.filter(k => k !== col.key) : [...v, col.key]);
                          }} />
                          {col.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {/* Filter chips */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {userMulti.map(u => (
                    <span key={u} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      {u} <button onClick={() => setUserMulti(userMulti.filter(x => x !== u))}>&times;</button>
                    </span>
                  ))}
                  {actionMulti.map(a => (
                    <span key={a} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      {ACTIONS.find(act => act.value === a)?.label || a} <button onClick={() => setActionMulti(actionMulti.filter(x => x !== a))}>&times;</button>
                    </span>
                  ))}
                </div>
                {/* Filters row */}
                <div className="flex flex-wrap gap-3 items-center w-full md:w-auto mb-4">
                  <div className="relative w-48">
                    <Input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  {/* Multi-select user filter */}
                  <div className="relative" ref={userDropdownRef}>
                    <button className="border rounded px-2 h-10 min-w-[120px] text-left" onClick={() => userDropdownRef.current.classList.toggle('open')}>{userMulti.length ? userMulti.join(', ') : 'All Users'}</button>
                    <div className="absolute bg-white border rounded shadow p-2 mt-1 z-50 hidden group-[.open]:block">
                      {uniqueUsers.map(u => (
                        <label key={u} className="flex items-center gap-2 mb-1">
                          <input type="checkbox" checked={userMulti.includes(u)} onChange={() => setUserMulti(userMulti.includes(u) ? userMulti.filter(x => x !== u) : [...userMulti, u])} />
                          {u}
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Multi-select action filter */}
                  <div className="relative" ref={actionDropdownRef}>
                    <button className="border rounded px-2 h-10 min-w-[120px] text-left" onClick={() => actionDropdownRef.current.classList.toggle('open')}>{actionMulti.length ? actionMulti.map(a => ACTIONS.find(act => act.value === a)?.label || a).join(', ') : 'All Actions'}</button>
                    <div className="absolute bg-white border rounded shadow p-2 mt-1 z-50 hidden group-[.open]:block">
                      {ACTIONS.filter(a => a.value).map(a => (
                        <label key={a.value} className="flex items-center gap-2 mb-1">
                          <input type="checkbox" checked={actionMulti.includes(a.value)} onChange={() => setActionMulti(actionMulti.includes(a.value) ? actionMulti.filter(x => x !== a.value) : [...actionMulti, a.value])} />
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${a.color}`}>{a.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button onClick={exportSelectedToCSV} disabled={!selectedRows.length} title="Export selected as CSV" className="h-10">Export Selected</Button>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-100">
                  {loading ? (
                    <div className="flex justify-center items-center h-32"><span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></span> <span className="text-gray-400">Loading audit logs...</span></div>
                  ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                      <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#F3F4F6"/><path d="M8 11h8M8 15h5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="1" fill="#9CA3AF"/></svg>
                      <span>No audit log entries found.</span>
                    </div>
                  ) : (
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr className="border-b border-gray-200">
                          <th className="py-3 px-3"><input type="checkbox" checked={selectedRows.length === paginated.length} onChange={e => setSelectedRows(e.target.checked ? paginated : [])} aria-label="Select all" /></th>
                          {columns.filter(col => visibleColumns.includes(col.key)).map(col => (
                            <th key={col.key} className="text-left py-3 px-3 font-semibold text-gray-700">{col.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((log, idx) => (
                          <tr key={log._id} className={`border-b last:border-0 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 cursor-pointer`} onClick={() => setSelectedLog(log)}>
                            <td className="py-2 px-3"><input type="checkbox" checked={selectedRows.includes(log)} onChange={e => setSelectedRows(e.target.checked ? [...selectedRows, log] : selectedRows.filter(l => l !== log))} aria-label="Select row" /></td>
                            {visibleColumns.includes('when') && <td className="py-2 px-3 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>}
                            {visibleColumns.includes('who') && <td className="py-2 px-3 whitespace-nowrap flex items-center gap-2"><span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">{log.user ? `${log.user.firstName[0]}${log.user.lastName[0]}` : 'S'}</span><span className="font-medium">{log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'}</span></td>}
                            {visibleColumns.includes('action') && <td className="py-2 px-3 whitespace-nowrap"><span className={`px-2 py-1 rounded text-xs font-semibold ${ACTIONS.find(a => a.value === log.action)?.color || 'bg-gray-200 text-gray-700'}`}>{ACTIONS.find(a => a.value === log.action)?.label || log.action}</span></td>}
                            {visibleColumns.includes('details') && <td className="py-2 px-3 whitespace-pre-wrap max-w-xs overflow-x-auto">{log.details ? JSON.stringify(log.details) : '-'}</td>}
                            {visibleColumns.includes('ip') && <td className="py-2 px-3 whitespace-nowrap">{log.ipAddress || '-'}</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                {/* Pagination Controls */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 h-8">
                      {PAGE_SIZE_OPTIONS.map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
                    <span>Page {page} of {totalPages || 1}</span>
                    <Button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
                  </div>
                </div>
                {/* Details Modal */}
                {selectedLog && (
                  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full relative">
                      <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-2xl" onClick={() => setSelectedLog(null)}>&times;</button>
                      <h3 className="text-xl font-bold mb-4 text-blue-900">Audit Log Details</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-semibold text-gray-700">When:</span> {new Date(selectedLog.createdAt).toLocaleString()}</div>
                        <div><span className="font-semibold text-gray-700">Who:</span> {selectedLog.user ? `${selectedLog.user.firstName} ${selectedLog.user.lastName}` : 'System'}</div>
                        <div><span className="font-semibold text-gray-700">Action:</span> <span className={`px-2 py-1 rounded text-xs font-semibold ${ACTIONS.find(a => a.value === selectedLog.action)?.color || 'bg-gray-200 text-gray-700'}`}>{ACTIONS.find(a => a.value === selectedLog.action)?.label || selectedLog.action}</span></div>
                        <div><span className="font-semibold text-gray-700">Details:</span> <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto max-h-40 mt-1">{selectedLog.details ? JSON.stringify(selectedLog.details, null, 2) : '-'}</pre></div>
                        <div><span className="font-semibold text-gray-700">IP Address:</span> {selectedLog.ipAddress || '-'}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {activePanel === 'documents' && (
            <DocumentList />
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