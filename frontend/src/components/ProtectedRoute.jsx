import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function checkUser() {
            const { data } = await supabase.auth.getSession();

            setUser(data.session?.user ?? null);
            setLoading(false);
        }

        checkUser();
    }, []);
    if (loading) {
  return <h2>Loading...</h2>;
}
if (!user) {
  return <Navigate to="/login" replace />;
}
return children;

}

export default ProtectedRoute;