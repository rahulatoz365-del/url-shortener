import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context value
interface StoreContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

// Define props for the provider component
interface ContextProviderProps {
  children: ReactNode;
}

// Create context with undefined default to enforce provider usage
const ContextApi = createContext<StoreContextType | undefined>(undefined);

// Provider component that wraps the app and supplies auth state
export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  // Retrieve stored token from localStorage on initial load
  const storedToken = localStorage.getItem("JWT_TOKEN");

  // Parse token if exists, otherwise set to null
  const getToken: string | null = storedToken ? JSON.parse(storedToken) : null;

  // State to hold the current authentication token
  const [token, setToken] = useState<string | null>(getToken);

  // Value object to be shared across all consuming components
  const contextValue: StoreContextType = {
    token,
    setToken,
  };

  return (
    <ContextApi.Provider value={contextValue}>
      {children}
    </ContextApi.Provider>
  );
};

// Custom hook to access the context safely
export const useStoreContext = (): StoreContextType => {
  const context = useContext(ContextApi);

  // Throw error if hook is used outside of ContextProvider
  if (!context) {
    throw new Error("useStoreContext must be used within a ContextProvider");
  }

  return context;
};