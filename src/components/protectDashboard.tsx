import { useEffect, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  verifyProfileStart,
  verifyProfileSuccess,
  verifyProfileFailure,
} from "@/redux/slices/profileSlice";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedDashboard({ children }: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { hasProfile, isVerifying, profileType, error } = useAppSelector(
    (state) => state.profile
  );

  const id = user?._id;
  const role = user?.role;

  useEffect(() => {
    const verifyProfile = async () => {
      if (!id || !role) return;

      dispatch(verifyProfileStart());
      try {
        const endpoint =
          role === "doctor" ? `/api/doctor/${id}` : `/api/user/${id}`;
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Failed to verify profile");
        }

        const data = await response.json();

        // Check for profile data based on role
        const hasExistingProfile =
          role === "doctor" ? !!data.doctordetails : !!data.userdetails;

        dispatch(
          verifyProfileSuccess({
            hasProfile: hasExistingProfile,
            profileType: role as "user" | "doctor",
            profileData:
              role === "doctor" ? data.doctordetails : data.userdetails,
          })
        );
      } catch (error) {
        dispatch(
          verifyProfileFailure(
            error instanceof Error ? error.message : "Failed to verify profile"
          )
        );
      }
    };

    // Verify profile on mount and when role changes
    verifyProfile();
  }, [id, role, dispatch]);

  // Show loading state while verifying
  if (isVerifying) {
    return <div>Verifying profile...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Handle different states
  if (isVerifying) {
    return <div>Verifying profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Only redirect if we've confirmed there's no profile
  if (!isVerifying && !hasProfile) {
    return (
      <Navigate
        to={role === "doctor" ? "/profilefordoctor" : "/profile"}
        replace
      />
    );
  }

  // Render children if authenticated and profile exists
  if (hasProfile) {
    return <>{children}</>;
  }

  // Show loading while verifying
  return <div>Loading...</div>;
}
