/* eslint-disable  */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Upload,
  Send,
} from "lucide-react";
import Link from "next/link";

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface ApplicationData {

  // Documents
  recommendationLetter: File | null;
  cv: File | null;
  identificationDocument: File | null;
  passportPhoto: File | null;
  applicationForm: File | null;
}

export default function VolunteerApplication() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('editform') === 'true';

  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    
    recommendationLetter: null,
    cv: null,
    identificationDocument: null,
    passportPhoto: null,
    applicationForm: null
  });
  const [formUrl, setFormUrl] = useState<string | null>(null);

  const sections = [
    { title: "Personal Details", icon: <User className="w-5 h-5" />, fields: 10 },
    { title: "Education Background", icon: <GraduationCap className="w-5 h-5" />, fields: 2 },
    { title: "Employment Background", icon: <Briefcase className="w-5 h-5" />, fields: 1 },
    { title: "Application Questions", icon: <FileText className="w-5 h-5" />, fields: 11 },
    { title: "Document Upload", icon: <Upload className="w-5 h-5" />, fields: 5 },
  ];

  // Fetch user data from your API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return;

      try {
        console.log('Fetching user data...');
        const response = await fetch('/api/user');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Check different possible response structures
        const user = data.user || data || {};
        console.log('User object:', user);
        
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const email = user.email || session.user?.email || '';

        console.log('Extracted values:', { firstName, lastName, email });

        setUserData({
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          email,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback: at least set email from session
        setUserData({
          firstName: undefined,
          lastName: undefined,
          email: session?.user?.email || undefined,
        });
      }
    };

    fetchUserData();
  }, [session]);

  // Load existing application or draft
  useEffect(() => {
    if (isEdit) {
      loadExistingApplication();
    } else {
      // Load draft if available
      loadDraft();
    }
  }, [isEdit]);

  const loadExistingApplication = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/volunteer/application');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.application) {
          setApplicationData(data.application);
        }
      }
    } catch (error) {
      console.error("Error loading application:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDraft = async () => {
    try {
      const response = await fetch('/api/volunteer/application/draft');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.draft) {
          // Load all the form data
          const { currentSection, ...formData } = data.draft;
          
          // Set the application data (excluding currentSection)
          setApplicationData(prev => ({
            ...prev,
            ...formData
          }));
          
          // Restore the section the user was on
          if (currentSection !== undefined && currentSection >= 0) {
            setCurrentSection(currentSection);
          }
          
          console.log("Draft loaded successfully");
        }
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  };

  // Add function to clear draft after successful submission
  const clearDraft = async () => {
    try {
      await fetch('/api/volunteer/application/draft', {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  };

  const saveAsDraft = async () => {
    try {
      setSavingDraft(true);
      
      const formData = new FormData();
      
      // Add all text fields from the application form only
      Object.entries(applicationData).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          formData.append(key, value);
        }
      });

      // Add files if they exist
      if (applicationData.recommendationLetter) {
        formData.append('recommendationLetter', applicationData.recommendationLetter);
      }
      if (applicationData.cv) {
        formData.append('cv', applicationData.cv);
      }
      if (applicationData.identificationDocument) {
        formData.append('identificationDocument', applicationData.identificationDocument);
      }
      if (applicationData.passportPhoto) {
        formData.append('passportPhoto', applicationData.passportPhoto);
      }

      if (applicationData.applicationForm) {
        formData.append('applicationForm', applicationData.applicationForm);
      }

      // Add current section for resume later
      formData.append('currentSection', currentSection.toString());
      
      const response = await fetch('/api/volunteer/application/draft', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Show success message briefly
        alert('Draft saved successfully!');
      } else {
        alert('Error saving draft: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft. Please try again.');
    } finally {
      setSavingDraft(false);
    }
  };

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!isEdit) { // Only auto-save for new applications
      const autoSaveInterval = setInterval(() => {
        // Check if there's any data to save
        const hasData = Object.values(applicationData).some(value => {
          if (typeof value === 'string') {
            return value.trim() !== '';
          }
          return value !== null;
        });

        if (hasData && !loading && !savingDraft) {
          console.log('Auto-saving draft...');
          saveAsDraft();
        }
      }, 300000); // 30 seconds

      return () => clearInterval(autoSaveInterval);
    }
  }, [applicationData, isEdit, loading]);

  

  const handleFileChange = (field: keyof ApplicationData, file: File | null) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  

 

  const getFullName = (): string => {
    const firstName = userData.firstName || '';
    const lastName = userData.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    }
    
    return 'Not available';
  };

  const submitApplication = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      
      // Add all text fields from the application form only
      Object.entries(applicationData).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          formData.append(key, value);
        }
      });

      // Add files
      if (applicationData.recommendationLetter) {
        formData.append('recommendationLetter', applicationData.recommendationLetter);
      }
      if (applicationData.cv) {
        formData.append('cv', applicationData.cv);
      }
      if (applicationData.identificationDocument) {
        formData.append('identificationDocument', applicationData.identificationDocument);
      }
      if (applicationData.passportPhoto) {
        formData.append('passportPhoto', applicationData.passportPhoto);
      }
      if (applicationData.applicationForm) {
        formData.append('applicationForm', applicationData.applicationForm);
      }

      const endpoint = isEdit ? '/api/volunteer/application/update' : '/api/volunteer/application/submit';
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method: method,
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Clear the draft after successful submission
        await clearDraft();
        
        alert(isEdit ? 'Application updated successfully!' : 'Application submitted successfully!');
        router.push('/membership/volunteer');
      } else {
        alert('Error submitting application: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch the application form document from Strapi
    async function fetchForm() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/volunteer-application-forms?populate=document`);
        const data = await res.json();
        // Strapi v4: data.data[0].attributes.document.data.attributes.url
        const doc = data?.data?.[0]?.document?.url;

        console.log("Strapi form fetch:", doc);

        if (doc) {
          setFormUrl(doc.startsWith("http") ? doc : `${process.env.NEXT_PUBLIC_STRAPI_URL}${doc}`);
          console.log("Resolved form URL:", doc.startsWith("http") ? doc : `${process.env.NEXT_PUBLIC_STRAPI_URL}${doc}`);
        }
      } catch (err) {
        console.error("Failed to fetch application form:", err);
      }
    }
    fetchForm();
  }, []);

  if (!session) {
    return (
      <div className="w-full p-4 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to apply</h1>
        <p className="text-gray-600">You need to be logged in to submit a volunteer application.</p>
      </div>
    );
  }

  if (loading && isEdit) {
    return (
      <div className="w-full p-4 max-w-4xl mx-auto text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  };



  const renderDocumentsSection = () => (
    <div className="space-y-6 text-gray-700">

        

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Document Requirements</h3>
        <p className="text-sm text-blue-800">
          Please attach a clear copy of documents or photos required. All files should be in PDF, JPEG, or PNG format and not exceed 5MB each.
        </p>
      </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Applicant Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-700">Full Name</p>
            <p className="font-medium text-blue-900">{getFullName()}</p>
          </div>
          <div>
            <p className="text-sm text-blue-700">Email Address</p>
            <p className="font-medium text-blue-900">{userData.email || session?.user?.email || 'Not available'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recommendation letter *
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('recommendationLetter', e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">From a professional, academic, or community reference</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Curriculum-Vitae (CV) *
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('cv', e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Current curriculum vitae or resume</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passport/ID *
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('identificationDocument', e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Government-issued ID or passport copy</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passport Photo *
          </label>
          <input
            type="file"
            id="passportPhoto"
            name="passportPhoto"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.webp" // Accept common image formats
            onChange={(e) => handleFileChange('passportPhoto', e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
            required
          />
          {applicationData.passportPhoto && (
            <div className="file-info">
              <span className="file-name">
                Selected: {applicationData.passportPhoto.name}
              </span>
              <span className="file-size">
                ({(applicationData.passportPhoto.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">Recent passport-size photograph</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Application Form *
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('applicationForm', e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Upload your fully filled application form.</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="consent"
            className="w-4 h-4 text-[#04663A] border-gray-300 rounded focus:ring-[#04663A] mt-1"
            required
          />
          <label htmlFor="consent" className="text-sm text-gray-700">
            By submitting this application, I confirm the accuracy of my information and consent to its processing for volunteer evaluation.
          </label>
        </div>
      </div>
    </div>
  );

  const getCurrentSectionContent = () => {
    switch (currentSection) {
      case 4:
        return renderDocumentsSection();
      default:
        return renderDocumentsSection();
    }
  };

  return (
    <div className="w-full p-4 max-w-4xl mx-auto text-gray-700">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {isEdit ? 'Edit Volunteer Application' : 'Volunteer Application'}
        </h1>
        <p className="text-gray-600">
          {isEdit ? 'Update your volunteer application details' : 'Complete all fields to submit your volunteer application'}
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center w-full mb-5 ">
            <Link href="/membership/volunteer">
                <button className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transform transition-all duration-300 hover:scale-105 cursor-pointer">
                Back to Volunteer Page
                </button>
            </Link>

            {formUrl ? (
              <a
                href={formUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transform transition-all duration-300 hover:scale-105 ml-4"
              >
                Download Application Form
              </a>
            ) : (
              <button
                className="bg-gray-400 text-white font-bold py-3 px-6 rounded-lg cursor-not-allowed ml-4"
                disabled
              >
                Download Application Form
              </button>
            )}
        </div>

      {/* Current Section Content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-[#04663A] text-white p-2 rounded-lg">
            {sections[currentSection].icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {sections[currentSection].title}
          </h2>
        </div>
        
        {getCurrentSectionContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        

        
          <button
            onClick={submitApplication}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-[#04663A] text-white hover:bg-[#032303] cursor-pointer"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>{isEdit ? 'Update Application' : 'Submit Application'}</span>
              </>
            )}
          </button>
        
      </div>

     

      
    </div>
  );
}