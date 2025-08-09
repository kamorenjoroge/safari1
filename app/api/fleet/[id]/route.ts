// app/api/fleet/[id]/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Car } from '@/models/cars';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id } = await context.params; // ✅ await params in Next.js 15

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid car ID' },
        { status: 400 }
      );
    }

    const car = await Car.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'categories',
          localField: 'type',
          foreignField: '_id',
          as: 'type'
        }
      },
      { $unwind: '$type' },
      {
        $project: {
          model: 1,
          image: 1,
          schedule: 1,
          'type.description': 1,
          'type.priceFrom': 1,
          'type.features': 1
        }
      }
    ]);

    if (!car.length) {
      return NextResponse.json(
        { success: false, error: 'Car not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: car[0] });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
