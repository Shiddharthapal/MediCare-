"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BillingSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Methods</CardTitle>
          <CardDescription>
            Manage your payment methods and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-primary rounded flex items-center justify-center">
                  <span className="text-xs text-primary-foreground font-bold">
                    VISA
                  </span>
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/25</p>
                </div>
              </div>
              <Badge>Primary</Badge>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent">
            Add New Payment Method
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Billing History</CardTitle>
          <CardDescription>
            View your recent transactions and invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Consultation - Dr. Smith</p>
                <p className="text-sm text-muted-foreground">March 15, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$150.00</p>
                <Badge variant="secondary">Paid</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Lab Tests</p>
                <p className="text-sm text-muted-foreground">March 10, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$85.00</p>
                <Badge variant="secondary">Paid</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Prescription Refill</p>
                <p className="text-sm text-muted-foreground">March 5, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$25.00</p>
                <Badge variant="secondary">Paid</Badge>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4 bg-transparent">
            View All Transactions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
