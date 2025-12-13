
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, Share2, MoreVertical, MapPin, Calendar, Briefcase, Building2, Newspaper, TrendingUp, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { GoogleGenAI } from "@google/genai";

interface StockDetailScreenProps {
  stock: {
    name: string;
    symbol: string;
    domain: string;
  };
  onBack: () => void;
}

// Mock Data Database
const STOCK_DB: Record<string, any> = {
  "Reliance": {
    fullName: "Reliance Industries Ltd",
    desc: "Diversified Indian conglomerate operating in energy, retail, and telecom",
    price: "2,345.65",
    logo: "ril.com",
    about: {
      listed: "NSE / BSE",
      founded: "1973",
      hq: "Mumbai, India",
      industry: "Conglomerate",
      bio: "Reliance Industries operates businesses across energy, retail, and digital services. It owns brands and platforms like Jio and Reliance Retail used by millions of people across India.",
      leadership: [
        { 
          name: "Mukesh Ambani", 
          role: "Chairman & MD",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Mukesh_Ambani.jpg/220px-Mukesh_Ambani.jpg"
        },
        { 
          name: "Isha Ambani", 
          role: "Director, Retail",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Isha_Ambani_at_NMACC_launch.jpg/220px-Isha_Ambani_at_NMACC_launch.jpg"
        }
      ]
    },
    basics: {
      size: "India's largest company by market value",
      maturity: "Operating for several decades with a strong history",
      growth: "Business has expanded steadily from textiles to energy and tech"
    },
    news: [
      { source: "LiveMint", headline: "Reliance to expand retail footprint in rural India", date: "2 days ago" },
      { source: "Economic Times", headline: "Jio announces new plans for home broadband", date: "1 week ago" },
      { source: "CNBC TV18", headline: "Reliance green energy initiative gets global attention", date: "2 weeks ago" }
    ]
  },
  "TCS": {
    fullName: "Tata Consultancy Services",
    desc: "Global leader in IT services, consulting, and business solutions",
    price: "3,890.10",
    logo: "tcs.com",
    about: {
      listed: "NSE / BSE",
      founded: "1968",
      hq: "Mumbai, India",
      industry: "IT Services",
      bio: "TCS helps businesses around the world solve complex problems using technology. It is part of the Tata Group and employs over 600,000 people globally.",
      leadership: [
        { 
          name: "K. Krithivasan", 
          role: "CEO",
          imageUrl: "" // Fallback to initials
        },
        { 
          name: "N. Chandrasekaran", 
          role: "Chairman",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Natarajan_Chandrasekaran_2019_%28cropped%29.jpg/220px-Natarajan_Chandrasekaran_2019_%28cropped%29.jpg"
        }
      ]
    },
    basics: {
      size: "One of the largest IT companies in the world",
      maturity: "Highly mature business with consistent dividends",
      growth: "Steady growth driven by global demand for technology"
    },
    news: [
      { source: "MoneyControl", headline: "TCS secures major deal with UK insurer", date: "1 day ago" },
      { source: "Business Standard", headline: "TCS to hire 40,000 freshers this year", date: "3 days ago" }
    ]
  },
  "HDFC Bank": {
    fullName: "HDFC Bank",
    desc: "India's largest private sector bank providing banking and financial services",
    price: "1,650.45",
    logo: "hdfcbank.com",
    about: {
      listed: "NSE / BSE",
      founded: "1994",
      hq: "Mumbai, India",
      industry: "Banking",
      bio: "HDFC Bank provides banking services like savings accounts, loans, and credit cards. It is known for its wide network of ATMs and digital banking app.",
      leadership: [
        { name: "Sashidhar Jagdishan", role: "CEO", imageUrl: "" },
        { name: "Atanu Chakraborty", role: "Chairman", imageUrl: "" }
      ]
    },
    basics: {
      size: "Largest private bank in India",
      maturity: "Well-established with a very strong track record",
      growth: "Consistent growth in loans and deposits year over year"
    },
    news: [
      { source: "The Hindu", headline: "HDFC Bank opens 100 new branches in North East", date: "5 days ago" },
      { source: "NDTV Profit", headline: "Quarterly results show steady profit growth", date: "1 week ago" }
    ]
  }
};

const FALLBACK_DATA = {
  fullName: "Company Name",
  desc: "A leading company in its sector serving millions of customers",
  price: "1,250.00",
  about: {
    listed: "NSE / BSE",
    founded: "1990",
    hq: "Mumbai, India",
    industry: "General Sector",
    bio: "This company operates in a key sector of the Indian economy. It provides essential products or services and has a strong presence across the country.",
    leadership: [
      { name: "Managing Director", role: "CEO" },
      { name: "Director", role: "CFO" }
    ]
  },
  basics: {
    size: "Large and well-established company",
    maturity: "Operating for several decades",
    growth: "Business has expanded steadily over time"
  },
  news: [
    { source: "Market News", headline: "Company announces annual general meeting dates", date: "2 days ago" },
    { source: "India Business", headline: "Sector outlook remains positive for the coming year", date: "5 days ago" }
  ]
};

export const StockDetailScreen: React.FC<StockDetailScreenProps> = ({ stock, onBack }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'basics'>('about');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [fetchedLeadership, setFetchedLeadership] = useState<any[] | null>(null);
  const [loadingLeadership, setLoadingLeadership] = useState(false);

  const data = STOCK_DB[stock.name] || { ...FALLBACK_DATA, fullName: stock.name };
  
  const getLogoUrl = (domain: string) => 
    `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;

  // Fetch real leadership data using Gemini
  useEffect(() => {
    // If we have hardcoded data for this stock, we can skip fetching or fetch to update/expand
    // For now, let's fetch to try and get better data if available, but respect hardcoded if fetch fails.
    
    const fetchRealLeadership = async () => {
      if (!process.env.API_KEY) return;
      
      setLoadingLeadership(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = "gemini-2.5-flash";
        // Refined prompt to prioritize Wikimedia Commons URLs
        const prompt = `Identify the current key leadership (CEO, Managing Director, Chairman) for the Indian company "${stock.name}". 
        Return a JSON object strictly with this schema: 
        { 
          "leadership": [
            { 
              "name": "Full Name", 
              "role": "Job Title",
              "imageUrl": "URL to a public photo on Wikimedia Commons (e.g. upload.wikimedia.org...). If a Wikimedia image is not available, leave this empty."
            }
          ] 
        }. 
        Limit to the top 4 most important people.`;

        const result = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });

        if (result.text) {
          const parsed = JSON.parse(result.text);
          if (parsed.leadership && Array.isArray(parsed.leadership)) {
            // Filter out empty names
            const valid = parsed.leadership.filter((p: any) => p.name);
            if (valid.length > 0) {
                setFetchedLeadership(valid);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch real leadership data", error);
      } finally {
        setLoadingLeadership(false);
      }
    };

    setFetchedLeadership(null);
    fetchRealLeadership();
  }, [stock.name]);

  // Use fetched data if available, otherwise fall back to static DB data
  const leadershipToShow = fetchedLeadership || data.about.leadership;

  return (
    <div className="flex-1 h-full bg-white flex flex-col font-sans overflow-hidden animate-in slide-in-from-right duration-300 relative z-50">
      
      {/* Header */}
      <div className="px-4 pt-12 pb-4 flex items-center justify-between bg-white sticky top-0 z-30 border-b border-gray-50">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-700 hover:bg-gray-50 rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-gray-900 text-lg">{stock.name}</h1>
        <div className="flex items-center gap-1">
           <button 
             onClick={() => setIsBookmarked(!isBookmarked)}
             className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
           >
             <Bookmark size={22} fill={isBookmarked ? "#f97316" : "none"} className={isBookmarked ? "text-orange-500" : ""} />
           </button>
           <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
             <Share2 size={22} />
           </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
         
         {/* Company Identity */}
         <div className="px-6 py-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-4 flex items-center justify-center overflow-hidden">
               <img 
                 src={getLogoUrl(stock.domain)} 
                 alt={stock.name} 
                 className="w-full h-full object-contain"
                 onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    if ((e.target as HTMLImageElement).parentElement) {
                        (e.target as HTMLImageElement).parentElement!.innerText = stock.name[0];
                        (e.target as HTMLImageElement).parentElement!.classList.add("text-2xl", "font-bold", "text-gray-400");
                    }
                 }}
               />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{data.fullName}</h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{data.desc}</p>
         </div>

         {/* Price Section */}
         <div className="px-6 py-4 mb-6">
            <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Price</p>
               <p className="text-3xl font-black text-gray-900 mb-3">₹{data.price}</p>
               <div className="flex items-start gap-2 justify-center max-w-[80%] mx-auto">
                  <ShieldCheck size={16} className="text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-gray-400 font-medium leading-tight text-left">
                    Prices move daily. Long-term investing focuses on business quality over short-term movement.
                  </p>
               </div>
            </div>
         </div>

         {/* Invest CTA */}
         <div className="px-6 mb-8">
            <Button 
               className="w-full rounded-full py-4 text-lg font-bold shadow-lg shadow-orange-500/20"
            >
               Invest
            </Button>
         </div>

         {/* Tabs */}
         <div className="px-6 mb-6">
            <div className="bg-gray-100/80 p-1 rounded-full flex">
               <button
                 onClick={() => setActiveTab('about')}
                 className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${activeTab === 'about' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 About
               </button>
               <button
                 onClick={() => setActiveTab('basics')}
                 className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${activeTab === 'basics' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 Company Basics
               </button>
            </div>
         </div>

         {/* Tab Content */}
         <div className="px-6 pb-8">
            {activeTab === 'about' && (
               <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
                  
                  {/* Basic Details */}
                  <div className="space-y-4">
                     <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500 text-sm font-medium flex items-center gap-2"><Building2 size={16} /> Listed on</span>
                        <span className="text-gray-900 font-bold text-sm">{data.about.listed}</span>
                     </div>
                     <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500 text-sm font-medium flex items-center gap-2"><Calendar size={16} /> Founded</span>
                        <span className="text-gray-900 font-bold text-sm">{data.about.founded}</span>
                     </div>
                     <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500 text-sm font-medium flex items-center gap-2"><MapPin size={16} /> Headquarters</span>
                        <span className="text-gray-900 font-bold text-sm">{data.about.hq}</span>
                     </div>
                     <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500 text-sm font-medium flex items-center gap-2"><Briefcase size={16} /> Industry</span>
                        <span className="text-gray-900 font-bold text-sm">{data.about.industry}</span>
                     </div>
                  </div>

                  {/* Description */}
                  <div>
                     <h3 className="text-lg font-bold text-gray-900 mb-3">What they do</h3>
                     <p className="text-gray-600 leading-relaxed text-sm font-medium bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        {data.about.bio}
                     </p>
                  </div>

                  {/* Leadership */}
                  <div>
                     <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Leadership</h3>
                        {loadingLeadership && <Loader2 size={14} className="text-orange-500 animate-spin" />}
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        {leadershipToShow && leadershipToShow.length > 0 ? (
                           leadershipToShow.map((person: any, idx: number) => (
                              <div key={idx} className="flex flex-col items-center text-center p-3 border border-gray-100 rounded-2xl bg-white shadow-sm hover:border-orange-200 transition-colors animate-in fade-in duration-500 min-h-[140px] justify-center">
                                 {/* Image with Fallback */}
                                 <div className="w-16 h-16 mb-2 relative shrink-0">
                                    {person.imageUrl ? (
                                        <img 
                                        src={person.imageUrl} 
                                        alt={person.name} 
                                        className="w-full h-full rounded-full object-cover shadow-sm border border-gray-100 bg-gray-50"
                                        onError={(e) => {
                                            // Hide image on error
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            // Show fallback div (next sibling)
                                            const fallback = target.nextElementSibling as HTMLElement;
                                            if(fallback) fallback.style.display = 'flex';
                                        }}
                                        />
                                    ) : null}
                                    
                                    {/* Fallback Initials - Shown if no URL or if Image Errors */}
                                    <div 
                                        className="w-full h-full bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl absolute top-0 left-0"
                                        style={{ display: person.imageUrl ? 'none' : 'flex' }}
                                    >
                                        {person.name ? person.name[0] : "?"}
                                    </div>
                                 </div>

                                 <p className="text-gray-900 font-bold text-sm leading-tight mb-1 line-clamp-2">{person.name}</p>
                                 <p className="text-gray-500 text-xs font-medium line-clamp-1">{person.role}</p>
                              </div>
                           ))
                        ) : (
                           <p className="text-gray-400 text-sm col-span-2">Information not available</p>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'basics' && (
               <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                  
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                           <Building2 size={20} />
                        </div>
                        <h4 className="font-bold text-gray-900">Company Size</h4>
                     </div>
                     <p className="text-gray-600 text-sm leading-relaxed">{data.basics.size}</p>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                           <ShieldCheck size={20} />
                        </div>
                        <h4 className="font-bold text-gray-900">Business Maturity</h4>
                     </div>
                     <p className="text-gray-600 text-sm leading-relaxed">{data.basics.maturity}</p>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                           <TrendingUp size={20} />
                        </div>
                        <h4 className="font-bold text-gray-900">Growth Outlook</h4>
                     </div>
                     <p className="text-gray-600 text-sm leading-relaxed">{data.basics.growth}</p>
                  </div>

               </div>
            )}

            {/* News Section (Shared across tabs or at bottom) */}
            <div className="mt-10 pt-8 border-t border-gray-100">
               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Newspaper size={18} className="text-gray-400" /> In the news
               </h3>
               <div className="space-y-4">
                  {data.news.map((item: any, idx: number) => (
                     <div key={idx} className="flex flex-col gap-1 pb-4 border-b border-gray-50 last:border-0">
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                           <span>{item.source}</span>
                           <span>{item.date}</span>
                        </div>
                        <p className="text-gray-800 font-medium text-sm leading-snug hover:text-orange-600 transition-colors cursor-pointer">
                           {item.headline}
                        </p>
                     </div>
                  ))}
               </div>
            </div>

         </div>

      </div>
    </div>
  );
};
