import Header from '@/components/Header';
import EconomyPanel from '@/components/EconomyPanel';
import PlayerPanel from '@/components/PlayerPanel';
import ActionsPanel from '@/components/ActionsPanel';
import WorldEvent from '@/components/WorldEvent';
import CascadeVisualization from '@/components/CascadeVisualization';
import MonaCorpPanel from '@/components/MonaCorpPanel';
import ActivityLog from '@/components/ActivityLog';
import CompanyCards from '@/components/CompanyCards';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Mandi Overview — full width */}
        <EconomyPanel />

        {/* Autonomous Companies — full width */}
        <CompanyCards />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-4 space-y-6">
            <PlayerPanel />
            <ActionsPanel />
          </div>

          {/* Center column */}
          <div className="lg:col-span-4 space-y-6">
            <WorldEvent />
            <CascadeVisualization />
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-6">
            <MonaCorpPanel />
            <ActivityLog />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 border-t-2 border-[#2A211D] bg-[#F7F0DF] flex items-center justify-between font-mono text-[10px] text-[#524339] font-bold">
        <span>
          PURANI DILLI GAZETTE v0.1.0 — Monad Stage Showcase MVP
        </span>
        <span>
          TESTNET SIMULATION — NO REAL VALUE 📜
        </span>
      </footer>
    </div>
  );
}
