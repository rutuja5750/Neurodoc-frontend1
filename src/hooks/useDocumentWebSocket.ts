import { useEffect, useRef, useState } from 'react';
import { Document, AuditLogEntry } from '@/services/clinical-trials.service';

interface WebSocketMessage {
  type: 'document_update' | 'audit_log_update';
  payload: Document | AuditLogEntry;
}

export const useDocumentWebSocket = (documentId: string) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3000'}/ws/documents/${documentId}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        switch (message.type) {
          case 'document_update':
            setDocument(message.payload as Document);
            break;
          case 'audit_log_update':
            setAuditLog((prev) => [...prev, message.payload as AuditLogEntry]);
            break;
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [documentId]);

  return { document, auditLog };
}; 