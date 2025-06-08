import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    

const {id: hospitalId} = await params

    if (!hospitalId) {
      return NextResponse.json({ error: 'Invalid hospital ID' }, { status: 400 });
    }

    const bloodGroupParam = req.nextUrl.searchParams.get('group');
    const bloodGroup = bloodGroupParam ? bloodGroupParam.toUpperCase() : undefined;

    const whereClause: {
      hospitalId: string;
      bloodGroup?: string;
    } = { hospitalId };

    if (bloodGroup) {
      whereClause.bloodGroup = bloodGroup;
    }

    const stock = await prisma.bloodStock.findMany({
      where: whereClause,
      select: {
        bloodGroup: true,
        quantity: true,
      },
    });

    return NextResponse.json({ stock });
  } catch (error) {
    console.error('GET /api/hospital/[id]/blood-stock error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}