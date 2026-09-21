import { useCallback, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { supabase } from "../services/supabaseClient";

function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const formatSupabaseUser = useCallback((supabaseUser) => {
    if (!supabaseUser) {
      return null;
    }

    return {
      id: supabaseUser.id,
      fullName:
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.user_metadata?.fullName ||
        "DavidTech User",
      email: supabaseUser.email || "",
      phone: supabaseUser.user_metadata?.phone || supabaseUser.phone || "",
      address: supabaseUser.user_metadata?.address || "",
    };
  }, []);
  const getUserWithProfile = useCallback(
    async (supabaseUser) => {
      const basicUser = formatSupabaseUser(supabaseUser);

      if (!supabaseUser) {
        return null;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, email, phone, address")
        .eq("id", supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading profile:", error.message);
        return basicUser;
      }

      if (!profile) {
        return basicUser;
      }

      return {
        ...basicUser,
        fullName: profile.full_name || basicUser.fullName,
        email: supabaseUser.email || profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      };
    },
    [formatSupabaseUser],
  );
  useEffect(() => {
    const restoreSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const authenticatedUser = await getUserWithProfile(session.user);

        setUser(authenticatedUser);

        localStorage.setItem("currentUser", JSON.stringify(authenticatedUser));

        localStorage.setItem("isLoggedIn", "true");
      } else {
        setUser(null);

        localStorage.removeItem("currentUser");
        localStorage.removeItem("isLoggedIn");
      }

      setLoading(false);
    };

    restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("isLoggedIn");
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getUserWithProfile, formatSupabaseUser]);

  const loginWithSupabase = async (supabaseUser) => {
    if (!supabaseUser) {
      return {
        success: false,
        message: "Unable to retrieve the logged-in user.",
      };
    }

    const authenticatedUser = await getUserWithProfile(supabaseUser);

    setUser(authenticatedUser);

    localStorage.setItem("currentUser", JSON.stringify(authenticatedUser));

    localStorage.setItem("isLoggedIn", "true");

    return {
      success: true,
      message: "Login successful.",
    };
  };
  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    setUser(null);

    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");

    return {
      success: true,
      message: "Logout successful.",
    };
  };
  const updateProfile = async (updatedData) => {
    if (!user) {
      return {
        success: false,
        message: "No user is currently logged in.",
      };
    }

    const profileData = {
      id: user.id,
      full_name: updatedData.fullName.trim(),
      email: user.email,
      phone: updatedData.phone?.trim() || "",
      address: updatedData.address?.trim() || "",
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").upsert(profileData, {
      onConflict: "id",
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    const updatedUser = {
      ...user,
      fullName: profileData.full_name,
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address,
    };

    setUser(updatedUser);

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  };
  const changePassword = async (currentPassword, newPassword) => {
    if (!user) {
      return {
        success: false,
        message: "No user is currently logged in.",
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        message: "New password must be at least 6 characters.",
      };
    }

    if (currentPassword === newPassword) {
      return {
        success: false,
        message: "New password must be different from the current password.",
      };
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      return {
        success: false,
        message: "Current password is incorrect.",
      };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return {
        success: false,
        message: updateError.message,
      };
    }

    return {
      success: true,
      message: "Password changed successfully.",
    };
  };
  const value = {
    user,
    loginWithSupabase,
    logout,
    updateProfile,
    changePassword,
    isLoggedIn: !!user,
  };
  if (loading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
