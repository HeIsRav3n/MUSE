import type { Metadata } from "next";
import "./globals.css";
import { Inter, Outfit } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MusicPlayer } from "@/components/player/MusicPlayer";
import { Providers } from "@/components/Providers";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { SolanaWalletProvider } from "@/components/SolanaWalletProvider";

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ 
    subsets: ["latin"],
    variable: "--font-outfit",
});

// Safe metadataBase generation for production build stability
const getMetadataBase = () => {
    const url = process.env.WEBAPP_URL || 'https://muse.vercel.app';
    try {
        return new URL(url);
    } catch {
        return new URL('https://muse.vercel.app');
    }
};

export const metadata: Metadata = {
    metadataBase: getMetadataBase(),
    title: "MUSE — Women's History Month & Discovery",
    description: "Discover emerging artists, invest in music, and earn rewards in the decentralized music economy. Built By Rav3n • Happy Women's History Month.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="theme-dark" suppressHydrationWarning>
            <body className={`${inter.className} ${outfit.variable} antialiased selection:bg-muse-primary/30 selection:text-muse-primary-light`}>
                <SolanaWalletProvider>
                    <Providers>
                        <div className="bg-orb bg-orb-1" />
                        <div className="bg-orb bg-orb-2" />
                        <div className="bg-orb bg-orb-3" />

                        <div className="relative z-10 flex min-h-screen">
                            <Sidebar />
                            <div className="flex-1 flex flex-col min-h-screen">
                                <TopBar />
                                <LayoutShell>
                                    <main className="flex-1 p-4 lg:p-6 pb-28">
                                        {children}
                                    </main>
                                </LayoutShell>
                            </div>
                            <MusicPlayer />
                        </div>
                    </Providers>
                </SolanaWalletProvider>
            </body>
        </html>
    );
}
