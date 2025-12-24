
import React from 'react';
import { InvestmentPlan, UserProfile } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from './Button';
import { TrendingUp, ShieldCheck, Sparkles, Layers, ChevronRight } from 'lucide-react';

interface DashboardProps {
  plan: InvestmentPlan;
  user: UserProfile;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ plan, user, onReset }) => {
  const rp = user.riskProfile;

  // Ensure the risk profile is available before rendering the dashboard
  if (!rp) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-brand-text">Profile Missing</h2>
          <p className="text-brand-subtext">Something went wrong while loading your investment strategy.</p>
          <Button onClick={onReset}>Start Over</Button>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Equity', value: rp.equity_display },
    { name: 'Debt', value: rp.debt_display },
    { name: 'Gold', value: rp.gold },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-6 pb-24 relative z-10 animate-in fade-in duration-700">
        <div className="text-center py-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-secondary/10 text-brand-secondary text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} />
            <span>{rp.type} Profile</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-brand-text leading-tight">
            {plan.summary}
          </h1>
          <p className="text-lg text-brand-subtext max-w-2xl mx-auto font-medium">
            Hi {user.name}, we've optimized this strategy for your <span className="text-brand-secondary font-bold">future goals</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-[40px] shadow-xl border-2 border-brand-card">
              <h3 className="text-sm font-black text-brand-muted mb-8 uppercase tracking-widest text-center">Asset Allocation</h3>
              <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'Equity' ? '#9B7EEC' : entry.name === 'Debt' ? '#FFB7A5' : '#DFFF4F'} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFF', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="text-center">
                     <span className="block text-2xl font-black text-brand-text">{rp.score}</span>
                     <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Risk Score</span>
                   </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {chartData.map((alloc, i) => (
                  <div key={alloc.name} className="flex items-center justify-between p-4 rounded-2xl bg-brand-bg/30">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: alloc.name === 'Equity' ? '#9B7EEC' : alloc.name === 'Debt' ? '#FFB7A5' : '#DFFF4F' }}></div>
                      <span className="font-bold text-sm text-brand-subtext">{alloc.name}</span>
                    </div>
                    <span className="font-black text-brand-text">{alloc.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-xl border-2 border-brand-primary relative overflow-hidden">
               <div className="flex items-center gap-2 mb-6 text-brand-subtext uppercase text-[10px] font-black tracking-[0.2em]">
                  <TrendingUp size={16} />
                  <span>Growth Potential</span>
               </div>
               <div className="flex justify-between items-end">
                  <div>
                     <p className="text-4xl font-black text-brand-text">{rp.expected_annual_return}</p>
                     <p className="text-xs text-brand-subtext font-bold mt-1">Expected Annual Return</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-8">
            <div className="bg-white p-10 rounded-[40px] shadow-xl border-2 border-brand-card">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-brand-secondary/10 p-3 rounded-2xl text-brand-secondary">
                  <Layers size={28} />
                </div>
                <h3 className="text-2xl font-black text-brand-text">Why this works</h3>
              </div>
              <p className="text-brand-subtext font-medium leading-relaxed text-lg mb-4">
                {rp.explanation.why_this}
              </p>
              <div className="p-4 bg-brand-bg/20 rounded-2xl border border-brand-card">
                <p className="text-sm font-bold text-brand-text mb-1">What to expect:</p>
                <p className="text-sm text-brand-subtext italic">{rp.explanation.what_to_expect}</p>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] shadow-xl border-2 border-brand-success/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-brand-success/20 p-3 rounded-2xl text-brand-text">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-2xl font-black text-brand-text">First Steps</h3>
              </div>
              <ul className="space-y-6">
                {plan.firstSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-5 items-center">
                     <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-brand-primary text-brand-text font-black flex items-center justify-center text-sm shadow-md">
                       {idx + 1}
                     </span>
                     <span className="font-bold text-brand-text text-lg">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap justify-center gap-6">
          <Button variant="secondary" onClick={onReset}>
            Recalculate
          </Button>
          <Button className="flex items-center gap-2">
             Invest Now <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
