"use client";

import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Wallet, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

type Tab = 'profile' | 'web3' | 'notifications' | 'security';

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const { publicKey, disconnect } = useWallet();

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="min-h-screen p-6 lg:p-10 max-w-5xl mx-auto">
            <div className="mb-10 animate-slide-up flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-display font-black text-white flex items-center gap-3">
                        <Settings className="w-8 h-8 text-muse-primary" />
                        Account <span className="text-muse-primary font-cursive font-normal">Settings</span>
                    </h1>
                    <p className="text-muse-text-dim mt-2">Manage your MUSE profile, $AUDIO wallet, and Web3 configurations.</p>
                </div>
                <button 
                    onClick={handleSave}
                    className="btn-primary shadow-glow-pink flex items-center gap-2"
                >
                    {saved ? <CheckCircle2 className="w-5 h-5" /> : <Sparkles className="w-5 h-5 fill-white" />}
                    <span>{saved ? "Saved" : "Save Changes"}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Navigation */}
                <div className="col-span-1 space-y-2">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-colors ${activeTab === 'profile' ? 'bg-white/10 text-white border border-muse-primary/30' : 'glass text-muse-text-muted hover:text-white hover:bg-white/5'}`}
                    >
                        <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-muse-primary' : ''}`} /> Profile Details
                    </button>
                    <button 
                        onClick={() => setActiveTab('web3')}
                        className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-colors ${activeTab === 'web3' ? 'bg-white/10 text-white border border-muse-primary/30' : 'glass text-muse-text-muted hover:text-white hover:bg-white/5'}`}
                    >
                        <Wallet className={`w-5 h-5 ${activeTab === 'web3' ? 'text-muse-primary' : ''}`} /> Web3 & $AUDIO
                    </button>
                    <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-colors ${activeTab === 'notifications' ? 'bg-white/10 text-white border border-muse-primary/30' : 'glass text-muse-text-muted hover:text-white hover:bg-white/5'}`}
                    >
                        <Bell className={`w-5 h-5 ${activeTab === 'notifications' ? 'text-muse-primary' : ''}`} /> Notifications
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-colors ${activeTab === 'security' ? 'bg-white/10 text-white border border-muse-primary/30' : 'glass text-muse-text-muted hover:text-white hover:bg-white/5'}`}
                    >
                        <Shield className={`w-5 h-5 ${activeTab === 'security' ? 'text-muse-primary' : ''}`} /> Security
                    </button>
                    
                    {publicKey && (
                        <div className="pt-8">
                            <button 
                                onClick={() => disconnect()}
                                className="w-full flex items-center gap-3 p-4 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                                <LogOut className="w-5 h-5" /> Disconnect Wallet
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="col-span-1 md:col-span-2 space-y-8">
                    {/* Profile Section */}
                    {activeTab === 'profile' && (
                    <motion.section 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-strong p-8 rounded-[2rem] border border-white/5"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Public Profile</h2>
                        
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-muse-primary to-muse-accent p-1 cursor-pointer group">
                                <div className="w-full h-full bg-[#130626] rounded-full overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white z-10">Upload</div>
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-muse-primary font-black">R</div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Profile Avatar</h3>
                                <p className="text-sm text-muse-text-muted">JPG, GIF or PNG. 1MB max.</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-muse-text-dim mb-2 uppercase tracking-wider">Display Name</label>
                                <input type="text" defaultValue="RAV3N" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-muse-primary focus:ring-1 focus:ring-muse-primary transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-muse-text-dim mb-2 uppercase tracking-wider">Bio</label>
                                <textarea rows={3} defaultValue="Web3 Developer building the future of decentralized audio." className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-muse-primary focus:ring-1 focus:ring-muse-primary transition-all resize-none"></textarea>
                            </div>
                        </div>
                    </motion.section>
                    )}

                    {/* Web3 Connections */}
                    {activeTab === 'web3' && (
                    <motion.section 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-strong p-8 rounded-[2rem] border border-white/5"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Web3 Integrations</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                <div>
                                    <h4 className="font-bold text-white">Audius Account</h4>
                                    <p className="text-sm text-muse-text-muted">Connected to view your $AUDIO</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-[#00ffaa]/20 text-[#00ffaa] text-sm font-bold border border-[#00ffaa]/30">Connected</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                <div>
                                    <h4 className="font-bold text-white">Solana Wallet</h4>
                                    <p className="text-sm text-muse-text-muted">
                                        {publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : "Not connected"}
                                    </p>
                                </div>
                                <WalletMultiButton className="!bg-muse-primary hover:!bg-muse-primary-light !transition-colors !rounded-xl" />
                            </div>
                        </div>
                    </motion.section>
                    )}

                    {/* Notifications Section */}
                    {activeTab === 'notifications' && (
                    <motion.section 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-strong p-8 rounded-[2rem] border border-white/5"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                        <div className="space-y-4">
                            {[
                                { title: "New Releases", desc: "When artists you follow drop new tracks" },
                                { title: "Mentorship Requests", desc: "When someone wants to collaborate" },
                                { title: "$AUDIO Grants", desc: "Updates on your grant applications" },
                                { title: "Platform Updates", desc: "News from the MUSE team" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div>
                                        <h4 className="font-bold text-white">{item.title}</h4>
                                        <p className="text-sm text-muse-text-muted">{item.desc}</p>
                                    </div>
                                    <div className="w-12 h-6 bg-muse-primary rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                    )}

                    {/* Security Section */}
                    {activeTab === 'security' && (
                    <motion.section 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-strong p-8 rounded-[2rem] border border-white/5"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Account Security</h2>
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="text-left">
                                    <h4 className="font-bold text-white">Change Password</h4>
                                    <p className="text-sm text-muse-text-muted">Update your Audius account password</p>
                                </div>
                                <Settings className="w-5 h-5 text-muse-text-muted" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="text-left">
                                    <h4 className="font-bold text-white">2-Factor Authentication</h4>
                                    <p className="text-sm text-muse-text-muted">Add an extra layer of security</p>
                                </div>
                                <span className="text-sm text-muse-text-dim">Disabled</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors">
                                <div className="text-left">
                                    <h4 className="font-bold text-rose-400">Delete Account</h4>
                                    <p className="text-sm text-rose-400/70">Permanently remove your data</p>
                                </div>
                            </button>
                        </div>
                    </motion.section>
                    )}
                </div>
            </div>
        </div>
    );
}
