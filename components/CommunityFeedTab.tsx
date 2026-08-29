'use client';

import React from 'react';

interface CommunityFeedTabProps {
  logs: string[];
}

export default function CommunityFeedTab({ logs }: CommunityFeedTabProps) {
  const announcements = [
    {
      id: 'a1',
      author: '📜 Delhi Gazette Town Crier',
      time: '2 mins ago',
      content: 'Mandi prices updated in Khari Baoli! Spice wholesale demand surged 15% following morning arrival of freight rickshaws.',
      tag: 'MARKET NEWS',
    },
    {
      id: 'a2',
      author: '☕ Chachi Shanti Chaiwala',
      time: '5 mins ago',
      content: 'Served 12 cups of hot masala chai to heavy sack loaders at Jama Masjid warehouse gates. Energy levels restored!',
      tag: 'CIVILIAN ACTIVITY',
    },
    {
      id: 'a3',
      author: '🛺 Kabir Rickshaw Puller',
      time: '12 mins ago',
      content: 'Completed 3 freight hauls from Khari Baoli to Chandni Chowk silk bazaars. Earned 14 MON in transport fees.',
      tag: 'FREIGHT HAUL',
    },
  ];

  return (
    <div className="w-full space-y-4 font-mono select-none">
      {/* Feed Header */}
      <div className="border-b border-[#2D231D] pb-3">
        <h3 className="text-base font-black text-[#F3E5AB] flex items-center gap-2">
          <span>📜</span> COMMUNITY GAZETTE & TRADE SIGNAL FEED
        </h3>
        <p className="text-[11px] text-[#A89F91]">
          Live stream of civilian agent micro-transactions, district announcements, and market activity.
        </p>
      </div>

      {/* Featured Announcements */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-[#F59E0B]">TOWN CRIER ANNOUNCEMENTS</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#140F0D] border border-[#2D231D] hover:border-[#D97706] transition space-y-2"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-[#F3E5AB]">{item.author}</span>
                <span className="text-[#7A6E65]">{item.time}</span>
              </div>
              <p className="text-[11px] text-[#D4C4B5] leading-relaxed">{item.content}</p>
              <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-[#D97706]/20 text-[#F59E0B] border border-[#D97706]">
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Agent Log Stream */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-bold text-[#F59E0B]">REAL-TIME CIVILIAN ACTIVITY STREAM</h4>
        <div className="p-4 rounded-xl bg-[#120D0B] border border-[#2D231D] max-h-[300px] overflow-y-auto space-y-2 text-xs">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-[#D4C4B5] border-b border-[#231A15] pb-1.5 last:border-none">
              <span className="text-amber-500">⚙️</span>
              <span className="leading-snug">{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
