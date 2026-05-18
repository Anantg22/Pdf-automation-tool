"use client";

import jsPDF from "jspdf";

export default function GeneratePdfPage() {

  const generatePDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.text("Student Report", 20, 20);

    doc.setFontSize(16);

    doc.text("Student Name: Anant", 20, 40);

    doc.text("Marks: 85", 20, 55);

    doc.text("Grade: A", 20, 70);

    doc.save("student-report.pdf");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">

      <div className="bg-white p-10 rounded-2xl shadow-lg text-center">

        <h1 className="text-4xl font-bold mb-6">
          PDF Generator
        </h1>

        <button
          onClick={generatePDF}
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Generate PDF
        </button>

      </div>

    </main>
  );
}