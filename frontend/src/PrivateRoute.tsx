import React from 'react';
import { Navigate } from "react-router-dom";
import { useStoreContext } from "./contextApi/ContextApi";

interface PrivateRouteProps {
    children: React.ReactNode;
    publicPage: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, publicPage }) => {
    const { token } = useStoreContext();

    if (publicPage) {
        // If accessing a public page (like Login) but already logged in, redirect to Dashboard
        return token ? <Navigate to="/dashboard" /> : <>{children}</>;
    }

    // If accessing a private page but not logged in, redirect to Login
    return !token ? <Navigate to="/login" /> : <>{children}</>;
};

export default PrivateRoute;