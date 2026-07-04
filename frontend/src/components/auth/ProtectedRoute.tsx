import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../contexts/AuthContext";
import type { Role } from "../../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Role[];
}

/**
 * Wrap a route component with this to require authentication (and optionally
 * a specific set of roles). Redirects to /login on failure.
 */
export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    if (roles && roles.length > 0 && !hasRole(...roles)) {
      navigate({ to: "/dashboard" });
    }
  }, [isLoading, isAuthenticated, roles, hasRole, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--gold)] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (roles && roles.length > 0 && !hasRole(...roles)) return null;

  return <>{children}</>;
}
