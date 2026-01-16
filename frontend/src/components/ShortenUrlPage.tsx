import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Define the expected route parameter for the shortened code
type RouteParams = {
  url: string;
};

// Component responsible for capturing the short code and redirecting via the backend
const ShortenUrlPage: React.FC = () => {
  // Extract the specific short code from the URL path
  const { url } = useParams<RouteParams>();

  useEffect(() => {
    if (url) {
      // Construct the backend redirection endpoint and navigate the browser window
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/${url}`;
    }
  }, [url]);

  return <p>Redirecting...</p>;
};

export default ShortenUrlPage;