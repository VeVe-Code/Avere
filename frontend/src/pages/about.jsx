import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import DarkVeil from "../components/DarkVeil";
import { BackgroundBeams } from "../components/background-beams";
import SEO from "../components/SEO";

export default function About() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@splinetool/viewer@1.12.48/build/spline-viewer.js";
    document.body.appendChild(script);
  }, []);

  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0]);

  const list = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: 30 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
       <SEO
        title="About Page - Bislator"
        description="about page"
      />
       <BackgroundBeams />
      {/* ================= HERO ================= */}
      <section className="relative h-[520px] flex items-center justify-center overflow-hidden">
        {mounted && (
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
            <DarkVeil
              color={[0.14, 0.67, 1]}
              amplitude={0.8}
              distance={0.35}
              enableMouseInteraction
            />
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 text-6xl font-extrabold"
        >
          About Us
        </motion.h1>
      </section>

      {/* ================= FOLLOW SECTION ================= */}
    <section
  ref={sectionRef}
  className="
    relative
    px-6 sm:px-10 lg:px-16
    pt-20 lg:pt-24
    pb-32 lg:pb-40
    overflow-hidden
  "
>
  {/* title */}
  <motion.div
    style={{ y, opacity }}
    className="flex justify-center mb-16 lg:mb-24"
    initial={{ opacity: 0, y: -30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="px-8 lg:px-10 py-4 rounded-2xl bg-white/80 backdrop-blur-md border shadow"
    >
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center">
        Bislator
      </h1>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-2 h-1 w-12 sm:w-16 mx-auto bg-blue-500 rounded-full origin-left"
      />
    </motion.div>
  </motion.div>

  {/* content */}
  <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-center">
    {/* text */}
    <motion.p
      className="
        w-full lg:w-1/2
        text-base sm:text-lg
        text-slate-700
        leading-relaxed
      "
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      Bislator founded in 1995, is a system integration company providing
      IT solutions across hardware, software, network, and security.
      <br /><br />
      With decades of experience, we ensure our customers receive the
      best solutions — because “Your Success is Our Success.”
    </motion.p>

    {/* image */}
    <motion.img
      src="/logo.png"
      alt="Bislator"
      className="
        w-3/4 sm:w-2/3 lg:w-[45%]
        max-w-sm
        rounded-xl
        shadow-lg
      "
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      whileHover={{ scale: 1.2 }}
    />
  </div>

  {/* business target */}
  <section
    className="
      bg-slate-50
      mt-24
      py-20 lg:py-24
      px-6 sm:px-10 lg:px-16
    "
  >
    <motion.div
      className="max-w-5xl mx-auto text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">
        Business Target
      </h2>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 1 }}
        className="w-16 sm:w-20 h-1 bg-blue-500 mx-auto mb-6 sm:mb-8 rounded-full origin-center"
      />

      <p className="text-base sm:text-lg leading-relaxed text-slate-700">
        Bislator’s business target is to deliver reliable and innovative IT
        solutions that help organizations improve efficiency, security, and
        digital performance. We focus on providing high-quality system
        integration services across hardware, software, networking, and
        security to meet diverse business needs.
      </p>
    </motion.div>
  </section>
</section>



      {/* ================= SERVICES ================= */}
      <div className="flex min-h-screen px-10 py-20 gap-10">
          <BackgroundBeams />
        <div className="w-1/2">
          <div className="sticky top-32">
            <h2 className="text-5xl font-bold">Bislator</h2>
            <p className="mt-4 text-gray-500">
              We build modern digital solutions.
            </p>
          </div>
        </div>

        <div className="w-1/2">
          <motion.ul
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-6 text-xl"
          >
            {[
              "Software Development Services",
              "UI / UX & Design Services",
              "Cloud & Infrastructure Services",
              "Data & AI Services",
              "Digital Marketing & SEO",
              "Emerging Technology Services",
            ].map((s, i) => (
              <motion.li
                key={i}
                variants={item}
                className="border-b pb-4 hover:text-blue-600"
              >
                {s}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* ================= SPLINE ================= */}
<div className="flex flex-col md:px-20 lg:flex-row gap-6 lg:gap-10 items-center">
  {/* Image */}
  <div className="w-full lg:w-1/2">
    <img
      src="/unnamed (1).jpg"
      alt="Preview"
      className="
        w-full
        h-auto
        max-h-[260px] sm:max-h-[340px] md:max-h-[400px] lg:max-h-none
        rounded-xl
        object-cover
      "
    />
  </div>

  {/* Spline */}
  <motion.div
    className="
      w-full lg:w-1/2
      h-[220px] sm:h-[300px] md:h-[360px] lg:h-[420px]
      max-h-[450px]
      rounded-xl
      overflow-hidden
      shadow-xl
      bg-white
    "
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
  >
    <spline-viewer
      class="w-full h-full"
      url="https://prod.spline.design/LrtQKl3hoM0Q4BR5/scene.splinecode"
    />
  </motion.div>
</div>

      
    </div>
  );
}