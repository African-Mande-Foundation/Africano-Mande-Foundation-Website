"use client";

import LoginRegisterBg from "../components/LoginRegisterBg";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();

  // Handle callback URL safely
  const rawCallbackUrl = searchParams.get("callbackUrl");
  const callbackUrl =
    rawCallbackUrl && !rawCallbackUrl.includes("/register")
      ? rawCallbackUrl
      : "/membership";

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      setIsLoading(true);
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  // --- Submit login form ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await handleLogin(email, password);
    } catch {
      setIsLoading(false);
      setError("Login failed. Please try again.");
    }
  };

  // --- Login with credentials ---
  const handleLogin = async (identifier: string, password: string) => {
    const res = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  // --- Login with Google ---
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    const res = await signIn("google", {
      redirect: false,
      callbackUrl,
    });

    if (res?.error) {
      setError(res.error || "Google sign-in failed.");
      setIsLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };
  return (
    <div className="relative ">
      <LoginRegisterBg />
      <div className="w-screen h-screen absolute border-0 flex items-center justify-center border-amber-500 z-10">
        <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full flex items-center justify-center h-full">
          <div className="w-full items-center justify-center flex flex-col">
            <p className="text-black text-4xl text-center text-shadow-2xl ">
              LOG IN
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
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="p-2 w-full h-12 rounded-2xl bg-[#F5F5F5] text-[#032303] _shadow font-medium focus:outline-none"
              />

              <div className="h-12 rounded-2xl bg-[#F5F5F5] text-[#032303] _shadow font-medium outline-[#032303] w-full flex items-center justify-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="p-2 w-80/100 md:w-90/100 h-full focus:outline-none"
                />
                <div className="w-20/100 md:w-10/100 flex items-center justify-center p-2 h-full">
                  <button
                    type="button"
                    className="cursor-pointer"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="text-sm">
                <a
                  href="forgot-password"
                  className="font-medium text-cyan-600 hover:text-cyan-500"
                >
                  Forgot your password?
                </a>
              </div>

              <button
                disabled={isLoading}
                className=" cursor-pointer p-5 w-full h-12 items-center justify-center flex rounded-2xl bg-[#04663A] text-white _shadow font-bold text-xl mt-10 text-shadow-black/50 text-shadow-2xs "
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>
              <p className="text-black font-medium text-center text-shadow-2xl">
                OR
              </p>
              <button
                disabled={isLoading}
                onClick={handleGoogleSignIn}
                className="cursor-pointer p-5 w-full h-12 items-center justify-center flex gap-x-5 rounded-2xl bg-[#04B47F] text-white _shadow font-bold text-shadow-black/30 text-shadow-2xs text-base "
              >
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/Foundation_FM_Media%2Ficons8-google-48.png?alt=media&token=b423d98b-7fca-4535-a5d8-3ef2e849680d"
                  alt="google_icon"
                  width={30}
                  height={30}
                  className="shadow-2xl shadow-black"
                />
                Continue with Google
              </button>

              <div className=" mt-6 flex items-center justify-center gap-2 w-full text-center">
                <p className="text-black">Don&apos;t have an account?</p>
                <Link
                  href="/register"
                  className="font-medium text-cyan-600 hover:text-cyan-500"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
