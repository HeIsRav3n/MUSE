"use client";

import { motion } from "framer-motion";
import { BookOpen, Map, HelpCircle, Key, Play } from "lucide-react";

export default function GuidePage() {
    return (
        <div className="min-h-screen p-6 lg:p-10 max-w-4xl mx-auto">
            <div className="mb-10 animate-slide-up">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-muse-primary to-muse-secondary flex items-center justify-center shadow-glow-pink">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-display font-black text-white">MUSE <span className="text-muse-primary font-cursive font-normal">Guide</span></h1>
                </div>
                <p className="text-muse-text-dim text-lg">
                    Everything you need to know about navigating the MUSE platform during Women's History Month. We've replaced our backend tokenomics with decentralized $AUDIO support to directly empower creators.
                </p>
            </div>

            <div className="grid gap-6">
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-strong p-8 rounded-3xl"
                >
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-muse-border/50 pb-4">
                        <Map className="w-6 h-6 text-muse-accent" /> Navigating The Initiatives
                    </h2>
                    <div className="space-y-4 text-muse-text-muted">
                        <p><strong className="text-white">Discover Women:</strong> Our flagship search powered directly by the Audius API. Find any trending track matching your Women's History Month search criteria.</p>
                        <p><strong className="text-white">Live Women Radio:</strong> Tune into massive 24/7 web3 radiostreams hosted exclusively by female DJs. You can tip $AUDIO directly into their decentralized wallets.</p>
                        <p><strong className="text-white">Her Story Podcasts:</strong> Dive into long-format discussions with Web3 founders, audio engineers, and tech visionaries.</p>
                        <p><strong className="text-white">Wellness Audio & Mentorship:</strong> Engage with sound baths encoded to specific frequencies for nervous system regulation, or ping top creators for 1-on-1 career scaling.</p>
                    </div>
                </motion.section>

                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-strong p-8 rounded-3xl"
                >
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-muse-border/50 pb-4">
                        <Key className="w-6 h-6 text-muse-success" /> The $AUDIO Token Integration
                    </h2>
                    <div className="space-y-4 text-muse-text-muted">
                        <p>We've stripped our platform of all internal mock tokens to fully support the <strong className="text-white font-mono">$AUDIO</strong> token on Solana/Ethereum.</p>
                        <p>Your "Token Balance" in the top right will now reflect your $AUDIO reserves. You can stake $AUDIO via Empower Grants to fund women-led labels, or tip $AUDIO during Listening Parties and Her Story podcast streams.</p>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
