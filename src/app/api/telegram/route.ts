import { NextRequest, NextResponse } from 'next/server';
import {
    getBot,
    sendMainMenu,
    sendTrendingTracks,
    sendNewReleases,
    sendUserFavorites,
    sendPortfolio,
    sendSettings,
    sendHelp,
    sendTrackPreview,
    getUserSession
} from '@/lib/telegramBot';

// This route handles Webhook updates from Telegram (Production)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const bot = getBot();

        // Handle callback queries (button presses)
        if (body.callback_query) {
            const chatId = body.callback_query.message.chat.id;
            const data = body.callback_query.data;
            const messageId = body.callback_query.message.message_id;

            // Answer callback query to remove loading state
            await bot?.answerCallbackQuery(body.callback_query.id);

            // Handle different callback actions
            switch (data) {
                case 'main_menu':
                    await sendMainMenu(chatId);
                    break;
                case 'trending':
                    await sendTrendingTracks(chatId);
                    break;
                case 'new_releases':
                    await sendNewReleases(chatId);
                    break;
                case 'favorites':
                    await sendUserFavorites(chatId);
                    break;
                case 'portfolio':
                    await sendPortfolio(chatId);
                    break;
                case 'settings':
                    await sendSettings(chatId);
                    break;
                case 'help':
                    await sendHelp(chatId);
                    break;
                case 'toggle_notifications':
                    const session = getUserSession(chatId);
                    session.preferences.notificationEnabled = !session.preferences.notificationEnabled;
                    await sendSettings(chatId);
                    break;
                case 'toggle_autoplay':
                    const session2 = getUserSession(chatId);
                    session2.preferences.autoPlay = !session2.preferences.autoPlay;
                    await sendSettings(chatId);
                    break;
                case 'play_trending':
                    // Simulate playing trending tracks
                    await sendTrackPreview(chatId, 'Summer Vibes', 'Ocean Waves');
                    break;
                case 'play_new':
                    await sendTrackPreview(chatId, 'New Beginning', 'Rising Star');
                    break;
                default:
                    if (data.startsWith('fav_')) {
                        const track = data.substring(4);
                        await bot?.sendMessage(chatId, `⭐ Added "${track}" to your favorites!`);
                    } else if (data.startsWith('invest_')) {
                        const track = data.substring(7);
                        await bot?.sendMessage(chatId, `💎 Investment options for "${track}" will be available in the mini-app.`);
                    }
                    break;
            }

            // Delete the previous message to keep chat clean
            try {
                await bot?.deleteMessage(chatId, messageId);
            } catch (deleteError) {
                console.log('Could not delete message (may be too old):', deleteError);
            }
        }

        // Handle regular messages
        if (body.message) {
            const chatId = body.message.chat.id;
            const text = body.message.text;
            const userInfo = {
                username: body.message.from.username,
                firstName: body.message.from.first_name,
                lastName: body.message.from.last_name
            };

            // Initialize user session
            getUserSession(chatId, userInfo);

            if (text === '/start') {
                await sendMainMenu(chatId);
            } else if (text === '/trending') {
                await sendTrendingTracks(chatId);
            } else if (text === '/new') {
                await sendNewReleases(chatId);
            } else if (text === '/favorites') {
                await sendUserFavorites(chatId);
            } else if (text === '/portfolio') {
                await sendPortfolio(chatId);
            } else if (text === '/settings') {
                await sendSettings(chatId);
            } else if (text === '/help') {
                await sendHelp(chatId);
            } else if (text.startsWith('/')) {
                await bot?.sendMessage(chatId, '🤔 Command not recognized. Type /help for available commands.');
            } else {
                await bot?.sendMessage(chatId, '🎵 I\'m your SONARA music assistant! Use the menu below to explore music or type /help for commands.', {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "🚀 Open Mini App", web_app: { url: process.env.WEBAPP_URL || 'https://sonara-2-0.vercel.app' } }],
                            [{ text: "❓ Help", callback_data: "help" }]
                        ]
                    }
                });
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error handling Telegram Webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
