import React, { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const categories = [
  'Protocol',
  'Informed Consent',
  'Case Report Form',
  'Safety Report',
  'Regulatory Document',
  'Other',
];

export default function EditDocumentDialog({ open, onClose, document, onSave }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (document) {
      setForm({
        title: document.metadata?.title || document.title || '',
        category: document.metadata?.category || document.documentType || '',
        version: document.metadata?.version || document.version || '',
        studyId: document.metadata?.studyId || document.study || '',
      });
    }
  }, [document]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Document Metadata</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input value={form.title} onChange={e => handleChange('title', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select value={form.category} onValueChange={v => handleChange('category', v)}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Version</label>
            <Input value={form.version} onChange={e => handleChange('version', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Study ID</label>
            <Input value={form.studyId} onChange={e => handleChange('studyId', e.target.value)} />
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 