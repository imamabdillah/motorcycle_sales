import ReportPageComponent from "@/components/ReportPage";

export default function ReportPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Laporan Angsuran Bulanan</h1>
      <ReportPageComponent purchaseId={Number(params.id)} />
    </div>
  );
}
