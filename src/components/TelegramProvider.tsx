"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
    interface Window {
        Telegram?: {
            WebApp: any;
        };
    }
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand(); // Auto-expand to full height

            // Set theme based on TG params
            document.documentElement.style.setProperty('--tg-theme-bg-color', tg.backgroundColor);
            document.documentElement.style.setProperty('--tg-theme-text-color', tg.textColor);
            document.documentElement.style.setProperty('--tg-theme-button-color', tg.buttonColor);
            document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.buttonTextColor);

            setIsLoaded(true);
        }
    }, []);

    return (
        <>
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="beforeInteractive"
                onLoad={() => setIsLoaded(true)}
            />
            {children}
        </>
    );
}
