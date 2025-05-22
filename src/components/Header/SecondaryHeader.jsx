import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus, Settings } from 'lucide-react';

const SecondaryHeader = () => {
  const navigate = useNavigate();
  
  // State to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState(null);

  // Navigation menu items structure
  const menuItems = [
    {
      id: 'study-info',
      label: 'Study Info',
      items: [
        { label: 'Study Overview', path: '/study/overview' },
        { label: 'Study Details', path: '/study/details' },
        { label: 'Protocol Information', path: '/study/protocol' }
      ]
    },
    {
      id: 'planning',
      label: 'Planning',
      items: [
        { label: 'Study Timeline', path: '/planning/timeline' },
        { label: 'Milestones', path: '/planning/milestones' },
        { label: 'Resources', path: '/planning/resources' }
      ]
    },
    {
      id: 'study-management',
      label: 'Study Management',
      items: [
        { label: 'TMF Homepage', path: '/management/tmf-homepage' },
        { label: 'TMF Viewer', path: '/tmf-viewer' },
        { label: 'Studies', path: '/management/studies' }
      ]
    },
    {
      id: 'site-monitoring',
      label: 'Site Monitoring',
      items: [
        { label: 'Sites', path: '/monitoring/sites' },
        { label: 'Visits', path: '/monitoring/visits' },
        { label: 'Issues', path: '/monitoring/issues' }
      ]
    },
    {
      id: 'library',
      label: 'Library',
      items: [
        { label: 'Templates', path: '/library/templates' },
        { label: 'Resources', path: '/library/resources' },
        { label: 'References', path: '/library/references' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      items: [
        { label: 'Study Reports', path: '/reports/study' },
        { label: 'Site Reports', path: '/reports/site' },
        { label: 'Custom Reports', path: '/reports/custom' }
      ]
    }
  ];

  // Create menu items for dropdown
  const createItems = [
    { label: 'Add Document', path: '/create/document' },
    { label: 'Create Users', path: '/create/user' },
    { label: 'Create Study', path: '/create/study' },
    { label: 'Create Workflow', path: '/create/workflow' },
    { label: 'Override Workflow', path: '/create/overide-workflow' },
  ];

  // Toggle dropdown visibility
  const toggleDropdown = (id) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(id);
    }
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setOpenDropdown(null);
  };

  // Navigate to path and close dropdown
  const navigateTo = (path) => {
    navigate(path);
    closeAllDropdowns();
  };

  return (
    <div 
      className="fixed left-0 right-0 h-12 bg-white border-b border-gray-200 z-40 px-4 flex items-center justify-between shadow-sm"
      onClick={(e) => {
        // Close dropdowns when clicking elsewhere
        if (!e.target.closest('.dropdown-container')) {
          closeAllDropdowns();
        }
      }}
    >
      {/* Left side navigation */}
      <div className="flex items-center h-full space-x-1">
        {/* Home button */}
        <Button 
          variant="ghost" 
          className="h-9 px-3 text-sm font-medium hover:bg-gray-100"
          onClick={() => navigateTo('/')}
        >
          Home
        </Button>

        <Button 
          variant="ghost" 
          className="h-9 px-3 text-sm font-medium hover:bg-gray-100"
          onClick={() => navigateTo('/tmf-viewer')}
        >
          TMF Viewer
        </Button>

        <Button 
          variant="ghost" 
          className="h-9 px-3 text-sm font-medium hover:bg-gray-100"
          onClick={() => navigateTo('/documents')}
        >
          Documents
        </Button>

        <Button 
          variant="ghost" 
          className="h-9 px-3 text-sm font-medium hover:bg-gray-100"
          onClick={() => navigateTo('/tmf-library')}
        >
          Library
        </Button>


        
        {/* Navigation dropdown menus */}
        {/* {menuItems.map((menu) => (
          <div 
            key={menu.id}
            className="dropdown-container relative"
            onMouseEnter={() => setOpenDropdown(menu.id)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <Button 
              variant="ghost" 
              className={cn(
                "h-9 px-3 text-sm font-medium group",
                openDropdown === menu.id ? "bg-gray-100 text-primary" : "hover:bg-gray-100"
              )}
              onClick={() => toggleDropdown(menu.id)}
            >
              {menu.label}
              <ChevronDown 
                className={cn(
                  "ml-1 h-4 w-4 opacity-70 transition-transform duration-200",
                  openDropdown === menu.id ? "rotate-180 text-primary" : ""
                )} 
              />
            </Button>
            
            {openDropdown === menu.id && (
              <div className="absolute top-full left-0 mt-0.5 w-52 bg-white rounded shadow-md border border-gray-100 py-1 z-50">
                {menu.items.map((item, i) => (
                  <button
                    key={i}
                    className="w-full text-left py-1.5 px-3 text-sm hover:bg-gray-50 hover:text-primary"
                    onClick={() => navigateTo(item.path)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))} */}
      </div>


      {/* Right side controls */}
      <div className="flex items-center space-x-2">
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
            <div className="absolute top-full right-0 mt-0.5 w-40 bg-white rounded shadow-md border border-gray-100 py-1 z-50">
              {createItems.map((item, i) => (
                <button
                  key={i}
                  className="w-full text-left py-1.5 px-3 text-sm hover:bg-gray-50 hover:text-primary"
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
          className="h-8 w-8 rounded-full hover:bg-gray-100"
          onClick={() => navigateTo('/settings')}
        >
          <Settings className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

export default SecondaryHeader;