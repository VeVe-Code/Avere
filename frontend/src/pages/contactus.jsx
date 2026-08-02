import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, Mail, Phone, MapPin } from "lucide-react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../helper/axios";
import SEO from "../components/SEO";

function FieldMsg({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-sm text-red-600 dark:text-red-400">
      <AlertCircle size={14} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phno, setPhno] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const clearField = (key) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const validate = () => {
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!phno.trim()) newErrors.phno = "Phone number is required";
    if (!msg.trim()) newErrors.msg = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const postdata = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validate()) {
      toast.error("Check the form fields below", {
        position: "top-center",
        autoClose: 3000,
        transition: Bounce,
      });
      return;
    }

    setLoading(true);

    try {
      const data = { name, email, phno, msg };
      const res = await axios.post("/api/contactus", data);

      if (res.status === 200) {
        toast.success("Message sent successfully", {
          position: "top-center",
          autoClose: 3000,
          transition: Bounce,
        });

        setName("");
        setEmail("");
        setPhno("");
        setMsg("");
        setErrors({});
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again", {
        position: "top-center",
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const errBorder = (key) =>
    errors[key]
      ? "border-red-400 dark:border-red-500/80 bg-red-50/40 dark:bg-red-950/20 focus:ring-red-500/30"
      : "border-gray-300 dark:border-slate-700 focus:ring-blue-500";

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <section className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SEO
        title="Contact us Page - Avere"
        description="contact page"
      />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-slate-100 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            Let’s talk about your project or any question you have.
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Left Info */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl border border-transparent dark:border-slate-800"
          >
            <h2 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-slate-100">
              Get in touch
            </h2>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="text-blue-600" />
                <span className="text-gray-700 dark:text-slate-300">Email:  info@avere.example.com</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-blue-600" />
                <span className="text-gray-700 dark:text-slate-300">Tel: +66 21245263</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="text-blue-600" />
                <span className="text-gray-700 dark:text-slate-300">
2823/3 Charoen Krung Road, Bang Kho Laem,
Bang Kho Laem, Bangkok 10120
</span>
              </div>
            </div>

            <p className="mt-10 text-sm text-gray-500 dark:text-slate-400">
              We reply within 24 hours.
            </p>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl border border-transparent dark:border-slate-800"
          >
            <form className="space-y-6" onSubmit={postdata} noValidate>
              {hasErrors && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/35 px-4 py-3"
                >
                  <AlertTriangle
                    size={16}
                    className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
                  />
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Please complete the required fields
                  </p>
                </div>
              )}

              {/* Name */}
              <div>
                <motion.input
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearField("name");
                  }}
                  placeholder="Your Name"
                  aria-invalid={Boolean(errors.name)}
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-200
                    ${errBorder("name")}
                    focus:ring-2 focus:outline-none`}
                />
                <FieldMsg message={errors.name} />
              </div>

              {/* Email */}
              <div>
                <motion.input
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearField("email");
                  }}
                  placeholder="Email Address"
                  aria-invalid={Boolean(errors.email)}
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-200
                    ${errBorder("email")}
                    focus:ring-2 focus:outline-none`}
                />
                <FieldMsg message={errors.email} />
              </div>

              {/* Phone */}
              <div>
                <motion.input
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  value={phno}
                  onChange={(e) => {
                    setPhno(e.target.value);
                    clearField("phno");
                  }}
                  placeholder="Phone number"
                  aria-invalid={Boolean(errors.phno)}
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-200
                    ${errBorder("phno")}
                    focus:ring-2 focus:outline-none`}
                />
                <FieldMsg message={errors.phno} />
              </div>

              {/* Message */}
              <div>
                <motion.textarea
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  whileFocus={{ scale: 1.02 }}
                  rows="5"
                  value={msg}
                  onChange={(e) => {
                    setMsg(e.target.value);
                    clearField("msg");
                  }}
                  placeholder="Your Message"
                  aria-invalid={Boolean(errors.msg)}
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-200
                    ${errBorder("msg")}
                    focus:ring-2 focus:outline-none resize-none`}
                />
                <FieldMsg message={errors.msg} />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={!loading ? { scale: 1.03 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                className={`w-full flex items-center justify-center gap-3
                  font-semibold py-3 rounded-xl transition
                  ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </motion.button>

            </form>
          </motion.div>

        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        style={{ top: "5.5rem", zIndex: 100000 }}
      />
    </section>
  );
}

export default ContactUs;
