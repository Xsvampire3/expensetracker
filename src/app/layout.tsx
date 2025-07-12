
import React, { ReactNode } from "react";
import "./globals.css";
import ClientLayout from "./_components/ClientLayout";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
