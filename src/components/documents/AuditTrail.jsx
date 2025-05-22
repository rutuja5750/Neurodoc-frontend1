import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';

export default function AuditTrail({ documentId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!documentId) return;
    setLoading(true);
    api.get(`/api/documents/${documentId}/audit-logs`)
      .then(res => setLogs(res.data.data))
      .catch(err => setError('Failed to load audit trail'))
      .finally(() => setLoading(false));
  }, [documentId]);

  if (!documentId) return null;

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
    a.download = 'audit_log.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
        Audit Trail
        <Button size="sm" variant="outline" onClick={() => exportToCSV(logs)} disabled={!logs.length}>
          Export CSV
        </Button>
      </h3>
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        {loading ? (
          <div className="text-gray-400">Loading audit trail...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : logs.length === 0 ? (
          <div className="text-gray-400">No audit trail entries found.</div>
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
              {logs.map(log => (
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
  );
} 