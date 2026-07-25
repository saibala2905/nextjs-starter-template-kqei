import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="mt-4 text-slate-600">
        Welcome to the KSP AI Platform.
      </p>
    </DashboardLayout>
  );
}