import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN || '8468516167:AAHLPb_iE2TwOw0cXqjy93Q6EzSZD6M82vQ';
const webAppUrl = process.env.WEBAPP_URL || 'https://sonara-music.vercel.app';

if (webAppUrl === 'https://sonara-music.vercel.app') {
    console.warn('⚠️ WARNING: Using placeholder WebApp URL. The Mini App will NOT load unless you deploy or use a tunnel.');
}

console.log('🤖 Starting SONARA Bot in Polling Mode...');

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    console.log(`Received message from ${msg.from?.username}: ${text}`);

    if (text === '/start') {
        await bot.sendMessage(chatId, '🎵 *Welcome to SONARA* 🎵\n\nDiscover hidden gems, invest in artists, and earn rewards.', {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🚀 Launch Mini App", web_app: { url: webAppUrl } }]
                ]
            }
        });
    } else if (text === '/help') {
        await bot.sendMessage(chatId, 'Need help? Visit our website or join the community group.');
    } else {
        await bot.sendMessage(chatId, 'I am a gateway to the SONARA App. Click "Launch" to start.');
    }
});

console.log('✅ Bot is running!');
