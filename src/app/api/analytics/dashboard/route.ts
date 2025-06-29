import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, customers, products, triggeredDiscounts } from '@/lib/db/schema';
import { sql, gte, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Get current date and 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Total customers
    const totalCustomers = await db.$count(customers);

    // Total orders
    const totalOrders = await db.$count(orders);

    // Total revenue
    const revenueResult = await db
      .select({ total: sql<number>`sum(${orders.total})` })
      .from(orders);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Active campaigns (triggered discounts in last 30 days)
    const activeCampaigns = await db.$count(
      triggeredDiscounts,
      gte(triggeredDiscounts.triggeredAt, thirtyDaysAgo)
    );

    // Recent orders for chart
    const recentOrders = await db
      .select({
        date: sql<string>`date(${orders.createdAt})`,
        count: sql<number>`count(*)`,
        revenue: sql<number>`sum(${orders.total})`,
      })
      .from(orders)
      .where(gte(orders.createdAt, thirtyDaysAgo))
      .groupBy(sql`date(${orders.createdAt})`)
      .orderBy(sql`date(${orders.createdAt})`);

    // Top selling products
    const topProducts = await db
      .select({
        productId: products.id,
        productName: products.name,
        totalSold: sql<number>`sum(order_items.quantity)`,
        revenue: sql<number>`sum(order_items.total)`,
      })
      .from(products)
      .leftJoin(orderItems, eq(products.id, orderItems.productId))
      .groupBy(products.id, products.name)
      .orderBy(desc(sql`sum(order_items.quantity)`))
      .limit(5);

    // Order status distribution
    const orderStatusStats = await db
      .select({
        status: orders.status,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .groupBy(orders.status);

    return NextResponse.json({
      summary: {
        totalCustomers,
        totalOrders,
        totalRevenue,
        activeCampaigns,
      },
      charts: {
        recentOrders,
        topProducts,
        orderStatusStats,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}