import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';

const statusOptions = [
  { value: '', label: 'Any' },
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'In Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'final', label: 'Final' },
  { value: 'archived', label: 'Archived' },
];

export default function AdvancedFilterPanel({ open, onClose, filters, onChange, onApply, categories }) {
  const [localFilters, setLocalFilters] = useState(filters || {});

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Advanced Filters</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select value={localFilters.category || ''} onValueChange={v => handleChange('category', v)}>
              <option value="">Any</option>
              {categories?.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Version</label>
            <Input value={localFilters.version || ''} onChange={e => handleChange('version', e.target.value)} placeholder="e.g. 1.0" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Study ID</label>
            <Input value={localFilters.studyId || ''} onChange={e => handleChange('studyId', e.target.value)} placeholder="e.g. 000909" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Uploader</label>
            <Input value={localFilters.uploader || ''} onChange={e => handleChange('uploader', e.target.value)} placeholder="Uploader name or email" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select value={localFilters.status || ''} onValueChange={v => handleChange('status', v)}>
              {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date Range</label>
            <div className="flex gap-2">
              <Calendar selected={localFilters.startDate} onSelect={date => handleChange('startDate', date)} />
              <span className="self-center">to</span>
              <Calendar selected={localFilters.endDate} onSelect={date => handleChange('endDate', date)} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </div>
    </div>
  );
} 