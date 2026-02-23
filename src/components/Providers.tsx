"use client";

import { SessionProvider } from "next-auth/react";
import { AudiusAuthProvider } from "@/context/AudiusAuthContext";
import { AudioStoreProvider } from "@/lib/audioStore";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AudiusAuthProvider>
                <AudioStoreProvider>
                    {children}
                </AudioStoreProvider>
            </AudiusAuthProvider>
        </SessionProvider>
    );
}
