import React, { useEffect, useState } from "react";
import axios from "../../helper/axios";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  User,
  MessageSquare,
  Trash2,
  
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom'

function AdminContact() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("/api/contactus");
      setData(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    setDeletingId(id);
    try {
      await axios.delete(`/api/contactus/${id}`);
      setData(prev => prev.filter(item => item._id !== id));
      toast.success("Message deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-semibold">
        Loading messages...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 px-6 py-14">
      <ToastContainer autoClose={3000} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Contact Messages
          </h1>
          <p className="text-gray-500">
            Messages sent from Contact Us page
          </p>
        </div>

        {/* Table Header (desktop) */}
        <div className="hidden sm:grid grid-cols-12 bg-gray-200 text-sm font-semibold text-gray-700 px-6 py-4 rounded-t-xl">
          <div className="col-span-3">User</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Phone</div>
          <div className="col-span-2">Message</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        {/* Table Header (mobile) */}
        <div className="sm:hidden bg-gray-200 text-sm font-semibold text-gray-700 px-6 py-4 rounded-t-xl">
          <span>Messages (tap a row for details)</span>
        </div>

        {/* Rows */}
        <div className="bg-white rounded-b-xl shadow divide-y">
          {data.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No messages found
            </div>
          )}

          {data.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              {/* Desktop Row */}
              <div className="hidden sm:grid grid-cols-12 px-6 py-5 items-center hover:bg-gray-50">
                {/* USER */}
                <div className="col-span-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{item.name}</span>
                </div>

                {/* EMAIL */}
                <div className="col-span-3 flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-green-600" />
                  {item.email}
                </div>

                {/* PHONE */}
                <div className="col-span-2 flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-purple-600" />
                  {item.phno}
                </div>

                {/* MESSAGE */}
                <Link to={`/admin/admincontactus/${item._id}`} className="col-span-2 flex items-start gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-orange-500 mt-1" />
                  Detail
                </Link>

                {/* DATE */}
                <div className="col-span-1 text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>

                {/* ACTION */}
                <div className="col-span-1 text-center">
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {deletingId === item._id ? "..." : <Trash2 size={18} />}
                  </button>
                </div>
              </div>

              {/* Mobile Row */}
              <div className="sm:hidden px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-base font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {deletingId === item._id ? "..." : <Trash2 size={18} />}
                  </button>
                </div>

                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-green-600" />
                    {item.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-600" />
                    {item.phno}
                  </div>
                  <Link
                    to={`/admin/admincontactus/${item._id}`}
                    className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminContact;
