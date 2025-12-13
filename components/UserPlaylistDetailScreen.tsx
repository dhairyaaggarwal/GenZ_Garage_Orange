import React, { useState } from 'react';
import { Button } from './Button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface UserPlaylistDetailScreenProps {
  playlist: any;
  onBack: () => void;
}

export const UserPlaylistDetailScreen: React.FC<UserPlaylistDetailScreenProps> = ({ playlist, onBack }) => {
  const details = playlist.customDetails || {};
  const reportData = details.reportData || { core: [], interests: [], companies: [] };
  
  // Track selected items (simple toggle logic for visual feedback)
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (name: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const isSelected = (name: string) => {
    // Default to true if not present in state map (initially all selected)
    return selectedItems[name] !== false;
  };

  const getLogoUrl = (domain: string) => 
    `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;

  const renderDonut = (pct: number, colorClass: string) => (
    <div className="w-8 h-8 relative shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
            <path className="text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="6" />
            <path className={colorClass} strokeDasharray={`${pct}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>
    </div>
  );

  const renderToggle = (item: any) => {
     const selected = isSelected(item.name);
     return (
        <div 
          onClick={() => toggleItem(item.name)}
          className={`flex items-center gap-3 cursor-pointer transition-all ${selected ? 'opacity-100' : 'opacity-50'}`}
        >
            <span className={`font-bold text-base ${selected ? 'text-white' : 'text-gray-500'}`}>{item.pct}</span>
            <div className={`w-6 h-6 rounded-full border-2 relative flex items-center justify-center transition-colors ${selected ? 'border-orange-500 bg-orange-500' : 'border-gray-600'}`}>
                {selected && <CheckCircle2 size={16} className="text-white" />}
            </div>
        </div>
     );
  };

  // Count active items
  const activeCount = 
    [...(reportData.core || []), ...(reportData.interests || []), ...(reportData.companies || [])]
    .filter((i: any) => isSelected(i.name)).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111827] font-sans overflow-hidden animate-in slide-in-from-right duration-300 relative z-50 text-white">
      
      {/* Header */}
      <div className="px-6 pt-12 pb-4 z-20 bg-[#111827] sticky top-0 shadow-xl shadow-[#111827]/50 flex items-center gap-4">
         <button 
           onClick={onBack}
           className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
         >
           <ArrowLeft size={24} />
         </button>
         <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">{playlist.title}</h1>
            <p className="text-gray-400 text-xs mt-0.5">{playlist.subtitle || "Created for you"}</p>
         </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar pb-40 scroll-smooth">
         
         {/* CORE */}
         {reportData.core && reportData.core.length > 0 && (
             <div className="mb-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-2">
                            <span className="text-orange-500">60%</span> CORE
                        </h3>
                        <p className="text-xs text-gray-400 font-medium mt-1">Providing higher growth with higher risk</p>
                    </div>
                    {renderDonut(60, "text-orange-500")}
                </div>

                <div className="space-y-5">
                   {reportData.core.map((item: any, idx: number) => (
                      <div key={idx} className={`flex items-center justify-between group ${!isSelected(item.name) && 'opacity-60'}`}>
                         <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center text-xl shadow-lg shrink-0`}>
                               {item.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base leading-tight mb-0.5">{item.name}</h4>
                                <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
                            </div>
                         </div>
                         {renderToggle(item)}
                      </div>
                   ))}
                </div>
                <div className="w-full h-px bg-gray-800 my-8"></div>
             </div>
         )}

         {/* INTERESTS */}
         {reportData.interests && reportData.interests.length > 0 && (
             <div className="mb-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-2">
                            <span className="text-orange-500">20%</span> INTERESTS
                        </h3>
                        <p className="text-xs text-gray-400 font-medium mt-1">Chosen from your interests</p>
                    </div>
                    {renderDonut(20, "text-orange-500")}
                </div>

                <div className="space-y-5">
                   {reportData.interests.map((item: any, idx: number) => (
                      <div key={idx} className={`flex items-center justify-between group ${!isSelected(item.name) && 'opacity-60'}`}>
                         <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center text-xl shadow-lg shrink-0`}>
                               {item.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base leading-tight mb-0.5">{item.name}</h4>
                                <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
                            </div>
                         </div>
                         {renderToggle(item)}
                      </div>
                   ))}
                </div>
                <div className="w-full h-px bg-gray-800 my-8"></div>
             </div>
         )}

         {/* COMPANIES */}
         {reportData.companies && reportData.companies.length > 0 && (
             <div className="mb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-2">
                            <span className="text-orange-500">20%</span> COMPANIES
                        </h3>
                        <p className="text-xs text-gray-400 font-medium mt-1">From companies you like</p>
                    </div>
                    {renderDonut(20, "text-orange-500")}
                </div>

                <div className="space-y-5">
                   {reportData.companies.map((item: any, idx: number) => (
                      <div key={idx} className={`flex items-center justify-between group ${!isSelected(item.name) && 'opacity-60'}`}>
                         <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center overflow-hidden p-1 shrink-0">
                               <img 
                                  src={getLogoUrl(item.domain)} 
                                  alt={item.name} 
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                     const target = e.target as HTMLImageElement;
                                     target.style.display = 'none';
                                     if (target.parentElement) {
                                        target.parentElement.style.backgroundColor = '#fed7aa';
                                        target.parentElement.innerHTML = `<span class="text-xs font-bold text-orange-800">${item.name.substring(0, 1)}</span>`;
                                     }
                                  }}
                               />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base leading-tight mb-0.5">{item.name}</h4>
                                <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
                            </div>
                         </div>
                         {renderToggle(item)}
                      </div>
                   ))}
                </div>
             </div>
         )}

      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[#111827] border-t border-gray-800 p-6 pb-10 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
         <div className="max-w-md mx-auto flex flex-col gap-4">
            <Button 
               disabled={activeCount === 0}
               className="w-full rounded-full py-4 text-lg bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white font-bold border-none shadow-lg shadow-orange-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
               Invest in {activeCount} items
            </Button>
         </div>
      </div>

    </div>
  );
};