// Web3 wallet connection utilities (simulated for MVP)

export interface WalletState {
    isConnected: boolean;
    address: string | null;
    balance: number;
    chainId: number;
    chainName: string;
}

const INITIAL_STATE: WalletState = {
    isConnected: false,
    address: null,
    balance: 0,
    chainId: 137,
    chainName: 'Polygon',
};

// Simulated wallet for demo
export function getSimulatedWallet(): WalletState {
    return {
        isConnected: true,
        address: '0x7a3d...f82e',
        balance: 4.52,
        chainId: 137,
        chainName: 'Polygon',
    };
}

export function formatAddress(address: string): string {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatUSD(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number): string {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString();
}

export function formatPercent(value: number): string {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
}
