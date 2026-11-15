import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/database.types';
import { ROUTES } from '@/constants/routes';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    // Redirect unauthenticated visitors to role selection
    return <Navigate to={ROUTES.AUTH} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    // Normalize MISSION_COMMANDER and MISSION_CONTROLLER
    const userRoleNormalized =
      currentUser.role === 'MISSION_CONTROLLER' ? 'MISSION_COMMANDER' : currentUser.role;

    const isAuthorized = allowedRoles.some((role) => {
      const targetRoleNormalized = role === 'MISSION_CONTROLLER' ? 'MISSION_COMMANDER' : role;
      return targetRoleNormalized === userRoleNormalized;
    });

    if (!isAuthorized) {
      return (
        <Navigate
          to={ROUTES.ACCESS_DENIED}
          state={{
            attemptedPath: location.pathname,
            userRole: currentUser.role,
            allowedRoles,
          }}
          replace
        />
      );
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export const DashboardRedirect: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  if (currentUser.role === 'ASTRONAUT') {
    return <Navigate to={ROUTES.ASTRONAUT_DASHBOARD} replace />;
  }

  if (currentUser.role === 'MEDICAL_OFFICER') {
    return <Navigate to={ROUTES.MEDICAL_DASHBOARD} replace />;
  }

  return <Navigate to={ROUTES.COMMANDER_DASHBOARD} replace />;
};
