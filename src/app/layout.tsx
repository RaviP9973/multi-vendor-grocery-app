import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider/provider";

export const metadata: Metadata = {
  title: "Kirana Kart",
  description: "Multipurpose E-commerce Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
