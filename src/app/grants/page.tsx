"use client";

import { motion } from 'framer-motion';
import { Award, Target, Users, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

const activeGrants = [
    { id: 1, title: "Next-Gen Audio Protocols", pool: "50,000 $AUDIO", deadline: "Mar 30, 2026", applicants: 142, category: "Engineering" },
    { id: 2, title: "Independent Touring Fund", pool: "25,000 $AUDIO", deadline: "Apr 15, 2026", applicants: 89, category: "Artists" },
    { id: 3, title: "Web3 Label Accelerators", pool: "100,000 $AUDIO", deadline: "May 01, 2026", applicants: 45, category: "Business" },
];

export default function GrantsPage() {
    return (
        <div className="min-h-screen p-6 lg:p-10">
            {/* Header Hero */}
            <div className="relative glass-strong rounded-3xl overflow-hidden mb-12 p-10 flex flex-col justify-center min-h-[300px] border border-muse-success/20">
                <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-muse-success/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                
                <div className="relative z-10 max-w-2xl">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00ffaa] to-[#0088ff] flex items-center justify-center mb-6 shadow-glow-cyan">
                        <Award className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-display font-black text-white drop-shadow-lg mb-4 leading-tight">
                        Empower <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffaa] to-[#0088ff]">Grants</span>
                    </h1>
                    <p className="text-lg text-muse-text-dim max-w-xl">
                        A decentralized funding pool dedicated entirely to accelerating women-led projects in the Web3 music space.
                    </p>
                    
                    <button className="mt-8 flex items-center gap-2 bg-gradient-to-r from-[#00ffaa] to-[#0088ff] text-muse-bg font-bold py-3 px-6 rounded-full hover:scale-105 active:scale-95 transition-all w-fit shadow-glow-cyan">
                        <span>Apply For Grant</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="stat-card">
                    <h3 className="text-muse-text-muted text-sm font-semibold uppercase tracking-wider mb-2">Total Distributed</h3>
                    <p className="text-3xl font-mono font-bold text-white">2.4M <span className="text-lg text-muse-success">$AUDIO</span></p>
                </div>
                <div className="stat-card">
                    <h3 className="text-muse-text-muted text-sm font-semibold uppercase tracking-wider mb-2">Funded Projects</h3>
                    <p className="text-3xl font-mono font-bold text-white">184</p>
                </div>
                <div className="stat-card">
                    <h3 className="text-muse-text-muted text-sm font-semibold uppercase tracking-wider mb-2">Active Proposals</h3>
                    <p className="text-3xl font-mono font-bold text-white">42</p>
                </div>
            </div>

            {/* Active Grants List */}
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                <Target className="w-6 h-6 text-muse-success" /> Open Grant Pools
            </h2>

            <div className="space-y-4">
                {activeGrants.map((grant, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        key={grant.id}
                        className="glass p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/5 hover:border-muse-success/30 transition-all cursor-pointer group"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-[#00ffaa]/20 text-[#00ffaa] text-xs font-bold px-2.5 py-1 rounded">
                                    {grant.category}
                                </span>
                                <span className="text-sm font-mono text-muse-text-muted flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" /> Closing {grant.deadline}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white group-hover:text-[#00ffaa] transition-colors">{grant.title}</h3>
                        </div>

                        <div className="flex items-center gap-8 w-full md:w-auto">
                            <div className="flex flex-col">
                                <span className="text-xs text-muse-text-muted mb-1">Available Pool</span>
                                <span className="font-mono font-bold text-muse-success flex items-center gap-1">
                                    <Zap className="w-4 h-4" /> {grant.pool}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-muse-text-muted mb-1">Applicants</span>
                                <span className="font-mono font-bold text-white flex items-center gap-1">
                                    <Users className="w-4 h-4 text-muse-text-dim" /> {grant.applicants}
                                </span>
                            </div>
                            <button className="hidden md:flex p-3 rounded-xl bg-white/5 group-hover:bg-[#00ffaa] group-hover:text-black text-white transition-all">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
