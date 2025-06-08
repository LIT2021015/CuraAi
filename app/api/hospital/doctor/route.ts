import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== 'hospital') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const hospitalId = (session.user as any).id;

  const doctors = await prisma.doctor.findMany({
    where: { hospitalId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(doctors);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== 'hospital') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const hospitalId = (session.user as any).id;
  const { name, email, specialization, availableSlots } = await req.json();

  try {
    const doctor = await prisma.doctor.create({
      data: {
        name,
        email,
        specialization,
        availableSlots,
        hospitalId,
      },
    });
    return NextResponse.json(doctor);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}
