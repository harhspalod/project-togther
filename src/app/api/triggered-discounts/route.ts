import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { triggeredDiscounts } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');

    const offset = (page - 1) * perPage;

    const allTriggers = await db.query.triggeredDiscounts.findMany({
      with: {
        customer: true,
        campaign: true,
        order: true,
      },
      orderBy: [desc(triggeredDiscounts.triggeredAt)],
      limit: perPage,
      offset,
    });

    // Get total count for pagination
    const totalCount = await db.$count(triggeredDiscounts);
    const totalPages = Math.ceil(totalCount / perPage);

    return NextResponse.json({
      data: allTriggers,
      pagination: {
        page,
        perPage,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get triggered discounts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch triggered discounts' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    const body = await request.json();
    const { status } = body;

    await db.update(triggeredDiscounts)
      .set({ status })
      .where(eq(triggeredDiscounts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update triggered discount error:', error);
    return NextResponse.json(
      { error: 'Failed to update triggered discount' },
      { status: 500 }
    );
  }
}