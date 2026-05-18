"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { FiDownload, FiEye } from "react-icons/fi";

interface Student {
  studentName: string;
  marks: string;
}

export default function UploadCsvPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ✅ Store local dataURLs instead of Firebase URLs for PDF generation
  const [logoDataUrl, setLogoDataUrl] = useState<string>("");
  const [templateDataUrl, setTemplateDataUrl] = useState<string>("");

  const [logoUploaded, setLogoUploaded] = useState(false);
  const [templateUploaded, setTemplateUploaded] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // =========================
  // CSV UPLOAD
  // =========================

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    Papa.parse<Student>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validStudents = results.data.filter(
          (s) => s.studentName && s.marks
        );
        setStudents(validStudents);
      },
      error: (err) => {
        setError("Failed to parse CSV file.");
        console.error(err);
      },
    });
  };

  // =========================
  // READ FILE AS DATA URL (local, no CORS issues)
  // =========================

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // =========================
  // FIREBASE UPLOAD (background, for storage only)
  // =========================

  const uploadImageToFirebase = async (file: File, folder: string) => {
    const uniqueFileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `${folder}/${uniqueFileName}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // =========================
  // LOGO UPLOAD — ✅ use local dataURL for PDF, upload to Firebase in background
  // =========================

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      setLoading(true);
      setError("");

      // ✅ Read locally first — used for PDF generation (no CORS)
      const dataUrl = await readFileAsDataUrl(file);
      setLogoDataUrl(dataUrl);
      setLogoUploaded(true);

      // Upload to Firebase in background (don't await blocking the UI)
      uploadImageToFirebase(file, "logos").catch((err) =>
        console.warn("Firebase logo upload failed (non-critical):", err)
      );
    } catch (err) {
      console.error(err);
      setError("Failed to process logo.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // TEMPLATE UPLOAD — same pattern
  // =========================

  const handleTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      setLoading(true);
      setError("");

      const dataUrl = await readFileAsDataUrl(file);
      setTemplateDataUrl(dataUrl);
      setTemplateUploaded(true);

      uploadImageToFirebase(file, "templates").catch((err) =>
        console.warn("Firebase template upload failed (non-critical):", err)
      );
    } catch (err) {
      console.error(err);
      setError("Failed to process template.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD IMAGE — ✅ works with both dataURL and remote URLs
  // =========================

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      // Only set crossOrigin for non-data URLs
      if (!src.startsWith("data:")) {
        img.crossOrigin = "anonymous";
      }
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src.slice(0, 60)}`));
    });
  };

  // =========================
  // CREATE CERTIFICATE PDF
  // =========================

  const createCertificatePDF = async (
    student: Student,
    logoImage?: HTMLImageElement | null,
    templateImage?: HTMLImageElement | null
  ) => {
    const doc = new jsPDF("landscape");

    if (templateImage) {
      doc.addImage(templateImage, "PNG", 0, 0, 297, 210);
    } else {
      doc.rect(10, 10, 277, 190);
    }

    if (logoImage) {
      doc.addImage(logoImage, "PNG", 20, 20, 30, 30);
    }

    doc.setFontSize(30);
    doc.text("Certificate of Achievement", 148, 40, { align: "center" });

    doc.setFontSize(20);
    doc.text("This certifies that", 148, 80, { align: "center" });

    doc.setFontSize(28);
    doc.text(student.studentName, 148, 100, { align: "center" });

    doc.setFontSize(18);
    doc.text(`has successfully scored ${student.marks} marks.`, 148, 130, {
      align: "center",
    });

    doc.line(200, 160, 260, 160);
    doc.setFontSize(14);
    doc.text("Authorized Signature", 230, 170, { align: "center" });

    return doc;
  };

  // =========================
  // PREVIEW PDF
  // =========================

  const previewPDF = async () => {
    try {
      if (students.length === 0) return;
      setLoading(true);
      setError("");

      const logoImage = logoDataUrl ? await loadImage(logoDataUrl) : null;
      const templateImage = templateDataUrl ? await loadImage(templateDataUrl) : null;

      const doc = await createCertificatePDF(students[0], logoImage, templateImage);
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      console.error(err);
      setError("Failed to generate preview.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GENERATE ALL PDFs
  // =========================

  const generateAllCertificates = async () => {
    try {
      if (students.length === 0) return;
      setLoading(true);
      setError("");

      const zip = new JSZip();

      const logoImage = logoDataUrl ? await loadImage(logoDataUrl) : null;
      const templateImage = templateDataUrl ? await loadImage(templateDataUrl) : null;

      for (const student of students) {
        const doc = await createCertificatePDF(student, logoImage, templateImage);
        const pdfBlob = doc.output("blob");
        zip.file(`${student.studentName}-certificate.pdf`, pdfBlob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "all-certificates.zip");
    } catch (err) {
      console.error(err);
      setError("Failed to generate certificates.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-gray-100 p-8 md:p-12">
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-gray-800 mb-3">
          Bulk Certificate Generator
        </h1>
        <p className="text-gray-600 text-lg">
          Upload CSV files, customize certificates, preview PDFs and export ZIP bundles.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block font-semibold mb-3">Upload CSV</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="w-full border p-3 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-semibold mb-3">Upload Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full border p-3 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-semibold mb-3">Upload Template</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleTemplateUpload}
              className="w-full border p-3 rounded-xl"
            />
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-10">
          <button
            onClick={previewPDF}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
          >
            <FiEye />
            Preview Certificate
          </button>
          <button
            onClick={generateAllCertificates}
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-gray-800 transition disabled:opacity-50"
          >
            <FiDownload />
            {loading ? "Generating..." : "Generate All Certificates"}
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-500 mb-2">Total Students</h2>
          <p className="text-4xl font-bold">{students.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-500 mb-2">Logo Status</h2>
          <p className="text-2xl font-semibold">
            {logoUploaded ? "✅ Uploaded" : "Not Uploaded"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-500 mb-2">Template Status</h2>
          <p className="text-2xl font-semibold">
            {templateUploaded ? "✅ Uploaded" : "Default"}
          </p>
        </div>
      </div>

      {previewUrl && (
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">
          <h2 className="text-3xl font-bold mb-6">PDF Preview</h2>
          <iframe src={previewUrl} className="w-full h-[700px] border rounded-2xl" />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {students.map((student, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {student.studentName}
            </h2>
            <p className="text-gray-600 text-lg">Marks: {student.marks}</p>
          </div>
        ))}
      </div>
    </main>
  );
}