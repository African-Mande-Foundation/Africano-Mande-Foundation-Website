import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { Session } from 'next-auth';

// Define extended session type
interface ExtendedSession extends Session {
  jwt?: string;
  strapiUserId?: number;
}

// Field mapping: Strapi snake_case -> frontend camelCase
const reverseFieldMapping: Record<string, string> = {
  birth_date: 'birthDate',
  country_of_origin: 'countryOfOrigin',
  address_of_origin: 'addressOfOrigin',
  current_address: 'currentAddress',
  phone_number: 'phoneNumber',
  next_of_kin: 'nextOfKin',
  kin_relationship: 'kinRelationship',
  kin_current_address: 'kinCurrentAddress',
  kin_phone_number: 'kinPhoneNumber',
  kin_email: 'kinEmail',
  other_personal_details: 'otherPersonalDetails',
  education: 'educationBackground',
  other_education: 'otherEducationDetails',
  employment: 'employmentDetails',
  learning_of_opportunity: 'learningOfOpportunity',
  motivation_to_apply: 'motivationToApply',
  knowledge_of_south_sudan: 'knowledgeOfSouthSudan',
  knowledge_of_maridi: 'knowledgeOfMaridi',
  visited_maridi: 'visitedMaridi',
  visited_south_sudan: 'visitedSouthSudan',
  purpose_of_visit: 'purposeOfVisit',
  value_to_amf: 'valueToAmf',
  value_to_community: 'valueToCommunity',
  project_focus: 'projectFocus',
  duration: 'duration'
};

const reverseFileFieldMapping: Record<string, string> = {
  recommendation_letter: 'recommendationLetter',
  cv: 'cv',
  identification_document: 'identificationDocument',
  passport_photo: 'passportPhoto',
  applicationForm:'application_form'
};

// GET - Load submitted application
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
        application: null,
        message: 'No user ID found - application functionality unavailable'
      });
    }

    console.log('Using user ID:', userId);

    // Fetch submitted application (not draft)
    const response = await fetch(
      `${process.env.STRAPI_URL}/api/volunteer-applications?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
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
        application: null,
        message: 'Application service unavailable'
      });
    }

    const data = await response.json();
    console.log('Application fetch response:', data);
    const application = data.data?.[0];

    if (application) {
      // Convert Strapi snake_case fields back to frontend camelCase
      const convertedData: Record<string, string | number | boolean> = {};
      
      Object.keys(application).forEach(key => {
        // Skip metadata and system fields
        if (key === 'id' || key === 'documentId' || key === 'createdAt' || key === 'updatedAt' || key === 'publishedAt' || key === 'users_permissions_user') {
          return;
        }
        
        // Handle file fields - check if they have data
        if (reverseFileFieldMapping[key]) {
          const camelKey = reverseFileFieldMapping[key];
          if (application[key] && Array.isArray(application[key]) && application[key].length > 0) {
            // Store file info for frontend
            convertedData[camelKey] = application[key][0].name || 'Uploaded file';
            convertedData[`${camelKey}Url`] = application[key][0].url;
            convertedData[`${camelKey}Id`] = application[key][0].id;
          }
          return;
        }
        
        // Only include fields that have values (not null)
        if (application[key] !== null && application[key] !== undefined) {
          const camelKey = reverseFieldMapping[key] || key;
          convertedData[camelKey] = application[key];
        }
      });
      
      console.log('Converted application data:', convertedData);
      
      return NextResponse.json({
        success: true,
        application: convertedData,
        applicationId: application.id,
        documentId: application.documentId
      });
    } else {
      return NextResponse.json({
        success: true,
        application: null
      });
    }
  } catch (error) {
    console.error('Error loading application:', error);
    return NextResponse.json({ 
      success: true, 
      application: null,
      message: 'Application loading failed'
    });
  }
}