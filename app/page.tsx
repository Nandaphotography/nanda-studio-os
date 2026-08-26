import Link from "next/link";
import { BrandMark } from "./components/brand-mark";
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <BrandMark className="text-gray-800" />

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
