import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
export function BillingSettings() {
  const [acceptCreditCards, setAcceptCreditCards] = useState(true);
  const [acceptDebitCards, setAcceptDebitCards] = useState(true);
  const [acceptMobileBanking, setAcceptMobileBanking] = useState(true);
  const [acceptBkash, setAcceptBkash] = useState(true);
  const [acceptNagad, setAcceptNagad] = useState(true);
  const [acceptRocket, setAcceptRocket] = useState(true);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage accepted payment methods for your practice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Accept Credit Cards</Label>
                <p className="text-sm text-muted-foreground">
                  Visa, MasterCard, American Express
                </p>
              </div>
              <Switch
                checked={acceptCreditCards}
                onCheckedChange={setAcceptCreditCards}
              />
            </div>
            <div className="ml-4">
              <Label htmlFor="credit-card-number" className="text-sm">
                Add Your Card Number
              </Label>
              <Input
                id="credit-card-number"
                placeholder="Enter your card number"
                disabled={!acceptCreditCards}
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Accept Debit Cards</Label>
                <p className="text-sm text-muted-foreground">
                  PIN and signature debit cards
                </p>
              </div>
              <Switch
                checked={acceptDebitCards}
                onCheckedChange={setAcceptDebitCards}
              />
            </div>
            <div className="ml-4">
              <Label htmlFor="debit-card-number" className="text-sm">
                Add Your Account Number
              </Label>
              <Input
                id="debit-card-number"
                placeholder="Enter your account number"
                disabled={!acceptDebitCards}
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">
                Mobile Banking Payments
              </Label>
              <p className="text-sm text-muted-foreground">
                Configure individual mobile banking services
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Accept bKash</Label>
                  <p className="text-sm text-muted-foreground">
                    bKash mobile banking payments
                  </p>
                </div>
                <Switch
                  checked={acceptBkash}
                  onCheckedChange={setAcceptBkash}
                />
              </div>
              <div className="ml-4">
                <Label htmlFor="bkash-number" className="text-sm">
                  bKash Merchant Number
                </Label>
                <Input
                  id="bkash-number"
                  placeholder="Enter your bKash merchant number"
                  disabled={!acceptBkash}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Accept Nagad</Label>
                  <p className="text-sm text-muted-foreground">
                    Nagad mobile banking payments
                  </p>
                </div>
                <Switch
                  checked={acceptNagad}
                  onCheckedChange={setAcceptNagad}
                />
              </div>
              <div className="ml-4">
                <Label htmlFor="nagad-number" className="text-sm">
                  Nagad Merchant Number
                </Label>
                <Input
                  id="nagad-number"
                  placeholder="Enter your Nagad merchant number"
                  disabled={!acceptNagad}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Accept Rocket</Label>
                  <p className="text-sm text-muted-foreground">
                    Rocket mobile banking payments
                  </p>
                </div>
                <Switch
                  checked={acceptRocket}
                  onCheckedChange={setAcceptRocket}
                />
              </div>
              <div className="ml-4">
                <Label htmlFor="bkash-number" className="text-sm">
                  Rocket Merchant Number
                </Label>
                <Input
                  id="bkash-number"
                  placeholder="Enter your bKash merchant number"
                  disabled={!acceptRocket}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
