import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "next-themes";
import { Toaster } from "./_components/ui/sonner";
import { AuthProvider } from "../lib/auth";
import QueryProvider from "./_providers/query-provider";

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["700"],
    variable: "--font-display",
});

const manrope = Manrope({ 
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"], 
    variable: "--font-body",
});

export const metadata: Metadata = {
    title: "AparatuƧ",
    description: "Encontre a barbearia perfeita para você.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className="light" suppressHydrationWarning>
            <body
                className={`${playfair.variable} ${manrope.variable}  bg-background-light dark:bg-background-dark font-body text-text-light dark:text-text-dark antialiased`}
            >
                <AuthProvider>
                    <QueryProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                        >
                            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                                <div className="layout-container flex h-full grow flex-col">
                                    <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
                                        <div className="layout-content-container flex flex-col max-w-7xl flex-1">
                                            {children}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Toaster />
                        </ThemeProvider>
                    </QueryProvider>
                </AuthProvider>
            </body>
        </html>
    );
}