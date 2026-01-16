import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosMenu, IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useStoreContext } from "../contextApi/ContextApi";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { token, setToken } = useStoreContext();
  const path = useLocation().pathname;
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);

  // Ref for click-outside handling
  const menuRef = useRef<HTMLDivElement>(null);

  // Detect scroll to adjust shadow/border intensity
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setNavbarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onLogOutHandler = (): void => {
    setToken(null);
    localStorage.removeItem("JWT_TOKEN");
    navigate("/login");
    setNavbarOpen(false);
  };

  // Helper for Link Classes - Dark text with a subtle hover color
  const getLinkClass = (route: string) => {
    const isActive = path === route;
    return `text-sm font-medium transition-colors duration-300 ${
      isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
    }`;
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-14 flex justify-between items-center relative">

        {/* Brand Logo */}
        <Link to="/" className="z-50" onClick={() => setNavbarOpen(false)}>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-baseline gap-1">
            Shortly<span className="block w-2 h-2 rounded-full bg-blue-600 mb-1"></span>
          </h1>
        </Link>

        {/* Desktop Navigation - Centered & Clean */}
        <nav className="hidden md:flex items-center gap-10">
          <Link className={getLinkClass("/")} to="/">Home</Link>
          <Link className={getLinkClass("/about")} to="/about">About</Link>
          {token && (
            <Link className={getLinkClass("/dashboard")} to="/dashboard">Dashboard</Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
              >
                Log In
              </Link>
              <Link to="/register">
                <button className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <button
              onClick={onLogOutHandler}
              className="text-slate-500 hover:text-red-600 text-sm font-medium px-4 py-2 transition-colors"
            >
              Log Out
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle (Hamburger) */}
        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="md:hidden text-slate-800 p-2 focus:outline-none z-50 rounded-md hover:bg-slate-100 transition-colors"
        >
          {navbarOpen ? <IoMdClose size={28} /> : <IoIosMenu size={28} />}
        </button>

        {/* Mobile Menu Dropdown - Clean & Compact */}
        <AnimatePresence>
          {navbarOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-16 right-6 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden md:hidden"
            >
              <ul className="flex flex-col py-2">
                <MobileLink to="/" label="Home" active={path === "/"} close={() => setNavbarOpen(false)} />
                <MobileLink to="/about" label="About" active={path === "/about"} close={() => setNavbarOpen(false)} />
                {token && (
                  <MobileLink to="/dashboard" label="Dashboard" active={path === "/dashboard"} close={() => setNavbarOpen(false)} />
                )}

                <div className="my-2 border-t border-slate-100 mx-4"></div>

                {!token ? (
                  <div className="flex flex-col gap-2 px-4 pb-4 pt-2">
                     <Link
                        to="/login"
                        onClick={() => setNavbarOpen(false)}
                        className="w-full text-center font-medium text-slate-600 hover:text-slate-900 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Log In
                      </Link>
                      <Link to="/register" onClick={() => setNavbarOpen(false)}>
                        <button className="w-full bg-slate-900 text-white font-medium py-2.5 rounded-xl shadow-md hover:bg-slate-800 transition-colors">
                          Sign Up
                        </button>
                      </Link>
                  </div>
                ) : (
                  <div className="px-4 pb-4 pt-2">
                    <button
                      onClick={onLogOutHandler}
                      className="w-full bg-red-50 text-red-600 font-medium py-2.5 rounded-xl hover:bg-red-100 transition-colors text-sm"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Reusable Mobile Link Component
const MobileLink = ({ to, label, active, close }: { to: string, label: string, active: boolean, close: () => void }) => (
  <li>
    <Link
      to={to}
      onClick={close}
      className={`block px-6 py-3 text-base font-medium transition-all ${
        active
          ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600 pl-5"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
      }`}
    >
      {label}
    </Link>
  </li>
);

export default Navbar;