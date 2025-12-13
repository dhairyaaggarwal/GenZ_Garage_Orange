import React, { useState } from 'react';
import { Button } from './Button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { setValue, persistOnboardingState } from '../utils/onboardingState';

interface CreatePlaylistCompaniesScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

const COMPANIES_DATA = [
  { name: "Tata Group", domain: "tata.com" },
  { name: "Reliance Industries", domain: "ril.com" },
  { name: "HDFC Bank", domain: "hdfcbank.com" },
  { name: "ICICI Bank", domain: "icicibank.com" },
  { name: "Infosys", domain: "infosys.com" },
  { name: "TCS", domain: "tcs.com" },
  { name: "Wipro", domain: "wipro.com" },
  { name: "Paytm", domain: "paytm.com" },
  { name: "Groww", domain: "groww.in" },
  { name: "Zomato", domain: "zomato.com" },
  { name: "Swiggy", domain: "swiggy.com" },
  { name: "Nykaa", domain: "nykaa.com" },
  { name: "Flipkart", domain: "flipkart.com" },
  { name: "Amazon India", domain: "amazon.in" },
  { name: "Jio", domain: "jio.com" },
  { name: "Airtel", domain: "airtel.in" },
  { name: "Bajaj Finance", domain: "bajajfinserv.in" },
  { name: "Larsen & Toubro", domain: "larsentoubro.com" },
  { name: "ITC", domain: "itc.in" },
  { name: "Asian Paints", domain: "asianpaints.com" },
];

export const CreatePlaylistCompaniesScreen: React.FC<CreatePlaylistCompaniesScreenProps> = ({ onBack, onContinue }) => {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const toggleCompany = (name: string) => {
    if (selectedCompanies.includes(name)) {
      setSelectedCompanies(selectedCompanies.filter(c => c !== name));
    } else {
      setSelectedCompanies([...selectedCompanies, name]);
    }
  };

  const handleNext = () => {
    setValue('playlistCompanies', selectedCompanies);
    persistOnboardingState();
    onContinue();
  };

  const handleSkip = () => {
    setValue('playlistCompanies', []);
    persistOnboardingState();
    onContinue();
  };

  const getLogoUrl = (domain: string) => 
    `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111827] font-sans overflow-hidden animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Title */}
      <div className="px-6 pb-6">
         <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 uppercase">
            Companies <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">you are excited about</span>
         </h1>
         <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
            Select the brands you trust or relate to.
         </p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-40 custom-scrollbar">
         <div className="grid grid-cols-3 gap-3">
            {COMPANIES_DATA.map((item) => {
              const isSelected = selectedCompanies.includes(item.name);
              return (
                <button
                  key={item.name}
                  onClick={() => toggleCompany(item.name)}
                  className={`
                    relative group flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200
                    ${isSelected ? 'bg-white/10 ring-2 ring-orange-500 scale-[0.98]' : 'bg-gray-800 hover:bg-gray-700 active:scale-[0.98]'}
                  `}
                  style={{ aspectRatio: '1/1' }}
                >
                   {isSelected && (
                      <div className="absolute top-2 right-2 text-orange-500 z-10 animate-in zoom-in duration-200">
                         <CheckCircle2 size={16} fill="white" />
                      </div>
                   )}

                   <div className="w-10 h-10 rounded-full bg-white p-1.5 mb-2 overflow-hidden flex items-center justify-center">
                      <img 
                        src={getLogoUrl(item.domain)} 
                        alt={item.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.style.display = 'none';
                           if (target.parentElement) {
                                target.parentElement.style.backgroundColor = '#ffedd5'; // orange-100
                                target.parentElement.innerHTML = `<span class="text-orange-600 font-bold text-xs">${item.name.substring(0, 2).toUpperCase()}</span>`;
                           }
                        }}
                      />
                   </div>
                   
                   <span className={`text-[10px] font-bold text-center leading-tight ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                     {item.name}
                   </span>
                </button>
              );
            })}
         </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full p-6 pb-8 bg-gradient-to-t from-[#111827] via-[#111827] to-transparent z-30">
         <div className="max-w-md mx-auto flex flex-col gap-3">
            <Button 
               onClick={handleNext}
               className="w-full rounded-full py-4 text-lg shadow-[0_0_20px_rgba(249,115,22,0.4)] bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white font-bold border-none transition-all"
            >
               Next
            </Button>
            <button 
               onClick={handleSkip}
               className="text-sm font-bold text-gray-500 hover:text-white transition-colors py-2"
            >
               Skip
            </button>
         </div>
      </div>

    </div>
  );
};