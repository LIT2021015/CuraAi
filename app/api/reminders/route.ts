import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, time, recurring } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const reminder = await prisma.reminder.create({
    data: {
      userId: user.id,
      message,
      time, // store as "23:00" string for recurring, or full ISO for one-time
      recurring: recurring ?? true, // default to true if not sent
    },
  });

  return NextResponse.json(reminder);
}
