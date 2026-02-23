import type { Metadata } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "Jamie's 2026 Shifts",
  description: "Jamie's 2026 shift rota",
  icons: {
    icon: "/shift-calendar-icon.jpg",
    apple: "/shift-calendar-icon.jpg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
