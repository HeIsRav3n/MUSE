// Mock data for Web3 features (staking, bonds, coins, wallet activity)
// In production these would come from smart contracts & The Graph

export interface ArtistCoin {
    id: string;
    name: string;
    symbol: string;
    artistName: string;
    artistImage: string;
    price: number;
    priceChange24h: number;
    marketCap: number;
    holders: number;
    volume24h: number;
    totalSupply: number;
    sparkline: number[];
}

export interface AlbumBond {
    id: string;
    artistName: string;
    artistImage: string;
    albumTitle: string;
    targetAmount: number;
    raisedAmount: number;
    apy: number;
    maturityDate: string;
    riskScore: 'Low' | 'Medium' | 'High';
    streamingRevenueShare: number;
    status: 'Active' | 'Funded' | 'Matured';
    investors: number;
}

export interface WalletActivityItem {
    id: string;
    type: 'buy' | 'sell' | 'stake' | 'mint' | 'claim';
    address: string;
    amount: number;
    token: string;
    timestamp: string;
    usdValue: number;
}

export interface ScoutEntry {
    rank: number;
    address: string;
    handle: string;
    avatar: string;
    discoveries: number;
    accuracy: number;
    totalEarned: number;
    badge: 'Diamond' | 'Gold' | 'Silver' | 'Bronze';
}

export interface BreakoutPrediction {
    id: string;
    artistName: string;
    artistImage: string;
    probability: number;
    genre: string;
    monthlyListeners: number;
    growthRate: number;
    signals: string[];
}

export interface StemListing {
    id: string;
    title: string;
    artistName: string;
    artistImage: string;
    coverArt: string;
    stemType: 'Vocals' | 'Drums' | 'Bass' | 'Melody' | 'Full Mix';
    licenseType: 'Non-Exclusive' | 'Exclusive' | 'Commercial';
    price: number;
    royaltyBPS: number;
    genre: string;
    bpm: number;
    key: string;
    duration: number;
    purchases: number;
}

export interface PortfolioHolding {
    id: string;
    name: string;
    type: 'Coin' | 'Bond' | 'Stem' | 'NFT';
    amount: number;
    value: number;
    costBasis: number;
    change24h: number;
    image: string;
}

// --- Generate live data ---

const randomSparkline = (len = 24, base = 1) =>
    Array.from({ length: len }, () => base + (Math.random() - 0.45) * base * 0.3);

export const artistCoins: ArtistCoin[] = [
    { id: '1', name: 'Vex Coin', symbol: '$VEX', artistName: 'Vex', artistImage: '', price: 2.34, priceChange24h: 12.5, marketCap: 2_340_000, holders: 4521, volume24h: 156_000, totalSupply: 1_000_000, sparkline: randomSparkline() },
    { id: '2', name: 'Luna Token', symbol: '$LUNA', artistName: 'Luna Wave', artistImage: '', price: 0.87, priceChange24h: -3.2, marketCap: 870_000, holders: 2103, volume24h: 43_000, totalSupply: 1_000_000, sparkline: randomSparkline(24, 0.87) },
    { id: '3', name: 'Nex Coin', symbol: '$NEX', artistName: 'NexGen', artistImage: '', price: 5.12, priceChange24h: 28.7, marketCap: 5_120_000, holders: 8932, volume24h: 892_000, totalSupply: 1_000_000, sparkline: randomSparkline(24, 5) },
    { id: '4', name: 'Echo Token', symbol: '$ECHO', artistName: 'Echo Chamber', artistImage: '', price: 0.45, priceChange24h: 5.1, marketCap: 450_000, holders: 1204, volume24h: 23_000, totalSupply: 1_000_000, sparkline: randomSparkline(24, 0.45) },
    { id: '5', name: 'Drift Coin', symbol: '$DRFT', artistName: 'Drift', artistImage: '', price: 1.56, priceChange24h: -1.8, marketCap: 1_560_000, holders: 3678, volume24h: 87_000, totalSupply: 1_000_000, sparkline: randomSparkline(24, 1.5) },
    { id: '6', name: 'Prism Token', symbol: '$PRSM', artistName: 'Prism', artistImage: '', price: 3.89, priceChange24h: 45.2, marketCap: 3_890_000, holders: 6543, volume24h: 567_000, totalSupply: 1_000_000, sparkline: randomSparkline(24, 3.5) },
];

export const albumBonds: AlbumBond[] = [
    { id: '1', artistName: 'Vex', artistImage: '', albumTitle: 'Neon Dreams', targetAmount: 50_000, raisedAmount: 38_500, apy: 12.5, maturityDate: '2026-08-15', riskScore: 'Low', streamingRevenueShare: 10, status: 'Active', investors: 234 },
    { id: '2', artistName: 'NexGen', artistImage: '', albumTitle: 'Quantum Leap', targetAmount: 100_000, raisedAmount: 100_000, apy: 18.0, maturityDate: '2026-06-01', riskScore: 'Medium', streamingRevenueShare: 15, status: 'Funded', investors: 567 },
    { id: '3', artistName: 'Echo Chamber', artistImage: '', albumTitle: 'Resonance', targetAmount: 30_000, raisedAmount: 12_000, apy: 8.5, maturityDate: '2026-12-01', riskScore: 'Low', streamingRevenueShare: 8, status: 'Active', investors: 89 },
    { id: '4', artistName: 'Drift', artistImage: '', albumTitle: 'Horizons', targetAmount: 75_000, raisedAmount: 61_000, apy: 15.0, maturityDate: '2026-09-30', riskScore: 'Medium', streamingRevenueShare: 12, status: 'Active', investors: 412 },
    { id: '5', artistName: 'Luna Wave', artistImage: '', albumTitle: 'Tidal Force', targetAmount: 200_000, raisedAmount: 45_000, apy: 22.0, maturityDate: '2027-01-15', riskScore: 'High', streamingRevenueShare: 20, status: 'Active', investors: 178 },
];

export const walletActivity: WalletActivityItem[] = [
    { id: '1', type: 'buy', address: '0x7a3d...f82e', amount: 5000, token: '$VEX', timestamp: '2 min ago', usdValue: 11_700 },
    { id: '2', type: 'stake', address: '0x4b1c...a93d', amount: 10000, token: '$AUDIO', timestamp: '5 min ago', usdValue: 45_000 },
    { id: '3', type: 'mint', address: '0x9e2f...b71a', amount: 1, token: 'Discovery #4521', timestamp: '8 min ago', usdValue: 250 },
    { id: '4', type: 'sell', address: '0x2d8a...c45f', amount: 2500, token: '$LUNA', timestamp: '12 min ago', usdValue: 2_175 },
    { id: '5', type: 'claim', address: '0x5f3b...d82c', amount: 750, token: '$AUDIO', timestamp: '15 min ago', usdValue: 3_375 },
    { id: '6', type: 'buy', address: '0x8c1e...a23d', amount: 15000, token: '$NEX', timestamp: '18 min ago', usdValue: 76_800 },
    { id: '7', type: 'stake', address: '0x1a4f...e67b', amount: 3000, token: '$DRFT', timestamp: '22 min ago', usdValue: 4_680 },
    { id: '8', type: 'buy', address: '0x6b9c...f12a', amount: 8000, token: '$PRSM', timestamp: '25 min ago', usdValue: 31_120 },
];

export const scouts: ScoutEntry[] = [
    { rank: 1, address: '0x7a3d...f82e', handle: 'AlphaHunter', avatar: '', discoveries: 47, accuracy: 94, totalEarned: 125_000, badge: 'Diamond' },
    { rank: 2, address: '0x4b1c...a93d', handle: 'VibeScout', avatar: '', discoveries: 38, accuracy: 89, totalEarned: 87_500, badge: 'Diamond' },
    { rank: 3, address: '0x9e2f...b71a', handle: 'BeatFinder', avatar: '', discoveries: 31, accuracy: 85, totalEarned: 62_000, badge: 'Gold' },
    { rank: 4, address: '0x2d8a...c45f', handle: 'SoundSeeker', avatar: '', discoveries: 24, accuracy: 82, totalEarned: 41_000, badge: 'Gold' },
    { rank: 5, address: '0x5f3b...d82c', handle: 'WaveRider', avatar: '', discoveries: 19, accuracy: 78, totalEarned: 28_000, badge: 'Silver' },
];

export const breakoutPredictions: BreakoutPrediction[] = [
    { id: '1', artistName: 'Prism', artistImage: '', probability: 92, genre: 'Electronic', monthlyListeners: 45_000, growthRate: 340, signals: ['Viral TikTok', 'Whale accumulation', 'Label interest'] },
    { id: '2', artistName: 'Drift', artistImage: '', probability: 87, genre: 'Lo-Fi', monthlyListeners: 32_000, growthRate: 210, signals: ['Playlist placement', 'Community growth', 'Token demand'] },
    { id: '3', artistName: 'NexGen', artistImage: '', probability: 78, genre: 'Hip Hop', monthlyListeners: 128_000, growthRate: 156, signals: ['Collab announcement', 'Festival booking', 'Social velocity'] },
    { id: '4', artistName: 'Vex', artistImage: '', probability: 73, genre: 'Pop', monthlyListeners: 67_000, growthRate: 120, signals: ['Streaming momentum', 'Scout consensus'] },
];

export const stemListings: StemListing[] = [
    { id: '1', title: 'Neon Dreams - Vocals', artistName: 'Vex', artistImage: '', coverArt: '', stemType: 'Vocals', licenseType: 'Non-Exclusive', price: 0.5, royaltyBPS: 500, genre: 'Pop', bpm: 128, key: 'Am', duration: 210, purchases: 45 },
    { id: '2', title: 'Quantum Leap - Drums', artistName: 'NexGen', artistImage: '', coverArt: '', stemType: 'Drums', licenseType: 'Non-Exclusive', price: 0.3, royaltyBPS: 300, genre: 'Hip Hop', bpm: 95, key: 'Cm', duration: 180, purchases: 78 },
    { id: '3', title: 'Resonance - Melody', artistName: 'Echo Chamber', artistImage: '', coverArt: '', stemType: 'Melody', licenseType: 'Exclusive', price: 2.0, royaltyBPS: 800, genre: 'Electronic', bpm: 140, key: 'F#m', duration: 240, purchases: 12 },
    { id: '4', title: 'Horizons - Bass', artistName: 'Drift', artistImage: '', coverArt: '', stemType: 'Bass', licenseType: 'Commercial', price: 1.5, royaltyBPS: 600, genre: 'Lo-Fi', bpm: 85, key: 'Em', duration: 195, purchases: 34 },
    { id: '5', title: 'Tidal Force - Full Mix', artistName: 'Luna Wave', artistImage: '', coverArt: '', stemType: 'Full Mix', licenseType: 'Non-Exclusive', price: 0.8, royaltyBPS: 400, genre: 'R&B', bpm: 110, key: 'Dm', duration: 225, purchases: 56 },
    { id: '6', title: 'Electric Soul - Vocals', artistName: 'Prism', artistImage: '', coverArt: '', stemType: 'Vocals', licenseType: 'Commercial', price: 3.0, royaltyBPS: 1000, genre: 'Electronic', bpm: 132, key: 'Gm', duration: 200, purchases: 23 },
];

export const portfolioHoldings: PortfolioHolding[] = [
    { id: '1', name: '$VEX', type: 'Coin', amount: 5000, value: 11_700, costBasis: 8_500, change24h: 12.5, image: '' },
    { id: '2', name: '$NEX', type: 'Coin', amount: 2000, value: 10_240, costBasis: 6_000, change24h: 28.7, image: '' },
    { id: '3', name: 'Neon Dreams Bond', type: 'Bond', amount: 1, value: 5_000, costBasis: 5_000, change24h: 0.5, image: '' },
    { id: '4', name: '$AUDIO', type: 'Coin', amount: 25_000, value: 112_500, costBasis: 75_000, change24h: 4.2, image: '' },
    { id: '5', name: 'Resonance Melody Stem', type: 'Stem', amount: 1, value: 2_400, costBasis: 2_000, change24h: 8.0, image: '' },
    { id: '6', name: 'Discovery NFT #47', type: 'NFT', amount: 1, value: 1_250, costBasis: 250, change24h: -2.1, image: '' },
];

// Deterministic pseudo-random to avoid server/client hydration mismatch
function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export const portfolioHistory = Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    value: Math.round(120000 + seededRandom(i + 42) * 30000 + i * 500),
}));

export const platformStats = {
    tvl: 14_500_000,
    activeWallets: 23_456,
    artistsLaunched: 142,
    audioPrice: 4.50,
    audioPriceChange: 6.8,
    totalVolume: 8_900_000,
    discoveryNFTs: 12_345,
};
