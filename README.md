# PGAGI Analytics Dashboard

A comprehensive analytics dashboard built with Next.js, React, TypeScript, and modern web technologies. This dashboard integrates multiple APIs to provide real-time data visualization and analytics.

## Features

- 🌤️ Weather Information with 7-day forecast
- 📰 Real-time News Feed with category filtering
- 📈 Stock Market Data with interactive charts
- 🎨 Beautiful UI with dark/light mode support
- 🔄 Real-time data updates
- 🌐 Multi-language support
- 📱 Fully responsive design
- ♿ WCAG 2.1 compliant accessibility
- 🎭 Advanced animations and transitions
- 🔒 Secure authentication system

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS, SCSS
- **State Management:** Redux Toolkit with RTK Query
- **Data Fetching:** React Query
- **Authentication:** NextAuth.js
- **Animations:** Framer Motion, Three.js
- **Charts:** Recharts
- **Testing:** Jest, React Testing Library, Cypress
- **Internationalization:** i18next
- **Code Quality:** ESLint, Prettier, Husky

## Prerequisites

- Node.js >= 18
- npm or yarn
- API keys for:
  - OpenWeatherMap API
  - NewsAPI
  - Alpha Vantage API

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pgagi-analytics-dashboard.git
   cd pgagi-analytics-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your API keys:
   ```env
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
   NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key
   NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
   NEXT_PUBLIC_NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── services/           # API service integrations
├── store/              # Redux store configuration
├── styles/             # Global styles and Tailwind config
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Testing

Run the test suite:

```bash
# Unit and integration tests
npm test

# End-to-end tests
npm run cypress:open
```

## Building for Production

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)
