"use client";

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
  currency?: "USD";
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
  currency = "USD",
  onVerified,
}: Props) {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC!;

  const payWithPaystack = () => {
   
    if (typeof window === "undefined" || !window.PaystackPop) {
      alert("Payment library not loaded yet. Please try again.");
      return;
    }
    if (!publicKey) {
      alert("Missing Paystack public key.");
      return;
    }
    if (!email || !amount || amount <= 0) {
      alert("Please enter a valid email and amount.");
      return;
    }

    const handler = window.PaystackPop!.setup({
      key: publicKey,
      email,
      amount: Math.round(amount * 100),
      currency,
      callback: (response: { reference: string }) => {
     
        (async () => {
          try {
            const res = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: response.reference, email }),
            });
            const data = await res.json();

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
            alert("Network error verifying payment.");
            console.error(err);
          }
        })();
      },
      onClose: () => {
        console.log("Payment window closed.");
      },
    });

    handler.openIframe();
  };

  return (
    <button
      onClick={payWithPaystack}
      className="  bg-[#dfefd2] text-[#032303] font-bold hover:bg-[#032303] hover:text-white transform transition-transform cursor-pointer duration-300 px-6 py-2 rounded"
    >
      {label ?? `Donate $${amount}`}
    </button>
  );
}
