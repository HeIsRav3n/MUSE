import { getTrendingTracks, AudiusPlaylist } from "@/lib/audius";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MoodSection } from "@/components/dashboard/MoodSection";
import { TrendingGrid } from "@/components/dashboard/TrendingGrid";
import { ArtistSpotlight } from "@/components/dashboard/ArtistSpotlight";

export const dynamic = "force-dynamic";

export default async function Home() {
    let playlistData: AudiusPlaylist | null = null;
    let fallbackTracks: any[] = [];

    try {
        const response = await fetch("https://api.audius.co/v1/playlists/dp2Vo4m", {
            next: { revalidate: 3600 }
        });
        if (response.ok) {
            const data = await response.json();
            playlistData = data.data?.[0] || null;
        }
    } catch (error) {
        console.error("Failed to fetch featured playlist:", error);
    }

    try {
        fallbackTracks = await getTrendingTracks(10);
    } catch (error) {
        console.error("Failed to fetch trending tracks:", error);
    }

    return (
        <div className="space-y-10 animate-fade-in">
            <DashboardHeader />
            
            <MoodSection />

            <TrendingGrid 
                tracks={playlistData?.tracks || fallbackTracks} 
                title="Emerging Women in Music"
            />

            <ArtistSpotlight 
                tracks={fallbackTracks}
            />
        </div>
    );
}
