"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Users, Heart, CheckCircle, Clock, XCircle, FileText, ArrowRight, Mail, Phone } from "lucide-react";
import Link from "next/link";
import Contact from "@/app/components/Contact";

interface VolunteerApplication {
  id: number;
  state: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export default function Volunteer() {
  const { data: session } = useSession();
  const [application, setApplication] = useState<VolunteerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [userRole, setUserRole] = useState<string>('authenticated');

  useEffect(() => {
    if (session?.user) {
      fetchApplicationStatus();
      fetchUserRole();
    }
  }, [session]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch('/api/user/role');
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role || 'authenticated');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('authenticated');
    }
  };

  const fetchApplicationStatus = async () => {
    try {
      const response = await fetch('/api/volunteer/application-status');
      console.log('Application status response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Application status data:', data);
        
        if (data.application) {
          // Treat empty/null state as "pending"
          const normalizedApplication = {
            ...data.application,
            state: data.application.state || "pending"
          };
          console.log('Setting application:', normalizedApplication);
          setApplication(normalizedApplication);
        } else {
          console.log('No application found for user');
          setApplication(null);
        }
      } else {
        console.error('Failed to fetch application status:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching application status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="w-full p-4 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access volunteer opportunities</h1>
        <p className="text-gray-600">You need to be logged in to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full p-4 max-w-4xl mx-auto text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Volunteer Role - Welcome and Portal Access
  if (userRole === 'Volunteer') {
    return (
      <div className="w-full p-4 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <Heart className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome, Volunteer! 🎉
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Thank you for being part of our mission to create positive change in African communities. 
            Your dedication and service make a real difference in the lives of those we serve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Your Impact</h3>
            </div>
            <p className="text-gray-600 mb-4">
              As a registered volunteer, you have access to exclusive opportunities and resources 
              to maximize your contribution to our foundation&apos;s mission.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Portal Access</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Access your volunteer portal to view assignments, track your progress, 
              and connect with other volunteers and supervisors.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/volunteer">
            <button className="bg-[#04663A] text-white font-bold py-4 px-8 rounded-lg hover:bg-[#032303] transform transition-all duration-300 hover:scale-105 flex items-center mx-auto">
              <span className="mr-3">Access Volunteer Portal</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Authenticated Role with Application States
  if (userRole === 'Authenticated') {
    // No Application - Show Registration Invitation
    if (!application) {
      return (
        <div className="w-full p-4 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <Users className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Become a Volunteer
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Join our mission to create lasting change in African communities. Your skills, 
              passion, and dedication can help us build a better future for those in need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Make an Impact</h3>
              <p className="text-gray-600">
                Contribute directly to education, healthcare, and community development projects.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Join a Community</h3>
              <p className="text-gray-600">
                Connect with like-minded individuals working towards positive change.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Grow Your Skills</h3>
              <p className="text-gray-600">
                Develop new abilities while contributing to meaningful causes.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ready to Get Started?</h2>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/membership/volunteer/requirements">
                <button className="bg-[#04663A] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#032303] transform transition-all duration-300 hover:scale-105 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  View Requirements
                </button>
              </Link>
              <Link href="/membership/volunteer/apply">
                <button className="bg-[#dfefd2] text-[#032303] font-bold py-3 px-6 rounded-lg hover:bg-[#032303] hover:text-white transform transition-all duration-300 hover:scale-105 flex items-center">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Apply Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Has Application - Show Status
    const getStatusIcon = (state: string) => {
      // Normalize state - treat empty/null as pending
      const normalizedState = state || "pending";
      switch (normalizedState) {
        case 'pending':
          return <Clock className="w-8 h-8 text-yellow-600" />;
        case 'approved':
          return <CheckCircle className="w-8 h-8 text-green-600" />;
        case 'rejected':
          return <XCircle className="w-8 h-8 text-red-600" />;
        default:
          return <Clock className="w-8 h-8 text-gray-600" />;
      }
    };

    const getStatusColor = (state: string) => {
      // Normalize state - treat empty/null as pending
      const normalizedState = state || "pending";
      switch (normalizedState) {
        case 'pending':
          return 'bg-yellow-100 border-yellow-500';
        case 'approved':
          return 'bg-green-100 border-green-500';
        case 'rejected':
          return 'bg-red-100 border-red-500';
        default:
          return 'bg-yellow-100 border-yellow-500'; // Default to pending style
      }
    };

    const getStatusMessage = (state: string) => {
      // Normalize state - treat empty/null as pending
      const normalizedState = state || "pending";
      switch (normalizedState) {
        case 'pending':
          return {
            title: 'Application Under Review',
            message: 'Your volunteer application has been submitted and is currently being reviewed by our team. We will notify you once a decision has been made.',
            canEdit: true
          };
        case 'approved':
          return {
            title: 'Application Approved! 🎉',
            message: 'Congratulations! Your volunteer application has been approved. You will receive further instructions via email.',
            canEdit: false
          };
        case 'rejected':
          return {
            title: 'Application Not Approved',
            message: 'Unfortunately, your volunteer application was not approved at this time. Please contact us for more information or to discuss future opportunities.',
            canEdit: false
          };
        default:
          return {
            title: 'Application Under Review',
            message: 'Your volunteer application has been submitted and is currently being reviewed by our team. We will notify you once a decision has been made.',
            canEdit: true
          };
      }
    };

    // Normalize the application state before using it
    const normalizedState = application?.state || "pending";
    const statusInfo = getStatusMessage(normalizedState);

    return (
      <div className="w-full p-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Volunteer Application Status
          </h1>
        </div>

        <div className={`bg-white rounded-lg shadow-md p-8 border-l-4 ${getStatusColor(normalizedState)} mb-8`}>
          <div className="flex items-center justify-center mb-6">
            <div className={`p-4 rounded-full ${getStatusColor(normalizedState).replace('border-', 'bg-').replace('-500', '-100')}`}>
              {getStatusIcon(normalizedState)}
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{statusInfo.title}</h2>
            <p className="text-gray-600 text-lg">{statusInfo.message}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Application Submitted</p>
              <p className="font-semibold">{new Date(application.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-semibold">{new Date(application.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {statusInfo.canEdit && (
              <Link href="/membership/volunteer/apply?edit=true">
                <button className="bg-[#04663A] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#032303] transform transition-all duration-300 hover:scale-105 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Edit Application
                </button>
              </Link>
            )}

            {normalizedState === 'rejected' && (
              <>
                <button
                  onClick={() => setShowContact(true)}
                  className="bg-[#dfefd2] text-[#032303] font-bold py-3 px-6 rounded-lg hover:bg-[#032303] hover:text-white transform transition-all duration-300 hover:scale-105 flex items-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Us
                </button>
                <a
                  href="mailto:africanomandefoundation18@gmail.com"
                  className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-105 flex items-center"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Support
                </a>
              </>
            )}
          </div>
        </div>

        {normalizedState === 'rejected' && (
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">Need More Information?</h3>
            <p className="text-blue-800 mb-4">
              If you have questions about your application or would like to understand how you can improve 
              for future opportunities, please don&apos;t hesitate to reach out to us.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center text-blue-800">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">africanomandefoundation18@gmail.com</span>
              </div>
              <div className="flex items-center text-blue-800">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">Contact form available on main site</span>
              </div>
            </div>
          </div>
        )}

        <Contact showContactModal={showContact} setShowContactModal={setShowContact} />
      </div>
    );
  }

  // Fallback for unknown roles
  return (
    <div className="w-full p-4 max-w-4xl mx-auto text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
      <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
    </div>
  );
}