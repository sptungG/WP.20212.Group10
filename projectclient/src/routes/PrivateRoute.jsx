import LoadingToRedirect from "src/components/loader/LoadingToRedirect";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "src/common/useAuth";

export default function PrivateRoute() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) return <LoadingToRedirect />;

  return <Outlet />;
}
