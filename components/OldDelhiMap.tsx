'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { DistrictId, Agent, DistrictEconomyState } from '@/lib/types/agentTypes';
import { DISTRICTS } from '@/lib/simulation/districtEconomy';

// Dynamic import for 2.5D Isometric World Canvas (SSR Safe)
const VoxelWorldCanvas = dynamic(() => import('@/components/VoxelWorldCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] bg-[#06070B] rounded-2xl border border-[#1E2232] flex flex-col items-center justify-center font-sans text-white">
      <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-3" />
      <p className="text-xs font-bold tracking-wider">INITIALIZING ISOMETRIC ENGINE...</p>
      <p className="text-[10px] text-gray-400 mt-1">Generating 2.5D Diamond City Canvas</p>
    </div>
  ),
});

interface OldDelhiMapProps {
  economy: DistrictEconomyState;
  agents: Agent[];
  selectedDistrict: DistrictId;
  onSelectDistrict: (districtId: DistrictId) => void;
  onOpenDeployModal: (districtId: DistrictId) => void;
}

export default function OldDelhiMap({
  economy,
  agents,
  selectedDistrict,
  onSelectDistrict,
  onOpenDeployModal,
}: OldDelhiMapProps) {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  // 2D View State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // 2D Grid dimensions
  const GRID_SIZE = 10;
  const TILE_W = 70;
  const TILE_H = 35;

  const handleMouseDown2D = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove2D = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp2D = () => setIsDragging(false);

  // Generate 2D grid map layout (grass, roads, buildings)
  const gridTiles = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const isRoadRow = r === 2 || r === 5 || r === 8;
      const isRoadCol = c === 2 || c === 5 || c === 8;
      const isRoad = isRoadRow || isRoadCol;
      const isBuilding = !isRoad && (r + c) % 2 === 0;

      const isoX = (c - r) * (TILE_W / 2);
      const isoY = (c + r) * (TILE_H / 2);

      gridTiles.push({
        r,
        c,
        isoX,
        isoY,
        isRoad,
        isBuilding,
        buildingHeight: isBuilding ? 60 + ((r * 7 + c * 13) % 40) : 0,
        buildingType: (r + c) % 3 === 0 ? 'tall' : 'medium',
      });
    }
  }

  return (
    <div className="relative w-full rounded-2xl border border-[#1E2232] bg-[#0E1018] p-4 shadow-2xl overflow-hidden font-sans select-none space-y-3">
      {/* Top Controls Header */}
      <div className="relative z-20 flex flex-wrap items-center justify-between border-b border-[#1A1D2B] pb-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-sm text-blue-400">
            🌆
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-2">
              OLD DELHI ISOMETRIC CITY WORLD
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">
                {viewMode === '3d' ? '2.5D ISOMETRIC ENGINE' : '2D TILED MAP'}
              </span>
            </h2>
            <p className="text-[11px] text-gray-400">
              Interactive 2.5D Mandi map with autonomous agents, tea vendors & loaders
            </p>
          </div>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#06070B] rounded-lg p-1 border border-[#1A1D2B] text-xs">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1 rounded-md font-bold transition ${
                viewMode === '3d'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              2.5D Canvas
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`px-3 py-1 rounded-md font-bold transition ${
                viewMode === '2d'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              2D Grid
            </button>
          </div>

          <button
            onClick={() => onOpenDeployModal(selectedDistrict)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow transition transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <span>🤖</span> Deploy Agent
          </button>
        </div>
      </div>

      {/* District Selection Tabs Bar */}
      <div className="relative z-20 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {(Object.keys(DISTRICTS) as DistrictId[]).map((dId) => {
          const d = DISTRICTS[dId];
          const isSelected = dId === selectedDistrict;

          return (
            <button
              key={dId}
              onClick={() => onSelectDistrict(dId)}
              className={`px-3.5 py-2 rounded-xl border transition flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-[#161926] border-blue-500 text-white font-bold shadow-lg'
                  : 'bg-[#0A0B10] border-[#1A1D2B] text-gray-400 hover:text-white hover:border-gray-600'
              }`}
            >
              <span className="text-base">{d.icon}</span>
              <div className="text-left">
                <div className="font-bold leading-tight">{d.name}</div>
                <div className="text-[9px] opacity-75">{d.hindiName}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main View Container (2.5D Canvas vs 2D Tiled Grid) */}
      <div className="relative rounded-2xl border border-[#1E2232] bg-[#06070B] overflow-hidden shadow-2xl">
        {viewMode === '3d' ? (
          <VoxelWorldCanvas
            economy={economy}
            agents={agents}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={onSelectDistrict}
            onOpenDeployModal={onOpenDeployModal}
          />
        ) : (
          <div
            className="w-full h-[460px] relative cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center"
            onMouseDown={handleMouseDown2D}
            onMouseMove={handleMouseMove2D}
            onMouseUp={handleMouseUp2D}
          >
            <div
              className="absolute transition-transform duration-75"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              }}
            >
              <div className="relative" style={{ width: 800, height: 500 }}>
                {gridTiles.map((t, idx) => {
                  const cx = 400 + t.isoX;
                  const cy = 100 + t.isoY;

                  return (
                    <div
                      key={idx}
                      className="absolute group transition-transform"
                      style={{
                        left: `${cx}px`,
                        top: `${cy}px`,
                        zIndex: Math.floor(cy),
                      }}
                    >
                      <div
                        className={`w-[70px] h-[35px] transition-colors border border-white/5 ${
                          t.isRoad
                            ? 'bg-[#1C1F2B]'
                            : t.isBuilding
                            ? 'bg-[#0E1017]'
                            : 'bg-[#0A0C14]'
                        }`}
                        style={{
                          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                        }}
                      />

                      {t.isBuilding && (
                        <div
                          className="absolute bottom-[17px] left-[10px] w-[50px] bg-gradient-to-t from-[#141724] to-[#1E2234] border border-blue-500/20 rounded-t shadow-lg flex flex-col items-center justify-center text-[9px] text-blue-300 font-bold"
                          style={{ height: `${t.buildingHeight}px` }}
                        >
                          🏬
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Zoom controls overlay */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#090A0F]/90 p-1 rounded-lg border border-[#1A1D2B] text-xs">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
                className="w-7 h-7 rounded bg-[#141622] hover:bg-[#1F2334] text-white font-bold"
              >
                +
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
                className="w-7 h-7 rounded bg-[#141622] hover:bg-[#1F2334] text-white font-bold"
              >
                -
              </button>
              <button
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
                className="px-2 py-1 rounded bg-[#141622] hover:bg-[#1F2334] text-gray-300 font-bold text-[10px]"
              >
                RESET
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
