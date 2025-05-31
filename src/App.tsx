import { useState } from 'react';
import { Sun, Moon, Settings } from 'lucide-react';
import WeatherWidget from './components/widgets/WeatherWidget';
import NewsWidget from './components/widgets/NewsWidget';
import FinanceWidget from './components/widgets/FinanceWidget';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-background text-foreground min-h-screen">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">PGAGI Analytics Dashboard</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Weather Widget */}
            <div className="col-span-1">
              <WeatherWidget />
            </div>

            {/* News Widget */}
            <div className="col-span-1 md:col-span-2">
              <NewsWidget />
            </div>

            {/* Finance Widget */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <FinanceWidget />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t mt-8">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} PGAGI Analytics Dashboard. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App; 