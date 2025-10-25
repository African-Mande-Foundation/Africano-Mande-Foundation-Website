"use client";
import { useEffect, useState } from "react";

// Define proper types for Paystack metadata
interface PaystackCustomField {
  display_name: string;
  variable_name: string;
  value: string;
}

interface PaystackMetadata {
  custom_fields?: PaystackCustomField[];
  // Remove the any type and use specific types instead
  [key: string]: PaystackCustomField[] | string | number | boolean | undefined;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        reference?: string;
        callback: (response: { reference: string; status: string }) => void;
        onClose: () => void;
        channels?: string[];
        metadata?: PaystackMetadata;
      }) => { openIframe: () => void };
    };
  }
}

type Props = {
  amount: number;
  email: string;
  label?: string;
  onVerified?: (payload: {
    reference: string;
    amount: number;
    currency: string;
    email: string;
  }) => void;
  onError?: (error: string) => void;
  className?: string;
};

export default function PaystackButtonInline({
  amount,
  email,
  label,
  onVerified,
  onError,
  className = "",
}: Props) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  
  // USD only currency
  const currency = "USD";
  
  // Fix: Use the correct environment variable name
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

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
      setError("Failed to load payment system");
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializePayment = async () => {
    try {
      setError("");
      
      // Create properly typed metadata
      const metadata: PaystackMetadata = {
        custom_fields: [
          {
            display_name: "Payment for",
            variable_name: "payment_for",
            value: "Donation"
          }
        ]
      };
      
      // Initialize payment on backend first
      const response = await fetch("/api/initialize-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount,
          currency,
          metadata
        }),
      });

      const data = await response.json();
      console.log("Payment initialization response:", data);

      if (data.status === "success") {
        return data.data.reference;
      } else {
        throw new Error(data.message || "Failed to initialize payment");
      }
    } catch (err) {
      console.error("Payment initialization error:", err);
      throw err;
    }
  };

  const payWithPaystack = async () => {
    // Validation checks
    if (!isScriptLoaded || typeof window === "undefined" || !window.PaystackPop) {
      const errorMsg = "Payment system is still loading. Please wait a moment and try again.";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (!publicKey) {
      const errorMsg = "Payment system is not properly configured. Please contact support.";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (!email || !amount || amount <= 0) {
      const errorMsg = "Please enter a valid email and amount.";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Initialize payment on backend first
      const reference = await initializePayment();
      
      // Create properly typed metadata for frontend
      const metadata: PaystackMetadata = {
        custom_fields: [
          {
            display_name: "Payment for",
            variable_name: "payment_for",
            value: "Donation"
          }
        ]
      };
      
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount: Math.round(amount * 100), // Convert to cents for USD
        currency,
        reference,
        channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
        metadata,
        callback: (response: { reference: string; status: string }) => {
          console.log("Payment response:", response);

          if (response.status === "success") {
            // Verify payment
            verifyPayment(response.reference);
          } else {
            const errorMsg = "Payment was not completed successfully.";
            setError(errorMsg);
            onError?.(errorMsg);
            setIsProcessing(false);
          }
        },
        onClose: () => {
          console.log("Payment window closed.");
          setIsProcessing(false);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Error initializing payment:", error);
      const errorMsg = error instanceof Error ? error.message : "Failed to initialize payment. Please try again.";
      setError(errorMsg);
      onError?.(errorMsg);
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, email }),
      });

      const data = await res.json();
      console.log("Verification response:", data);

      if (res.ok && data.status === "success") {
        onVerified?.({
          reference,
          amount: data.data.amount,
          currency: data.data.currency,
          email,
        });
        
        // Show success message
        if (typeof window !== "undefined") {
          alert("🎉 Thank you for your donation! Payment successful.");
        }
      } else {
        const errorMsg = data.message || "We could not verify your payment. Please contact support.";
        setError(errorMsg);
        onError?.(errorMsg);
        console.error("Verification failed:", data);
      }
    } catch (err) {
      const errorMsg = "Network error verifying payment. Please contact support.";
      setError(errorMsg);
      onError?.(errorMsg);
      console.error("Verification error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const isDisabled = !isScriptLoaded || isProcessing || !publicKey || !email || amount <= 0;

  // Fix: Properly construct className string
  const buttonClassName = [
    className,
    "bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white",
    "transform transition-all duration-300 px-6 py-3 rounded-lg",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
    isDisabled ? "" : "hover:scale-105 active:scale-95"
  ].filter(Boolean).join(" ");

  return (
    <div className="w-full">
      {error && (
        <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      
      <button
        onClick={payWithPaystack}
        disabled={isDisabled}
        className={buttonClassName}
        title={
          !publicKey 
            ? "Payment system not configured" 
            : !isScriptLoaded 
            ? "Loading payment system..." 
            : !email 
            ? "Email required" 
            : amount <= 0 
            ? "Valid amount required" 
            : ""
        }
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : !isScriptLoaded ? (
          "Loading..."
        ) : !publicKey ? (
          "Payment Unavailable"
        ) : (
          label ?? `Donate $${amount.toFixed(2)}`
        )}
      </button>
      
      {!publicKey && (
        <p className="mt-2 text-sm text-red-600">
          Payment system is not configured. Please check environment variables.
        </p>
      )}
    </div>
  );
}
