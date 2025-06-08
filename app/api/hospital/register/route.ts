import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      name,
      location,
      lat,
      lng,
      departments,
      facilities,
      bloodTypes, // string[] like ["A+", "O-", "B+"]
    } = body;

    // Validate required fields
    if (!email || !password || !name || !location || lat === undefined || lng === undefined) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check for duplicate email
    const existing = await prisma.hospital.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Hospital already registered" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create hospital with related blood stocks
    const newHospital = await prisma.hospital.create({
      data: {
        name,
        email,
        password: hashedPassword,
        location,
        lat,
        lng,
        departments,
        facilities,
        bloodTypes: {
          create: bloodTypes.map((group: string) => ({
            bloodGroup: group,
            quantity: 0, // Default quantity
          })),
        },
      },
    });

    return NextResponse.json({
      message: "Registration successful",
      hospitalId: newHospital.id,
    });
  } catch (err) {
    console.error("Error in hospital registration:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
