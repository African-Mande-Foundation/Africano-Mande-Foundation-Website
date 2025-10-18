import { flattenStrapiResponse } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "../../../auth/[...nextauth]/authOptions";

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categorySlug: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.jwt) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const  categorySlug  = (await params).categorySlug;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  if (!categorySlug) {
    return NextResponse.json({ message: 'Category slug is required' }, { status: 400 });
  }

  try {
    const strapiRes = await fetch(
      `${process.env.STRAPI_URL}/api/articles?filters[category][slug][$eq]=${categorySlug}&populate[author][populate][0]=avatar&populate[cover]=true&populate[category]=true&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.jwt}`,
        },
      }
    );

    const data = await strapiRes.json();

    if (!strapiRes.ok) {
      return NextResponse.json(
        { message: data.error?.message || 'Failed to fetch articles' },
        { status: strapiRes.status }
      );
    }

    const flattenedData = flattenStrapiResponse(data.data);

    return NextResponse.json({ data: flattenedData, meta: data.meta });
  } catch (error) {
    console.error('Error fetching paginated articles:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}