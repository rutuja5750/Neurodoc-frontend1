import React, { useEffect, useState } from 'react';
import api from '@/services/api';

export default function WorkflowTimeline({ documentId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!documentId) return;
    setLoading(true);
    api.get(`/api/documents/${documentId}/status-history`)
      .then(res => setHistory(res.data.data))
      .catch(() => setError('Failed to load status history'))
      .finally(() => setLoading(false));
  }, [documentId]);

  if (!documentId) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Workflow Timeline</h3>
      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <div className="text-gray-400">Loading timeline...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : history.length === 0 ? (
          <div className="text-gray-400">No status history found.</div>
        ) : (
          <ol className="relative border-l border-gray-200">
            {history.map((item, idx) => (
              <li key={item._id || idx} className="mb-6 ml-4">
                <div className="absolute w-3 h-3 bg-blue-200 rounded-full -left-1.5 border border-white"></div>
                <time className="mb-1 text-xs font-normal leading-none text-gray-400">{new Date(item.timestamp).toLocaleString()}</time>
                <div className="text-sm font-semibold">{item.status.replace(/_/g, ' ')}</div>
                <div className="text-xs text-gray-500">{item.user ? `${item.user.firstName} ${item.user.lastName}` : 'System'}</div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
} 