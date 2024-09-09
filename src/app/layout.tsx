import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";




export const metadata: Metadata = {
  title: "Goal Getter",
  description: "Your AI powered task creator and goal tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
