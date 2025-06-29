import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, customers } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { checkCampaignTriggers } from '@/lib/campaign-engine';

const createOrderSchema = z.object({
  customerId: z.number(),
  paymentMethod: z.string(),
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number(),
    price: z.string(),
  })),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');

    const offset = (page - 1) * perPage;

    const allOrders = await db.query.orders.findMany({
      with: {
        customer: true,
        orderItems: {
          with: {
            product: true,
          },
        },
      },
      orderBy: [desc(orders.createdAt)],
      limit: perPage,
      offset,
    });

    // Get total count for pagination
    const totalCount = await db.$count(orders);
    const totalPages = Math.ceil(totalCount / perPage);

    return NextResponse.json({
      data: allOrders,
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
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createOrderSchema.parse(body);

    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => 
      sum + (parseFloat(item.price) * item.quantity), 0
    );

    // Generate invoice number
    const invoiceNo = `INV-${Date.now()}`;

    // Create order
    const newOrder = await db.insert(orders).values({
      customerId: data.customerId,
      invoiceNo,
      paymentMethod: data.paymentMethod,
      subtotal: subtotal.toString(),
      total: subtotal.toString(),
      status: 'pending',
    }).returning();

    const orderId = newOrder[0].id;

    // Create order items
    for (const item of data.items) {
      await db.insert(orderItems).values({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: (parseFloat(item.price) * item.quantity).toString(),
      });
    }

    // Update customer stats
    await db.update(customers)
      .set({
        totalOrders: sql`${customers.totalOrders} + 1`,
        totalSpent: sql`${customers.totalSpent} + ${subtotal}`,
      })
      .where(eq(customers.id, data.customerId));

    // Check for campaign triggers
    const triggers = await checkCampaignTriggers(orderId);

    return NextResponse.json({
      order: newOrder[0],
      campaignTriggers: triggers,
    }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}