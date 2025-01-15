"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ReportData = {
  purchaseDetails: {
    buyer_name: string;
    purchase_date: string;
    motorcycle_name: string;
  };
  installments: Array<{
    installment_no: number;
    amount: string;
    due_date: string;
  }>;
};

export default function ReportPage({ purchaseId }: { purchaseId: number }) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/purchase/${purchaseId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch report data");
        }
        const data = await response.json();
        setReportData(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch report data",
          variant: "destructive",
        });
      }
    };

    if (purchaseId) fetchReportData();
  }, [purchaseId, toast]);

  if (!reportData) return <div>Loading report...</div>;

  const { purchaseDetails, installments } = reportData;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Purchase Report</h1>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Pembeli</TableHead>
              <TableHead>Tanggal Beli</TableHead>
              <TableHead>Motorcycle</TableHead>
              {/* Dinamis: Menambahkan kolom angsuran berdasarkan data installments */}
              {installments.map((installment, index) => (
                <TableHead key={index}>
                  Angsuran {installment.installment_no}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{purchaseDetails.buyer_name}</TableCell>
              <TableCell>
                {new Date(purchaseDetails.purchase_date).toLocaleDateString(
                  "id-ID"
                )}
              </TableCell>
              <TableCell>{purchaseDetails.motorcycle_name}</TableCell>
              {/* Dinamis: Menampilkan angsuran berdasarkan jumlah installments */}
              {installments.map((installment, index) => (
                <TableCell key={index}>
                  Rp {Number(installment.amount).toLocaleString("id-ID")}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Button onClick={() => router.push("/")} className="w-1/4">
        Back to Home
      </Button>
    </div>
  );
}
