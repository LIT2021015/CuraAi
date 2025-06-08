import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hospitals = await prisma.hospital.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
        lat: true,
        lng: true,
      },
    });

    return NextResponse.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
