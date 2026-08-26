import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Nanda Studio OS
        </h1>

        <p className="mt-3 text-gray-600">
          Wedding Photography Management System
        </p>

        <div className="mt-8 grid gap-4">
          <Link
            href="/quotation"
            className="rounded-lg bg-black p-4 text-center text-white"
          >
            Create New Quotation
          </Link>

          <Link href="/projects" className="rounded-lg border p-4 text-center">
            Wedding Projects
          </Link>

          <button className="border p-4 rounded-lg">
            Team Workflow
          </button>
        </div>
      </div>
    </main>
  );
}
