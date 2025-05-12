import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import { Sidebar } from './Sidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 