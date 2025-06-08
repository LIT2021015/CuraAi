import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id: hospitalId} = await params

  try {
    const doctors = await prisma.doctor.findMany({
      where: { hospitalId },
    });

    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { message: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}
