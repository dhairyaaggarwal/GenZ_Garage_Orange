import React from 'react';
import { InvestmentPlan, UserProfile } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Button } from './Button';
import { Download, Share2, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

interface DashboardProps {
  plan: InvestmentPlan;
  user: UserProfile;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ plan, user, onReset }) => {
  const formatPercentage = (val: number) => `${val}%`;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="text-center py-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-2">
          <Sparkles size={16} />
          <span>Curated for {user.name}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          {plan.summary}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Based on your goal to <span className="text-orange-600 font-medium">{user.financialGoals[0] || 'grow wealth'}</span> and your {user.riskAppetite.toLowerCase()} risk comfort.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Chart & Allocations */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-lg shadow-orange-100/50 border border-orange-50">
            <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">Your Asset Mix</h3>
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
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                   <span className="block text-3xl font-bold text-gray-800">100%</span>
                   <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Diversified</span>
                 </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {plan.allocations.map((alloc) => (
                <div key={alloc.assetClass} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: alloc.color }}></div>
                    <span className="font-medium text-gray-700">{alloc.assetClass}</span>
                  </div>
                  <span className="font-bold text-gray-900">{alloc.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Reasoning & Steps */}
        <div className="md:col-span-7 space-y-6">
          {/* Rationale Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Why this plan works for you</h3>
            </div>
            <div className="prose prose-orange text-gray-600 leading-relaxed">
              <p>{plan.rationale}</p>
            </div>
          </div>

          {/* Action Steps */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 rounded-3xl text-white shadow-lg shadow-orange-500/20">
             <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/20 p-2 rounded-lg text-white">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold">Your First Steps</h3>
            </div>
            <ul className="space-y-4">
              {plan.firstSteps.map((step, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                   <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-orange-600 font-bold flex items-center justify-center text-sm shadow-sm">
                     {idx + 1}
                   </span>
                   <span className="pt-1 font-medium text-orange-50 leading-snug">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center gap-4">
        <Button variant="outline" onClick={onReset} className="flex items-center gap-2">
          Start Over
        </Button>
        <Button variant="secondary" className="flex items-center gap-2 text-gray-600">
          <Share2 size={18} /> Share
        </Button>
        <Button variant="secondary" className="flex items-center gap-2 text-gray-600">
          <Download size={18} /> Save Plan
        </Button>
      </div>
    </div>
  );
};