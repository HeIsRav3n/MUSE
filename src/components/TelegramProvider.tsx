"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
    interface Window {
        Telegram?: {
            WebApp: {
                ready: () => void;
                expand: () => void;
                enableClosingConfirmation: () => void;
                backgroundColor: string;
                textColor: string;
                buttonColor: string;
                buttonTextColor: string;
                showPopup: (params: any) => void;
                openLink: (url: string) => void;
                initData?: string;
                initDataUnsafe?: any;
                version?: string;
                platform?: string;
            };
        };
    }
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [tg, setTg] = useState<any>(null);

    useEffect(() => {
        // Check if we're in Telegram WebApp environment
        const isTelegramWebApp = () => {
            return typeof window !== 'undefined' && 
                   window.Telegram?.WebApp &&
                   window.Telegram.WebApp.initData;
        };

        if (isTelegramWebApp()) {
            const webApp = window.Telegram!.WebApp;
            setTg(webApp);
            
            // Initialize Telegram WebApp
            webApp.ready();
            webApp.expand();
            webApp.enableClosingConfirmation();

            // Set theme colors for CSS variables
            document.documentElement.style.setProperty('--tg-theme-bg-color', webApp.backgroundColor);
            document.documentElement.style.setProperty('--tg-theme-text-color', webApp.textColor);
            document.documentElement.style.setProperty('--tg-theme-button-color', webApp.buttonColor);
            document.documentElement.style.setProperty('--tg-theme-button-text-color', webApp.buttonTextColor);

            // Set background color
            document.body.style.backgroundColor = webApp.backgroundColor;
            
            setIsLoaded(true);
            console.log('Telegram WebApp initialized successfully');
            console.log('Platform:', webApp.platform);
            console.log('Version:', webApp.version);
        } else {
            // Not in Telegram environment
            setIsLoaded(true);
            console.log('Running outside Telegram environment');
        }
    }, []);

    return (
        <>
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="afterInteractive"
                onLoad={() => {
                    // Script loaded, but we still need to check if we're in Telegram
                    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initData) {
                        setIsLoaded(true);
                    } else {
                        setIsLoaded(true); // Still mark as loaded for non-Telegram environments
                    }
                }}
                onError={() => {
                    console.error('Failed to load Telegram WebApp script');
                    setIsLoaded(true); // Continue anyway for non-Telegram environments
                }}
            />
            {children}
        </>
    );
}
