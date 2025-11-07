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
  ChevronRight,
  ChevronLeft,
  Save,
  Send,
  CheckCircle
} from "lucide-react";

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface ApplicationData {
  // Personal Details (removed fullName and email)
  birthDate: string;
  countryOfOrigin: string;
  addressOfOrigin: string;
  currentAddress: string;
  phoneNumber: string;
  nextOfKin: string;
  kinRelationship: string;
  kinCurrentAddress: string;
  kinPhoneNumber: string;
  otherPersonalDetails: string;

  // Education
  educationBackground: string;
  otherEducationDetails: string;

  // Employment
  employmentDetails: string;

  // Application Questions
  learningOfOpportunity: string;
  motivationToApply: string;
  knowledgeOfSouthSudan: string;
  knowledgeOfMaridi: string;
  visitedMaridi: string;
  visitedSouthSudan: string;
  purposeOfVisit: string;
  valueToAmf: string;
  valueToCommunity: string;
  projectFocus: string;
  duration: string;

  // Documents
  recommendationLetter: File | null;
  cv: File | null;
  identificationDocument: File | null;
  passportPhoto: File | null;
}

export default function VolunteerApplication() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true';

  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    birthDate: "",
    countryOfOrigin: "",
    addressOfOrigin: "",
    currentAddress: "",
    phoneNumber: "",
    nextOfKin: "",
    kinRelationship: "",
    kinCurrentAddress: "",
    kinPhoneNumber: "",
    otherPersonalDetails: "",
    educationBackground: "",
    otherEducationDetails: "",
    employmentDetails: "",
    learningOfOpportunity: "",
    motivationToApply: "",
    knowledgeOfSouthSudan: "",
    knowledgeOfMaridi: "",
    visitedMaridi: "",
    visitedSouthSudan: "",
    purposeOfVisit: "",
    valueToAmf: "",
    valueToCommunity: "",
    projectFocus: "",
    duration: "",
    recommendationLetter: null,
    cv: null,
    identificationDocument: null,
    passportPhoto: null,
  });

  const sections = [
    { title: "Personal Details", icon: <User className="w-5 h-5" />, fields: 10 },
    { title: "Education Background", icon: <GraduationCap className="w-5 h-5" />, fields: 2 },
    { title: "Employment Background", icon: <Briefcase className="w-5 h-5" />, fields: 1 },
    { title: "Application Questions", icon: <FileText className="w-5 h-5" />, fields: 11 },
    { title: "Document Upload", icon: <Upload className="w-5 h-5" />, fields: 4 },
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
  }, [applicationData, isEdit, loading, savingDraft]);

  const handleInputChange = (field: keyof ApplicationData, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field: keyof ApplicationData, file: File | null) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const validateSection = (sectionIndex: number): boolean => {
    switch (sectionIndex) {
      case 0: // Personal Details
        return !!(
          applicationData.birthDate &&
          applicationData.countryOfOrigin &&
          applicationData.addressOfOrigin &&
          applicationData.currentAddress &&
          applicationData.phoneNumber &&
          applicationData.nextOfKin &&
          applicationData.kinRelationship
        );
      case 1: // Education
        return !!applicationData.educationBackground;
      case 2: // Employment
        return !!applicationData.employmentDetails;
      case 3: // Questions
        return !!(
          applicationData.learningOfOpportunity &&
          applicationData.motivationToApply &&
          applicationData.knowledgeOfSouthSudan &&
          applicationData.knowledgeOfMaridi &&
          applicationData.visitedMaridi &&
          applicationData.visitedSouthSudan &&
          applicationData.valueToAmf &&
          applicationData.valueToCommunity &&
          applicationData.projectFocus &&
          applicationData.duration
        );
      case 4: // Documents
        return !!(
          applicationData.recommendationLetter &&
          applicationData.cv &&
          applicationData.identificationDocument &&
          applicationData.passportPhoto
        );
      default:
        return false;
    }
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
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

  const renderPersonalDetailsSection = () => (
    <div className="space-y-6 text-gray-700">
      {/* User Info Display */}
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Birth Date *
        </label>
        <input
          type="date"
          value={applicationData.birthDate || ""}
          onChange={(e) => handleInputChange('birthDate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={applicationData.countryOfOrigin || ""}
            onChange={(e) => handleInputChange('countryOfOrigin', e.target.value)}
            placeholder="Enter country of origin"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
            required
            />
          
          <input
            type="text"
            value={applicationData.addressOfOrigin || ""}
            onChange={(e) => handleInputChange('addressOfOrigin', e.target.value)}
            placeholder="Enter address of origin in full"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
            required
          />
        </div>
        
        <input
          type="text"
          value={applicationData.currentAddress || ""}
          onChange={(e) => handleInputChange('currentAddress', e.target.value)}
          placeholder="Enter current address in full"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          value={applicationData.phoneNumber || ""}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          placeholder="Enter phone number"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Next of kin Name *
          </label>
          <input
            type="text"
            value={applicationData.nextOfKin || ""}
            onChange={(e) => handleInputChange('nextOfKin', e.target.value)}
            placeholder="Next of kin name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationship to the next of kin *
          </label>
          <input
            type="text"
            value={applicationData.kinRelationship || ""}
            onChange={(e) => handleInputChange('kinRelationship', e.target.value)}
            placeholder="Next of kin relationship"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Address of Next of Kin
        </label>
        <input
          type="text"
          value={applicationData.kinCurrentAddress || ""}
          onChange={(e) => handleInputChange('kinCurrentAddress', e.target.value)}
          placeholder="Current address"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone number of next of kin
        </label>
        <input
          type="tel"
          value={applicationData.kinPhoneNumber || ""}
          onChange={(e) => handleInputChange('kinPhoneNumber', e.target.value)}
          placeholder="Enter Phone Number"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Other Personal Details
        </label>
        <textarea
          value={applicationData.otherPersonalDetails || ""}
          onChange={(e) => handleInputChange('otherPersonalDetails', e.target.value)}
          placeholder="Personal Details"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
        />
      </div>
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-6 text-gray-700">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Education Background *
        </label>
        <textarea
          value={applicationData.educationBackground || ""}
          onChange={(e) => handleInputChange('educationBackground', e.target.value)}
          placeholder="Describe your educational background..."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Other details
        </label>
        <textarea
          value={applicationData.otherEducationDetails || ""}
          onChange={(e) => handleInputChange('otherEducationDetails', e.target.value)}
          placeholder="Any additional educational details..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
        />
      </div>
    </div>
  );

  const renderEmploymentSection = () => (
    <div className="space-y-6 text-gray-700">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Employment Background
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Kindly include each employer details in the following format:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 mb-4 space-y-1">
          <li>Employer Name</li>
          <li>Address of employer</li>
          <li>Contact of the employer</li>
          <li>Position you held</li>
          <li>Year of Employment</li>
        </ul>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employer details *
          </label>
          <textarea
            value={applicationData.employmentDetails || ""}
            onChange={(e) => handleInputChange('employmentDetails', e.target.value)}
            placeholder="Enter employer details following the format above..."
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderQuestionsSection = () => (
    <div className="space-y-6 text-gray-700 ">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How did you learn about the volunteer opportunity? *
        </label>
        <textarea
          value={applicationData.learningOfOpportunity || ""}
          onChange={(e) => handleInputChange('learningOfOpportunity', e.target.value)}
          placeholder="Describe how you learned about this opportunity..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What motivated you to apply for the volunteer opportunity? *
        </label>
        <textarea
          value={applicationData.motivationToApply || ""}
          onChange={(e) => handleInputChange('motivationToApply', e.target.value)}
          placeholder="Share your motivation..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What do you know about the Republic of South Sudan? *
        </label>
        <textarea
          value={applicationData.knowledgeOfSouthSudan || ""}
          onChange={(e) => handleInputChange('knowledgeOfSouthSudan', e.target.value)}
          placeholder="Share your knowledge about South Sudan..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What do you know about Maridi where AMF&apos;s projects are located? *
        </label>
        <textarea
          value={applicationData.knowledgeOfMaridi || ""}
          onChange={(e) => handleInputChange('knowledgeOfMaridi', e.target.value)}
          placeholder="Share your knowledge about Maridi..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          (For South Sudanese) Have you visited Maridi before? *
        </label>
        <select
          value={applicationData.visitedMaridi || ""}
          onChange={(e) => handleInputChange('visitedMaridi', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
          required
        >
          <option value="">Select Yes or No</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="N/A">Not Applicable (Non-South Sudanese)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          (For non-South Sudanese) Have you visited South Sudan before? *
        </label>
        <select
          value={applicationData.visitedSouthSudan || ""}
          onChange={(e) => handleInputChange('visitedSouthSudan', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent"
          required
        >
          <option value="">Select Yes or No</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="N/A">Not Applicable (South Sudanese)</option>
        </select>
      </div>

      {(applicationData.visitedMaridi === 'Yes' || applicationData.visitedSouthSudan === 'Yes') && (
        <div className="text-gray-700">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            If yes, which places did your visit and what was the purpose of your visit? Did your visit include visit to Maridi?
          </label>
          <textarea
            value={applicationData.purposeOfVisit || ""}
            onChange={(e) => handleInputChange('purposeOfVisit', e.target.value)}
            placeholder="Describe your previous visits..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What added value will you bring to AMF&apos;s vision, mission and projects? *
        </label>
        <textarea
          value={applicationData.valueToAmf || ""}
          onChange={(e) => handleInputChange('valueToAmf', e.target.value)}
          placeholder="Describe the value you'll bring to AMF..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What added value will you bring to communities where AMF works? *
        </label>
        <textarea
          value={applicationData.valueToCommunity || ""}
          onChange={(e) => handleInputChange('valueToCommunity', e.target.value)}
          placeholder="Describe the value you'll bring to communities..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Which specific project area (s) do you intend to focus on? *
        </label>
        <textarea
          value={applicationData.projectFocus || ""}
          onChange={(e) => handleInputChange('projectFocus', e.target.value)}
          placeholder="Specify your project focus areas..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What duration do you intend to spend as a volunteer with AMF? *
        </label>
        <textarea
          value={applicationData.duration || ""}
          onChange={(e) => handleInputChange('duration', e.target.value)}
          placeholder="Specify your intended duration..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04663A] focus:border-transparent resize-none"
          required
        />
      </div>
    </div>
  );

  const renderDocumentsSection = () => (
    <div className="space-y-6 text-gray-700">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Document Requirements</h3>
        <p className="text-sm text-blue-800">
          Please attach a clear copy of documents or photos required. All files should be in PDF, JPEG, or PNG format and not exceed 5MB each.
        </p>
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
      case 0:
        return renderPersonalDetailsSection();
      case 1:
        return renderEducationSection();
      case 2:
        return renderEmploymentSection();
      case 3:
        return renderQuestionsSection();
      case 4:
        return renderDocumentsSection();
      default:
        return renderPersonalDetailsSection();
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
          {isEdit ? 'Update your volunteer application details' : 'Complete all sections to submit your volunteer application'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {sections.map((section, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index === currentSection
                    ? 'border-[#04663A] bg-[#04663A] text-white'
                    : index < currentSection
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-white text-gray-500'
                }`}
              >
                {index < currentSection ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>
              {index < sections.length - 1 && (
                <div
                  className={`h-1 w-16 ml-2 ${
                    index < currentSection ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Step {currentSection + 1} of {sections.length}: {sections[currentSection].title}
          </p>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setCurrentSection(index)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                index === currentSection
                  ? 'bg-[#04663A] text-white'
                  : validateSection(index)
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {section.icon}
              <span className="text-sm font-medium">{section.title}</span>
              {validateSection(index) && index !== currentSection && (
                <CheckCircle className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
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
          onClick={prevSection}
          disabled={currentSection === 0}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            currentSection === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        <div className="text-sm text-gray-500">
          {currentSection + 1} of {sections.length}
        </div>

        {currentSection === sections.length - 1 ? (
          <button
            onClick={submitApplication}
            disabled={loading || !validateSection(currentSection)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              loading || !validateSection(currentSection)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#04663A] text-white hover:bg-[#032303]'
            }`}
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
        ) : (
          <button
            onClick={nextSection}
            disabled={!validateSection(currentSection)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              !validateSection(currentSection)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#04663A] text-white hover:bg-[#032303]'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Save Draft Button */}
      <div className="text-center mt-4">
        <button
          onClick={saveAsDraft}
          disabled={savingDraft || loading}
          className={`flex items-center space-x-2 mx-auto font-medium text-sm transition-all duration-200 ${
            savingDraft || loading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-[#04663A] hover:text-[#032303]'
          }`}
        >
          {savingDraft ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#04663A]"></div>
              <span>Saving Draft...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save as Draft</span>
            </>
          )}
        </button>
      </div>

      {/* Auto-save indicator */}
      {!isEdit && (
        <div className="text-center mt-2">
          <p className="text-xs text-gray-500">
            💾 Your progress is automatically saved every 30 seconds
          </p>
        </div>
      )}
    </div>
  );
}