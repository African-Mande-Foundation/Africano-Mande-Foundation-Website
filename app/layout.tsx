import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],   
  weight: ["400", "500", "600", "700"], 
  variable: "--font-poppins", 
});
export const metadata: Metadata = {
  title: "Africano Mande Foundation",
  description: "The Africano-Mande Foundation (AMF) is a community-focused organization based in Maridi, South Sudan, dedicated to empowering youth and strengthening communities through education, leadership development, and social initiatives that promote peace, growth, and opportunity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
