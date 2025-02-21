import { useState } from "react";
import AdminSidebar from "@/components/Common/AdminSidebar";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import { cn } from "@/lib/utils";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from 'react';

const AdminDashboardLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="min-h-screen">
      <AdminSidebar isExpanded={isSidebarExpanded} toggle={toggleSidebar} />
      <div
        className={cn(
          "transition-all duration-300",
          isSidebarExpanded ? "pl-64" : "pl-20",
        )}
      >
        <main className="p-4">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
