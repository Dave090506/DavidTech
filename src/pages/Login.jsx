import { useState } from "react";
import useAuth from "../context/useAuth";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import hero from "../assets/images/hero.png";
import { supabase } from "../services/supabaseClient";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { loginWithSupabase } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      await supabase.auth.signOut();
      toast.error("Unable to verify your account.");
      return;
    }

    if (profile?.is_admin) {
      await supabase.auth.signOut();
      toast.error("Administrator accounts must use the Admin Login page.");
      return;
    }

    const result = await loginWithSupabase(data.user);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Login successful!");

    navigate("/dashboard");
  };
  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-linear-to-br from-blue-600 to-indigo-700 text-white p-10">
          <img
            src={hero}
            alt="DavidTech"
            className="w-64 object-contain mb-8"
          />

          <h2 className="text-4xl font-bold text-center">
            Welcome to DavidTech
          </h2>

          <p className="text-center text-blue-100 mt-5 leading-8 max-w-md">
            Your One-Stop Shop for Premium Computer Gadgets.
          </p>
        </div>

        {/* Right Side */}
        <div className="p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-600 mb-2">
            Welcome Back
          </h1>

          <p className="text-center text-gray-500 mb-6 sm:mb-8">
            Sign in to your DavidTech account
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block mb-2 font-medium">
                Email Address
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="block mb-2 font-medium"
              >
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="login-password"
                  name="password"
                  autoComplete="current-password"
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 sm:hover:scale-[1.02] duration-300 transition font-semibold"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
