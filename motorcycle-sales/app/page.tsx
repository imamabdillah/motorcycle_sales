import PurchaseForm from "@/components/PurchaseForm";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">
        Purchase Your Dream Motorcycle
      </h2>
      <PurchaseForm />
    </div>
  );
}
