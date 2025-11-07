"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart, Users, TreePine, GraduationCap, Building, ArrowRight, DollarSign, CheckCircle } from "lucide-react";
import PaystackButtonInline from "@/app/components/PaystackButonInline";
import type { PaymentPayload } from "@/lib/types";

interface DonationCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  amounts: number[];
}

export default function MemberDonations() {
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState<string>("general");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const donationCategories: DonationCategory[] = [
    {
      id: "general",
      title: "General Support",
      description: "Support our overall mission and help us make a difference across all our programs",
      icon: <Heart className="w-6 h-6" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      amounts: [25, 50, 100, 250]
    },
    {
      id: "education",
      title: "Education Programs",
      description: "Fund educational initiatives, scholarships, and learning resources for communities",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      amounts: [30, 75, 150, 300]
    },
    {
      id: "environment",
      title: "Environmental Projects",
      description: "Support tree planting, conservation efforts, and sustainable development projects",
      icon: <TreePine className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      amounts: [20, 60, 120, 200]
    },
    {
      id: "community",
      title: "Community Development",
      description: "Help build stronger communities through infrastructure and social programs",
      icon: <Users className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      amounts: [40, 100, 200, 500]
    },
    {
      id: "infrastructure",
      title: "Infrastructure",
      description: "Support building schools, health centers, and other essential infrastructure",
      icon: <Building className="w-6 h-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      amounts: [50, 150, 300, 1000]
    }
  ];

  const currentCategory = donationCategories.find(cat => cat.id === selectedCategory) || donationCategories[0];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(numValue);
    } else {
      setSelectedAmount(0);
    }
  };

  const handlePaymentSuccess = async (payload: PaymentPayload) => {
    console.log("Donation successful:", payload);
    
    try {
      const response = await fetch("/api/donations/registered", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId: payload.reference,
          amount_usd: payload.amount,
          cause: selectedCategory,
          message: message || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("🎉 Thank you for your generous donation! Your support makes a real difference.");
      } else {
        console.error("Error saving donation:", result.error);
        alert("Payment successful, but there was an issue saving the donation details. Please contact support.");
      }
    } catch (error) {
      console.error("Error saving donation:", error);
      alert("Payment successful, but there was an issue saving the donation details. Please contact support.");
    }
  };

  const handlePaymentError = (error: string) => {
    console.error("Donation error:", error);
  };

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  // Redirect if not authenticated
  if (!session) {
    return (
      <div className="w-full p-4 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to make a donation</h1>
        <p className="text-gray-600">You need to be logged in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 max-w-6xl mx-auto text-gray-600">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-black text-3xl md:text-4xl font-bold mb-4">Make a Donation</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Your generous support helps us create lasting change in communities across Africa. 
          Every donation, no matter the size, makes a meaningful impact.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Welcome back, {session.user?.name || session.user?.email}!
        </p>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#04663A] text-white p-6 rounded-lg text-center">
          <div className="text-3xl font-bold mb-2">$50</div>
          <p className="text-sm opacity-90">Can provide educational materials for 5 children</p>
        </div>
        <div className="bg-[#04663A] text-white p-6 rounded-lg text-center">
          <div className="text-3xl font-bold mb-2">$100</div>
          <p className="text-sm opacity-90">Can plant 50 trees for environmental restoration</p>
        </div>
        <div className="bg-[#04663A] text-white p-6 rounded-lg text-center">
          <div className="text-3xl font-bold mb-2">$250</div>
          <p className="text-sm opacity-90">Can support a family&apos;s health needs for a month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Donation Categories */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a Cause</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {donationCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedCategory === category.id
                    ? `border-[#04663A] ${category.bgColor}`
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`${category.color} ${category.bgColor} p-2 rounded-lg flex-shrink-0`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  {selectedCategory === category.id && (
                    <CheckCircle className="w-5 h-5 text-[#04663A] flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Amount Selection */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">Select Amount</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {currentCategory.amounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`p-4 rounded-lg border-2 font-semibold transition-all duration-200 ${
                  selectedAmount === amount && !customAmount
                    ? "border-[#04663A] bg-[#04663A] text-white"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or enter a custom amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Donation Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Complete Your Donation</h3>
            
            <div className="space-y-4 mb-6">
              {/* Optional Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a message of support..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Donation Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Category:</span>
                <span className="text-sm font-medium">{currentCategory.title}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-lg font-bold text-[#04663A]">
                  ${finalAmount > 0 ? finalAmount.toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Donor:</span>
                <span className="text-sm font-medium">{session.user?.name || session.user?.email}</span>
              </div>
            </div>

            {/* Payment Button */}
            {finalAmount > 0 && session.user?.email ? (
              <PaystackButtonInline
                email={session.user.email}
                amount={finalAmount}
                label={`Donate $${finalAmount.toFixed(2)}`}
                onVerified={handlePaymentSuccess}
                onError={handlePaymentError}
                className="w-full"
              />
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-6 rounded-lg cursor-not-allowed"
              >
                Select an amount to continue
              </button>
            )}

            {/* Security Note */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                🔒 Your payment is secured by Paystack SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Why Your Donation Matters</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-[#04663A] mr-2 mt-0.5 flex-shrink-0" />
                <span>100% of donations go directly to programs and communities in need</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-[#04663A] mr-2 mt-0.5 flex-shrink-0" />
                <span>Your contribution creates lasting change in African communities</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-[#04663A] mr-2 mt-0.5 flex-shrink-0" />
                <span>Receive updates on how your donation is making an impact</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-[#04663A] mr-2 mt-0.5 flex-shrink-0" />
                <span>Tax-deductible receipts provided for all donations</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Other Ways to Help</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-[#04663A] mr-2 mt-0.5 flex-shrink-0" />
                <span>Share our mission with friends and family</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-[#04663A] mr-2 mt-0.5 flex-shrink-0" />
                <span>Volunteer your time and skills to our projects</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-[#04663A] mr-2 mt-0.5 flex-shrink-0" />
                <span>Partner with us for corporate social responsibility</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-[#04663A] mr-2 mt-0.5 flex-shrink-0" />
                <span>Follow us on social media to stay updated</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}