"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function TriggeredDiscountsList() {
  const queryClient = useQueryClient();

  const { data: triggers, isLoading } = useQuery({
    queryKey: ['triggered-discounts'],
    queryFn: async () => {
      const response = await fetch('/api/triggered-discounts');
      if (!response.ok) throw new Error('Failed to fetch triggered discounts');
      return response.json();
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/triggered-discounts?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['triggered-discounts'] });
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
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
      {triggers?.data?.map((trigger: any) => (
        <Card key={trigger.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {trigger.campaign.title}
              </CardTitle>
              <Badge 
                variant={
                  trigger.status === 'pending' ? 'warning' :
                  trigger.status === 'contacted' ? 'processing' :
                  'success'
                }
              >
                {trigger.status}
              </Badge>
            </div>
            <CardDescription>
              Triggered for {trigger.customer.name} ({trigger.customer.email})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <span className="font-medium">Customer:</span><br />
                {trigger.customer.name}<br />
                <span className="text-muted-foreground">{trigger.customer.phone}</span>
              </div>
              <div>
                <span className="font-medium">Discount:</span><br />
                ${trigger.discountAmount}
              </div>
              <div>
                <span className="font-medium">Coupon Code:</span><br />
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {trigger.couponCode}
                </code>
              </div>
              <div>
                <span className="font-medium">Triggered:</span><br />
                {format(new Date(trigger.triggeredAt), 'MMM dd, yyyy HH:mm')}
              </div>
            </div>

            {trigger.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => updateStatus.mutate({ id: trigger.id, status: 'contacted' })}
                  disabled={updateStatus.isPending}
                >
                  Mark as Contacted
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus.mutate({ id: trigger.id, status: 'used' })}
                  disabled={updateStatus.isPending}
                >
                  Mark as Used
                </Button>
              </div>
            )}

            {trigger.status === 'contacted' && (
              <Button
                size="sm"
                onClick={() => updateStatus.mutate({ id: trigger.id, status: 'used' })}
                disabled={updateStatus.isPending}
              >
                Mark as Used
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      {triggers?.data?.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No triggered discounts yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create campaigns and process orders to see triggered discounts here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}