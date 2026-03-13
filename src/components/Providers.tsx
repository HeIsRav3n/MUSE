"use client";

import { AudiusAuthProvider } from "@/context/AudiusAuthContext";
import { AudioStoreProvider } from "@/lib/audioStore";
import { AuthGate } from "@/components/auth/AuthGate";

export function Providers({ children }: { children: React.ReactNode }) {
    // Removed SessionProvider (NextAuth) to resolve "TypeError: Invalid URL" during build.
    // NextAuth was not being used and caused prerendering failures on Vercel.
    return (
        <AudiusAuthProvider>
            <AudioStoreProvider>
                <AuthGate>
                    {children}
                </AuthGate>
            </AudioStoreProvider>
        </AudiusAuthProvider>
    );
}
