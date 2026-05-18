"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import jsPDF from "jspdf";

// REPORT TYPE
interface Report {
  id: string;
  studentName: string;
  marks: number;
}

export default function ReportsPage() {

  // REPORT STATE
  const [reports, setReports] = useState<Report[]>([]);

  // FETCH REPORTS
  useEffect(() => {

    const fetchReports = async () => {

      try {

        const querySnapshot = await getDocs(
          collection(db, "reports")
        );

        const reportsData: Report[] = [];

        querySnapshot.forEach((doc) => {

          const data = doc.data();

          reportsData.push({
            id: doc.id,
            studentName: data.studentName,
            marks: Number(data.marks),
          });

        });

        setReports(reportsData);

      } catch (error) {

        console.log(
          "Error fetching reports:",
          error
        );
      }
    };

    fetchReports();

  }, []);

  // GENERATE SIMPLE CERTIFICATE PDF (NO IMAGES)
  const generatePDF = (
    report: Report
  ) => {

    try {

      const doc = new jsPDF("landscape");

      // BORDER
      doc.rect(
        10,
        10,
        277,
        190
      );

      // TITLE
      doc.setFontSize(30);

      doc.text(
        "Certificate of Achievement",
        70,
        40
      );

      // SUBTITLE
      doc.setFontSize(20);

      doc.text(
        "This certifies that",
        110,
        80
      );

      // STUDENT NAME
      doc.setFontSize(28);

      doc.text(
        report.studentName,
        105,
        100
      );

      // MARKS
      doc.setFontSize(18);

      doc.text(
        `has successfully scored ${report.marks} marks.`,
        75,
        130
      );

      // SIGNATURE LINE
      doc.line(
        200,
        160,
        260,
        160
      );

      // SIGNATURE TEXT
      doc.setFontSize(14);

      doc.text(
        "Authorized Signature",
        205,
        170
      );

      // DOWNLOAD
      doc.save(
        `${report.studentName}-certificate.pdf`
      );

    } catch (error) {

      console.log(
        "Error generating PDF:",
        error
      );
    }
  };

  return (
    <main className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-4xl font-bold mb-8">
        Reports
      </h1>

      <div className="grid gap-6">

        {reports.map((report) => (

          <div
            key={report.id}
            className="bg-white p-6 rounded-xl shadow"
          >

            <h2 className="text-2xl font-semibold">
              {report.studentName}
            </h2>

            <p className="text-gray-600 mt-2 mb-4">
              Marks: {report.marks}
            </p>

            <button
              onClick={() =>
                generatePDF(report)
              }
              className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Generate Certificate
            </button>

          </div>

        ))}

      </div>

    </main>
  );
}