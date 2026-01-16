import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { FaLink, FaChartPie, FaLock, FaBolt } from "react-icons/fa";
import { useStoreContext } from "../contextApi/ContextApi";

// --- Animation Variants ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeUpBlur: Variants = {
  hidden: { y: 40, opacity: 0, filter: "blur(10px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] }, // Cinematic ease
  },
};

const imageReveal: Variants = {
  hidden: { scale: 0.95, opacity: 0, y: 20 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: "easeOut", delay: 0.2 },
  },
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useStoreContext();

  const dashBoardNavigateHandler = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white text-slate-900 overflow-hidden font-sans relative pt-8">

      {/* --- Background Ambience --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Soft, barely visible ambient glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-100/50 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="container mx-auto px-6 lg:px-14 pb-20 relative z-10">

        {/* --- HERO SECTION --- */}
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pt-12 lg:pt-20 mb-28"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left">

            <motion.div variants={fadeUpBlur}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold tracking-widest uppercase mb-6">
                <span className="w-2 h-2 bg-slate-900 rounded-full" />
                The New Standard
              </span>
            </motion.div>

            {/* Title - PURE BLACK, SERIF, TIGHT TRACKING */}
            <motion.h1
              variants={fadeUpBlur}
              className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight"
            >
              Master the Art of <br className="hidden lg:block"/>
              Digital Connections.
            </motion.h1>

            <motion.p
              variants={fadeUpBlur}
              className="font-sans text-lg md:text-xl text-slate-500 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light"
            >
              <strong className="text-slate-900 font-semibold">Shortly</strong> replaces clunky URLs with elegant, trackable links.
              Gain clarity on your audience and optimize every click.
            </motion.p>

            <motion.div
              variants={fadeUpBlur}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={dashBoardNavigateHandler}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full font-medium shadow-xl shadow-slate-900/10 hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started Free
              </button>
              <button
                onClick={dashBoardNavigateHandler}
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-medium hover:border-slate-400 hover:text-slate-900 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Create Short Link
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>
          </div>

          {/* Right: Hero Image */}
          <motion.div
            variants={imageReveal}
            className="w-full lg:w-[45%] flex justify-center lg:justify-end"
          >
            <div className="relative rounded-2xl bg-white p-2 shadow-2xl shadow-slate-200/50 border border-slate-100 max-w-md w-full">
              <img
                className="w-full h-auto rounded-xl object-cover border border-slate-100"
                src="/img2.png"
                alt="Shortly Dashboard"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* --- DIVIDER --- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-8 border-y border-slate-100 mb-20 text-center"
        >
            <p className="text-slate-400 font-medium tracking-[0.2em] uppercase text-xs">
              Simplifying the web for creators & teams
            </p>
        </motion.div>

        {/* --- FEATURES GRID --- */}
        <div className="pb-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            {/* Feature Heading - PURE BLACK */}
            <motion.h2 variants={fadeUpBlur} className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
               Essential tools for growth
            </motion.h2>
            <motion.p variants={fadeUpBlur} className="text-slate-500 text-lg font-light">
              We focus on speed, reliability, and clear insights so you can focus on creating.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <LandingFeatureCard
              title="Instant Shortening"
              desc="Transform long URLs into clean links instantly."
              icon={<FaLink />}
            />
            <LandingFeatureCard
              title="Smart Analytics"
              desc="Track clicks and engagement in real-time."
              icon={<FaChartPie />}
            />
            <LandingFeatureCard
              title="Secure Encryption"
              desc="Bank-grade security keeps your data safe."
              icon={<FaLock />}
            />
            <LandingFeatureCard
              title="Global Edge"
              desc="Lightning fast redirects from anywhere."
              icon={<FaBolt />}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- Internal Feature Card ---
const LandingFeatureCard: React.FC<{ title: string, desc: string, icon: React.ReactNode }> = ({ title, desc, icon }) => {
  return (
    <motion.div
      variants={fadeUpBlur}
      whileHover={{ y: -5 }}
      className="bg-slate-50 border border-slate-200 p-8 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300"
    >
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-700 text-xl mb-6 shadow-sm border border-slate-100">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export default LandingPage;