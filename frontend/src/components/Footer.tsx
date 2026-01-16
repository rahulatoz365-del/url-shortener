import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 border-t border-slate-200">
      <div className="container mx-auto px-6 lg:px-14 py-8">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Branding */}
          <Link to="/">
            <h2 className="font-serif text-xl font-bold text-slate-800">
              Shortly<span className="text-blue-600">.</span>
            </h2>
          </Link>

          {/* Tagline */}
          <p className="text-slate-500 text-sm text-center sm:text-left">
            Simplifying URL shortening for efficient sharing.
          </p>

          {/* Copyright */}
          <p className="text-slate-400 text-sm">
            &copy; {currentYear} Shortly
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;