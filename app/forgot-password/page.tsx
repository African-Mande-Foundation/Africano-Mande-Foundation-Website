"use client";

import LoginRegisterBg from "../components/LoginRegisterBg";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
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
              FORGOT PASSWORD
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
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="p-2 w-full h-12 rounded-2xl bg-[#F5F5F5] text-[#032303] _shadow font-medium focus:outline-none"
                required
              />

              <button
                disabled={isLoading}
                className="cursor-pointer p-5 w-full h-12 items-center justify-center flex rounded-2xl bg-[#04663A] text-white _shadow font-bold text-xl mt-10 text-shadow-black/50 text-shadow-2xs"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 w-full text-center">
                <Link
                  href="/login"
                  className="font-medium text-cyan-600 hover:text-cyan-500"
                >
                  Back to Log in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
