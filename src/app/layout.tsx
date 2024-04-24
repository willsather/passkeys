import React, { ReactNode } from "react";

import "./tailwind.css";
import Header from "@/src/app/Header";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
