"use client";

import { motion } from 'framer-motion';
import { Users, Star, MessageSquarePlus, Trophy, MapPin, Sparkles } from 'lucide-react';

const mentors = [
    { name: "Dr. Alanna Ross", role: "Web3 Audio Engineer", location: "Berlin, DE", matches: 42, tags: ["Mixing", "Solidity", "Mastering"], image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80" },
    { name: "Sarah Jenkins", role: "Algorithmic Growth VP", location: "New York, US", matches: 89, tags: ["Marketing", "TikTok", "Branding"], image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80" },
    { name: "Luna Wave", role: "Platinum Producer", location: "London, UK", matches: 15, tags: ["Logic Pro X", "Songwriting", "Vocal Chains"], image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80" },
    { name: "Elena Rostova", role: "Smart Contract Dev", location: "Remote", matches: 64, tags: ["Ethereum", "Royalties", "NFT Drops"], image: "https://images.unsplash.com/photo-1531123897727-8f129e1bfa8ce?w=500&q=80" }
];

export default function MentorshipPage() {
    return (
        <div className="min-h-screen p-6 lg:p-10">
            {/* Hero Section */}
            <div className="relative glass-strong rounded-3xl overflow-hidden mb-12 flex flex-col items-center justify-center min-h-[350px] text-center p-10 bg-gradient-to-b from-[#6333ff]/10 to-transparent border border-[#6333ff]/30">
                <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6333ff]/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                
                <div className="relative z-10 max-w-3xl">
                    <div className="w-20 h-20 mx-auto rounded-[2rem] bg-gradient-to-br from-[#6333ff] to-[#e024c3] flex items-center justify-center mb-6 shadow-glow-purple -rotate-6 hover:rotate-0 transition-all duration-500 cursor-default">
                        <Users className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-display font-black text-white drop-shadow-lg mb-4">
                        Mentorship <span className="gradient-text font-cursive">Collabs</span>
                    </h1>
                    <p className="text-xl text-muse-text-dim max-w-2xl mx-auto leading-relaxed">
                        Connect with industry-leading women in Web3, audio engineering, and label management. Level up your music career with 1-on-1 guidance.
                    </p>
                    
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button className="flex items-center gap-2 btn-primary shadow-glow-purple border-[#6333ff]/50">
                            <Star className="w-5 h-5 fill-white" />
                            <span>Find a Mentor</span>
                        </button>
                        <button className="flex items-center gap-2 btn-secondary hover:bg-[#6333ff]/20 hover:border-[#6333ff]/50">
                            <Sparkles className="w-5 h-5 text-muse-text-muted" />
                            <span>Become a Mentor</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Mentors Grid */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-[#ffb800]" /> Top Featured Mentors
                </h2>
                <div className="text-sm font-semibold text-muse-text-muted hover:text-white cursor-pointer transition">Browse All 240+ Mentors</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mentors.map((mentor, idx) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        key={idx}
                        className="glass p-6 rounded-3xl flex flex-col items-center text-center hover:-translate-y-2 hover:bg-white/5 transition-all group border border-transparent hover:border-[#6333ff]/30 shadow-lg"
                    >
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[#6333ff]/30 p-1 group-hover:border-[#e024c3] transition-colors shadow-glow-purple">
                            <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover rounded-full" />
                        </div>
                        
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#ffb800] transition-colors">{mentor.name}</h3>
                        <p className="text-sm font-medium text-muse-text-muted mb-3">{mentor.role}</p>
                        
                        <div className="flex items-center gap-1.5 text-xs text-muse-text-dim mb-4 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                            <MapPin className="w-3.5 h-3.5" /> {mentor.location}
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 w-full">
                            {mentor.tags.map(tag => (
                                <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-[#6333ff]/10 text-[#cca8ff] border border-[#6333ff]/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        
                        <button className="mt-auto w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#6333ff] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-white/10 hover:border-[#6333ff]">
                            <MessageSquarePlus className="w-4 h-4" /> Request Collab
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
