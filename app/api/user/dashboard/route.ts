import { NextRequest,NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret });

  if (!token || !token.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: token.email },
      select: {
        id: true,
        name: true,
        email: true,
        bloodGroup: true,
        age: true,
        gender: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }


    const [appointments, bloodRequests, bloodVolunteers] = await Promise.all([
      prisma.consultation.findMany({
        where: { userId: user.id },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
            },
          },
          hospital: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
        },
        orderBy: { dateTime: 'desc' },
      }),

      prisma.bloodRequest.findMany({
        where: { userId: user.id },
        include: {
          fulfilledBy: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),

      prisma.volunteer.findMany({
        where: { userId: user.id },
        include: {
          hospital: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
        },
        orderBy: { registeredAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      user,
      appointments,
      bloodRequests,
      bloodVolunteers,
    });
  } catch (error) {
    console.error('Error fetching user dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
