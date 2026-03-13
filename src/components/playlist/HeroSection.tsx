"use client";

import { motion } from "framer-motion";

interface HeroSectionProps {
    title: string;
    description: string;
    curatorName?: string;
    curatorUrl?: string;
}

export default function HeroSection({ title, description, curatorName, curatorUrl }: HeroSectionProps) {
    // Basic extraction logic to get the quote part and the rest
    // Audius description often has newlines separating thoughts.
    const lines = description.split('\n').filter(line => line.trim().length > 0);
    const quote = lines[0] || description;

    return (
        <div className="flex flex-col items-center justify-center text-center pt-24 pb-12 md:pt-32 md:pb-16 relative">
            {/* Quote Block (Styled like the reference site) */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto mb-20 px-4 md:px-8 relative"
            >
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-muse-primary via-muse-primary-light to-transparent rounded-full" />
                <p className="text-xl md:text-3xl font-serif italic text-white/95 leading-relaxed text-left pl-6 md:pl-10 text-shadow-md">
                    "{quote}"
                </p>
                {curatorName && (
                    <div className="text-left pl-6 md:pl-10 mt-6 md:mt-8">
                        <span className="text-muse-text-muted text-xs md:text-sm tracking-widest font-mono uppercase mr-2">Curated By</span>
                        <a 
                            href={curatorUrl || "#"} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white font-display font-bold hover:text-muse-primary transition-colors hover:underline underline-offset-4 decoration-muse-primary"
                        >
                            {curatorName}
                        </a>
                    </div>
                )}
            </motion.div>

            {/* Title Block */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative z-10"
            >
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black text-white tracking-tighter mb-6">
                    <span className="drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{title}</span>
                </h1>
                <p className="text-muse-text-dim/80 text-sm md:text-lg max-w-xl mx-auto font-medium px-4">
                    {lines[1] || 'Experience the sound of tomorrow.'}
                </p>
                <div className="mt-10 flex justify-center">
                    <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-muse-primary to-transparent rounded-full shadow-[0_0_10px_rgba(224,36,195,0.5)]" />
                </div>
            </motion.div>
        </div>
    );
}
