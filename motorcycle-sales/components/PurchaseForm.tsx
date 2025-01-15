"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PurchaseForm() {
  const [motorcycles, setMotorcycles] = useState([]);
  const [buyerName, setBuyerName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [selectedMotorcycle, setSelectedMotorcycle] = useState("");
  const [selectedInstallment, setSelectedInstallment] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/motorcycles");

        const data = await response.json();
        setMotorcycles(data);
      } catch (error) {
        console.error("Error fetching motorcycles", error);
      }
    };
    fetchMotorcycles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (
      !buyerName ||
      !purchaseDate ||
      !selectedMotorcycle ||
      !selectedInstallment
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Format purchaseDate to match backend's expected format
    const formattedPurchaseDate = purchaseDate
      ? new Date(purchaseDate).toISOString().slice(0, 19).replace("T", " ")
      : "";

    // Convert selectedInstallment to number
    const installmentPeriod = Number(selectedInstallment);

    const purchaseData = {
      buyerName,
      purchaseDate: formattedPurchaseDate,
      motorcycleType: selectedMotorcycle,
      installmentPeriod,
    };

    try {
      const response = await fetch("http://localhost:3000/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      });

      if (response.ok) {
        toast({
          title: "Purchase Successful",
          description: "Your motorcycle purchase has been recorded.",
        });
        // Reset form fields after successful submission
        setBuyerName("");
        setPurchaseDate("");
        setSelectedMotorcycle("");
        setSelectedInstallment("");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save purchase");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to save purchase. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Motorcycle Purchase Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="buyerName" className="text-sm font-medium">
                Buyer Name
              </label>
              <Input
                id="buyerName"
                type="text"
                placeholder="Enter buyer name"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="purchaseDate" className="text-sm font-medium">
                Purchase Date
              </label>
              <Input
                id="purchaseDate"
                type="datetime-local"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="motorcycleType" className="text-sm font-medium">
                Motorcycle Type
              </label>
              <Select
                value={selectedMotorcycle}
                onValueChange={setSelectedMotorcycle}
              >
                <SelectTrigger id="motorcycleType">
                  <SelectValue placeholder="Select Motorcycle" />
                </SelectTrigger>
                <SelectContent>
                  {motorcycles.map((moto) => (
                    <SelectItem key={moto.name} value={moto.name}>
                      {moto.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="installmentPeriod"
                className="text-sm font-medium"
              >
                Installment Period
              </label>
              <Select
                value={selectedInstallment}
                onValueChange={setSelectedInstallment}
              >
                <SelectTrigger id="installmentPeriod">
                  <SelectValue placeholder="Select Installment Period" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15].map((period) => (
                    <SelectItem key={period} value={period.toString()}>
                      {period} months
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Submit Purchase
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
