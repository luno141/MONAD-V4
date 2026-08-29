'use client';

import { CASCADE_STEPS } from '@/lib/config/gameConstants';

export default function CascadeVisualization() {
  const isActive = false;

  const typeStyles = {
    event: 'border-[#2A211D] bg-[#D96B27] text-[#F7F0DF]',
    danger: 'border-[#2A211D] bg-[#A8201A] text-[#F7F0DF]',
    warning: 'border-[#2A211D] bg-[#D48C00] text-[#2A211D]',
    success: 'border-[#2A211D] bg-[#2D6A4F] text-[#F7F0DF]',
  };

  return (
    <section id="cascade-panel" className="vintage-card p-5">
      <div className="flex items-center justify-between mb-4 border-b-2 border-[#D5C29D] pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#1B4965] border border-[#2A211D]" />
          <h2 className="text-sm font-black uppercase tracking-widest text-[#2A211D] font-serif">
            PURANI DILLI TELEGRAM WIRE (CASCADE)
          </h2>
        </div>
        <span className="stamp-badge text-[9px] border-[#1B4965] text-[#1B4965]">
          SPECIAL DISPATCH
        </span>
      </div>

      {isActive ? (
        <div className="space-y-2 font-mono">
          {CASCADE_STEPS.map((step, i) => (
            <div
              key={i}
              className={`animate-cascade flex items-center gap-3 px-3 py-2.5 border-2 shadow-[2px_2px_0px_#2A211D] ${typeStyles[step.type]}`}
              style={{ animationDelay: `${i * 400}ms`, opacity: 0 }}
            >
              <span className="text-xs font-bold tracking-wide">{step.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-[#7D6C60] font-mono text-center">
          <div className="text-3xl mb-2">📜</div>
          <p className="text-xs font-bold text-[#524339]">
            TELEGRAM DISPATCHES QUIET
          </p>
          <p className="text-[10px] text-[#7D6C60] mt-1">
            Press &quot;ACTIVATE CHAKKA JAM&quot; to trigger the market ripple
          </p>
        </div>
      )}
    </section>
  );
}
