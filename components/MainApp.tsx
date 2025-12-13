import React, { useState } from 'react';
import { HomeScreen } from './HomeScreen';
import { PlaylistDetailScreen } from './PlaylistDetailScreen';
import { UserPlaylistDetailScreen } from './UserPlaylistDetailScreen';
import { StockDetailScreen } from './StockDetailScreen';
import { ETFDetailScreen } from './ETFDetailScreen';
import { Home, MessageCircle, Sparkles } from 'lucide-react';

interface MainAppProps {
  onRetakeQuiz?: () => void;
}

type Tab = 'home' | 'buddy';

export const MainApp: React.FC<MainAppProps> = ({ onRetakeQuiz }) => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [selectedETF, setSelectedETF] = useState<any | null>(null);

  const handlePlaylistClick = (playlist: any) => {
    setSelectedPlaylist(playlist);
  };

  const handleStockClick = (stock: any) => {
    setSelectedStock(stock);
  };

  const handleETFClick = (etf: any) => {
    setSelectedETF(etf);
  };

  const handleBackToHome = () => {
    setSelectedPlaylist(null);
    setSelectedStock(null);
    setSelectedETF(null);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'home' && !selectedPlaylist && !selectedStock && !selectedETF && (
          <HomeScreen 
            onPlaylistClick={handlePlaylistClick} 
            onRetakeQuiz={onRetakeQuiz}
            onStockClick={handleStockClick}
            onETFClick={handleETFClick}
          />
        )}

        {/* Detail Screen Overlays */}
        {selectedPlaylist && (
           <div className="absolute inset-0 z-50 bg-white">
             {selectedPlaylist.isUserGenerated ? (
                <UserPlaylistDetailScreen
                  playlist={selectedPlaylist}
                  onBack={handleBackToHome}
                />
             ) : (
                <PlaylistDetailScreen 
                  playlist={selectedPlaylist} 
                  onBack={handleBackToHome} 
                />
             )}
           </div>
        )}

        {selectedStock && (
           <div className="absolute inset-0 z-50 bg-white">
              <StockDetailScreen 
                stock={selectedStock}
                onBack={handleBackToHome}
              />
           </div>
        )}

        {selectedETF && (
           <div className="absolute inset-0 z-50 bg-white">
              <ETFDetailScreen 
                etf={selectedETF}
                onBack={handleBackToHome}
              />
           </div>
        )}
        
        {activeTab === 'buddy' && !selectedPlaylist && !selectedStock && !selectedETF && (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
             <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-6 animate-pulse">
                <Sparkles className="text-orange-500 w-10 h-10" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Buddy Assistant</h2>
             <p className="text-gray-500 max-w-xs">
               Your AI financial companion is ready to chat. (Placeholder for Buddy Screen)
             </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation - Hidden on Detail Screens */}
      {!selectedPlaylist && !selectedStock && !selectedETF && (
        <nav className="h-[80px] bg-white border-t border-gray-100 flex justify-around items-center px-6 pb-4 pt-2 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-50">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 w-16 ${
              activeTab === 'home' ? 'text-orange-600 -translate-y-1' : 'text-gray-400'
            }`}
          >
            <Home size={26} strokeWidth={activeTab === 'home' ? 3 : 2} fill={activeTab === 'home' ? "currentColor" : "none"} className={activeTab === 'home' ? "opacity-100" : "opacity-80"} />
            <span className="text-[10px] font-bold tracking-wide">Home</span>
          </button>

          <button 
            onClick={() => setActiveTab('buddy')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 w-16 ${
              activeTab === 'buddy' ? 'text-orange-600 -translate-y-1' : 'text-gray-400'
            }`}
          >
            <div className="relative">
               <MessageCircle size={26} strokeWidth={activeTab === 'buddy' ? 3 : 2} fill={activeTab === 'buddy' ? "currentColor" : "none"} className={activeTab === 'buddy' ? "opacity-100" : "opacity-80"} />
               {/* Notification Dot */}
               <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </div>
            <span className="text-[10px] font-bold tracking-wide">Buddy</span>
          </button>
        </nav>
      )}
    </div>
  );
};