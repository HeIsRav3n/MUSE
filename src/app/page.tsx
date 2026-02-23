import { StatsBar } from "@/components/dashboard/StatsBar";
import { ArtistHeatmap } from "@/components/dashboard/ArtistHeatmap";
import { BreakoutPredictions } from "@/components/dashboard/BreakoutPredictions";
import { TrendingTracks } from "@/components/dashboard/TrendingTracks";
import { WalletActivity } from "@/components/dashboard/WalletActivity";

export default function Dashboard() {
    return (
        <div className="space-y-6 animate-slide-up">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold gradient-text">
                    Music Alpha Scanner
                </h1>
                <p className="text-sm text-sonara-text-muted mt-1">
                    Real-time intelligence for the decentralized music economy
                </p>
            </div>

            {/* Stats Row */}
            <StatsBar />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                    <TrendingTracks />
                    <ArtistHeatmap />
                </div>

                {/* Right Column */}
                <div className="space-y-4 lg:space-y-6">
                    <BreakoutPredictions />
                    <WalletActivity />
                </div>
            </div>
        </div>
    );
}
