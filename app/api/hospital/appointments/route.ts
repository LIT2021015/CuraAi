// /app/api/hospital/appointments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

// GET all consultations for logged-in hospital
export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hospital = await prisma.hospital.findUnique({
    where: { email: token.email },
    select: { id: true },
  });

  if (!hospital) {
    return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
  }

  const appointments = await prisma.consultation.findMany({
    where: { hospitalId: hospital.id },
    include: {
      user: { select: { name: true, email: true } },
      doctor: { select: { name: true, specialization: true } },
    },
    orderBy: { dateTime: "asc" },
  });

  return NextResponse.json(appointments);
}
