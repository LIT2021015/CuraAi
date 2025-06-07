import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, recipient, location, message } = body;

  if (!name || !recipient || !location || !message) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const { latitude, longitude, mapLink } = location;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: '🚨 SOS Alert - Emergency Help Needed',
      html: `
        <h2>🚨 Emergency Alert</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Location:</strong> ${latitude}, ${longitude}</p>
        <p><a href="${mapLink}" target="_blank">📍 View on Google Maps</a></p>
      `,
    });

    return NextResponse.json({ message: 'SOS sent successfully' });
  } catch (error: any) {
    console.error('Email error:', error.message);
    return NextResponse.json({ message: 'Failed to send SOS' }, { status: 500 });
  }
}
