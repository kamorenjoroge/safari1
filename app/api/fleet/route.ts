// app/api/fleet/[id]route.ts
import { NextResponse } from 'next/server';
import { Car } from '@/models/cars';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    await dbConnect();

    const groupedCars = await Car.aggregate([
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
          registrationNumber: 0, // hide this field 
          'type.description': 0,
          'type.image': 0,
          'type.priceFrom': 0,
          'type.features': 0,
          'type.popular': 0,
          'type.createdAt': 0,
          'type.updatedAt': 0,
          'type.__v': 0
        }
      },
      {
        $group: {
          _id: '$type.title',
          cars: { $push: '$$ROOT' }
        }
      },
    
    ]);

    return NextResponse.json({ success: true, data: groupedCars });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
