import React, { useState } from "react";
import { useAuthUser } from "../../context/AuthUserContext.jsx";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import toast from "react-hot-toast";

export default function Step1EmailPassword({ formData, setFormData, next }) {
  const [email, setEmail] = useState(formData.email || "");
  const [password, setPassword] = useState(formData.password || "");
  const [isDisabled, setDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { registerUser } = useAuthUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    try {
      const userDoc = await registerUser(email, password);

      if (userDoc) {
        localStorage.setItem("uid", userDoc.uid);
        setFormData({ ...formData, email, password });
        next();
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setDisabled(false); // re-enable form after error
    }
  };

  return (
    <div className="flex items-center justify-center mb-14  sm:px-6">
      <div className="rounded-3xl shadow-2xl border p-10 w-full max-w-md bg-white/80 text-center animate-fade-in">
        <h3 className="text-4xl font-extrabold mb-8 bg-gradient-to-l from-[#095DB7] to-[#41D7B7] bg-clip-text text-transparent">
          Dive into Multicity
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-3 rounded-xl text-black bg-white/60 outline-none border-2 border-transparent 
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-500"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-3 rounded-xl text-black bg-white/60 outline-none border-2 border-transparent 
                         focus:border-green-400 focus:ring-2 focus:ring-green-200 placeholder-gray-500"
              disabled={isDisabled}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black transition"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <p className="text-xs text-left text-gray-800">
            Password must be <span className="font-semibold">8+ characters</span>, include <span className="font-semibold">a letter</span> and <span className="font-semibold">a number</span>.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-[#41D7B7] to-[#095DB7] hover:from-[#095DB7] hover:to-[#41D7B7] 
                       text-white font-bold py-3 rounded-xl w-full shadow-lg transition-all duration-300 
                       transform hover:scale-105 hover:shadow-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDisabled}
          >
            {isDisabled ? "Processing..." : "Next →"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#095DB7] font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
