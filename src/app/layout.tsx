import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import ConditionalMobileMenu from "@/components/ConditionalMobileMenu";
import { ThemeProvider } from "next-themes";

// Import components

// Font configuration
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Metadata
export const metadata: Metadata = {
  title: "Harshit Sengar | Portfolio",
  description: "Personal portfolio of Harshit Sengar, a BCA student specializing in MERN stack development.",
  keywords: ["portfolio", "developer", "MERN", "frontend", "Harshit Sengar", "web development", "BCA"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="flex-grow">{children}</main>
          <ConditionalMobileMenu />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
