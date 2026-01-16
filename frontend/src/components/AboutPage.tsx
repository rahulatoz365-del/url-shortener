import React from "react";
import { FaLink, FaShareAlt, FaShieldAlt, FaBolt } from "react-icons/fa";
import { motion, Variants } from "framer-motion";

// --- Animation Variants ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const lineExpand: Variants = {
  hidden: { width: 0 },
  visible: {
    width: "6rem",
    transition: { duration: 0.8, ease: "easeOut", delay: 0.5 },
  },
};

// --- Floating Shape Component ---
const FloatingShape: React.FC<{
  className: string;
  delay?: number;
  duration?: number;
}> = ({ className, delay = 0, duration = 6 }) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
      delay,
    }}
  />
);

// --- Main Component ---

const AboutPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-white text-slate-900 overflow-hidden font-sans pt-20">

      {/* --- Animated Background Elements --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Floating Decorative Shapes */}
        <FloatingShape
          className="absolute top-20 left-[10%] w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40"
          delay={0}
          duration={8}
        />
        <FloatingShape
          className="absolute top-40 right-[5%] w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-30"
          delay={2}
          duration={10}
        />
        <FloatingShape
          className="absolute bottom-20 left-[20%] w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-30"
          delay={1}
          duration={9}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24">

        {/* --- Hero Section --- */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center mb-24 lg:mb-32"
        >
          {/* Badge */}
          <motion.div variants={scaleIn} className="inline-block mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold tracking-widest uppercase">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              About Shortly
            </span>
          </motion.div>

          {/* Main Heading with Word Animation */}
          <motion.h1
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-8"
          >
            <motion.span
              variants={itemVariants}
              className="inline-block mr-4"
            >
              We make
            </motion.span>
            <motion.span
              variants={itemVariants}
              className="inline-block mr-4"
            >
              sharing
            </motion.span>
            <br className="hidden sm:block" />
            <motion.span
              variants={itemVariants}
              className="inline-block mr-4"
            >
              effortless
            </motion.span>
            <motion.span
              variants={itemVariants}
              className="inline-block"
            >
              & powerful.
            </motion.span>
          </motion.h1>

          {/* Animated Underline */}
          <motion.div
            variants={lineExpand}
            className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-8"
          />

          {/* Subheading */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto font-light"
          >
            Shortly is a simple yet powerful URL shortener.
            Create short links, track clicks, and understand your audience—all in one place.
          </motion.p>
        </motion.div>

        {/* --- Feature Grid with Stagger Animation --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          <FeatureCard
            icon={<FaLink />}
            title="Simple Shortening"
            desc="Turn long URLs into short, clean links with a single click. Easy to share, easy to remember."
            index={0}
          />
          <FeatureCard
            icon={<FaShareAlt />}
            title="Click Analytics"
            desc="See how many times your links are clicked. Track performance over time with simple charts."
            index={1}
          />
          <FeatureCard
            icon={<FaShieldAlt />}
            title="Secure & Private"
            desc="Your data stays yours. We use secure connections and don't share your information."
            index={2}
          />
          <FeatureCard
            icon={<FaBolt />}
            title="Fast Redirects"
            desc="Our links redirect quickly so your users get where they need to go without delay."
            index={3}
          />
        </motion.div>

        {/* --- Simple CTA Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 lg:mt-32 text-center"
        >
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-12" />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-slate-600 text-lg font-medium mb-6"
          >
            Ready to get started?
          </motion.p>

          <motion.a
            href="/register"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all"
          >
            Create Your First Link
          </motion.a>
        </motion.div>

      </div>
    </div>
  );
};

// --- Feature Card Component ---

interface FeatureCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, desc, icon, index }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        y: -8,
        transition: { type: "spring", stiffness: 300 },
      }}
      className="group relative bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-10 hover:bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-default overflow-hidden"
    >
      {/* Animated Background Gradient on Hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={false}
      />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          className="w-14 h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 text-xl mb-6 shadow-sm group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white group-hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {icon}
        </motion.div>

        {/* Title */}
        <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-slate-800 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 leading-7 text-base font-light group-hover:text-slate-600 transition-colors">
          {desc}
        </p>
      </div>

      {/* Animated Corner Accent */}
      <motion.div
        className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-100 rounded-full opacity-0 group-hover:opacity-50 transition-all duration-500"
        whileHover={{ scale: 1.5 }}
      />

      {/* Hover Arrow */}
      <motion.div
        className="absolute top-8 right-8 text-slate-300 group-hover:text-blue-500 transition-colors"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 + index * 0.1 }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
};

export default AboutPage;