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

    loadUser();

  }, []);

  async function loadUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (user) {

      const profile = await getUserProfile();

setRole(profile?.role || "staff");
setStatus(profile?.status || "active");

    }

    setLoading(false);

  }

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