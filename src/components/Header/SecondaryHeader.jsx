import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus, Settings } from 'lucide-react';

const SecondaryHeader = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  // Create menu items for dropdown
  const createItems = [
    { label: 'Add Document', path: '/create/document' },
    { label: 'Create Users', path: '/create/user' },
    { label: 'Create Study', path: '/create/study' },
    { label: 'Create Workflow', path: '/create/workflow' },
    { label: 'Override Workflow', path: '/create/overide-workflow' },
  ];

  const toggleDropdown = (id) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(id);
    }
  };

  const closeAllDropdowns = () => {
    setOpenDropdown(null);
  };

  const navigateTo = (path) => {
    navigate(path);
    closeAllDropdowns();
  };

  return (
    <div className="sticky top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-40">
      <div className="container mx-auto h-full px-6 flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Left side navigation */}
          <div className="flex items-center space-x-4">
            {/* Home button */}
            <Button 
              variant="ghost" 
              className="h-9 px-4 text-sm font-medium hover:bg-gray-100"
              onClick={() => navigateTo('/')}
            >
              Home
            </Button>

            <Button 
              variant="ghost" 
              className="h-9 px-4 text-sm font-medium hover:bg-gray-100"
              onClick={() => navigateTo('/tmf-viewer')}
            >
              TMF Viewer
            </Button>

            <Button 
              variant="ghost" 
              className="h-9 px-4 text-sm font-medium hover:bg-gray-100"
              onClick={() => navigateTo('/documents')}
            >
              Documents
            </Button>

            <Button 
              variant="ghost" 
              className="h-9 px-4 text-sm font-medium hover:bg-gray-100"
              onClick={() => navigateTo('/tmf-library')}
            >
              Library
            </Button>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Create dropdown */}
            <div 
              className="dropdown-container relative"
              onMouseEnter={() => setOpenDropdown('create')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Button 
                size="sm"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => toggleDropdown('create')}
              >
                <Plus className="h-4 w-4" />
                Create
              </Button>

              {openDropdown === 'create' && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded shadow-md border border-gray-100 py-1 z-50">
                  {createItems.map((item, i) => (
                    <button
                      key={i}
                      className="w-full text-left py-2 px-4 text-sm hover:bg-gray-50 hover:text-primary"
                      onClick={() => navigateTo(item.path)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full hover:bg-gray-100"
              onClick={() => navigateTo('/settings')}
            >
              <Settings className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondaryHeader;