import { useEffect, useState } from "react";

import AdminContext from "./AdminContext";
import { adminSupabase } from "../services/supabaseClient";

function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const verifyAdmin = async (supabaseUser) => {
    if (!supabaseUser) {
      setAdmin(null);
      localStorage.removeItem("currentAdmin");
      return null;
    }

    const { data: profile, error } = await adminSupabase
      .from("profiles")
      .select("id, full_name, email, is_admin")
      .eq("id", supabaseUser.id)
      .maybeSingle();

    if (error || !profile || profile.is_admin !== true) {
      setAdmin(null);
      localStorage.removeItem("currentAdmin");
      return null;
    }

    const verifiedAdmin = {
      id: supabaseUser.id,
      name: profile.full_name || "Administrator",
      email: supabaseUser.email || profile.email || "",
      isAdmin: true,
    };

    setAdmin(verifiedAdmin);
    localStorage.setItem("currentAdmin", JSON.stringify(verifiedAdmin));

    return verifiedAdmin;
  };

  useEffect(() => {
    const restoreAdminSession = async () => {
      const {
        data: { session },
      } = await adminSupabase.auth.getSession();

      await verifyAdmin(session?.user || null);

      setLoading(false);
    };

    restoreAdminSession();

    const {
      data: { subscription },
    } = adminSupabase.auth.onAuthStateChange(async (_event, session) => {
      await verifyAdmin(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const adminLogin = async (email, password) => {
    // Step 1: Ask Supabase to authenticate the email and password
    const { data, error } = await adminSupabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: "Invalid administrator email or password.",
      };
    }

    const supabaseUser = data.user;

    if (!supabaseUser) {
      return {
        success: false,
        message: "Unable to retrieve administrator account.",
      };
    }

    // Step 2: Check this user's profile
    const { data: profile, error: profileError } = await adminSupabase
      .from("profiles")
      .select("id, full_name, email, is_admin")
      .eq("id", supabaseUser.id)
      .maybeSingle();

    if (profileError) {
      await adminSupabase.auth.signOut();

      return {
        success: false,
        message: profileError.message,
      };
    }

    // Step 3: Reject normal customers
    if (!profile || profile.is_admin !== true) {
      await adminSupabase.auth.signOut();

      setAdmin(null);
      localStorage.removeItem("currentAdmin");

      return {
        success: false,
        message: "This account does not have administrator access.",
      };
    }

    // Step 4: Store only safe administrator information
    await verifyAdmin(supabaseUser);

    return {
      success: true,
      message: "Administrator login successful.",
    };
  };

  const adminLogout = async () => {
    const { error } = await adminSupabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    setAdmin(null);
    localStorage.removeItem("currentAdmin");

    return {
      success: true,
      message: "Administrator logged out successfully.",
    };
  };

  const value = {
    admin,
    adminLogin,
    adminLogout,
    isAdminLoggedIn: !!admin,
  };

  if (loading) {
    return null;
  }

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export default AdminProvider;
