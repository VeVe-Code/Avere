import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/admin/sidebar";
import { Menu } from "lucide-react";
import { AuthContext } from "./contexts/AuthContext";

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Desktop Sidebar */}
      {user && (
        <aside className="hidden lg:flex w-64 fixed inset-y-0 left-0 z-40">
          <Sidebar />
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      {user && open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="w-64 bg-white shadow-xl">
            <Sidebar onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col w-full ${user ? "lg:ml-64" : ""}`}>

        {/* Top Bar */}
        {user && (
          <header className="h-16 bg-white shadow flex items-center px-6 sticky top-0 z-30">
            <button
              className="lg:hidden mr-4"
              onClick={() => setOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="font-semibold text-lg">Admin Panel</h1>
          </header>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;
