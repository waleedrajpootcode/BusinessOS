import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const {
    user,
    loading,
    status,
  } = useAuth();
  useEffect(() => {

    async function checkStatus() {

      if (
        user &&
        status === "inactive"
      ) {

        await supabase.auth.signOut();

        alert(
          "Your account has been disabled. Contact administrator."
        );

        window.location.href = "/login";

      }

    }

    checkStatus();

  }, [user, status]);
  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;

}

export default ProtectedRoute;