import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function GET() {
  const now = new Date();
  const currentTimeHHmm = now.toTimeString().slice(0, 5); // "HH:mm"
  console.log(`Running reminder job for time: ${currentTimeHHmm}`);

  const reminders = await prisma.reminder.findMany({
    where: {
      recurring: true,
      time: currentTimeHHmm,
    },
    include: {
      user: true,
    },
  });

  console.log(`Found ${reminders.length} reminders`);

  for (const reminder of reminders) {
    if (reminder.user?.email) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: reminder.user.email,
          subject: `⏰ Daily Reminder: ${reminder.message}`,
          text: `Hello,\n\nIt's time to: ${reminder.message}\n\nHave a nice day!`,
        });

        console.log(`Sent reminder to ${reminder.user.email}`);
      } catch (err) {
        console.error(`Failed to send email to ${reminder.user.email}:`, err);
      }
    }
  }

  return NextResponse.json({
    status: "OK",
    processed: reminders.length,
  });
}
