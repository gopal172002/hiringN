import Header from "@/app/components/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@radix-ui/themes/styles.css';
import { FaInstagram, FaLinkedin, FaTelegram, FaWhatsapp } from "react-icons/fa";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HiringNexus",
  description: "HiringNexus",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>HiringNexus</title>
        <link rel="icon" href="/assets/hiringnexus.png" />
        
        <meta name="description" content="HiringNexus: Your gateway to innovative hiring solutions." />
        <meta name="keywords" content="hiring, recruitment, employment, jobs, HiringNexus" />
        <meta name="author" content="HiringNexus Team" />
        
        <meta property="og:title" content="HiringNexus" />
        <meta property="og:description" content="HiringNexus: Your gateway to innovative hiring solutions." />
        <meta property="og:image" content="/assets/hiringnexus.png" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HiringNexus" />
        <meta name="twitter:description" content="HiringNexus: Your gateway to innovative hiring solutions." />
        <meta name="twitter:image" content="/assets/hiringnexus.png" />
      </head>
      <body className={inter.className}>
        <Header />
        {children}
        <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-12">
          <div className="container mx-auto text-center text-sm text-gray-600">
            <p className="mb-4">
              HiringNexus &copy; {new Date().getFullYear()} - All rights reserved
            </p>
            <div className="flex justify-center space-x-6 mb-4">
              <a href="https://chat.whatsapp.com/JJfEoGqP5nJEUetQZwOQKc" target="_blank" className="hover:text-gray-800" rel="noopener noreferrer">
                <FaInstagram size={24} />
              </a>
              <a href="https://www.linkedin.com/company/hiringnexus/" target="_blank" className="hover:text-gray-800" rel="noopener noreferrer">
                <FaLinkedin size={24} />
              </a>
              <a href="https://t.me/hiringnexus_team" target="_blank" className="hover:text-gray-800" rel="noopener noreferrer">
                <FaTelegram size={24} />
              </a>
              <a href="https://chat.whatsapp.com/JJfEoGqP5nJEUetQZwOQKc" target="_blank" className="hover:text-gray-800" rel="noopener noreferrer">
                <FaWhatsapp size={24} />
              </a>
            </div>
            <div className="flex justify-center space-x-6">
              <a href="/" className="hover:text-gray-800">
                Privacy Policy
              </a>
              <a href="/" className="hover:text-gray-800">
                Terms of Service
              </a>
              <a href="/" className="hover:text-gray-800">
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
