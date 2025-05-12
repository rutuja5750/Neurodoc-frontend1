import PrimaryHeader from '@/components/Header/PrimaryHeader';
import SecondaryHeader from '@/components/Header/SecondaryHeader';
import HomePage from '@/pages/HomePage';
import React from 'react';
import { Outlet } from "react-router";

function LayoutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full z-30 fixed top-0">
        <PrimaryHeader />
      </div>
      <div className="w-full z-20 fixed top-14">
        <SecondaryHeader />
      </div>
      <div className="w-full z-10 mt-24 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  )
}

export default LayoutPage;