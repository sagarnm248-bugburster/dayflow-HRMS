import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { loginUser } from "../../Redux/Slice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../config/api";

const Login = () => {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ CLEAR OLD TOKEN WHEN LOGIN PAGE LOADS
  useEffect(() => {
    console.log("🧹 Clearing old token...");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }, []);

  const handelLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // =========================================================================
    // TEMPORARY DEMO LOGIN FALLBACK — REMOVE BEFORE PRODUCTION
    // Allows immediate client-side login verification for DEMO001 / demo / demo123
    // =========================================================================
    const trimmedId = id.trim().toUpperCase();
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (trimmedId === "DEMO001" || trimmedUsername === "demo") {
      if (trimmedId === "DEMO001" && trimmedUsername === "demo" && trimmedPassword === "demo123") {
        const demoUser = {
          _id: "demo_user_001",
          id: "DEMO001",
          username: "demo",
          name: "Demo Admin",
          email: "demo@nmit.ac.in",
          role: "hr",
          department: "Human Resources",
          designation: "HR Manager",
          status: "Active"
        };
        const demoToken = "demo_jwt_token_nmit_peoplehub_2026_valid";

        // ✅ Update Redux & localStorage
        dispatch(loginUser({ user: demoUser, token: demoToken }));
        localStorage.setItem("token", demoToken);
        localStorage.setItem("role", "hr");
        localStorage.setItem("user", JSON.stringify(demoUser));

        toast.success("Demo Login successful! Redirecting to HR Dashboard...", {
          position: "bottom-right",
        });

        setTimeout(() => {
          navigate("/hrhome");
        }, 1000);

        setLoading(false);
        return;
      } else {
        toast.error("Invalid demo credentials. Use DEMO001 / demo / demo123", {
          position: "bottom-right",
        });
        setLoading(false);
        return;
      }
    }
    // =========================================================================

    const userData = { username, password, id };

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login failed", {
          position: "bottom-right",
        });
        return;
      }

      const role = (data?.user?.role || "").toLowerCase();

      // ✅ Update Redux
      dispatch(loginUser({ user: data.user, token: data.token }));

      // ✅ Save new token to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful!", {
        position: "bottom-right",
      });

      // ✅ Navigate after login
      setTimeout(() => {
        if (role === "employee") {
          navigate("/emhome");
        } else if (role === "hr") {
          navigate("/hrhome");
        }
      }, 1500); // wait for toast to show

    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred while logging in. Please try again.", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Left Side (Logo + Form + Footer) */}
      <div className="flex flex-col justify-center items-center w-full md:w-5/12 lg:w-4/12 px-6 py-12 relative z-10">

        {/* LOGO */}
        <div className="absolute top-8 left-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-200">
            N
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary tracking-tight">NMIT PeopleHub</span>
            <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Nitte Meenakshi Institute of Technology</span>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="w-full max-w-sm mt-12">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-text-sub">Sign in to your NMIT PeopleHub account.</p>
          </div>

          <form className="space-y-5" onSubmit={handelLogin}>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">ID</label>
              <input
                type="text"
                placeholder="Enter your ID"
                className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-text-main placeholder-gray-400"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-text-main placeholder-gray-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-text-main placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-white font-semibold text-lg hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 ${loading ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:bg-primary-hover"
                }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-400">
            <p className="mb-1">© 2026 NMIT PeopleHub • Nitte Meenakshi Institute of Technology</p>
            <span className="cursor-pointer hover:text-primary transition-colors">Terms and Conditions</span>
            <span className="mx-2">•</span>
            <span className="cursor-pointer hover:text-primary transition-colors">Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Right Side (Image/Art) */}
      <div className="hidden md:flex md:w-7/12 lg:w-8/12 bg-accent relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
        <div className="relative z-10 w-full max-w-2xl transform hover:scale-[1.02] transition-transform duration-500">
          <img
            src="https://res.cloudinary.com/doqzxuxb1/image/upload/v1748238957/Attendance%20And%20Payroll%20Managment/y45ltl4yfgxsksuetayk.png"
            alt="Login Illustration"
            className="w-full h-auto drop-shadow-2xl rounded-2xl"
          />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
