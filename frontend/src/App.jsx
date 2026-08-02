import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer.jsx";
import ScrollToTop from "./components/ScrollToTop";
import CrispChat from "./components/CrispChat";
import FaqChatBot from "./components/FaqChatBot";

function App() {
  return (
    <>
      <ScrollToTop />
      <CrispChat />
      <FaqChatBot />

      <Navbar />

      <main className="relative z-0 min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default App;
