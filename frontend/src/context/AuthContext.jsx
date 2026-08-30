import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";
import { getUserProfile } from "../services/profile";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser(currentUser = null) {
      try {
        let authenticatedUser = currentUser;

        if (!authenticatedUser) {
          const {
            data: { user: fetchedUser },
            error,
          } = await supabase.auth.getUser();

          if (error) {
            throw error;
          }

          authenticatedUser = fetchedUser;
        }

        if (!mounted) return;

        setUser(authenticatedUser);

        if (!authenticatedUser) {
          setRole(null);
          setStatus(null);
          return;
        }

        const profile = await getUserProfile();

        if (!mounted) return;

        setRole(profile?.role || "staff");
        setStatus(profile?.status || "active");
      } catch (error) {
        console.error("Auth initialization error:", error);

        if (!mounted) return;

        setUser(null);
        setRole(null);
        setStatus(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await loadUser(session?.user || null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        status,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}