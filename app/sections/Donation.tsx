"use client";
import { Heart } from "lucide-react";
import { useState } from "react";
import PaystackButtonInline from "@/app/components/PaystackButonInline";
import Link from "next/link";

interface DonationProps {
  showDonateModal: boolean;
  setShowDonateModal: (show: boolean) => void;
}

export default function Donation ({ showDonateModal, setShowDonateModal }: DonationProps) {
const [email, setEmail] = useState("");
const [customAmount, setCustomAmount] = useState<number | "">("");
const emailValid = !!email && /\S+@\S+\.\S+/.test(email);
const canDonateCustom = emailValid && typeof customAmount === "number" && customAmount > 0;

    return(
        <div className="bg-white mt-5 w-full items-center justify-center flex">
            <div className=" p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex flex-col items-start justify-center gap-y-5  h-auto">
                <div className="text-xl lg:text-2xl font-medium text-[#3b6907] items-center justify-center flex gap-x-2"><div className="bg-[#3b6907] w-1 h-6"></div><p>Donate</p></div>

                <div className="w-full h-auto bg-[#3b6907] gap-y-8 md:gap-y-13 p-5 md:p-10 flex flex-col items-center justify-between">
                    <div className="text-white font-bold text-2xl md:text-3xl lg:text-4xl text-center">Your support can make a lasting impact!</div>
                    <Link href="/donation" className="px-8 py-4 bg-[#005e84] text-white items-center justify-center flex gap-2 md:gap-4 text-sm md:text-base rounded-2xl cursor-point hover:bg-[#fff] hover:text-[#005e84] transition duration-300 cursor-pointer">
                    <span>Donate Now</span> <Heart className="w-4 md:w-5"/>
                </Link>
                </div>
            </div>

            {showDonateModal && (
            <div className="fixed inset-0 w-screen h-screen bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowDonateModal(false)}>
                <div className="p-2 md:p-4 lg:px-5 max-w-screen-xl w-full relative flex items-center justify-center h-auto">
                <div className="bg-white rounded" onClick={e => e.stopPropagation()}>
                    <div className="border-b border-gray-300 flex items-center justify-between p-2 lg:px-5 lg:py-3">
                        <div><p className="text-[#032303] font-bold">Donate</p></div>
                        <button
                            className="py-1 px-6 rounded-lg bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300"
                            onClick={() => setShowDonateModal(false)}
                        >
                            close
                        </button>
                    </div>
                    <div className="text-white p-2 lg:p-5 overflow-y-scroll max-h-[600px] lg:max-h-[500px] xl:max-h-[500px] ">
                        <h1 className="text-4xl font-bold text-[#032303] mb-8">Support Our Mission</h1>

                        {/* Capture donor email once for all buttons */}
                        <div className="bg-[#032303] p-6 rounded-lg mb-8">
                            <label className="block text-white font-semibold mb-2">Your Email (for receipt)</label>
                            <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-[#7daa59c5] text-white rounded outline-[#7eaf58]"
                            />
                            {!emailValid && email.length > 0 && (
                            <p className="text-red-400 text-sm mt-2">Please enter a valid email.</p>
                            )}
                        </div>

                        <div className="space-y-8">
                            <p className="text-lg text-[#6f6f6f]">
                            Your donation helps us continue our mission of serving the community through radio programming,
                            educational initiatives, and community development projects.
                            </p>

                            {/* Fixed amounts */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { amt: 25, desc: "Supports one day of community programming" },
                                { amt: 50, desc: "Helps fund youth empowerment programs" },
                                { amt: 100, desc: "Contributes to health services outreach initiatives" },
                            ].map(({ amt, desc }) => (
                                <div key={amt} className="bg-[#032303] p-6 rounded-lg text-center">
                                <h3 className="text-xl font-bold mb-3">${amt}</h3>
                                <p className="mb-4">{desc}</p>
                                {emailValid && email.length > 0 ? (<PaystackButtonInline
                                    amount={amt}
                                    email={email}
                                    label={`Donate $${amt}`}
                                    onVerified={({ reference }) => {
                                    
                                    console.log("Verified ref:", reference);
                                    }}
                                />)
                                : (
                                    <button
                                    disabled
                                    className="cursor-not-allowed opacity-60  bg-[#dfefd2] text-[#032303] px-6 py-2 rounded"
                                    >
                                    Donate
                                    </button>
                                )
                                
                                }
                                </div>
                            ))}
                            </div>

                            {/* Custom amount */}
                            <div className="bg-[#032303] p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-3">Other Amount</h3>
                            <p className="mb-4">Choose your own donation amount to support our community programs.</p>
                            <div className="flex flex-col md:flex-row  gap-4">
                                <input
                                type="number"
                                min={1}
                                placeholder="Enter amount"
                                value={customAmount}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setCustomAmount(v === "" ? "" : Number(v));
                                }}
                                className="w-full h-full md:w-1/2 px-4 py-2 bg-[#7daa59c5] outline-[#7eaf58] text-white rounded"
                                />
                                <div>
                                {canDonateCustom ? (
                                    <PaystackButtonInline
                                    amount={Number(customAmount)}
                                    email={email}
                                    label="Donate"
                                    onVerified={({ reference }) => {
                                    console.log("Verified ref:", reference);
                                    }}
                                    />
                                ) : (
                                    <button
                                    disabled
                                    className="cursor-not-allowed opacity-60 bg-[#dfefd2] text-[#032303] px-6 py-2 rounded"
                                    >
                                    Donate
                                    </button>
                                )}
                                </div>
                            </div>
                            {!emailValid && email.length > 0 && (
                                <p className="text-red-400 text-sm mt-2">Enter a valid email to proceed.</p>
                            )}
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-7 border-t border-gray-300"></div>
                </div>
                </div>
            </div>
            )}

        </div>
    )
}