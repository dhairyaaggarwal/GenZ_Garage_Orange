import React from 'react';
import { PlaylistDetailScreen } from './PlaylistDetailScreen';
import { getOnboardingState } from '../utils/onboardingState';

interface PlaylistDetailWrapperProps {
  onBack: () => void;
}

export const PlaylistDetailWrapper: React.FC<PlaylistDetailWrapperProps> = ({ onBack }) => {
  const state = getOnboardingState();
  const goal = state.playlistGoal || "Balanced";
  const interests = state.playlistInterests || [];

  // Map Goal to display text
  const goalMap: Record<string, string> = {
    aggressive: "Aggressive Growth",
    high: "High Growth",
    balanced: "Balanced Growth",
    conservative: "Stable Growth"
  };

  const title = `My ${goalMap[goal] || "Custom"} Mix`;
  
  // Construct Custom Details dynamically based on choices
  const customDetails = {
    description: `A personalized collection curated for your goal of ${goalMap[goal] || "growth"}, focusing on themes you love like ${interests.slice(0, 2).join(" & ") || "Market Leaders"}.`,
    trendValue: "↑ 18.2%",
    isPositive: true,
    holdings: [
      { name: "Nifty 50 ETF", trend: "↑ 12% 1Y", allocation: "30%", color: "text-green-600", domain: "nseindia.com" },
      { name: "Gold BeES", trend: "↑ 8% 1Y", allocation: "10%", color: "text-green-600", domain: "google.com" },
      { name: "Reliance Ind.", trend: "↑ 15% 1Y", allocation: "15%", color: "text-green-600", domain: "ril.com" },
      { name: "Tata Power", trend: "↑ 40% 1Y", allocation: "15%", color: "text-green-600", domain: "tatapower.com" },
      { name: "HDFC Bank", trend: "↑ 5% 1Y", allocation: "15%", color: "text-green-600", domain: "hdfcbank.com" },
      { name: "Infosys", trend: "↑ 10% 1Y", allocation: "15%", color: "text-green-600", domain: "infosys.com" },
    ],
    returns: { '1y': 18.2, '3y': 45.5, '5y': 78.0 }
  };

  const playlistSummary = {
    title: title,
    trend: "↑ 18% past 1Y",
    color: "bg-orange-100",
    iconColor: "bg-orange-500",
    emoji: "🎯"
  };

  return (
    <div className="h-full bg-white">
        <PlaylistDetailScreen 
        playlist={playlistSummary} 
        onBack={onBack} 
        customDetails={customDetails}
        />
    </div>
  );
};