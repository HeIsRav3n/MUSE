# 🎵 MUSE - Web3 Music Investment & Discovery Platform

> **Discover emerging artists, invest in music, and earn rewards in the decentralized music economy**

![MUSE Banner](https://img.shields.io/badge/Built%20By-RAV3N-purple) ![Powered By Audius](https://img.shields.io/badge/Powered%20By-Audius-blue) ![Web3 Music](https://img.shields.io/badge/Web3-Music-green)

## ✨ Features

### 🎶 Music Experience
- **Discover** trending tracks and emerging artists
- **Stream** high-quality music with seamless playback
- **Radio** live stations with global coverage
- **Party Mode** collaborative listening sessions

### 💰 Investment Platform
- **Tokenized Music** invest in artists and tracks
- **Portfolio Tracking** monitor your music investments
- **Revenue Sharing** earn from streaming royalties
- **Trading** buy/sell music tokens on decentralized exchange

### 🤖 Telegram Integration
- **Telegram Bot** with full music controls
- **Mini App** optimized for Telegram WebApp
- **Notifications** real-time updates and alerts
- **Social Sharing** share music with friends

### 🎨 Modern Interface
- **Dark/Light Theme** customizable appearance
- **Responsive Design** works on all devices
- **Smooth Animations** powered by Framer Motion
- **Audio Visualizer** immersive visual experience

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HeIsRav3n/muse.git
   cd muse
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Telegram Bot (optional)
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   WEBAPP_URL=https://your-deployment-url.vercel.app
   
   # Audius (optional)
   NEXT_PUBLIC_AUDIUS_APP_NAME=MUSE
   NEXT_PUBLIC_AUDIUS_ENDPOINT=https://discoveryprovider.audius.co
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js 13+ App Router
│   ├── api/            # API routes
│   ├── discover/       # Music discovery
│   ├── library/        # User library
│   ├── portfolio/      # Investment portfolio
│   ├── radio/          # Live radio
│   ├── settings/       # User settings
│   └── telegram/       # Telegram mini-app
├── components/         # React components
│   ├── layout/         # Layout components
│   ├── player/         # Music player
│   ├── ui/            # UI components
│   └── widgets/       # Interactive widgets
├── lib/               # Utilities and libraries
│   ├── audioStore.tsx # Zustand audio store
│   ├── telegramBot.ts # Telegram bot integration
│   ├── zenoSdk.ts    # Radio browser API
│   └── errorHandler.ts # Error management
└── styles/            # Global styles
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Telegram bot token for notifications | Optional |
| `WEBAPP_URL` | Deployment URL for Telegram mini-app | Optional |
| `NEXT_PUBLIC_AUDIUS_APP_NAME` | Audius application name | Optional |
| `NEXT_PUBLIC_AUDIUS_ENDPOINT` | Audius API endpoint | Optional |

### Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Set webhook (for production):
   ```bash
   curl -F "url=https://your-domain.com/api/telegram" https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook
   ```

## Project MUSE

MUSE is a next-generation decentralized music platform built for high-performance audio discovery and artist empowerment. 

> [!NOTE]
> **Status: MVP / Hackathon Readiness**
> This application is currently optimized for performance and aesthetic excellence. Core features like the Audio Engine, AI-DJ, and Theme System are fully operational. Web3 wallet connections are currently simulated for demonstration purposes.


## 🚀 Production Readiness
The application has undergone a comprehensive 10-point readiness audit:

1. **Code Review**: Static analysis and manual review completed.
2. **Security**: Audit of environment variables and Web3 simulation status.
3. **Automated Tests**: Unit tests implemented for core utilities using Vitest.
4. **Performance**: Optimized via dynamic imports, image optimization, and bundle splitting.
5. **UI/UX**: Themed for both Light (Elegant Crystal) and Dark modes.
6. **Documentation**: Comprehensive README and inline documentation.
7. **CI/CD**: GitHub Actions configured for automated linting and testing.
8. **Monitoring**: Performance monitoring singleton (LCP/FID/CLS) active.
9. **Deployment**: Vercel-ready configuration.

## 🎯 Usage

### As a Listener
1. Browse trending music on the Discover page
2. Create playlists and save favorites
3. Join Party Mode for collaborative listening
4. Explore live radio stations

### As an Investor  
1. Connect your wallet (Phantom/Solflare)
2. Browse investable tracks and artists
3. Purchase music tokens
4. Track your portfolio performance
5. Earn streaming royalties

### Telegram Features
1. Start conversation with [@muse_music_bot](https://t.me/muse_music_bot)
2. Use commands like `/trending`, `/new`, `/portfolio`
3. Launch mini-app for full experience
4. Receive notifications about your investments

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint checking
npm run typecheck # TypeScript checking
```

### Code Style
- TypeScript strict mode
- ESLint with Next.js rules
- Prettier code formatting
- Component-based architecture

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Other Platforms
- **Netlify**: `npm run build && npm run export`
- **Railway**: Connect GitHub repo for automatic deployment
- **Docker**: Containerized deployment available

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Audius** for decentralized music infrastructure
- **Next.js** for the amazing React framework
- **Telegram** for bot and mini-app platform
- **Web3** community for inspiration

## 📞 Support

- **Twitter**: [@muse_music](https://twitter.com/muse_music)
- **Telegram**: [@muse_support](https://t.me/muse_support)
- **Email**: support@muse.music
- **Discord**: Coming soon

## 🚨 Disclaimer

This is a demonstration project for educational purposes. Always do your own research before investing in any crypto assets.

---

**Built with ❤️ by [RAV3N](https://github.com/HeIsRav3n) • Powered by [Audius](https://audius.co)**