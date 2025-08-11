import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/NavBar";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Safari Ride Car Hire ",
  description: "Where the journey begins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <Navbar />
        <div>
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                className:
                  "bg-green-400 text-white px-4 py-2 rounded shadow-lg font-medium",
              },
              error: {
                className:
                  "bg-red-600 text-white px-4 py-2 rounded shadow-lg font-medium",
              },
              loading: {
                className:
                  "bg-yellow-500 text-white px-4 py-2 rounded shadow-lg font-medium",
              },
            }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
