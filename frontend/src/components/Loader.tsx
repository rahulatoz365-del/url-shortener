import React from 'react';
import { ImSpinner8 } from 'react-icons/im';

// A modern, centered loading spinner component
const Loader: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-[450px] gap-4">
      {/*
        Spinner Icon
        - text-blue-600: Matches your primary brand color
        - animate-spin: Tailwind utility for smooth rotation
      */}
      <ImSpinner8 className="text-4xl text-slate-800 animate-spin" />

      {/* Loading Text with Pulse Effect */}
      <p className="text-slate-500 text-sm font-medium tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default Loader;