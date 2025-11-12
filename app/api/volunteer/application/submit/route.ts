import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { Session } from 'next-auth';

// Define extended session type
interface ExtendedSession extends Session {
  jwt?: string;
  strapiUserId?: number;
}

// Define Strapi file type
interface StrapiFile {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, unknown>;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// Field mapping: frontend camelCase -> Strapi snake_case
const fieldMapping: Record<string, string> = {
  birthDate: 'birth_date',
  countryOfOrigin: 'country_of_origin',
  addressOfOrigin: 'address_of_origin',
  currentAddress: 'current_address',
  phoneNumber: 'phone_number',
  nextOfKin: 'next_of_kin',
  kinRelationship: 'kin_relationship',
  kinCurrentAddress: 'kin_current_address',
  kinPhoneNumber: 'kin_phone_number',
  kinEmail: 'kin_email',
  otherPersonalDetails: 'other_personal_details',
  educationBackground: 'education',
  otherEducationDetails: 'other_education',
  employmentDetails: 'employment',
  learningOfOpportunity: 'learning_of_opportunity',
  motivationToApply: 'motivation_to_apply',
  knowledgeOfSouthSudan: 'knowledge_of_south_sudan',
  knowledgeOfMaridi: 'knowledge_of_maridi',
  visitedMaridi: 'visited_maridi',
  visitedSouthSudan: 'visited_south_sudan',
  purposeOfVisit: 'purpose_of_visit',
  valueToAmf: 'value_to_amf',
  valueToCommunity: 'value_to_community',
  projectFocus: 'project_focus',
  duration: 'duration'
};

// File field mapping
const fileFieldMapping: Record<string, string> = {
  recommendationLetter: 'recommendation_letter',
  cv: 'cv',
  identificationDocument: 'identification_document',
  passportPhoto: 'passport_photo',
  applicationForm:'application_form'
};

// Helper function to upload ANY file as a regular file (no special image handling)
async function uploadFileToStrapi(file: File, jwt: string): Promise<number | null> {
  try {
    console.log('Attempting to upload file:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    // Check file size
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    if (file.size > maxSize) {
      console.error('File too large:', file.name, 'Size:', file.size, 'Max allowed:', maxSize);
      return null;
    }

    const timestamp = Date.now();
    const extension = file.name.split('.').pop()?.toLowerCase() || 'file';

    // Strategy 1: Upload as binary (we know this will get 500 but file uploads anyway)
    console.log('Strategy 1: Upload as binary - expecting 500 but file will upload');
    
    // Determine prefix based on file type
    let prefix = 'file';
    if (file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      prefix = 'img';
    } else if (['pdf', 'doc', 'docx'].includes(extension)) {
      prefix = 'doc';
    } else if (['txt', 'rtf'].includes(extension)) {
      prefix = 'txt';
    }
    
    const descriptiveName = `${prefix}_${timestamp}.${extension}`;
    const binaryFile = new File([file], descriptiveName, { 
      type: 'application/octet-stream' 
    });
    
    const formData1 = new FormData();
    formData1.append('files', binaryFile);

    let response = await fetch(`${process.env.STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData1,
    });

    console.log('Strategy 1 response status:', response.status);

    if (response.ok) {
      const result = await response.json() as StrapiFile[];
      console.log('Strategy 1 successful:', result[0]?.name, 'ID:', result[0]?.id);
      return result[0]?.id || null;
    }

    // Strategy 2: Check for uploaded file (this is what actually works!)
    console.log('Strategy 2: File uploaded despite 500 error - checking for it');
    
    // Reduced wait time since we know it works
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const recentResponse = await fetch(
        `${process.env.STRAPI_URL}/api/upload/files?sort=createdAt:desc&pagination[limit]=5`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      
      if (recentResponse.ok) {
        const recentFiles = await recentResponse.json() as StrapiFile[];
        const uploadedFile = recentFiles.find((f: StrapiFile) => f.name === descriptiveName);
        
        if (uploadedFile) {
          console.log('Strategy 2 successful - found uploaded file:', uploadedFile.name, 'ID:', uploadedFile.id);
          return uploadedFile.id;
        }
      }
    } catch (checkError) {
      console.log('Could not check recent files:', checkError);
    }

    // Strategy 3: Fallback with .bin extension (just in case)
    console.log('Strategy 3: Fallback with .bin extension');
    
    const binName = `${prefix}_${timestamp}.bin`;
    const binFile = new File([file], binName, { 
      type: 'application/octet-stream' 
    });
    
    const formData3 = new FormData();
    formData3.append('files', binFile);

    response = await fetch(`${process.env.STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData3,
    });

    console.log('Strategy 3 response status:', response.status);

    if (response.ok) {
      const result = await response.json() as StrapiFile[];
      console.log('Strategy 3 successful:', result[0]?.name, 'ID:', result[0]?.id);
      return result[0]?.id || null;
    }

    // Check if .bin upload worked despite error
    if (response.status === 500) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        const recentResponse = await fetch(
          `${process.env.STRAPI_URL}/api/upload/files?sort=createdAt:desc&pagination[limit]=5`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );
        
        if (recentResponse.ok) {
          const recentFiles = await recentResponse.json() as StrapiFile[];
          const uploadedFile = recentFiles.find((f: StrapiFile) => f.name === binName);
          
          if (uploadedFile) {
            console.log('Strategy 3 fallback successful:', uploadedFile.name, 'ID:', uploadedFile.id);
            return uploadedFile.id;
          }
        }
      } catch (e) {
        console.log('Strategy 3 fallback check failed:', e);
      }
    }

    console.log('All upload strategies failed');
    return null;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}

// POST - Submit application
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;
    
    if (!session?.user?.email || !session?.jwt) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Submitting application for email:', session.user.email);
    const userId = parseInt(session.user.id || '0');

    if (!userId) {
      console.log('No user ID found in session');
      return NextResponse.json({ 
        success: false, 
        error: 'User ID not found'
      });
    }

    console.log('Using user ID for application submission:', userId);

    const formData = await request.formData();
    
    // Convert frontend field names to Strapi field names
    const applicationData: Record<string, string | number | boolean | number[]> = {
      users_permissions_user: userId,
    };

    // Handle file uploads first
    const fileUploads: Record<string, File> = {};
    const failedUploads: string[] = [];
    
    // Collect files from form data
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && fileFieldMapping[key] && value.size > 0) {
        fileUploads[key] = value;
      }
    }

    console.log('Files to upload:', Object.keys(fileUploads));

    // Upload files and get their IDs
    for (const [key, file] of Object.entries(fileUploads)) {
      console.log(`Uploading file for ${key}:`, file.name);
      const fileId = await uploadFileToStrapi(file, session.jwt!);
      if (fileId) {
        const strapiFieldName = fileFieldMapping[key];
        applicationData[strapiFieldName] = [fileId]; // Strapi expects array of file IDs
        console.log(`File uploaded successfully for ${key}, ID:`, fileId);
      } else {
        console.log(`Failed to upload file for ${key}`);
        failedUploads.push(key);
      }
    }

    // Check if any required files failed to upload
    if (failedUploads.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Failed to upload required files: ${failedUploads.join(', ')}. Please try again.`
      });
    }

    // Add text fields with proper field name conversion
    for (const [key, value] of formData.entries()) {
      // Skip files as they're handled above
      if (value instanceof File) {
        continue;
      }
      
      if (fieldMapping[key]) {
        const strapiFieldName = fieldMapping[key];
        
        // Handle boolean fields
        if (strapiFieldName === 'visited_maridi' || strapiFieldName === 'visited_south_sudan') {
          applicationData[strapiFieldName] = value === 'true' || value === 'yes';
        } else {
          applicationData[strapiFieldName] = value as string;
        }
      }
    }

    console.log('Application data to submit:', Object.keys(applicationData));

    // Check if user already has a submitted application
    const existingResponse = await fetch(
      `${process.env.STRAPI_URL}/api/volunteer-applications?filters[users_permissions_user][id][$eq]=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${session.jwt}`,
        },
      }
    );

    if (existingResponse.ok) {
      const existingData = await existingResponse.json();
      if (existingData.data && existingData.data.length > 0) {
        return NextResponse.json({ 
          success: false, 
          error: 'You have already submitted a volunteer application. Use the edit option to update it.'
        });
      }
    }

    // Submit new application
    console.log('Creating new application');
    const response = await fetch(
      `${process.env.STRAPI_URL}/api/volunteer-applications`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.jwt}`,
        },
        body: JSON.stringify({ data: applicationData }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error:', response.status, response.statusText, errorText);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to submit application. Please try again.'
      });
    }

    const result = await response.json();
    console.log('Application submission result:', result);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully!',
      id: result.data?.id,
      documentId: result.data?.documentId
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit application. Please try again.'
    });
  }
}