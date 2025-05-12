import React, { useState, useEffect } from 'react';
import SidebarNav from './SidebarNav';
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Info } from 'lucide-react';

// Fixed imports with relative paths
import ZoneDialog from '../../components/dialogs/ZoneDialog ';
import SectionDialog from '../../components/dialogs/SectionDialog ';
import ArtifactDialog from '../../components/dialogs/ArtifactDialog ';
import SubArtifactDialog from '../../components/dialogs/SubArtifactDialog';
import DocumentDialog from '../../components/dialogs/DocumentDialog ';
import ContentArea from './ContentArea ';
import TMFLayout from './TMFLayout';

const TMFViewer = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
        <div className="text-2xl font-bold text-blue-800">TMF Viewer</div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => handleCreate('zone')}
        >
          <Plus className="h-4 w-4" /> Add Zone
        </button>
      </div>
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-72 bg-white border-r h-full overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded" />
              ))}
            </div>
          ) : (
            <SidebarNav
              data={data}
              onSelect={handleSelect}
              loadSections={loadSections}
              loadArtifacts={loadArtifacts}
              loadSubArtifacts={loadSubArtifacts}
              selectedItem={selectedItem}
            />
          )}
        </aside>
        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Info Panel for Selected Item */}
          {selectedItem ? (
            <div className="mb-6 p-4 bg-white rounded shadow flex items-center gap-4 border border-gray-100">
              <Info className="h-6 w-6 text-blue-500" />
              <div>
                <div className="font-semibold text-lg text-gray-800">{selectedItem.name || selectedItem.title}</div>
                <div className="text-sm text-gray-500">Type: {selectedItem.type || selectedItem.level || 'Unknown'}</div>
                {selectedItem.description && (
                  <div className="text-sm text-gray-600 mt-1">{selectedItem.description}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-white rounded shadow text-gray-500 border border-gray-100">Select a zone, section, or artifact to see details.</div>
          )}
          {/* Existing Content Area */}
          <ContentArea
            selectedItem={selectedItem}
            data={data}
            onCreate={handleCreate}
            onDialogOpen={setDialogOpen}
            parentId={parentId}
            setParentId={setParentId}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            handleZoneSubmit={handleZoneSubmit}
            handleSectionSubmit={handleSectionSubmit}
            handleArtifactSubmit={handleArtifactSubmit}
            handleSubArtifactSubmit={handleSubArtifactSubmit}
            handleDocumentSubmit={handleDocumentSubmit}
          />
        </main>
      </div>
      {/* Dialogs */}
      <ZoneDialog open={dialogOpen.zone} onClose={() => handleDialogClose('zone')} onSubmit={handleZoneSubmit} />
      <SectionDialog open={dialogOpen.section} onClose={() => handleDialogClose('section')} onSubmit={handleSectionSubmit} />
      <ArtifactDialog open={dialogOpen.artifact} onClose={() => handleDialogClose('artifact')} onSubmit={handleArtifactSubmit} />
      <SubArtifactDialog open={dialogOpen.subArtifact} onClose={() => handleDialogClose('subArtifact')} onSubmit={handleSubArtifactSubmit} />
      <DocumentDialog open={dialogOpen.document} onClose={() => handleDialogClose('document')} onSubmit={handleDocumentSubmit} />
    </div>
  );
};

export default TMFViewer;