import axios from "../helper/axios";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import SEO from "../components/SEO";

function Home({title,description,link}) {
  const images = [
    "/bislator.png",
    "/landscape-nature-sky-1118861.jpg",
    "/sea-landscape-sky-753626.jpg",
  ];

  const [current, setCurrent] = useState(0);
  let [data, setData] = useState([])

  // Auto slider (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);


useEffect(()=>{
  let resdata = async() =>{
    let res = await axios.get('/api/publicknowledge')
    setData(res.data.data)
  }
  resdata()
},[])

  return (
<>
   <div className="relative w-full h-[70vh] md:h-[90vh] lg:h-[97vh] overflow-hidden">
   <SEO 
  title="Bislator | IT & Network Solutions Thailand"
  description="Bislator provides professional IT systems integration, network infrastructure, and security solutions across Thailand."
  href="https://bislator.it.com/"
/>
      
      {/* 🖼 Background Image Slider */}
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-center"
          alt="hero"
        />
      </AnimatePresence>

      {/* 🌑 Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-black/60"></div>

      {/* ✨ Soft Glow Overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-blue-500/10 via-transparent to-purple-500/10"></div>

      {/* 🎯 Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-white text-3xl md:text-5xl lg:text-6xl font-bold tracking-wider"
        >
          BISLATOR
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-4 text-white/80 text-sm md:text-lg max-w-2xl"
        >
          Where Business Needs Become Solutions
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-8 flex gap-4"
        >
         <Link to="/service">
          <button className="px-6 py-3 rounded-full bg-white text-black font-semibold shadow-lg hover:scale-105 transition">
            Explore Services
          </button>
          </Link>

          <Link to="/Contactus">
          <button className="px-6 py-3 rounded-full border border-white text-white hover:bg-white hover:text-black transition">
            Contact Us
          </button></Link>
        </motion.div>
      </div>

      {/* 👉 Right Vertical Navigator (Desktop) */}
      <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 
        flex-col items-center space-y-5 z-50">

        <span className="text-white/70 rotate-90 text-sm tracking-[0.3em] font-medium">
          DISCOVER OUR SERVICE
        </span>

        <div className="w-0.5 h-20 bg-linear-to-b from-white/10 to-white/60 rounded-full"></div>

        <div className="flex flex-col space-y-4 mt-2">
          {images.map((_, i) => (
            <span
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-3 h-3 rounded-full cursor-pointer transition-all duration-300
                ${
                  current === i
                    ? "bg-white scale-125 shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                    : "bg-white/40"
                }
              `}
            >
              {current === i && (
                <span className="absolute inset-0 rounded-full animate-ping bg-white/40"></span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* 👉 Bottom Dots (Mobile) */}
      <div className="md:hidden absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-50">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === i
                ? "bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                : "bg-white/40"
            }`}
          ></button>
        ))}
      </div>

    </div>
    
     <section className="px-8 py-16 bg-gray-50">
        
  <h2 className="text-2xl font-semibold text-center mb-12">
    Solutions and Services
  </h2>

  <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">

    {/* SYSTEM */}
    <Link to="/system">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-white shadow rounded-lg text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition"
      >
        <h3 className="text-xl font-semibold">SYSTEM</h3>
        <p className="text-gray-500 mt-2">
          Construction is carried out by experts in accordance with the specified time.
        </p>
      </motion.div>
    </Link>

    {/* SECURITY */}
    <Link to="/security">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-white shadow rounded-lg text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition"
      >
        <h3 className="text-xl font-semibold">SECURITY</h3>
        <p className="text-gray-500 mt-2">
          Prepared to the contents of each room and the furniture.
        </p>
      </motion.div>
    </Link>

    {/* NETWORK */}
    <Link to="/network">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 bg-white shadow rounded-lg text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition"
      >
        <h3 className="text-xl font-semibold">NETWORK</h3>
        <p className="text-gray-500 mt-2">
          Buildings with futuristic and modern models for clients.
        </p>
      </motion.div>
    </Link>

    {/* SERVICE */}
    <Link to="/service">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 bg-white shadow rounded-lg text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition"
      >
        <h3 className="text-xl font-semibold">SERVICE</h3>
        <p className="text-gray-500 mt-2">
          General support and maintenance for your infrastructure.
        </p>
      </motion.div>
    </Link>

  </div>
</section>

<section className="max-w-7xl mx-auto px-6 py-12">
  <div className="lg:col-span-2">
    <h2 className="text-3xl font-bold mb-8">NEWS UPDATE</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.isArray(data) &&
        data.slice(0, 4).map((item, index) => (
          <motion.div
            key={item._id || item.id}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: index * 0.1,
            }}
            className="flex gap-4 border-b pb-6"
          >
            <img
              src={import.meta.env.VITE_BACKEND_ASSET_URL + item.photo}
              alt={item.title}
              className="w-28 h-20 object-cover rounded-lg"
            />

            <div className="flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                  {item.date}
                </span>
                <motion.div
            key={item._id || item.id}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: index * 0.1,
            }}
         
          >
                <Link to={`/Newsdetail/${item.id || item._id}`}>
                  <button className="text-sm font-medium text-gray-700 hover:underline">
                    Read more →
                  </button>
                </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
    </div>
  </div>
  
    <motion.div
         
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: 1.2,
            }} className="flex mt-8 justify-center md:justify-end ">
    
           <Link to="/knowledge">
            <button className="flex items-center gap-3 text-gray-900 font-semibold">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white">
                →
              </span>
              SEE MORE
            </button>
           </Link>
         </motion.div>
        
</section>




{/* OUR STORY SECTION */}
<section className="relative bg-white py-20 overflow-hidden">

  {/* Soft background curve */}
  <div className="absolute inset-0">
    <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full">
      <path
        fill="#f8fafc"
        d="M0,256L80,245.3C160,235,320,213,480,202.7C640,192,800,192,960,202.7C1120,213,1280,235,1360,245.3L1440,256L1440,0L0,0Z"
      />
    </svg>
  </div>

  <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

    {/* LEFT IMAGES */}
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 3 }}
      className="flex flex-col gap-8"
    >
      <div className="rounded-[40px] overflow-hidden shadow-lg">
        <img
          src="/bislator.png"
          alt="Office"
          className="w-full h-64 object-cover"
        />
      </div>

      <div className="rounded-[40px] overflow-hidden shadow-lg">
        <img
          src="/landscape-nature-sky-1118861.jpg"
          alt="Team"
          className="w-full h-64 object-cover grayscale"
        />
      </div>
    </motion.div>

    {/* RIGHT CONTENT */}
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 3 }}
      className="space-y-6"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        OUR STORY
      </h2>

      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
        We provide value-added IT hardware and software solutions. Our goal
        is to be a trusted systems integrator and a dependable partner.
        Through strong development in products, sales, and services,
        we continue to grow alongside our customers in Thailand.
      </p>

      <Link
        to="/about"
        className="inline-flex items-center gap-3 group"
      >
        <span className="w-12 h-12 rounded-full bg-gray-900 text-white
                         flex items-center justify-center
                         group-hover:bg-blue-600 transition">
          →
        </span>
        <span className="text-sm font-medium tracking-wide">
          READ MORE
        </span>
      </Link>
    </motion.div>

  </div>
</section>

</>
  );
}

export default Home;
