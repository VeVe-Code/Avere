import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { X, LogOut } from "lucide-react";
import axios from "../../helper/axios";
import { AuthContext } from "../../contexts/AuthContext";

export default function Sidebar({ open, onClose }) {

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = async () => {
    const res = await axios.post("/api/users/logout");

    if (res.status === 200) {
      dispatch({ type: "LOGIN", payload: res.data.user });
      navigate("/admin/login");
    }
  };

  const menu = [
    { name: "Service", path: "/admin/adminservice" },
    { name: "Categories", path: "/admin/adminCategories" },
    { name: "Knowledge", path: "/admin/adminknowledge" },
    { name: "Network", path: "/admin/adminnetwork" },
    { name: "Systems", path: "/admin/adminsystems" },
    { name: "Security", path: "/admin/adminSecurity" },
    { name: "Contact Data", path: "/admin/admincontactus" },
  ];

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white
        transform transition-transform duration-300 flex flex-col
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-5 text-lg font-bold border-b border-slate-700 flex justify-between items-center">
          Admin Panel

          <button className="lg:hidden" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <ul className="flex-1 p-4 space-y-2">
          {menu.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition
                  ${isActive ? "bg-blue-600" : "hover:bg-slate-700"}`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2
            px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}