"use client";

import { motion } from 'framer-motion';
import { AudiusImage } from '@/components/ui/AudiusImage';
import { CheckCircle2, Music3, Users } from 'lucide-react';

interface ArtistSpotlightProps {
    tracks: any[];
}

export function ArtistSpotlight({ tracks }: ArtistSpotlightProps) {
    // Pick unique artists from tracks
    const artists = Array.from(new Set(tracks?.map(t => t.user?.id)))
        .map(id => tracks.find(t => t.user.id === id)?.user)
        .slice(0, 4);

    if (artists.length === 0) return null;

    return (
        <section className="pb-20">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-display font-black text-white tracking-tighter">
                    Artist <span className="gradient-text italic">Spotlight</span>
                </h2>
                <button className="text-xs font-bold text-muse-text-muted hover:text-white transition-colors uppercase tracking-[0.2em] border-b border-white/10 pb-1">View Ranking</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {artists.map((artist, idx) => (
                    <motion.div
                        key={artist.id}
                        initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="glass-strong p-8 rounded-[3rem] flex items-center gap-8 group hover:border-muse-primary/40 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-muse-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/10 group-hover:border-muse-primary/60 transition-colors shadow-2xl relative">
                            <AudiusImage 
                                artwork={artist.profile_picture} 
                                size="md"
                                alt={artist.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {artist.is_verified && (
                                <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-lg">
                                    <CheckCircle2 className="w-5 h-5 text-muse-primary fill-current" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 z-10">
                            <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-muse-primary-light transition-colors">{artist.name}</h3>
                            <p className="text-sm text-muse-text-muted mb-6 font-medium line-clamp-2 leading-relaxed">
                                {artist.bio || `Passionate creator pushing boundaries in the decentralized music economy. Join the journey and support her growth.`}
                            </p>
                            
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-muse-text-dim uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                        <Users className="w-3 h-3 text-muse-secondary" /> Supporters
                                    </span>
                                    <span className="text-sm font-display font-black text-white">{artist.follower_count?.toLocaleString() || '1.2K'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-muse-text-dim uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                        <Music3 className="w-3 h-3 text-muse-primary" /> Tracks
                                    </span>
                                    <span className="text-sm font-display font-black text-white">{artist.track_count || '24'}</span>
                                </div>
                                <button className="ml-auto btn-primary-outline px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-muse-primary hover:text-white transition-all">Support</button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
