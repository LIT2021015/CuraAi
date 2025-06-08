import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { authOptions } from "@/lib/auth";
import {prisma} from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { hospitalId, bloodGroup, units } = body;

    if (!hospitalId || !bloodGroup) {
        
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const request = await prisma.bloodRequest.create({
      data: {
        userId: user.id,
        hospitalId,
        bloodGroup,
        units: units || 1, // default to 1 unit if not provided
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, request }, { status: 201 });

  } catch (error) {
    console.error('[BLOOD_REQUEST_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
