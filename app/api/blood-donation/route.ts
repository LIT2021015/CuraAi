import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hospitalId, userId, name, contact, bloodGroup } = body;

    if (!hospitalId || !userId || !name || !contact || !bloodGroup) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newVolunteer = await prisma.volunteer.create({
      data: {
        hospitalId,
        userId,
        name,
        contact,
        bloodGroup,
        // registeredAt will default to now(), no need to pass here
      },
      include: {
        hospital: true,
        user: true,
      },
    });

    return NextResponse.json({ success: true, volunteer: newVolunteer }, { status: 201 });
  } catch (error) {
    console.error('[BLOOD_DONATION_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
