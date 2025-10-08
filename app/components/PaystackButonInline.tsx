"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

type Props = {
  amount: number;
  email: string;
  label?: string;
  currency?: "KEN";
  onVerified?: (payload: {
    reference: string;
    amount: number;
    currency: string;
    email: string;
  }) => void;
};

export default function PaystackButtonInline({
  amount,
  email,
  label,
  currency = "KEN",
  onVerified,
}: Props) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC!;

  useEffect(() => {
    // Check if script is already loaded
    if (typeof window !== "undefined" && window.PaystackPop) {
      setIsScriptLoaded(true);
      return;
    }

    // Create and load the script
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;

    script.onload = () => {
      console.log("Paystack script loaded successfully");
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load Paystack script");
    };

    // Append to head for better loading
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const payWithPaystack = () => {
    // FIXED: Better check for window and PaystackPop
    if (!isScriptLoaded || typeof window === "undefined" || !window.PaystackPop) {
      alert("Payment system is still loading. Please wait a moment and try again.");
      return;
    }

    if (!publicKey) {
      alert("Payment system is not properly configured. Please contact support.");
      return;
    }

    if (!email || !amount || amount <= 0) {
      alert("Please enter a valid email and amount.");
      return;
    }

    setIsProcessing(true);

    try {
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount: Math.round(amount * 100), // Convert to kobo/cents
        currency,
        callback: (response: { reference: string }) => {
          console.log("Payment successful:", response.reference);

          // Verify payment
          (async () => {
            try {
              const res = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reference: response.reference, email }),
              });

              const data = await res.json();
              console.log("Verification response:", data);

              if (res.ok && data.status === "success") {
                onVerified?.({
                  reference: response.reference,
                  amount: data.amount,
                  currency: data.currency,
                  email,
                });
                alert("🎉 Thank you for your donation!");
              } else {
                alert("We could not verify your donation. Please contact support.");
                console.error("Verification failed:", data);
              }
            } catch (err) {
              alert("Network error verifying payment. Please contact support.");
              console.error("Verification error:", err);
            } finally {
              setIsProcessing(false);
            }
          })();
        },
        onClose: () => {
          console.log("Payment window closed.");
          setIsProcessing(false);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Error initializing payment:", error);
      alert("Failed to initialize payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={payWithPaystack}
      disabled={!isScriptLoaded || isProcessing || !publicKey}
      className={`bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300 px-6 py-2 rounded ${
        (!isScriptLoaded || isProcessing || !publicKey)
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
    >
      {isProcessing
        ? "Processing..."
        : !isScriptLoaded
        ? "Loading..."
        : label ?? `Donate $${amount}`}
    </button>
  );
}
