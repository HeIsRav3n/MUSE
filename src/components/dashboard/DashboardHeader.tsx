"use client";

import { motion } from 'framer-motion';
import { Sparkles, Play, Info } from 'lucide-react';

export function DashboardHeader() {
    return (
        <section className="relative h-[400px] rounded-[2.5rem] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
            
            {/* Background Image/Visual */}
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                <img 
                    src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop" 
                    alt="Hero"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            <div className="relative z-20 h-full flex flex-col justify-center px-10 max-w-2xl">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muse-primary/20 backdrop-blur-md border border-muse-primary/30 mb-6"
                >
                    <Sparkles className="w-4 h-4 text-muse-primary-light" />
                    <span className="text-[10px] font-bold text-muse-primary-light uppercase tracking-widest">Featured Artist Collection</span>
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl font-display font-black text-white mb-4 leading-none tracking-tighter"
                >
                    Be My <br />
                    <span className="gradient-text italic font-cursive drop-shadow-glow-pink">MUSE</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-white/70 mb-8 max-w-md leading-relaxed"
                >
                    Empowering the next generation of women in the decentralized music economy. 
                    Discover, invest, and grow together.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-4"
                >
                    <button className="btn-primary px-8 py-3 rounded-full flex items-center gap-2 shadow-glow-pink">
                        <Play className="w-5 h-5 fill-current" />
                        <span>Play Trending</span>
                    </button>
                    <button className="glass px-8 py-3 rounded-full text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        <span>Explore Her Story</span>
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
