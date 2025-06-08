import { NextRequest, NextResponse } from 'next/server';
import { prisma as db } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret });

  if (!token || !token.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { hospitalId, doctorId, dateTime } = await req.json();

    if (!hospitalId || !doctorId || !dateTime) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: token.email },
    });

    if (!user) {

      console.log(token)
        
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const appointment = await db.consultation.create({
      data: {
        userId: user.id,
        doctorId,
        hospitalId,
        dateTime: dateTime
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error booking appointment:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
