import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer.jsx"
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />

      {/* NAVBAR */}
      <div className="relative z-9999">
        <Navbar />
      </div>

      {/* PAGE CONTENT */}
      <main className="relative z-0">
        <Outlet />
      </main>
      <Footer></Footer>
    </>
  );
}

export default App;
