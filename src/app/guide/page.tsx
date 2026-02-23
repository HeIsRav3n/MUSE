"use client";

import { useState } from "react";
import {
    BookOpen,
    Coins,
    TrendingUp,
    Users,
    Shield,
    Search as SearchIcon,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    ChevronDown,
    HelpCircle,
} from "lucide-react";

const steps = [
    {
        id: "earn",
        title: "How to Earn Sonara Tokens",
        icon: Coins,
        content: [
            { title: "Listen to Earn", text: "Stream tracks on Sonara to earn SONARA tokens. Each verified listen earns you 1 token." },
            { title: "Staking Rewards", text: "Stake your SONARA tokens in artist pools to earn APY. Higher stakes on breakout artists yield more rewards." },
            { title: "Discovery Bonuses", text: "Be among the first to discover an artist who trends. Sonara Scanner tracks your discoveries and rewards early supporters." },
            { title: "Referral Program", text: "Invite friends using your unique link. Earn 50 SONARA per verified signup." },
        ],
    },
    {
        id: "stake",
        title: "How to Stake Tokens",
        icon: TrendingUp,
        content: [
            { title: "Choose an Artist Pool", text: "Browse the marketplace and find artist pools that match your taste and risk appetite." },
            { title: "Select Your Amount", text: "Enter the amount of SONARA tokens to stake. Minimum stake is 100 SONARA." },
            { title: "Lock Period", text: "Choose your lock period: 7 days (5% APY), 30 days (12% APY), or 90 days (25% APY)." },
            { title: "Claim Rewards", text: "Rewards accumulate in real-time. Claim anytime from your Portfolio page." },
        ],
    },
    {
        id: "discover",
        title: "How to Discover Alpha",
        icon: SearchIcon,
        content: [
            { title: "Use the Scanner", text: "Navigate to Scanner to see real-time breakout predictions powered by on-chain and social data." },
            { title: "Read the Heatmap", text: "The heatmap shows artists by breakout probability. Brighter tiles = higher opportunity." },
            { title: "Check Metrics", text: "Each artist card shows play count velocity, engagement rate, and token holder growth." },
            { title: "Set Alerts", text: "Enable notifications for specific genres or breakout thresholds to never miss alpha." },
        ],
    },
    {
        id: "invest",
        title: "How to Invest in Artists",
        icon: BookOpen,
        content: [
            { title: "Artist Coins", text: "Buy artist-specific coins that rise in value as the artist gains popularity." },
            { title: "Album Bonds", text: "Fund upcoming releases. When the album performs, you earn yield on your bond." },
            { title: "Remix Rights", text: "Purchase and trade remix rights NFTs. These can appreciate as remixes gain traction." },
            { title: "Portfolio Tracking", text: "All investments appear in your Portfolio with real-time P&L tracking." },
        ],
    },
    {
        id: "friends",
        title: "How to Add Friends",
        icon: Users,
        content: [
            { title: "Search by Username", text: "Go to Friends and search for users by their Audius handle or wallet address." },
            { title: "Share Your Link", text: "Copy your unique invite link from the Share tab and send it to friends." },
            { title: "Listen Together", text: "Join Listening Parties to discover music with friends in real-time." },
            { title: "Share Discoveries", text: "Send tracks, artists, and scanner results directly to friends." },
        ],
    },
    {
        id: "security",
        title: "Security & Wallet Safety",
        icon: Shield,
        content: [
            { title: "Never Share Your Seed Phrase", text: "Sonara will NEVER ask for your seed phrase. Keep it stored offline and never share it." },
            { title: "Use a Hardware Wallet", text: "For larger holdings, connect a hardware wallet like Ledger or Trezor." },
            { title: "Verify Transactions", text: "Always review transaction details before signing. Check amounts, addresses, and contract interactions." },
            { title: "Enable 2FA", text: "Add two-factor authentication to your Audius account for extra protection." },
        ],
    },
];

const faqs = [
    { q: "What blockchain is Sonara built on?", a: "Sonara runs on Solana for fast, low-cost transactions. Artist tokens and staking contracts are all deployed on Solana mainnet." },
    { q: "How do I connect my wallet?", a: "Click 'Log in with Audius' in the top bar. You can also connect a Solana wallet like Phantom or Backpack via the Settings page." },
    { q: "Are my tokens safe?", a: "All smart contracts are audited by CertiK. Tokens are held in non-custodial wallets — you always control your keys." },
    { q: "What is a breakout score?", a: "An AI-driven metric (0–100%) that predicts how likely an artist is to trend in the next 7 days based on play velocity, social engagement, and on-chain activity." },
    { q: "Can I withdraw my staked tokens early?", a: "Yes, but you'll forfeit any unclaimed rewards and pay a 2% early withdrawal fee." },
    { q: "How do Listening Parties work?", a: "Create or join a party from the Party Room page. Everyone hears the same tracks in sync, with live chat and queue voting." },
];

export default function GuidePage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [mode, setMode] = useState<"beginner" | "advanced">("beginner");
    const [completed, setCompleted] = useState<string[]>([]);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const complete = (id: string) => {
        if (!completed.includes(id)) setCompleted([...completed, id]);
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const step = steps[currentStep];

    return (
        <div className="space-y-8 animate-slide-up max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold gradient-text">
                        How to Use Sonara
                    </h1>
                    <p className="text-sm text-sonara-text-muted mt-1">
                        Interactive guide to get you started
                    </p>
                </div>
                <div className="flex gap-1 glass rounded-xl p-1">
                    {(["beginner", "advanced"] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${mode === m ? "bg-sonara-primary text-white" : "text-sonara-text-muted hover:text-sonara-text"
                                }`}
                        >
                            {m.charAt(0).toUpperCase() + m.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Progress */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-sonara-text-muted">Your Progress</span>
                    <span className="text-xs font-medium text-sonara-text">
                        {completed.length}/{steps.length} Completed
                    </span>
                </div>
                <div className="h-2 bg-sonara-border rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-sonara-primary to-sonara-accent transition-all"
                        style={{ width: `${(completed.length / steps.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {steps.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => setCurrentStep(i)}
                        className={`p-3 rounded-xl border transition-all text-left ${currentStep === i
                                ? "border-sonara-primary bg-sonara-primary/10"
                                : completed.includes(s.id)
                                    ? "border-sonara-success/50 bg-sonara-success/5"
                                    : "border-sonara-border hover:border-sonara-border/80"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className={`p-1.5 rounded-lg ${currentStep === i
                                        ? "bg-sonara-primary text-white"
                                        : completed.includes(s.id)
                                            ? "bg-sonara-success text-white"
                                            : "bg-sonara-surface text-sonara-text-dim"
                                    }`}
                            >
                                <s.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-sonara-text-muted">Step {i + 1}</p>
                                <p className="text-xs font-medium text-sonara-text truncate">{s.title}</p>
                            </div>
                            {completed.includes(s.id) && <CheckCircle className="w-4 h-4 text-sonara-success flex-shrink-0" />}
                        </div>
                    </button>
                ))}
            </div>

            {/* Active Step Content */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-xl bg-sonara-primary text-white">
                        <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-sonara-text-muted">Step {currentStep + 1} of {steps.length}</p>
                        <h2 className="text-lg font-semibold text-sonara-text">{step.title}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {step.content.map((c, i) => (
                        <div key={i} className="p-4 rounded-xl bg-sonara-surface/50 border border-sonara-border/30">
                            <p className="text-sm font-semibold text-sonara-text mb-1">{c.title}</p>
                            <p className="text-xs text-sonara-text-dim leading-relaxed">{c.text}</p>
                        </div>
                    ))}
                </div>

                {mode === "advanced" && (
                    <div className="p-4 rounded-xl bg-sonara-primary/5 border border-sonara-primary/20 mb-6">
                        <p className="text-xs font-semibold text-sonara-primary mb-1">💡 Pro Tip</p>
                        <p className="text-xs text-sonara-text-dim">
                            Combine Scanner alerts with staking to maximize your alpha. Set alerts for 70%+ breakout scores, then stake early for the highest APY.
                        </p>
                    </div>
                )}

                <div className="flex justify-between">
                    <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="px-4 py-2 rounded-xl glass text-sm text-sonara-text disabled:opacity-30 hover:bg-white/5 transition flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Previous
                    </button>
                    <button
                        onClick={() => complete(step.id)}
                        className="px-5 py-2 rounded-xl btn-primary text-sm flex items-center gap-2"
                    >
                        {completed.includes(step.id)
                            ? "Completed ✓"
                            : currentStep === steps.length - 1
                                ? "Finish Guide"
                                : "Next Step"}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* FAQ */}
            <div>
                <h2 className="text-xl font-display font-bold text-sonara-text flex items-center gap-2 mb-4">
                    <HelpCircle className="w-5 h-5 text-sonara-primary" /> Frequently Asked Questions
                </h2>
                <div className="space-y-2">
                    {faqs.map((faq, i) => (
                        <div key={i} className="glass rounded-xl overflow-hidden">
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-all"
                            >
                                <span className="text-sm font-medium text-sonara-text">{faq.q}</span>
                                <ChevronDown
                                    className={`w-4 h-4 text-sonara-text-muted transition-transform ${openFaq === i ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {openFaq === i && (
                                <div className="px-4 pb-4">
                                    <p className="text-sm text-sonara-text-dim leading-relaxed">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
