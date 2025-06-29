import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campaigns } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { z } from 'zod';
import { generateCouponCode } from '@/lib/campaign-engine';

const createCampaignSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.string(),
  conditionType: z.enum(['quantity', 'amount']),
  conditionValue: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');

    const offset = (page - 1) * perPage;

    const allCampaigns = await db.query.campaigns.findMany({
      orderBy: [desc(campaigns.createdAt)],
      limit: perPage,
      offset,
    });

    // Get total count for pagination
    const totalCount = await db.$count(campaigns);
    const totalPages = Math.ceil(totalCount / perPage);

    return NextResponse.json({
      data: allCampaigns,
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
    console.error('Get campaigns error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createCampaignSchema.parse(body);

    // Generate unique coupon code
    const couponCode = await generateCouponCode();

    const newCampaign = await db.insert(campaigns).values({
      ...data,
      couponCode,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    }).returning();

    return NextResponse.json(newCampaign[0], { status: 201 });
  } catch (error) {
    console.error('Create campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}