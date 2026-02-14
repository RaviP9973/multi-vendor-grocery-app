import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider/provider";
import StoreProvider from "@/redux/provider";
import InitUser from "@/InitUser";

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
        <Provider>
          <StoreProvider>
            <InitUser />
            {children}
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
