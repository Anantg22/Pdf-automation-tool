import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "CertGen - Bulk Certificate Generation",
  description: "Generate bulk certificates with ease",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[var(--background)]">
      <body className="bg-[var(--background)] text-[var(--foreground)]">
        <div className="flex h-screen overflow-hidden">
          <div className="hidden md:flex w-64 flex-shrink-0">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
