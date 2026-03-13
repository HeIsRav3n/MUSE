"use client";

import { motion } from 'framer-motion';
import { Wind, Zap, Moon, Sun, Heart } from 'lucide-react';

const moods = [
    { label: "Creative Flow", icon: Zap, color: "from-amber-400 to-orange-500", delay: 0 },
    { label: "Deep Focus", icon: Moon, color: "from-indigo-500 to-purple-600", delay: 0.1 },
    { label: "Morning Zen", icon: Sun, color: "from-cyan-400 to-blue-500", delay: 0.2 },
    { label: "Wellness", icon: Heart, color: "from-rose-400 to-pink-500", delay: 0.3 },
    { label: "Chill Vibes", icon: Wind, color: "from-emerald-400 to-teal-500", delay: 0.4 },
];

export function MoodSection() {
    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-white tracking-tight">How are we <span className="gradient-text italic">feeling?</span></h2>
                <button className="text-xs font-bold text-muse-text-muted hover:text-white transition-colors uppercase tracking-[0.2em]">Explore All</button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {moods.map((mood) => (
                    <motion.div
                        key={mood.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ duration: 0.3, delay: mood.delay }}
                        className="glass relative group overflow-hidden cursor-pointer"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                        
                        <div className="relative z-10 p-6 flex flex-col items-center text-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${mood.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-glow-sm transition-shadow`}>
                                <mood.icon className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors uppercase tracking-wider">{mood.label}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
