import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MusicPlayer } from "@/components/player/MusicPlayer";
import { Providers } from "@/components/Providers";
import { TelegramProvider } from "@/components/TelegramProvider";
import { LayoutShell } from "@/components/layout/LayoutShell";

export const metadata: Metadata = {
    title: "SONARA — Web3 Music Investment & Discovery",
    description: "Discover emerging artists, invest in music, and earn rewards in the decentralized music economy. Built By Rav3n • Powered By Audius.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="theme-dark" suppressHydrationWarning>
            <body className="antialiased">
                <TelegramProvider>
                    <Providers>
                        {/* Background orbs */}
                        <div className="bg-orb bg-orb-1" />
                        <div className="bg-orb bg-orb-2" />
                        <div className="bg-orb bg-orb-3" />

                        <div className="relative z-10 flex min-h-screen">
                            <Sidebar />
                            <LayoutShell>
                                <TopBar />
                                <main className="flex-1 p-4 lg:p-6 pb-28">{children}</main>

                                {/* Footer */}
                                <footer className="border-t border-sonara-border/30 py-6 px-4 lg:px-6 mb-20">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <p className="text-xs text-sonara-text-muted">
                                            Built By{" "}
                                            <span className="font-semibold text-sonara-primary">Rav3n</span>
                                        </p>
                                        <p className="text-[10px] text-sonara-text-dim">
                                            Powered By{" "}
                                            <a
                                                href="https://openaudio.org"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sonara-accent hover:underline"
                                            >
                                                Open Audio Protocol
                                            </a>
                                            {" "}•{" "}
                                            <a
                                                href="https://audius.co"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sonara-accent hover:underline"
                                            >
                                                Audius
                                            </a>
                                        </p>
                                        <p className="text-[10px] text-sonara-border mt-2">
                                            © {new Date().getFullYear()} Sonara. All rights reserved.
                                        </p>
                                    </div>
                                </footer>
                            </LayoutShell>
                        </div>

                        <MusicPlayer />
                    </Providers>
                </TelegramProvider>
            </body>
        </html>
    );
}
