"use client";

import { SessionProvider } from "next-auth/react";
import { AudiusAuthProvider } from "@/context/AudiusAuthContext";
import { AudioStoreProvider } from "@/lib/audioStore";
import { AuthGate } from "@/components/auth/AuthGate";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AudiusAuthProvider>
                <AudioStoreProvider>
                    <AuthGate>
                        {children}
                    </AuthGate>
                </AudioStoreProvider>
            </AudiusAuthProvider>
        </SessionProvider>
    );
}
