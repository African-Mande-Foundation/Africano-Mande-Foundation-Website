"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Eye, EyeOff, Save, User, AlertTriangle, LogOut, Trash2 } from "lucide-react";
import Image from "next/image";

export default function Settings() {
    const { data: session, update } = useSession();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [originalEmail, setOriginalEmail] = useState(""); // Track original email
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showEmailChangeModal, setShowEmailChangeModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // Load user data when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            if (session?.user) {
                try {
                    // Try to fetch from your API first for the most up-to-date data
                    const res = await fetch("/api/user");
                    if (res.ok) {
                        const userData = await res.json();
                        const userFirstName = userData.firstName || session.user.name?.split(" ")[0] || "";
                        const userLastName = userData.lastName || session.user.name?.split(" ")[1] || "";
                        const userEmail = userData.email || session.user.email || "";
                        
                        setFirstName(userFirstName);
                        setLastName(userLastName);
                        setEmail(userEmail);
                        setOriginalEmail(userEmail); // Store original email
                    } else {
                        // Fallback to session data if API fails
                        const sessionFirstName = session.user.name?.split(" ")[0] || "";
                        const sessionLastName = session.user.name?.split(" ")[1] || "";
                        const sessionEmail = session.user.email || "";
                        
                        setFirstName(sessionFirstName);
                        setLastName(sessionLastName);
                        setEmail(sessionEmail);
                        setOriginalEmail(sessionEmail); // Store original email
                    }
                } catch (error) {
                    // Fallback to session data if API fails
                    const sessionFirstName = session.user.name?.split(" ")[0] || "";
                    const sessionLastName = session.user.name?.split(" ")[1] || "";
                    const sessionEmail = session.user.email || "";
                    
                    setFirstName(sessionFirstName);
                    setLastName(sessionLastName);
                    setEmail(sessionEmail);
                    setOriginalEmail(sessionEmail); // Store original email
                }
            }
        };

        fetchUserData();
    }, [session]);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setIsLoading(true);

        if (!firstName || !lastName || !email) {
            setError("Please fill in all profile fields.");
            setIsLoading(false);
            return;
        }

        const emailChanged = email !== originalEmail;

        try {
            const res = await fetch("/api/user/update-profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to update profile.");
                setIsLoading(false);
                return;
            }

            // If email was changed, show the modal
            if (emailChanged) {
                setShowEmailChangeModal(true);
            } else {
                setMessage("Profile updated successfully!");
                
                // Force refresh the session from the server
                await update();
                
                // Also fetch the latest user data to ensure we have the updated info
                try {
                    const userRes = await fetch("/api/user");
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        // Update the form fields with the latest data
                        setFirstName(userData.firstName || "");
                        setLastName(userData.lastName || "");
                        setEmail(userData.email || "");
                        setOriginalEmail(userData.email || ""); // Update original email
                    }
                } catch (fetchError) {
                    console.log("Failed to fetch updated user data:", fetchError);
                }
            }

        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setIsLoading(true);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all password fields.");
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters long.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/user/update-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to update password.");
                setIsLoading(false);
                return;
            }

            setMessage("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut({ callbackUrl: "/" });
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            setError("Please enter your password to delete your account.");
            return;
        }

        setIsDeleting(true);
        setError("");

        try {
            const res = await fetch("/api/user/delete-account", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password: deletePassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to delete account.");
                setIsDeleting(false);
                return;
            }

            // Account deleted successfully, sign out
            await signOut({ callbackUrl: "/" });
        } catch (err) {
            setError("An unexpected error occurred.");
            setIsDeleting(false);
        }
    };

    const handleOkayAndSignOut = async () => {
        try {
            await signOut({ callbackUrl: "/login" });
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    return (
        <div className="w-full p-4 max-w-4xl mx-auto">
            {/* Email Change Modal */}
            {showEmailChangeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
                        <div className="flex items-center mb-4">
                            <AlertTriangle className="w-8 h-8 text-amber-500 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Email Updated Successfully</h3>
                        </div>
                        
                        <p className="text-gray-600 mb-6">
                            Your email has been changed successfully. For security reasons, you need to sign in again with your new email address to continue using the platform.
                        </p>
                        
                        <div className="flex justify-center">
                            <button
                                onClick={handleOkayAndSignOut}
                                className="px-8 py-3 bg-[#04663A] text-white rounded-lg hover:bg-[#035530] transition-colors font-medium"
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
                        <div className="flex items-center mb-4">
                            <Trash2 className="w-8 h-8 text-red-500 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                        </div>
                        
                        <p className="text-gray-600 mb-4">
                            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter your password to confirm
                            </label>
                            <input
                                type="password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full h-12 px-4 rounded-lg bg-[#F5F5F5] text-[#032303] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeletePassword("");
                                    setError("");
                                }}
                                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? "Deleting..." : "Delete Account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="w-full  mb-8">
                <h1 className="text-black text-3xl font-bold mb-2">Settings</h1>
                <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>

            {/* Messages */}
            {message && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Profile Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row items-start justify-start gap-2 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 bg-gray-200">
                        {session?.user?.image ? (
                            <Image
                                src={session.user.image}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User className="w-8 h-8 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-black">My Profile</h2>
                        <p className="text-gray-600">Update your personal information</p>
                    </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter your first name"
                                className="w-full h-12 px-4 rounded-lg bg-[#F5F5F5] text-[#032303] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter your last name"
                                className="w-full h-12 px-4 rounded-lg bg-[#F5F5F5] text-[#032303] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full h-12 px-4 rounded-lg bg-[#F5F5F5] text-[#032303] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
                        />
                        {email !== originalEmail && (
                            <p className="text-amber-600 text-sm mt-1 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                Changing your email will require you to sign in again
                            </p>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-3 bg-[#04663A] text-white rounded-lg hover:bg-[#035530] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            {isLoading ? "Saving..." : "Save Profile"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-black mb-2">Change Password</h2>
                    <p className="text-gray-600">Update your password to keep your account secure</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter your current password"
                                className="w-full h-12 px-4 pr-12 rounded-lg bg-[#F5F5F5] text-[#032303] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <Eye className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full h-12 px-4 pr-12 rounded-lg bg-[#F5F5F5] text-[#032303] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full h-12 px-4 pr-12 rounded-lg bg-[#F5F5F5] text-[#032303] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-3 bg-[#04663A] text-white rounded-lg hover:bg-[#035530] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            {isLoading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Account Actions Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-black mb-2">Account Actions</h2>
                    <p className="text-gray-600">Manage your account session and data</p>
                </div>

                <div className="space-y-4">
                    {/* Logout Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-medium text-gray-900">Sign Out</h3>
                            <p className="text-sm text-gray-600">Sign out of your account on this device</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>

                    {/* Delete Account Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-medium text-red-900">Delete Account</h3>
                            <p className="text-sm text-red-600">Permanently delete your account and all associated data</p>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center justify-center gap-2 px-6 md:px-2 lg:px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}