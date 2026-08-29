'use client';

interface ActivityEvent {
  id: string;
  type: 'buy' | 'sell' | 'factory' | 'blackout' | 'mona';
  message: string;
  txHash?: string;
  timestamp: string;
}

export default function ActivityLog() {
  const events: ActivityEvent[] = [];

  const typeColors = {
    buy: 'text-[#2D6A4F]',
    sell: 'text-[#A8201A]',
    factory: 'text-[#1B4965]',
    blackout: 'text-[#A8201A]',
    mona: 'text-[#D48C00]',
  };

  const typeIcons = {
    buy: '↑ KHARIDO',
    sell: '↓ BECHO',
    factory: '🍺 THEKA',
    blackout: '🛑 JAM',
    mona: '🏛️ MCD',
  };

  return (
    <section id="activity-log" className="vintage-card p-5">
      <div className="flex items-center justify-between mb-4 border-b-2 border-[#D5C29D] pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#2D6A4F] border border-[#2A211D]" />
          <h2 className="text-sm font-black uppercase tracking-widest text-[#2A211D] font-serif">
            OFFICIAL SARKAR REGISTER (ACTIVITY LOG)
          </h2>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#7D6C60]">
          {events.length} ENTRIES
        </span>
      </div>

      {events.length > 0 ? (
        <div className="space-y-1.5 max-h-64 overflow-y-auto font-mono text-xs">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-2 bg-[#F7F0DF] border border-[#D5C29D] px-3 py-2"
            >
              <span className={`font-bold ${typeColors[event.type]} flex-shrink-0 text-[10px]`}>
                {typeIcons[event.type]}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[#2A211D] font-semibold">{event.message}</div>
                {event.txHash && (
                  <div className="text-[10px] text-[#1B4965] truncate mt-0.5">
                    RECEIPT: {event.txHash}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-[#7D6C60] flex-shrink-0">
                {event.timestamp}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-[#7D6C60] font-mono text-center">
          <div className="text-3xl mb-2">📋</div>
          <p className="text-xs font-bold text-[#524339]">
            REGISTER BLANK
          </p>
          <p className="text-[10px] text-[#7D6C60] mt-1">
            Blockchain dealings will be stamped here
          </p>
        </div>
      )}
    </section>
  );
}
