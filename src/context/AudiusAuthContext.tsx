"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface AudiusUserProfile {
    userId: string;
    email: string;
    name: string;
    handle: string;
    verified: boolean;
    profilePicture?: { "150x150"?: string; "480x480"?: string; "1000x1000"?: string } | null;
    sub: number;
    iat: string;
}

interface AudiusAuthState {
    user: AudiusUserProfile | null;
    isLoggedIn: boolean;
    isInitialized: boolean;
    login: () => void;
    logout: () => void;
}

const AudiusAuthContext = createContext<AudiusAuthState>({
    user: null,
    isLoggedIn: false,
    isInitialized: false,
    login: () => { },
    logout: () => { },
});

const STORAGE_KEY = "sonara_audius_user";
const API_KEY = process.env.NEXT_PUBLIC_AUDIUS_API_KEY || "0xae4d3e296787e296b704511d724e7fac088ce029";

// Load SDK via CDN for OAuth only (avoids Node.js deps in webpack)
function loadSdkCDN(): Promise<void> {
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).audiusSdk) { resolve(); return; }
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@audius/sdk@latest/dist/sdk.min.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Audius SDK CDN"));
        document.head.appendChild(script);
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCDNSdk(): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sdkFactory = (window as any).audiusSdk;
    if (!sdkFactory) return null;
    return sdkFactory({ apiKey: API_KEY });
}

export function AudiusAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AudiusUserProfile | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sdkRef = useState<any>(null);

    // Restore from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch { }
        setIsInitialized(true);
    }, []);

    // Load CDN SDK and init OAuth
    useEffect(() => {
        if (typeof window === "undefined") return;
        loadSdkCDN()
            .then(() => {
                const sdk = getCDNSdk();
                if (!sdk) return;
                sdkRef[1](sdk);
                sdk.oauth?.init({
                    successCallback: (profile: unknown) => {
                        const p = profile as AudiusUserProfile;
                        setUser(p);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
                    },
                    errorCallback: (error: string) => {
                        console.error("Audius OAuth error:", error);
                    },
                });
            })
            .catch((e) => console.error("Failed to load Audius SDK:", e));
    }, []);

    const login = useCallback(() => {
        try {
            const sdk = sdkRef[0] || getCDNSdk();
            sdk?.oauth?.login({ scope: "read" });
        } catch (e) {
            console.error("Audius login error:", e);
        }
    }, [sdkRef]);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return (
        <AudiusAuthContext.Provider value={{ user, isLoggedIn: !!user, isInitialized, login, logout }}>
            {children}
        </AudiusAuthContext.Provider>
    );
}

export function useAudiusAuth() {
    return useContext(AudiusAuthContext);
}
