import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id: id} = await params
    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: { doctors: true },
    });

    if (!hospital) {
      return new NextResponse('Hospital not found', { status: 404 });
    }

    return NextResponse.json(hospital);
  } catch (error) {
    console.error('[HOSPITAL_DETAILS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
