import React, { createContext, useContext, useState, useEffect,type  ReactNode } from "react";

interface StoreContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ContextProviderProps {
  children: ReactNode;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  // Initialize token safely
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return null;
    
    // Try to parse it in case it was stored as a JSON string (e.g. "token")
    try {
      const parsed = JSON.parse(storedToken);
      if (typeof parsed === "string") return parsed;
      return storedToken; // If it's not a string after parsing, use raw
    } catch (e) {
      // If JSON.parse fails (SyntaxError), it means it's a raw string (JWT). Return it directly.
      return storedToken;
    }
  });

  // Sync with localStorage whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <StoreContext.Provider value={{ token, setToken }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStoreContext must be used within a ContextProvider");
  }
  return context;
};