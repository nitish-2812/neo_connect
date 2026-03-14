import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "sonner";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "NeoConnect — Staff Feedback & Complaint Management",
  description: "A transparent, accountable platform for staff feedback, complaint management, and organizational improvement.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${outfit.variable} antialiased font-sans flex flex-col min-h-screen selection:bg-primary/30 selection:text-white`}>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
