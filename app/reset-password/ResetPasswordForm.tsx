"use client";

import LoginRegisterBg from "../components/LoginRegisterBg";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (!code) {
      setError("No reset code provided. Please check your email link.");
    }
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!code) {
      setError("Cannot reset password without a valid code.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to reset password.");
      } else {
        setMessage(data.message);
        setPassword("");
        setConfirmPassword("");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <LoginRegisterBg />
      <div className="w-screen h-screen absolute border-0 flex items-center justify-center border-amber-500 z-10">
        <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full flex items-center justify-center h-full">
          <div className="w-full items-center justify-center flex flex-col">
            <p className="text-black text-4xl text-center text-shadow-2xl">
              RESET PASSWORD
            </p>
            <form
              onSubmit={handleSubmit}
              className="p-2 w-full md:w-[400px] gap-y-2 flex flex-col mt-10"
            >
              {error && (
                <p className="text-red-600 text-center font-medium mb-2">
                  {error}
                </p>
              )}
              {message && (
                <p className="text-green-600 text-center font-medium mb-2">
                  {message}
                </p>
              )}
              <div className="h-12 rounded-2xl bg-[#F5F5F5] text-[#032303] _shadow font-medium outline-[#032303] w-full flex items-center justify-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="p-2 w-80/100 md:w-90/100 h-full focus:outline-none"
                  required
                />
                <div className="w-20/100 md:w-10/100 flex items-center justify-center p-2 h-full">
                  <button
                    type="button"
                    className="cursor-pointer"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="h-12 rounded-2xl bg-[#F5F5F5] text-[#032303] _shadow font-medium outline-[#032303] w-full flex items-center justify-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="p-2 w-80/100 md:w-90/100 h-full focus:outline-none"
                  required
                />
                <div className="w-20/100 md:w-10/100 flex items-center justify-center p-2 h-full">
                  <button
                    type="button"
                    className="cursor-pointer"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                disabled={isLoading || !code}
                className="cursor-pointer p-5 w-full h-12 items-center justify-center flex rounded-2xl bg-[#04663A] text-white _shadow font-bold text-xl mt-10 text-shadow-black/50 text-shadow-2xs"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>

              {message && (
                <div className="mt-6 flex items-center justify-center gap-2 w-full text-center">
                  <Link
                    href="/login"
                    className="font-medium text-cyan-600 hover:text-cyan-500"
                  >
                    Proceed to Login
                  </Link>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
