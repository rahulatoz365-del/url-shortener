import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStoreContext } from '../contextApi/ContextApi';
import toast from 'react-hot-toast';

const OAuth2RedirectHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useStoreContext();
  
  // Track if we've already processed the redirect
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (hasProcessed.current) return;
    
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      hasProcessed.current = true; // Mark as processed
      setToken(token);
      toast.success("Login Successful!");
      navigate("/dashboard", { replace: true });
    } else if (error) {
      hasProcessed.current = true; // Mark as processed
      toast.error("Login Failed: " + decodeURIComponent(error));
      navigate("/login", { replace: true });
    } else {
      // No token or error - just redirect to login
      hasProcessed.current = true;
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, setToken]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default OAuth2RedirectHandler;