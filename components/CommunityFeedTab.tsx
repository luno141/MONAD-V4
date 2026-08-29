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
    <div className="w-full space-y-4 font-sans select-none">
      {/* Feed Header */}
      <div className="border-b border-[#1A1D2B] pb-3">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <span>📜</span> COMMUNITY GAZETTE & TRADE SIGNAL FEED
        </h3>
        <p className="text-xs text-gray-400">
          Live stream of civilian agent micro-transactions, district announcements, and market activity.
        </p>
      </div>

      {/* Featured Announcements */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">TOWN CRIER ANNOUNCEMENTS</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#0E1018] border border-[#1E2232] hover:border-blue-500/50 transition space-y-2 shadow-lg"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{item.author}</span>
                <span className="text-gray-500 text-[10px]">{item.time}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{item.content}</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Agent Log Stream */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">REAL-TIME CIVILIAN ACTIVITY STREAM</h4>
        <div className="p-4 rounded-xl bg-[#06070B] border border-[#1E2232] max-h-[300px] overflow-y-auto space-y-2 text-xs">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-gray-300 border-b border-[#141622] pb-2 last:border-none">
              <span className="text-blue-400">⚙️</span>
              <span className="leading-snug">{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
