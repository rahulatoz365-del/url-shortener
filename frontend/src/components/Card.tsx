import React from "react";
import { motion } from "framer-motion";

// Props interface for the Card component
interface CardProps {
  title: string;
  desc: string;
}

const Card: React.FC<CardProps> = ({ title, desc }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.1
      }}
      className="group relative bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300 overflow-hidden"
    >
      {/* Hover Accent: A subtle gradient line that appears at the top on hover */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />

      {/* Card title - Using Serif for elegance */}
      <h3 className="font-serif text-xl md:text-2xl text-slate-900 font-medium mb-4 group-hover:text-blue-700 transition-colors duration-300">
        {title}
      </h3>

      {/* Card description - Increased line height for readability */}
      <p className="font-sans text-slate-600 text-sm md:text-base leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
};

export default Card;