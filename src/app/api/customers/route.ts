import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/lib/db/schema';
import { desc, ilike, or } from 'drizzle-orm';
import { z } from 'zod';

const createCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * perPage;

    let whereCondition;
    if (search) {
      whereCondition = or(
        ilike(customers.name, `%${search}%`),
        ilike(customers.email, `%${search}%`),
        ilike(customers.phone, `%${search}%`)
      );
    }

    const allCustomers = await db.query.customers.findMany({
      where: whereCondition,
      orderBy: [desc(customers.createdAt)],
      limit: perPage,
      offset,
    });

    // Get total count for pagination
    const totalCount = await db.$count(customers, whereCondition);
    const totalPages = Math.ceil(totalCount / perPage);

    return NextResponse.json({
      data: allCustomers,
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
    console.error('Get customers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createCustomerSchema.parse(body);

    const newCustomer = await db.insert(customers).values(data).returning();

    return NextResponse.json(newCustomer[0], { status: 201 });
  } catch (error) {
    console.error('Create customer error:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}