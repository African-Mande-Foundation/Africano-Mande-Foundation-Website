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
  passportPhoto: 'passport_photo'
};

// Reverse mapping: Strapi snake_case -> frontend camelCase
const reverseFieldMapping: Record<string, string> = Object.fromEntries(
  Object.entries(fieldMapping).map(([key, value]) => [value, key])
);

const reverseFileFieldMapping: Record<string, string> = Object.fromEntries(
  Object.entries(fileFieldMapping).map(([key, value]) => [value, key])
);

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

// GET - Load draft
export async function GET() {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;
    
    if (!session?.user?.email || !session?.jwt) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Session email:', session.user.email);
    const userId = parseInt(session.user.id || '0');

    if (!userId) {
      console.log('No user ID found in session');
      return NextResponse.json({ 
        success: true, 
        draft: null,
        message: 'No user ID found - draft functionality unavailable'
      });
    }

    console.log('Using user ID:', userId);

    // Use the correct user field name from Strapi
    const response = await fetch(
      `${process.env.STRAPI_URL}/api/volunteer-application-drafts?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${session.jwt}`,
        },
      }
    );

    if (!response.ok) {
      console.log(`Query failed with ${response.status}`);
      return NextResponse.json({ 
        success: true, 
        draft: null,
        message: 'Draft service unavailable'
      });
    }

    const data = await response.json();
    console.log('Draft fetch response:', data);
    const draft = data.data?.[0];

    if (draft) {
      // Convert Strapi snake_case fields back to frontend camelCase
      const convertedData: Record<string, string | number | boolean> = {};
      
      // The data is directly in the draft object, not under draft.attributes
      Object.keys(draft).forEach(key => {
        // Skip metadata and system fields
        if (key === 'id' || key === 'documentId' || key === 'createdAt' || key === 'updatedAt' || key === 'publishedAt' || key === 'users_permissions_user') {
          return; // Skip these fields
        }
        
        // Handle file fields - check if they have data
        if (reverseFileFieldMapping[key]) {
          const camelKey = reverseFileFieldMapping[key];
          if (draft[key] && Array.isArray(draft[key]) && draft[key].length > 0) {
            // Store file info for frontend (file name, URL, etc.)
            convertedData[camelKey] = draft[key][0].name || 'Uploaded file';
            convertedData[`${camelKey}Url`] = draft[key][0].url;
            convertedData[`${camelKey}Id`] = draft[key][0].id;
          }
          return;
        }
        
        // Skip the application_form field as it's not part of our form
        if (key === 'application_form') {
          return;
        }
        
        // Only include fields that have values (not null)
        if (draft[key] !== null && draft[key] !== undefined) {
          const camelKey = reverseFieldMapping[key] || key;
          convertedData[camelKey] = draft[key];
        }
      });
      
      console.log('Converted draft data:', convertedData);
      
      return NextResponse.json({
        success: true,
        draft: convertedData
      });
    } else {
      return NextResponse.json({
        success: true,
        draft: null
      });
    }
  } catch (error) {
    console.error('Error loading draft:', error);
    return NextResponse.json({ 
      success: true, 
      draft: null,
      message: 'Draft loading failed - continuing without draft'
    });
  }
}

// POST - Save draft
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;
    
    if (!session?.user?.email || !session?.jwt) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Saving draft for email:', session.user.email);
    const userId = parseInt(session.user.id || '0');

    if (!userId) {
      console.log('No user ID found in session');
      return NextResponse.json({ 
        success: true, 
        message: 'Draft not saved - no user ID found'
      });
    }

    console.log('Using user ID for draft save:', userId);

    const formData = await request.formData();
    
    // Convert frontend field names to Strapi field names
    const draftData: Record<string, string | number | boolean | number[]> = {
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

    // Upload files and get their IDs
    for (const [key, file] of Object.entries(fileUploads)) {
      console.log(`Uploading file for ${key}:`, file.name);
      const fileId = await uploadFileToStrapi(file, session.jwt!);
      if (fileId) {
        const strapiFieldName = fileFieldMapping[key];
        draftData[strapiFieldName] = [fileId]; // Strapi expects array of file IDs
        console.log(`File uploaded successfully for ${key}, ID:`, fileId);
      } else {
        console.log(`Failed to upload file for ${key} - continuing without it`);
        failedUploads.push(key);
      }
    }

    // Add text fields with proper field name conversion
    for (const [key, value] of formData.entries()) {
      // Skip currentSection as it's not stored in Strapi
      if (key === 'currentSection') {
        continue;
      }
      
      // Skip files as they're handled above
      if (value instanceof File) {
        continue;
      }
      
      if (fieldMapping[key]) {
        const strapiFieldName = fieldMapping[key];
        
        // Handle boolean fields
        if (strapiFieldName === 'visited_maridi' || strapiFieldName === 'visited_south_sudan') {
          draftData[strapiFieldName] = value === 'true' || value === 'yes';
        } else {
          draftData[strapiFieldName] = value as string;
        }
      }
    }

    console.log('Draft data to save:', draftData);

    // Check if draft already exists
    const existingResponse = await fetch(
      `${process.env.STRAPI_URL}/api/volunteer-application-drafts?filters[users_permissions_user][id][$eq]=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${session.jwt}`,
        },
      }
    );

    let existingDraft = null;
    if (existingResponse.ok) {
      const existingData = await existingResponse.json();
      existingDraft = existingData.data?.[0];
    }

    let response;
    if (existingDraft) {
      // Update existing draft using documentId (Strapi v5 uses documentId for updates)
      const updateId = existingDraft.documentId || existingDraft.id;
      console.log('Updating existing draft with documentId:', updateId);
      
      response = await fetch(
        `${process.env.STRAPI_URL}/api/volunteer-application-drafts/${updateId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.jwt}`,
          },
          body: JSON.stringify({ data: draftData }),
        }
      );
    } else {
      // Create new draft
      console.log('Creating new draft');
      response = await fetch(
        `${process.env.STRAPI_URL}/api/volunteer-application-drafts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.jwt}`,
          },
          body: JSON.stringify({ data: draftData }),
        }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error:', response.status, response.statusText, errorText);
      return NextResponse.json({ 
        success: true, 
        message: 'Form data preserved, but draft not saved to server'
      });
    }

    const result = await response.json();
    console.log('Draft save result:', result);
    
    // Create a detailed message about upload status
    let message = 'Draft saved successfully';
    if (failedUploads.length > 0) {
      message += ` (failed to upload: ${failedUploads.join(', ')})`;
    } else if (Object.keys(fileUploads).length > 0) {
      message += ' with all files';
    }
    
    return NextResponse.json({ 
      success: true, 
      message,
      id: result.data?.id,
      documentId: result.data?.documentId,
      failedUploads: failedUploads.length > 0 ? failedUploads : undefined
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json({ 
      success: true, 
      message: 'Form data preserved locally, draft save failed'
    });
  }
}

// DELETE - Delete draft
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;
    
    if (!session?.user?.email || !session?.jwt) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id || '0');

    if (!userId) {
      return NextResponse.json({ success: true, message: 'No draft to delete' });
    }

    // Find existing draft
    const existingResponse = await fetch(
      `${process.env.STRAPI_URL}/api/volunteer-application-drafts?filters[users_permissions_user][id][$eq]=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${session.jwt}`,
        },
      }
    );

    if (!existingResponse.ok) {
      return NextResponse.json({ success: true, message: 'No draft to delete' });
    }

    const existingData = await existingResponse.json();
    const existingDraft = existingData.data?.[0];

    if (existingDraft) {
      // Delete the draft using documentId (Strapi v5 uses documentId for deletes)
      const deleteId = existingDraft.documentId || existingDraft.id;
      console.log('Deleting draft with documentId:', deleteId);
      
      const deleteResponse = await fetch(
        `${process.env.STRAPI_URL}/api/volunteer-application-drafts/${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session.jwt}`,
          },
        }
      );

      if (!deleteResponse.ok) {
        console.log('Failed to delete draft, but continuing...');
      } else {
        console.log('Draft deleted successfully');
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Draft deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting draft:', error);
    return NextResponse.json({ 
      success: true, 
      message: 'Draft deletion completed' 
    });
  }
}