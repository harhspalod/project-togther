import { db } from './db';
import { campaigns, triggeredDiscounts, orders, orderItems, customers } from './db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

export interface CampaignTriggerResult {
  triggered: boolean;
  campaignId?: number;
  discountAmount?: number;
  couponCode?: string;
}

export async function checkCampaignTriggers(orderId: number): Promise<CampaignTriggerResult[]> {
  const results: CampaignTriggerResult[] = [];

  // Get order details
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      orderItems: {
        with: {
          product: true,
        },
      },
      customer: true,
    },
  });

  if (!order) return results;

  // Get active campaigns
  const activeCampaigns = await db.query.campaigns.findMany({
    where: and(
      eq(campaigns.isActive, true),
      or(
        eq(campaigns.startDate, null),
        lte(campaigns.startDate, new Date())
      ),
      or(
        eq(campaigns.endDate, null),
        gte(campaigns.endDate, new Date())
      )
    ),
  });

  for (const campaign of activeCampaigns) {
    let triggered = false;
    let discountAmount = 0;

    // Check quantity-based triggers
    if (campaign.conditionType === 'quantity') {
      const totalQuantity = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      if (totalQuantity >= Number(campaign.conditionValue)) {
        triggered = true;
        discountAmount = campaign.discountType === 'percentage' 
          ? Number(order.subtotal) * (Number(campaign.discountValue) / 100)
          : Number(campaign.discountValue);
      }
    }

    // Check amount-based triggers
    if (campaign.conditionType === 'amount') {
      if (Number(order.subtotal) >= Number(campaign.conditionValue)) {
        triggered = true;
        discountAmount = campaign.discountType === 'percentage'
          ? Number(order.subtotal) * (Number(campaign.discountValue) / 100)
          : Number(campaign.discountValue);
      }
    }

    if (triggered) {
      // Generate unique coupon code
      const couponCode = `${campaign.couponCode || 'DISCOUNT'}-${Date.now()}`;

      // Save triggered discount
      await db.insert(triggeredDiscounts).values({
        customerId: order.customerId!,
        campaignId: campaign.id,
        orderId: order.id,
        couponCode,
        discountAmount: discountAmount.toString(),
        status: 'pending',
      });

      results.push({
        triggered: true,
        campaignId: campaign.id,
        discountAmount,
        couponCode,
      });

      // Here you would trigger notifications (email, SMS, etc.)
      console.log(`Campaign triggered for customer ${order.customer?.email}: ${couponCode}`);
    }
  }

  return results;
}

export async function generateCouponCode(prefix: string = 'SAVE'): Promise<string> {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${random}`.toUpperCase();
}