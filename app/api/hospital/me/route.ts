
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token || !token.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const hospital = await prisma.hospital.findUnique({
      where: { email: token.email },
    });

    if (!hospital) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    }

    return NextResponse.json({ hospital });
  } catch (error) {
    console.error("Error fetching hospital data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
