import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../helper/axios";
import SEO from "../components/SEO";

function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phno, setPhno] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
      toast.error("Please fix the errors ❌", {
        position: "top-right",
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
        toast.success("Message sent successfully ✅", {
          position: "top-right",
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
      toast.error("Something went wrong ❌", {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SEO
        title="Conactus Page - Bislator"
        description="contact page"
      />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
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
            className="bg-white rounded-3xl p-10 shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-8 text-gray-800">
              Get in touch
            </h2>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="text-blue-600" />
                <span className="text-gray-700">contact@example.com</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-blue-600" />
                <span className="text-gray-700">+95 9 123 456 789</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="text-blue-600" />
                <span className="text-gray-700">Bangkok, Thailand</span>
              </div>
            </div>

            <p className="mt-10 text-sm text-gray-500">
              We reply within 24 hours.
            </p>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-3xl p-10 shadow-xl"
          >
            <form className="space-y-6" onSubmit={postdata}>

              {/* Name */}
              <div>
                <motion.input
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className={`w-full px-4 py-3 rounded-xl border
                    ${errors.name ? "border-red-500" : "border-gray-300"}
                    focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className={`w-full px-4 py-3 rounded-xl border
                    ${errors.email ? "border-red-500" : "border-gray-300"}
                    focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
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
                  onChange={(e) => setPhno(e.target.value)}
                  placeholder="Phone number"
                  className={`w-full px-4 py-3 rounded-xl border
                    ${errors.phno ? "border-red-500" : "border-gray-300"}
                    focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                />
                {errors.phno && (
                  <p className="text-red-500 text-sm mt-1">{errors.phno}</p>
                )}
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
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Your Message"
                  className={`w-full px-4 py-3 rounded-xl border
                    ${errors.msg ? "border-red-500" : "border-gray-300"}
                    focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none`}
                />
                {errors.msg && (
                  <p className="text-red-500 text-sm mt-1">{errors.msg}</p>
                )}
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

      <ToastContainer />
    </section>
  );
}

export default ContactUs;
