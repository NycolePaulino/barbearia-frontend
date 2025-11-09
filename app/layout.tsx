import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import { ThemeProvider } from "next-themes";
import { Toaster } from "./_components/ui/sonner";
import { AuthProvider } from "../lib/auth";
import QueryProvider from "./_providers/query-provider";

export const metadata: Metadata = {
   title: "Barbearia",
   description: "Agendamentos para sua barbearia",
};

export default function RootLayout({
   children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   return (
      <html lang="pt-BR" suppressHydrationWarning>
         <body
            className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
         >
            <AuthProvider> 
               <QueryProvider>
                  <ThemeProvider
                     attribute="class"
                     defaultTheme="system"
                     enableSystem
                     disableTransitionOnChange
                     >
                     {children}
                     <Toaster />
                  </ThemeProvider>
               </QueryProvider>
            </AuthProvider>
         </body>
      </html>
   );
}