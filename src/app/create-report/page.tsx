"use client";

import { useState } from "react";

import { collection, addDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function CreateReportPage() {

  const [studentName, setStudentName] = useState("");
  const [marks, setMarks] = useState("");

  // SAVE FUNCTION
  const handleSave = async () => {

    try {

      await addDoc(collection(db, "reports"), {
        studentName,
        marks,
        createdAt: new Date(),
      });

      alert("Report saved successfully!");

      // Clear form after save
      setStudentName("");
      setMarks("");

    } catch (error) {

      console.log(error);

      alert("Error saving report");
    }
  };

  return (
    <main className="p-10 flex justify-center">

      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-xl">

        <h1 className="text-3xl font-bold mb-6">
          Create Report
        </h1>

        {/* STUDENT NAME INPUT */}
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          className="w-full border p-3 rounded-lg mb-4"
          onChange={(e) => setStudentName(e.target.value)}
        />

        {/* MARKS INPUT */}
        <input
          type="text"
          placeholder="Marks"
          value={marks}
          className="w-full border p-3 rounded-lg mb-6"
          onChange={(e) => setMarks(e.target.value)}
        />

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
        >
          Save Report
        </button>

      </div>

    </main>
  );
}