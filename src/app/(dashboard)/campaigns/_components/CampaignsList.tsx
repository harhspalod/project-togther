"use client";

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function CampaignsList() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await fetch('/api/campaigns');
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Active Campaigns</h3>
      {campaigns?.data?.map((campaign: any) => (
        <Card key={campaign.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{campaign.title}</CardTitle>
              <Badge variant={campaign.isActive ? "success" : "secondary"}>
                {campaign.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <CardDescription>{campaign.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Discount:</span>{" "}
                {campaign.discountType === 'percentage' 
                  ? `${campaign.discountValue}%` 
                  : `$${campaign.discountValue}`}
              </div>
              <div>
                <span className="font-medium">Condition:</span>{" "}
                {campaign.conditionType === 'quantity' 
                  ? `${campaign.conditionValue} items` 
                  : `$${campaign.conditionValue} spent`}
              </div>
              <div>
                <span className="font-medium">Coupon Code:</span>{" "}
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {campaign.couponCode}
                </code>
              </div>
              <div>
                <span className="font-medium">Created:</span>{" "}
                {format(new Date(campaign.createdAt), 'MMM dd, yyyy')}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}