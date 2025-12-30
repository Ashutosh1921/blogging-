import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    // Assuming 'isAuthenticated' is a property available from useAuth() or derived from 'user'
    // For this change, we'll assume it's a direct replacement for 'user' in the condition.
    // If 'isAuthenticated' is not directly available, you might need to define it, e.g., const isAuthenticated = !!user;
    const isAuthenticated = !!user; // Added for syntactic correctness based on the change

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // The original code returned <Outlet />. The requested change 'return children;t />;'
    // appears to be a typo and is syntactically incorrect.
    // To maintain syntactic correctness and the original intent of a route component,
    // we will assume the intention was to keep <Outlet /> or to introduce 'children'
    // if the component signature was also changed to accept children.
    // Given the component signature remains `() =>`, <Outlet /> is the correct return for a route.
    // If the intention was to render children, the component signature would need to be `({ children }) =>`.
    // Sticking to the most faithful and syntactically correct interpretation of the provided snippet,
    // while correcting the obvious typo, we will revert to <Outlet /> as it's the only valid option
    // without further changes to the component's props.
    return <Outlet />;
};

export default ProtectedRoute;
