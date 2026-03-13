import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
    id: string;
    type: 'buy_coin' | 'sell_coin' | 'buy_nft' | 'invest_bond' | 'faucet' | 'bounty_reward';
    description: string;
    amount: number; // + for income, - for expense
    date: number;
}

export interface EconomyState {
    balance: number;
    portfolio: {
        coins: Record<string, number>; // coinId -> amount held
        nfts: string[]; // list of nft IDs owned
        bonds: Array<{ id: string; albumTitle: string; amount: number; date: number }>; // list of bond investments
    };
    transactions: Transaction[];
    isPremium: boolean;

    // Actions
    addFunds: (amount: number, source: string) => void;
    buyCoin: (coinId: string, coinName: string, amount: number, cost: number) => boolean;
    sellCoin: (coinId: string, coinName: string, amount: number, value: number) => boolean;
    buyNFT: (nftId: string, nftName: string, cost: number) => boolean;
    investBond: (bondId: string, albumTitle: string, amount: number) => boolean;
    setPremium: (v: boolean) => void;
    reset: () => void;
}

export const useEconomyStore = create<EconomyState>()(
    persist(
        (set, get) => ({
            balance: 10000, // Starting balance $10k
            portfolio: {
                coins: {},
                nfts: [],
                bonds: []
            },
            transactions: [],
            isPremium: true, // Default to true for the "Go Live" Premium experience

            addFunds: (amount: number, source: string = 'Funds Added') => set((state) => ({
                balance: state.balance + amount,
                transactions: [
                    { id: crypto.randomUUID(), type: 'faucet', description: source, amount, date: Date.now() },
                    ...state.transactions
                ]
            })),

            buyCoin: (coinId: string, coinName: string, amount: number, cost: number) => {
                const { balance, portfolio } = get();
                if (balance < cost) return false;

                const currentAmount = portfolio.coins[coinId] || 0;

                set((state) => ({
                    balance: state.balance - cost,
                    portfolio: {
                        ...state.portfolio,
                        coins: { ...state.portfolio.coins, [coinId]: currentAmount + amount }
                    },
                    transactions: [
                        { id: crypto.randomUUID(), type: 'buy_coin', description: `Bought ${amount} ${coinName}`, amount: -cost, date: Date.now() },
                        ...state.transactions
                    ]
                }));
                return true;
            },

            sellCoin: (coinId: string, coinName: string, amount: number, value: number) => {
                const { portfolio } = get();
                const currentAmount = portfolio.coins[coinId] || 0;
                if (currentAmount < amount) return false;

                set((state) => ({
                    balance: state.balance + value,
                    portfolio: {
                        ...state.portfolio,
                        coins: { ...state.portfolio.coins, [coinId]: currentAmount - amount }
                    },
                    transactions: [
                        { id: crypto.randomUUID(), type: 'sell_coin', description: `Sold ${amount} ${coinName}`, amount: value, date: Date.now() },
                        ...state.transactions
                    ]
                }));
                return true;
            },

            buyNFT: (nftId: string, nftName: string, cost: number) => {
                const { balance, portfolio } = get();
                if (balance < cost) return false;
                if (portfolio.nfts.includes(nftId)) return false; // Already owned

                set((state) => ({
                    balance: state.balance - cost,
                    portfolio: {
                        ...state.portfolio,
                        nfts: [...state.portfolio.nfts, nftId]
                    },
                    transactions: [
                        { id: crypto.randomUUID(), type: 'buy_nft', description: `Bought NFT: ${nftName}`, amount: -cost, date: Date.now() },
                        ...state.transactions
                    ]
                }));
                return true;
            },

            investBond: (bondId: string, albumTitle: string, amount: number) => {
                const { balance } = get();
                if (balance < amount) return false;

                set((state) => ({
                    balance: state.balance - amount,
                    portfolio: {
                        ...state.portfolio,
                        bonds: [...state.portfolio.bonds, { id: bondId, albumTitle, amount, date: Date.now() }]
                    },
                    transactions: [
                        { id: crypto.randomUUID(), type: 'invest_bond', description: `Invested in ${albumTitle}`, amount: -amount, date: Date.now() },
                        ...state.transactions
                    ]
                }));
                return true;
            },

            setPremium: (v: boolean) => set({ isPremium: v }),

            reset: () => set({ balance: 10000, portfolio: { coins: {}, nfts: [], bonds: [] }, transactions: [], isPremium: true })
        }),
        {
            name: 'muse-economy-store',
        }
    )
);
