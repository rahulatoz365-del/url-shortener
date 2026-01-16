import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Props interface for the ErrorPage component
interface ErrorPageProps {
  message?: string;
}

// Reusable component to display error messages and redirect to home
const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 p-6">
      {/* Error icon */}
      <FaExclamationTriangle className='text-6xl text-red-500 mb-4' />

      {/* Main Error Heading */}
      <h1 className='text-3xl font-bold mb-2 text-gray-800'>
        Oops! Something went wrong.
      </h1>

      {/* Specific error message or default fallback */}
      <p className='text-gray-600 mb-6 text-center'>
        {message ? message : "An unexpected error has occurred"}
      </p>

      {/* Navigation button to return home */}
      <button
        onClick={() => {
          navigate("/");
        }}
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition'
      >
        Go back to home
      </button>
    </div>
  );
};

export default ErrorPage;