import LoadingToRedirect from "src/components/loader/LoadingToRedirect";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "src/common/useAuth";

export default function AdminRoute() {
  const { user, isSignedIn } = useAuth();

  if (isSignedIn && user?.role !== "admin") return <LoadingToRedirect />;

  return <Outlet />;
}
