import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Booking } from '@/models/booking';

// POST: Create new booking
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const booking = await Booking.create(body);

    return NextResponse.json(booking, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create booking';
    console.error('Booking POST error:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// GET: Retrieve all bookings
export async function GET() {
  try {
    await dbConnect();
    const bookings = await Booking.find().populate('carId');
    return NextResponse.json(bookings, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
    console.error('Booking GET error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
