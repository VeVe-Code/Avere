import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/admin/sidebar";
import { Menu } from "lucide-react";
import { AuthContext } from "./contexts/AuthContext";

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      {user && (
        <Sidebar open={open} onClose={() => setOpen(false)} />
      )}

      {/* Main Content */}
      <div className={`flex flex-col flex-1 ${user ? "lg:ml-64" : ""}`}>

        {/* Top Navbar */}
        {user && (
          <header className="h-16 bg-white shadow flex items-center px-6 sticky top-0 z-40">
            <button
              className="lg:hidden mr-4"
              onClick={() => setOpen(true)}
            >
              <Menu size={24} />
            </button>

            <h1 className="font-semibold text-lg">
              Admin Panel
            </h1>
          </header>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;