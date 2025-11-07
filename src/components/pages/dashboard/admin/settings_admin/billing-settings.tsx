"use client";

import { useEffect, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/redux/hooks";
import { BadgeDollarSign } from "lucide-react";

interface PaymentMethods {
  acceptCreditCards: boolean;
  acceptDebitCards: boolean;
  acceptBkash: boolean;
  acceptNagad: boolean;
  acceptRocket: boolean;
  creditCardNumber?: string;
  debitAccountNumber?: string;
  bkashNumber?: string;
  nagadNumber?: string;
  rocketNumber?: string;
}

export function BillingSettings() {
  const [formData, setFormData] = useState<PaymentMethods>({
    acceptCreditCards: false,
    acceptDebitCards: false,
    acceptBkash: false,
    acceptNagad: false,
    acceptRocket: false,
    creditCardNumber: "",
    debitAccountNumber: "",
    bkashNumber: "",
    nagadNumber: "",
    rocketNumber: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const doctor = useAppSelector((state) => state.auth.user);
  const id = doctor?._id;

  useEffect(() => {
    const fetchData = async () => {
      let response = await fetch(`/api/doctor/${id}`);
      if (!response.ok) {
        return new Response(
          JSON.stringify({
            message: "Failed to load user data",
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      const responsedata = await response.json();
      console.log("🧞‍♂️  responsedata --->", responsedata);
      setFormData(responsedata?.doctordetails?.payment);
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/doctor/billingSetting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save settings");
      }

      alert("Your payment method settings have been updated successfully.");
    } catch (error) {
      console.error("Error saving billing settings:", error);
      alert(
        "Error saving settings. Failed to save your billing settings. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (field: keyof PaymentMethods, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-3">
      <Card className="border border-gray-400">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center mb-0">
            <BadgeDollarSign className="h-6 w-6 mr-2 text-blue-600" />
            Payment Methods
          </CardTitle>
          <CardDescription>
            Manage accepted payment methods for your practice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-[hsl(210,92%,45%)] text-md">
                  Accept Credit Cards
                </Label>
                <p className="text-sm text-muted-foreground text-[hsl(210,92%,45%)]">
                  Visa, MasterCard, American Express
                </p>
              </div>
              <Switch
                checked={formData?.acceptCreditCards}
                onCheckedChange={(checked) => {
                  handleInputChange("acceptCreditCards", checked);
                }}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
              />
            </div>
            <div className="ml-4">
              <Label htmlFor="credit-card-number" className="text-sm">
                Add Your Card Number
              </Label>
              <Input
                id="credit-card-number"
                placeholder="Enter your card number"
                disabled={!formData?.acceptCreditCards}
                className="mt-1 border border-gray-400"
                value={formData?.creditCardNumber}
                onChange={(e) =>
                  handleInputChange("creditCardNumber", e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-cyan-700 text-md">
                  Accept Debit Cards
                </Label>
                <p className="text-sm text-muted-foreground text-cyan-700">
                  PIN and signature debit cards
                </p>
              </div>
              <Switch
                checked={formData?.acceptDebitCards}
                onCheckedChange={(checked) => {
                  handleInputChange("acceptDebitCards", checked);
                }}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
              />
            </div>
            <div className="ml-4">
              <Label htmlFor="debit-card-number" className="text-sm">
                Add Your Account Number
              </Label>
              <Input
                id="debit-card-number"
                placeholder="Enter your account number"
                disabled={!formData?.acceptDebitCards}
                className="mt-1 border border-gray-400"
                value={formData?.debitAccountNumber}
                onChange={(e) =>
                  handleInputChange("debitAccountNumber", e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">
                Mobile Banking Payments
              </Label>
              <p className="text-sm text-muted-foreground">
                Configure individual mobile banking services
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[hsl(334,84%,48%)] text-md">
                    Accept bKash
                  </Label>
                  <p className="text-sm text-muted-foreground text-[hsl(334,84%,48%)]">
                    bKash mobile banking payments
                  </p>
                </div>
                <Switch
                  checked={formData?.acceptBkash}
                  onCheckedChange={(checked) => {
                    handleInputChange("acceptBkash", checked);
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
                />
              </div>
              <div className="ml-4">
                <Label htmlFor="bkash-number" className="text-sm">
                  bKash Merchant Number
                </Label>
                <Input
                  id="bkash-number"
                  placeholder="Enter your bKash merchant number"
                  disabled={!formData?.acceptBkash}
                  className="mt-1 border border-gray-400"
                  value={formData?.bkashNumber}
                  onChange={(e) =>
                    handleInputChange("bkashNumber", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[hsl(5,65%,49%)] text-md">
                    Accept Nagad
                  </Label>
                  <p className="text-sm text-muted-foreground text-[hsl(5,65%,49%)]">
                    Nagad mobile banking payments
                  </p>
                </div>
                <Switch
                  checked={formData?.acceptNagad}
                  onCheckedChange={(checked) => {
                    handleInputChange("acceptNagad", checked);
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
                />
              </div>
              <div className="ml-4">
                <Label htmlFor="nagad-number" className="text-sm">
                  Nagad Merchant Number
                </Label>
                <Input
                  id="nagad-number"
                  placeholder="Enter your Nagad merchant number"
                  disabled={!formData?.acceptNagad}
                  className="mt-1 border border-gray-400"
                  value={formData?.nagadNumber}
                  onChange={(e) =>
                    handleInputChange("nagadNumber", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[hsl(296,62%,36%)] text-md">
                    Accept Rocket
                  </Label>
                  <p className="text-sm text-muted-foreground text-[hsl(296,62%,36%)]">
                    Rocket mobile banking payments
                  </p>
                </div>
                <Switch
                  checked={formData?.acceptRocket}
                  onCheckedChange={(checked) => {
                    handleInputChange("acceptRocket", checked);
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
                />
              </div>
              <div className="ml-4">
                <Label htmlFor="rocket-number" className="text-sm ">
                  Rocket Merchant Number
                </Label>
                <Input
                  id="rocket-number"
                  placeholder="Enter your Rocket merchant number"
                  disabled={!formData?.acceptRocket}
                  className="mt-1 border border-gray-400"
                  value={formData?.rocketNumber}
                  onChange={(e) =>
                    handleInputChange("rocketNumber", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
