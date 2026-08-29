'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { DistrictId, Agent, DistrictEconomyState } from '@/lib/types/agentTypes';
import { DISTRICTS } from '@/lib/simulation/districtEconomy';

// Dynamic import for Three.js 3D Voxel Canvas (SSR Safe)
const VoxelWorldCanvas = dynamic(() => import('@/components/VoxelWorldCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] bg-[#0A0807] rounded-xl border border-[#2E241F] flex flex-col items-center justify-center font-mono text-[#F3E5AB]">
      <div className="w-8 h-8 rounded-full border-4 border-[#F59E0B] border-t-transparent animate-spin mb-3" />
      <p className="text-xs font-bold">INITIALIZING ISOMETRIC ENGINE...</p>
      <p className="text-[10px] text-[#A89F91] mt-1">Generating 2.5D Diamond City</p>
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
    <div className="relative w-full rounded-2xl border-4 border-[#2A211D] bg-[#120F0E] p-4 shadow-2xl overflow-hidden font-mono select-none">
      {/* Top Controls Header */}
      <div className="relative z-20 flex flex-wrap items-center justify-between border-b-2 border-[#3D3029] pb-3 mb-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D97706]/20 border border-[#D97706] flex items-center justify-center text-lg text-[#F59E0B]">
            🌆
          </div>
          <div>
            <h2 className="text-sm font-black text-[#F3E5AB] tracking-wide flex items-center gap-2">
              OLD DELHI ISOMETRIC CITY WORLD
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500">
                {viewMode === '3d' ? '2.5D ISOMETRIC ENGINE' : '2D TILED MAP'}
              </span>
            </h2>
            <p className="text-[10px] text-[#A89F91]">
              {viewMode === '3d'
                ? 'Drag to pan camera • Scroll / + - to zoom • Click market hubs to deploy agents'
                : 'Drag to pan • Click to inspect districts'}
            </p>
          </div>
        </div>

        {/* View Mode Switcher & Controls */}
        <div className="flex items-center gap-2">
          {/* Toggle 3D / 2D Button */}
          <div className="flex bg-[#1E1714] p-1 rounded-xl border border-[#4A3B32]">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition ${
                viewMode === '3d'
                  ? 'bg-[#D97706] text-black shadow-md'
                  : 'text-[#A89F91] hover:text-[#F3E5AB]'
              }`}
            >
              🏙️ ISOMETRIC CITY
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition ${
                viewMode === '2d'
                  ? 'bg-[#D97706] text-black shadow-md'
                  : 'text-[#A89F91] hover:text-[#F3E5AB]'
              }`}
            >
              🗺️ 2D MAP
            </button>
          </div>

          {/* 2D Mode Zoom Controls */}
          {viewMode === '2d' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom((z) => Math.min(1.5, z + 0.15))}
                className="w-8 h-8 rounded-lg bg-[#2A1F19] hover:bg-[#3D3029] text-[#F3E5AB] border border-[#4A3B32] font-bold transition"
              >
                +
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                className="w-8 h-8 rounded-lg bg-[#2A1F19] hover:bg-[#3D3029] text-[#F3E5AB] border border-[#4A3B32] font-bold transition"
              >
                -
              </button>
              <button
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#2A1F19] hover:bg-[#3D3029] text-[10px] text-[#A89F91] border border-[#4A3B32] font-bold transition"
              >
                RESET
              </button>
            </div>
          )}
        </div>
      </div>

      {/* VIEWPORT: 3D VOXEL CANVAS OR 2D MAP */}
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
          onMouseDown={handleMouseDown2D}
          onMouseMove={handleMouseMove2D}
          onMouseUp={handleMouseUp2D}
          onMouseLeave={handleMouseUp2D}
          className="relative w-full h-[460px] bg-[#0E0C0B] rounded-xl border border-[#3A2D25] overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center"
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
            className="relative w-0 h-0"
          >
            {/* Render Isometric Grid Tiles & Buildings */}
            {gridTiles.map((tile) => {
              const { r, c, isoX, isoY, isRoad, isBuilding, buildingHeight, buildingType } = tile;

              return (
                <div
                  key={`${r}-${c}`}
                  style={{
                    left: `${isoX}px`,
                    top: `${isoY}px`,
                    zIndex: Math.floor(isoY + 500),
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                >
                  {/* Tile Base */}
                  <svg
                    width={TILE_W}
                    height={TILE_H + buildingHeight + 10}
                    className="overflow-visible"
                    style={{ marginTop: `-${buildingHeight}px` }}
                  >
                    {/* Road or Grass Tile Base */}
                    <polygon
                      points={`${TILE_W / 2},${buildingHeight} ${TILE_W},${buildingHeight + TILE_H / 2} ${TILE_W / 2},${buildingHeight + TILE_H} 0,${buildingHeight + TILE_H / 2}`}
                      fill={isRoad ? '#252321' : '#2D4A27'}
                      stroke={isRoad ? '#3D3834' : '#3E6635'}
                      strokeWidth="1"
                    />

                    {/* Road Markings */}
                    {isRoad && (
                      <polygon
                        points={`${TILE_W / 2},${buildingHeight + TILE_H / 4} ${TILE_W / 2 + 5},${buildingHeight + TILE_H / 2} ${TILE_W / 2},${buildingHeight + (TILE_H * 3) / 4} ${TILE_W / 2 - 5},${buildingHeight + TILE_H / 2}`}
                        fill="#F59E0B"
                        opacity="0.6"
                      />
                    )}

                    {/* 3D Isometric Building Block */}
                    {isBuilding && (
                      <g className="cursor-pointer hover:opacity-90 transition">
                        {/* Left Wall */}
                        <polygon
                          points={`0,${buildingHeight + TILE_H / 2} ${TILE_W / 2},${buildingHeight + TILE_H} ${TILE_W / 2},${TILE_H} 0,${TILE_H / 2}`}
                          fill={buildingType === 'tall' ? '#2A363B' : '#4A2E2B'}
                          stroke="#1A1F22"
                        />
                        {/* Right Wall */}
                        <polygon
                          points={`${TILE_W / 2},${buildingHeight + TILE_H} ${TILE_W},${buildingHeight + TILE_H / 2} ${TILE_W},${TILE_H / 2} ${TILE_W / 2},${TILE_H}`}
                          fill={buildingType === 'tall' ? '#3B4B52' : '#5E3A36'}
                          stroke="#1A1F22"
                        />
                        {/* Roof Top */}
                        <polygon
                          points={`${TILE_W / 2},0 ${TILE_W},${TILE_H / 2} ${TILE_W / 2},${TILE_H} 0,${TILE_H / 2}`}
                          fill={buildingType === 'tall' ? '#4C6069' : '#734742'}
                          stroke="#2A363B"
                        />

                        {/* Windows */}
                        <rect x={TILE_W / 4 - 3} y={buildingHeight / 2} width="6" height="8" fill="#FDE047" opacity="0.8" />
                        <rect x={(TILE_W * 3) / 4 - 3} y={buildingHeight / 2} width="6" height="8" fill="#FDE047" opacity="0.8" />
                      </g>
                    )}
                  </svg>
                </div>
              );
            })}

            {/* Render Animated Agent Beans on the Grid */}
            {agents.map((agent, index) => {
              const gridR = (index * 3 + 1) % GRID_SIZE;
              const gridC = (index * 2 + 2) % GRID_SIZE;
              const isoX = (gridC - gridR) * (TILE_W / 2);
              const isoY = (gridC + gridR) * (TILE_H / 2);

              return (
                <div
                  key={agent.id}
                  style={{
                    left: `${isoX}px`,
                    top: `${isoY - 15}px`,
                    zIndex: Math.floor(isoY + 800),
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 pointer-events-auto group cursor-pointer"
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-[#FFFBEB] text-[#1E1714] font-mono text-[9px] font-black rounded-lg border border-[#D97706] shadow-xl whitespace-nowrap z-50 animate-bounce">
                    {agent.speechBubble || 'on my way!'}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#FFFBEB]" />
                  </div>

                  <div className="relative flex flex-col items-center">
                    <div className="w-7 h-9 rounded-full bg-[#F59E0B] border-2 border-black flex flex-col items-center justify-center shadow-xl transform transition group-hover:scale-125">
                      <span className="text-xs">{agent.avatar}</span>
                      <div className="flex gap-1 mt-0.5">
                        <div className="w-1 h-1 bg-black rounded-full" />
                        <div className="w-1 h-1 bg-black rounded-full" />
                      </div>
                    </div>

                    <span className="px-1 bg-black/80 text-[#F3E5AB] text-[8px] rounded font-bold mt-0.5 whitespace-nowrap">
                      {agent.name.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* District Mandi Hub Overlays */}
            {(Object.keys(DISTRICTS) as DistrictId[]).map((dId, idx) => {
              const d = DISTRICTS[dId];
              const nodeR = idx === 0 ? 1 : idx === 1 ? 4 : 7;
              const nodeC = idx === 0 ? 1 : idx === 1 ? 4 : 7;
              const isoX = (nodeC - nodeR) * (TILE_W / 2);
              const isoY = (nodeC + nodeR) * (TILE_H / 2);

              return (
                <div
                  key={dId}
                  style={{
                    left: `${isoX}px`,
                    top: `${isoY - 60}px`,
                    zIndex: Math.floor(isoY + 900),
                  }}
                  onClick={() => onSelectDistrict(dId)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                >
                  <div className="flex flex-col items-center p-2 rounded-xl bg-[#1E1714]/90 border-2 border-[#F59E0B] shadow-2xl backdrop-blur-md transform transition group-hover:scale-110">
                    <span className="text-2xl">{d.icon}</span>
                    <span className="text-[10px] font-black text-[#F3E5AB] whitespace-nowrap">
                      {d.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDeployModal(dId);
                      }}
                      className="mt-1 px-2 py-0.5 bg-[#D97706] hover:bg-[#F59E0B] text-black font-black text-[9px] rounded transition"
                    >
                      + DEPLOY
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
