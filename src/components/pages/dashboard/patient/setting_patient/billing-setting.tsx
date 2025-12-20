"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/redux/hooks";

interface CardMethodSchema {
  cardholderName: string;
  type: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  isPrimary: boolean;
}

interface MobileBankingMethodSchema {
  provider: string;
  mobileNumber: string;
  accountName: string;
  isPrimary: boolean;
}

interface PaymentMethods {
  cardMethods: CardMethodSchema[];
  mobileBankingMethods: MobileBankingMethodSchema[];
}

export default function BillingSettings() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>({
    cardMethods: [],
    mobileBankingMethods: [],
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [paymentMethodType, setPaymentMethodType] = useState<
    "card" | "mobile-banking"
  >("card");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState<"VISA" | "MASTERCARD" | "AMEX">(
    "VISA"
  );
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [mobileProvider, setMobileProvider] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const doctor = useAppSelector((state) => state.auth.user);
  const id = doctor?._id;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/user/${id}`);
        const responsedata = await response.json();
        if (responsedata?.userdetails?.payment) {
          console.log("payment method=>", responsedata?.userdetails?.payment);
          setPaymentMethods(responsedata?.userdetails?.payment);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddPaymentMethod = async () => {
    if (paymentMethodType === "card") {
      if (
        !cardNumber ||
        !expiryMonth ||
        !expiryYear ||
        !cvv ||
        !cardholderName
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all card fields",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!mobileProvider || !mobileNumber || !accountName) {
        toast({
          title: "Validation Error",
          description: "Please fill in all mobile banking fields",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const hasExistingMethods =
        paymentMethods.cardMethods.length > 0 ||
        paymentMethods.mobileBankingMethods.length > 0;

      const paymentData = {
        methodType: paymentMethodType,
        isPrimary: !hasExistingMethods,
        ...(paymentMethodType === "card"
          ? {
              cardholderName,
              type: cardType,
              cardNumber,
              expiryMonth,
              expiryYear,
              cvv,
            }
          : {
              provider: mobileProvider,
              mobileNumber,
              accountName,
            }),
      };

      const response = await fetch("/api/user/billingSetting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentData, id }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to add payment method");
      }

      if (paymentMethodType === "card") {
        const newCardMethod: CardMethodSchema = {
          cardholderName,
          type: cardType,
          cardNumber,
          expiryMonth,
          expiryYear,
          cvv,
          isPrimary: !hasExistingMethods,
        };
        setPaymentMethods({
          ...paymentMethods,
          cardMethods: [...paymentMethods.cardMethods, newCardMethod],
        });
      } else {
        const newMobileBankingMethod: MobileBankingMethodSchema = {
          provider: mobileProvider,
          mobileNumber,
          accountName,
          isPrimary: !hasExistingMethods,
        };
        setPaymentMethods({
          ...paymentMethods,
          mobileBankingMethods: [
            ...paymentMethods.mobileBankingMethods,
            newMobileBankingMethod,
          ],
        });
      }

      if (paymentMethodType === "card") {
        setCardNumber("");
        setExpiryMonth("");
        setExpiryYear("");
        setCvv("");
        setCardholderName("");
      } else {
        setMobileProvider("");
        setMobileNumber("");
        setAccountName("");
      }

      toast({
        title: "Success",
        description: "Payment method added successfully",
      });

      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add payment method",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsLoading(true);
    }
  };

  const handleSetPrimary = async (index: number, methodType: string) => {
    console.log("🧞‍♂️  index --->", index, methodType);
    try {
      const method =
        methodType === "card"
          ? paymentMethods.cardMethods[index]
          : paymentMethods.mobileBankingMethods[index];
      console.log("🧞‍♂️  method --->", method);

      const response = await fetch("/api/user/setPrimaryAsBilling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          methodType,
          identifier:
            methodType === "card" ? method?.cardNumber : method?.mobileNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to set primary payment method"
        );
      }

      // Update local state after successful API call
      setPaymentMethods({
        cardMethods: paymentMethods.cardMethods.map((m, i) => ({
          ...m,
          isPrimary: methodType === "card" ? i === index : false,
        })),
        mobileBankingMethods: paymentMethods.mobileBankingMethods.map(
          (m, i) => ({
            ...m,
            isPrimary: methodType === "mobile-banking" ? i === index : false,
          })
        ),
      });

      toast({
        title: "Success",
        description: "Primary payment method updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update primary payment method",
        variant: "destructive",
      });
    }
  };

  const handleRemovePaymentMethod = (
    index: number,
    methodType: "card" | "mobile-banking"
  ) => {
    const totalMethods =
      paymentMethods.cardMethods.length +
      paymentMethods.mobileBankingMethods.length;

    if (totalMethods <= 1) {
      alert("You must have at least one payment method");
      return;
    }

    if (methodType === "card") {
      const methodToRemove = paymentMethods.cardMethods[index];
      if (methodToRemove.isPrimary) {
        alert(
          "Please set another payment method as primary before removing this one"
        );
        return;
      }
      setPaymentMethods({
        ...paymentMethods,
        cardMethods: paymentMethods.cardMethods.filter((_, i) => i !== index),
      });
    } else {
      const methodToRemove = paymentMethods.mobileBankingMethods[index];
      if (methodToRemove.isPrimary) {
        alert(
          "Please set another payment method as primary before removing this one"
        );
        return;
      }
      setPaymentMethods({
        ...paymentMethods,
        mobileBankingMethods: paymentMethods.mobileBankingMethods.filter(
          (_, i) => i !== index
        ),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background round p-2">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Billing Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your payment methods and view billing history
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Methods</CardTitle>
            <CardDescription>
              Manage your payment methods and billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.cardMethods.map((method, index) => (
              <div key={`card-${index}`} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-auto h-6 px-2 bg-primary rounded flex items-center justify-center">
                      <span className="text-xs text-primary-foreground font-bold">
                        {method.type}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{method.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {method.cardNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row items-center gap-2">
                    {method.isPrimary ? (
                      <Badge>Primary</Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetPrimary(index, "card")}
                      >
                        Set as Primary
                      </Button>
                    )}
                    {paymentMethods.cardMethods.length +
                      paymentMethods.mobileBankingMethods.length >
                      1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePaymentMethod(index, "card")}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {paymentMethods.mobileBankingMethods.map((method, index) => (
              <div key={`mobile-${index}`} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-foreground"
                      >
                        <rect
                          width="14"
                          height="20"
                          x="5"
                          y="2"
                          rx="2"
                          ry="2"
                        />
                        <path d="M12 18h.01" />
                      </svg>
                    </div> */}
                    <div className="w-auto h-6 px-2 bg-primary rounded flex items-center justify-center">
                      <span className="text-xs text-primary-foreground font-bold">
                        {method.provider}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{method.provider}</p>
                      <p className="text-sm text-muted-foreground">
                        {method.mobileNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {method.accountName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isPrimary ? (
                      <Badge>Primary</Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleSetPrimary(index, "mobile-banking")
                        }
                      >
                        Set as Primary
                      </Button>
                    )}
                    {paymentMethods.cardMethods.length +
                      paymentMethods.mobileBankingMethods.length >
                      1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemovePaymentMethod(index, "mobile-banking")
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-transparent hover:text-[hsl(201,72%,39%)]"
                >
                  Add New Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Choose your payment method type and enter the details
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-3">
                    <Label>Payment Method Type</Label>
                    <RadioGroup
                      value={paymentMethodType}
                      onValueChange={(value: any) =>
                        setPaymentMethodType(value)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label
                          htmlFor="card"
                          className="font-normal cursor-pointer"
                        >
                          Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="mobile-banking"
                          id="mobile-banking"
                        />
                        <Label
                          htmlFor="mobile-banking"
                          className="font-normal cursor-pointer"
                        >
                          Mobile Banking
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethodType === "card" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cardholderName">Cardholder Name</Label>
                        <Input
                          id="cardholderName"
                          placeholder="John Doe"
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardType">Card Type</Label>
                        <Select
                          value={cardType}
                          onValueChange={(value: any) => setCardType(value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VISA">Visa</SelectItem>
                            <SelectItem value="MASTERCARD">
                              Mastercard
                            </SelectItem>
                            <SelectItem value="AMEX">
                              American Express
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 16) {
                              setCardNumber(value);
                            }
                          }}
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryMonth">Month</Label>
                          <Input
                            id="expiryMonth"
                            placeholder="MM"
                            value={expiryMonth}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (
                                value.length <= 2 &&
                                Number.parseInt(value) <= 12
                              ) {
                                setExpiryMonth(value);
                              }
                            }}
                            maxLength={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiryYear">Year</Label>
                          <Input
                            id="expiryYear"
                            placeholder="YY"
                            value={expiryYear}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (value.length <= 2) {
                                setExpiryYear(value);
                              }
                            }}
                            maxLength={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (value.length <= 4) {
                                setCvv(value);
                              }
                            }}
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="mobileProvider">
                          Mobile Banking Provider
                        </Label>
                        <Select
                          value={mobileProvider}
                          onValueChange={setMobileProvider}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bKash">bKash</SelectItem>
                            <SelectItem value="Nagad">Nagad</SelectItem>
                            <SelectItem value="Rocket">Rocket</SelectItem>
                            <SelectItem value="Upay">Upay</SelectItem>
                            <SelectItem value="SureCash">SureCash</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Mobile Number</Label>
                        <Input
                          id="mobileNumber"
                          placeholder="01XXXXXXXXX"
                          value={mobileNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 11) {
                              setMobileNumber(value);
                            }
                          }}
                          maxLength={11}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountName">Account Name</Label>
                        <Input
                          id="accountName"
                          placeholder="John Doe"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddPaymentMethod}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Adding..."
                      : paymentMethodType === "card"
                        ? "Add Card"
                        : "Add Mobile Banking"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
