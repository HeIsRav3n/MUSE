import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN || '8468516167:AAHLPb_iE2TwOw0cXqjy93Q6EzSZD6M82vQ';
const webAppUrl = process.env.WEBAPP_URL || 'https://sonara-2-0.vercel.app';

// User session management
interface UserSession {
    chatId: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    lastActivity: Date;
    preferences: {
        favoriteGenre?: string;
        notificationEnabled: boolean;
        autoPlay: boolean;
    };
}

// In-memory session store (replace with Redis in production)
const userSessions = new Map<number, UserSession>();

// Singleton instance
let bot: TelegramBot | null = null;

export const getBot = () => {
    if (!bot) {
        bot = new TelegramBot(token, { polling: false });
    }
    return bot;
};

// Get or create user session
export const getUserSession = (chatId: number, userInfo?: Partial<UserSession>): UserSession => {
    if (!userSessions.has(chatId)) {
        userSessions.set(chatId, {
            chatId,
            username: userInfo?.username,
            firstName: userInfo?.firstName,
            lastName: userInfo?.lastName,
            lastActivity: new Date(),
            preferences: {
                notificationEnabled: true,
                autoPlay: false
            }
        });
    }

    const session = userSessions.get(chatId)!;
    session.lastActivity = new Date();
    return session;
};

// Helper to send the main menu
export const sendMainMenu = async (chatId: number) => {
    const b = getBot();
    if (!b) return;

    await b.sendMessage(chatId, '🎵 *Welcome to SONARA Music Protocol* 🎵\n\nDiscover hidden gems, invest in artists, and earn rewards in the decentralized music economy.', {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: "🚀 Launch Mini App", web_app: { url: webAppUrl } }],
                [{ text: "🎵 Trending Tracks", callback_data: "trending" }, { text: "🔥 New Releases", callback_data: "new_releases" }],
                [{ text: "⭐ My Favorites", callback_data: "favorites" }, { text: "📊 My Portfolio", callback_data: "portfolio" }],
                [{ text: "⚙️ Settings", callback_data: "settings" }, { text: "❓ Help", callback_data: "help" }],
                [{ text: "🐦 Follow Us", url: "https://twitter.com/sonara_music" }, { text: "🌐 Website", url: "https://sonara.music" }]
            ]
        }
    });
};

// Send trending tracks
export const sendTrendingTracks = async (chatId: number) => {
    const b = getBot();
    if (!b) return;

    await b.sendMessage(chatId, '📈 *Trending Tracks This Week*\n\nTop performing tracks based on plays and investments:', {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: "▶️ Play All Trending", callback_data: "play_trending" }],
                [{ text: "💎 Premium Picks", callback_data: "premium_tracks" }],
                [{ text: "🔙 Back to Menu", callback_data: "main_menu" }]
            ]
        }
    });
};

// Send new releases
export const sendNewReleases = async (chatId: number) => {
    const b = getBot();
    if (!b) return;

    await b.sendMessage(chatId, '🎉 *New Releases*\n\nFresh music from emerging artists:', {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: "🎧 Listen Now", callback_data: "play_new" }],
                [{ text: "⭐ Add to Favorites", callback_data: "add_favorites" }],
                [{ text: "🔙 Back to Menu", callback_data: "main_menu" }]
            ]
        }
    });
};

// Send user favorites
export const sendUserFavorites = async (chatId: number) => {
    const b = getBot();
    if (!b) return;

    await b.sendMessage(chatId, '⭐ *Your Favorites*\n\nYour saved tracks and artists:', {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: "▶️ Play Favorites", callback_data: "play_favorites" }],
                [{ text: "🗑️ Clear Favorites", callback_data: "clear_favorites" }],
                [{ text: "🔙 Back to Menu", callback_data: "main_menu" }]
            ]
        }
    });
};

// Send portfolio overview
export const sendPortfolio = async (chatId: number) => {
    const b = getBot();
    if (!b) return;

    await b.sendMessage(chatId, '📊 *Your Music Portfolio*\n\nTrack your investments and earnings:', {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: "💰 Total Value: $0.00", callback_data: "refresh_portfolio" }],
                [{ text: "📈 Performance", callback_data: "performance" }],
                [{ text: "💸 Withdraw", callback_data: "withdraw" }],
                [{ text: "🔙 Back to Menu", callback_data: "main_menu" }]
            ]
        }
    });
};

// Send settings menu
export const sendSettings = async (chatId: number) => {
    const b = getBot();
    if (!b) return;

    const session = getUserSession(chatId);

    await b.sendMessage(chatId, '⚙️ *Settings*\n\nCustomize your SONARA experience:', {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{
                    text: `🔔 Notifications: ${session.preferences.notificationEnabled ? '✅ On' : '❌ Off'}`,
                    callback_data: "toggle_notifications"
                }],
                [{
                    text: `▶️ Auto-play: ${session.preferences.autoPlay ? '✅ On' : '❌ Off'}`,
                    callback_data: "toggle_autoplay"
                }],
                [{ text: "🎵 Genre Preferences", callback_data: "genre_settings" }],
                [{ text: "📱 Connect Wallet", callback_data: "connect_wallet" }],
                [{ text: "🔙 Back to Menu", callback_data: "main_menu" }]
            ]
        }
    });
};

// Send help information
export const sendHelp = async (chatId: number) => {
    const b = getBot();
    if (!b) return;

    await b.sendMessage(chatId, '❓ *Help & Support*\n\n*Available Commands:*\n\n`/start` - Start the bot\n`/trending` - Show trending tracks\n`/new` - New releases\n`/favorites` - Your favorites\n`/portfolio` - Your investments\n`/settings` - Bot settings\n`/help` - This help message\n\n*Need more help?* Visit our website or contact support.', {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: "📚 Documentation", url: "https://docs.sonara.music" }],
                [{ text: "💬 Support Chat", url: "https://t.me/iSonara_bot" }],
                [{ text: "🐦 Twitter Updates", url: "https://twitter.com/sonara_music" }],
                [{ text: "🔙 Back to Menu", callback_data: "main_menu" }]
            ]
        }
    });
};

// Send track preview (simulated)
export const sendTrackPreview = async (chatId: number, trackTitle: string, artist: string) => {
    const b = getBot();
    if (!b) return;

    await b.sendAudio(chatId, 'https://example.com/track-preview.mp3', {
        title: trackTitle,
        performer: artist,
        caption: `🎵 *${trackTitle}*\nby *${artist}*\n\n⭐ Rate this track or add to your favorites!`,
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: "⭐ Add to Favorites", callback_data: `fav_${trackTitle}` }],
                [{ text: "💎 Invest", callback_data: `invest_${trackTitle}` }],
                [{ text: "🔗 Share", callback_data: `share_${trackTitle}` }],
                [{ text: "▶️ Play in App", web_app: { url: `${webAppUrl}/player?track=${encodeURIComponent(trackTitle)}` } }]
            ]
        }
    });
};

// Send notification to user
export const sendNotification = async (chatId: number, message: string, urgent = false) => {
    const b = getBot();
    if (!b) return;

    const session = getUserSession(chatId);
    if (!session.preferences.notificationEnabled && !urgent) return;

    try {
        await b.sendMessage(chatId, `🔔 *SONARA Notification*\n\n${message}`, {
            parse_mode: 'Markdown'
        });
    } catch (error) {
        console.error('Failed to send notification:', error);
    }
};
