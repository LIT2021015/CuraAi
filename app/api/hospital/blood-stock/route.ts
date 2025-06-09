import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all blood stock entries for the logged-in hospital
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hospital = await prisma.hospital.findUnique({
    where: { email: session.user.email },
    include: { bloodTypes: true },
  });

  if (!hospital) {
    return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
  }

  return NextResponse.json(hospital.bloodTypes);
}

// POST new stock or update existing
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bloodGroup, quantity } = await req.json();

  if (!bloodGroup || typeof quantity !== "number" || quantity < 0) {
    return NextResponse.json({ error: "Invalid blood group or quantity" }, { status: 400 });
  }

  const hospital = await prisma.hospital.findUnique({
    where: { email: session.user.email },
  });

  if (!hospital) {
    return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
  }

  const existing = await prisma.bloodStock.findFirst({
    where: {
      hospitalId: hospital.id,
      bloodGroup,
    },
  });

  const stock = existing
    ? await prisma.bloodStock.update({
        where: { id: existing.id },
        data: { quantity },
      })
    : await prisma.bloodStock.create({
        data: {
          hospitalId: hospital.id,
          bloodGroup,
          quantity,
        },
      });

  return NextResponse.json(stock);
}
