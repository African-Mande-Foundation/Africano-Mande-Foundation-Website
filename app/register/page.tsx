"use client";
import LoginRegisterBg from "../components/LoginRegisterBg";
import Image from "next/image";
import {Eye, EyeOff} from 'lucide-react';
import { useState , useEffect} from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Register () {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { status } = useSession();

  const callbackUrl = "/";

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      setIsLoading(true);
      router.replace(callbackUrl);
    }
  }, [status, router]);

  // --- Handle Form Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed.");
        setIsLoading(false);
        return;
      }

      // Auto-login after successful registration
      const signInRes = await signIn("credentials", {
        redirect: false,
        identifier: email,
        password,
      });

      if (signInRes?.error) {
        setError("Auto-login failed: " + signInRes.error);
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  // --- Handle Google Sign-in ---
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const signInRes = await signIn("google", { redirect: false });
      if (signInRes?.error) {
        setError("Google sign-in failed.");
        setIsLoading(false);
        return;
      }
    } catch {
      setError("Google sign-in failed.");
      setIsLoading(false);
    }
  };

    return(
        <div className="relative ">
            <LoginRegisterBg/>
            <div className="w-screen h-screen absolute border-0 flex items-center justify-center border-amber-500 z-10">
                <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full flex items-center justify-center h-full">
                    <div className="w-full items-center justify-center flex flex-col">
                        <p className="text-black text-4xl text-center text-shadow-2xl ">BECOME A MEMBER</p>
                        <form 
                        onSubmit={handleSubmit}
                        className="p-2 w-full md:w-[400px] gap-y-2 flex flex-col mt-10">

                             {error && (
                                    <p className="text-red-600 text-center font-medium mb-2">
                                    {error}
                                    </p>
                            )}


                            <input 
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter your first name"
                                className="p-2 w-full h-12 rounded-2xl bg-[#F5F5F5] text-[#032303] _shadow font-medium focus:outline-none"
                            />

                            <input 
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter your last name"
                                className="p-2 w-full h-12 rounded-2xl bg-[#F5F5F5] text-[#032303] _shadow font-medium focus:outline-none"
                            />

                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="p-2 w-full h-12 rounded-2xl bg-[#F5F5F5] text-[#032303] _shadow font-medium focus:outline-none"
                            />

                            <div className="h-12 rounded-2xl bg-[#F5F5F5] text-[#032303] _shadow font-medium outline-[#032303] w-full flex items-center justify-center">
                                <input 
                                type={showPassword? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                className="p-2 w-80/100 md:w-90/100 h-full focus:outline-none"
                                />

                                
                                <div className="w-20/100 md:w-10/100 flex items-center justify-center p-2 h-full">
                                    <button type="button" className="cursor-pointer" tabIndex={-1} onClick={() => setShowPassword((prev) => !prev)}>
                                    {showPassword? <EyeOff size={20}/> : <Eye size={20} />}
                                    </button>
                                </div>
                                

                            </div>

                            <div className="h-12 rounded-2xl bg-[#F5F5F5] text-[#032303] _shadow font-medium outline-[#032303] w-full flex items-center justify-center">
                                <input 
                                type={showPassword? "text" : "password"}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="p-2 w-80/100 md:w-90/100 h-full focus:outline-none"
                                />

                                
                                <div className="w-20/100 md:w-10/100 flex items-center justify-center p-2 h-full">
                                    <button type="button" className="cursor-pointer" tabIndex={-1} onClick={() => setShowPassword((prev) => !prev)}>
                                    {showPassword? <EyeOff size={20}/> : <Eye size={20} />}
                                    </button>
                                </div>
                                

                            </div>

                           
                            
                            <button 
                             type="submit"
                             disabled={isLoading}
                             className=" cursor-pointer p-5 w-full h-12 items-center justify-center flex rounded-2xl bg-[#04663A] text-white _shadow font-bold text-xl mt-10 text-shadow-black/50 text-shadow-2xs ">
                                {isLoading ? "Processing..." : "Join Us"}
                            </button>
                            <p className="text-black font-medium text-center text-shadow-2xl">
                                OR
                            </p>
                            <button 
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className=" cursor-pointer p-5 w-full h-12 items-center justify-center flex gap-x-5 rounded-2xl bg-[#04B47F] text-white _shadow font-bold text-shadow-black/30 text-shadow-2xs text-base ">
                                <Image src="https://firebasestorage.googleapis.com/v0/b/foundation-fm.firebasestorage.app/o/Foundation_FM_Media%2Ficons8-google-48.png?alt=media&token=b423d98b-7fca-4535-a5d8-3ef2e849680d" alt="google_icon" width={30} height={30} className='shadow-2xl shadow-black' />
                                Continue with Google
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 w-full text-center">
                                <p className="text-black">Already have an account?</p>
                                <Link href="/login" className="font-medium text-cyan-600 hover:text-cyan-500">Login</Link>
                            </div>
                            
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}