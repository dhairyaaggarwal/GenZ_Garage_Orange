import React from 'react';
import { InvestmentPlan, UserProfile } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from './Button';
import { Download, Share2, Sparkles, TrendingUp, ShieldCheck, Info } from 'lucide-react';

interface DashboardProps {
  plan: InvestmentPlan;
  user: UserProfile;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ plan, user, onReset }) => {
  const rp = user.riskProfile;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="text-center py-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-2">
          <Sparkles size={16} />
          <span>Profile: {rp?.type} (Score: {rp?.score}/25)</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          {plan.summary}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Hey {user.name}, we've crafted this for your goal to <span className="text-orange-600 font-medium">{user.financialGoals[0] || 'grow wealth'}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Chart & Allocations */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-lg shadow-orange-100/50 border border-orange-50">
            <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">Portfolio Mix</h3>
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={plan.allocations as any}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="percentage"
                  >
                    {plan.allocations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Allocation']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                   <span className="block text-2xl font-bold text-gray-900">{rp?.type}</span>
                   <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Strategy</span>
                 </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {plan.allocations.map((alloc) => (
                <div key={alloc.assetClass} className="flex items-center justify-between p-3 rounded-xl bg-orange-50/30 border border-transparent hover:border-orange-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: alloc.color }}></div>
                    <span className="font-medium text-sm text-gray-700">{alloc.assetClass}</span>
                  </div>
                  <span className="font-bold text-gray-900">{alloc.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Outlook Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl text-white shadow-xl">
             <div className="flex items-center gap-2 mb-4 opacity-80 uppercase text-[10px] font-bold tracking-widest">
                <TrendingUp size={14} />
                <span>Performance Outlook</span>
             </div>
             <div className="flex justify-between items-end">
                <div>
                   <p className="text-3xl font-bold">{plan.expectedReturn || rp?.returns}</p>
                   <p className="text-xs text-gray-400">Est. Annual Return</p>
                </div>
                <div className="text-right">
                   <p className="text-lg font-bold text-yellow-400">{plan.riskLevel || rp?.risk_level}</p>
                   <p className="text-xs text-gray-400">Risk Level</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Reasoning & Steps */}
        <div className="md:col-span-7 space-y-6">
          {/* Rationale Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                <Info size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Why this mix?</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              {plan.rationale}
            </p>
          </div>

          {/* Action Steps */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 rounded-3xl text-white shadow-lg shadow-orange-500/20">
             <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/20 p-2 rounded-lg text-white">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold">Your 3-Step Launch</h3>
            </div>
            <ul className="space-y-4">
              {plan.firstSteps.map((step, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                   <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-orange-600 font-bold flex items-center justify-center text-sm shadow-sm">
                     {idx + 1}
                   </span>
                   <span className="pt-1 font-medium text-orange-50 leading-snug text-lg">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Button variant="outline" onClick={onReset} className="flex items-center gap-2">
          Start Over
        </Button>
        <Button variant="secondary" className="flex items-center gap-2 text-gray-600">
          <Share2 size={18} /> Share
        </Button>
        <Button variant="secondary" className="flex items-center gap-2 text-gray-600">
          <Download size={18} /> Save PDF
        </Button>
      </div>
    </div>
  );
};