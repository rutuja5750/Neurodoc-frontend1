import PrimaryHeader from '@/components/Header/PrimaryHeader';
import SecondaryHeader from '@/components/Header/SecondaryHeader';
import HomePage from '@/pages/HomePage';
import React from 'react';
import { Outlet } from "react-router";

function LayoutPage() {
  return (
    <div className="flex flex-col">
      <div className="w-full z-30">
        <PrimaryHeader />
      </div>
      <div className="w-full z-20 mt-14"> {/* Add margin-top to create space */}
        <SecondaryHeader />
      </div>
      <div className="w-full z-10 mt-16"> {/* Add margin-top to create space */}
        <Outlet />
        <HomePage />
      </div>
    </div>
  )
}

export default LayoutPage;