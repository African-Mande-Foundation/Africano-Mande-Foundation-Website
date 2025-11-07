// app/membership/volunteer/requirements/page.tsx
"use client";

import { CheckCircle, FileText, Clock, Users, GraduationCap, Heart } from "lucide-react";
import Link from "next/link";

export default function VolunteerRequirements() {
  const requirements = [
    {
      title: "Age Requirement",
      description: "Must be 18 years or older",
      icon: <Users className="w-6 h-6" />,
      details: "All volunteers must be at least 18 years of age to participate in our programs."
    },
    {
      title: "Educational Background",
      description: "Minimum high school education or equivalent",
      icon: <GraduationCap className="w-6 h-6" />,
      details: "A basic educational foundation helps ensure effective communication and task completion."
    },
    {
      title: "Time Commitment",
      description: "Minimum 3 months availability",
      icon: <Clock className="w-6 h-6" />,
      details: "Projects require consistent participation for meaningful impact. We ask for a minimum 3-month commitment."
    },
    {
      title: "Passion for Service",
      description: "Genuine desire to help communities",
      icon: <Heart className="w-6 h-6" />,
      details: "We look for individuals who are passionate about making a positive difference in African communities."
    }
  ];

  const documents = [
    {
      name: "Recommendation Letter",
      description: "From a professional, academic, or community reference",
      required: true
    },
    {
      name: "CV/Resume",
      description: "Current curriculum vitae or resume",
      required: true
    },
    {
      name: "Identification Document",
      description: "Government-issued ID or passport copy",
      required: true
    },
    {
      name: "Passport Photo",
      description: "Recent passport-size photograph",
      required: true
    },
    {
      name: "Application Form",
      description: "Completed volunteer application form",
      required: true
    }
  ];

  return (
    <div className="w-full p-4 max-w-6xl mx-auto text-gray-600">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Volunteer Requirements
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Before applying to become a volunteer, please review the requirements below to ensure 
          you meet our criteria and understand what&apos;s expected.
        </p>
      </div>

      {/* Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {requirements.map((req, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#04663A]">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                <div className="text-green-600">
                  {req.icon}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{req.title}</h3>
                <p className="text-[#04663A] font-semibold mb-2">{req.description}</p>
                <p className="text-gray-600 text-sm">{req.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Required Documents */}
      <div className="bg-gray-50 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Required Documents</h2>
        <p className="text-gray-600 text-center mb-8">
          Please prepare the following documents before starting your application. All documents should be 
          in PDF, JPEG, or PNG format and not exceed 5MB each.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <FileText className="w-5 h-5 text-[#04663A]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  {doc.required && (
                    <span className="inline-flex items-center mt-2 text-xs font-medium text-red-600">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1"></span>
                      Required
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
        <h3 className="text-lg font-bold text-blue-900 mb-3">Additional Information</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>All applications are reviewed within 2-3 weeks of submission</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Background checks may be required for certain positions</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Training will be provided for selected volunteers</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Volunteers receive certificates of service upon completion</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="text-center">
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/membership/volunteer">
            <button className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transform transition-all duration-300 hover:scale-105">
              Back to Volunteer Page
            </button>
          </Link>
          <Link href="/membership/volunteer/apply">
            <button className="bg-[#04663A] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#032303] transform transition-all duration-300 hover:scale-105">
              Proceed to Application
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}