export default function DashboardPage() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">
            Total PDFs
          </h2>

          <p className="text-3xl font-bold">
            0
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">
            Templates
          </h2>

          <p className="text-3xl font-bold">
            0
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">
            Downloads
          </h2>

          <p className="text-3xl font-bold">
            0
          </p>
        </div>

      </div>
    </main>
  );
}