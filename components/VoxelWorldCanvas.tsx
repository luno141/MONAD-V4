'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { DistrictId, Agent, DistrictEconomyState } from '@/lib/types/agentTypes';
import { DISTRICTS } from '@/lib/simulation/districtEconomy';

// ─── ISOMETRIC 2.5D DIAMOND TILE ENGINE ───────────────────────────────
// Chain Reaction — Old Delhi Isometric City
// Projection: diamond 2.5D · Tiles: 64×32px · Pixel art warm palette

interface VoxelWorldCanvasProps {
  economy: DistrictEconomyState;
  agents: Agent[];
  selectedDistrict: DistrictId;
  onSelectDistrict: (districtId: DistrictId) => void;
  onOpenDeployModal: (districtId: DistrictId) => void;
}

const TILE_W = 64;
const TILE_H = 32;
const MAP_COLS = 22;
const MAP_ROWS = 22;

// ─── PALETTE ───────────────────────────────────────────────────────────
const PAL = {
  // Ground tones
  dirt:       '#A0845C',
  dirtLight:  '#B29468',
  dirtDark:   '#8B7350',
  dirtCool:   '#948068',
  road:       '#3E3630',
  roadMark:   '#554C44',
  roadEdge:   '#2E2822',
  grass:      '#5E7A3A',
  plaza:      '#C8AD70',
  plazaDark:  '#A89058',
  plazaLine:  '#B09A60',

  // Buildings
  brick1:      '#9E5A42',
  brick2:      '#8A6A58',
  brick3:      '#7A5040',
  sandstone:   '#C8A87A',
  sandstoneDk: '#A8885A',
  haveli:      '#B8784C',
  haveliDark:  '#8E5A38',
  mosque:      '#E8D8C0',
  mosqueDark:  '#C0B098',
  dome:        '#F0E8D8',
  roofTerra:   '#8B4A30',
  roofFlat:    '#6A5040',
  windowLit:   '#FFD560',
  windowDim:   '#9A7A38',
  door:        '#2A1C14',

  // Props
  awningRed:   '#B83828',
  awningGreen: '#387A38',
  awningBlue:  '#385A8A',
  awningAmber: '#C8862A',
  wood:        '#6A4A2A',
  stall:       '#A0784A',
  treeFill:    '#4A8838',
  treeShadow:  '#346028',
  trunk:       '#5A3A1A',
  lampPost:    '#504840',
  lampGlow:    '#FFE898',
  pot:         '#B85A30',

  // District
  khari:   '#D97706',
  chandni: '#3B82F6',
  jama:    '#10B981',

  shadow:  'rgba(0,0,0,0.18)',
  fog:     '#13100C',
};

// ─── DISTRICTS ─────────────────────────────────────────────────────────
interface DistrictZone {
  id: DistrictId;
  label: string;
  icon: string;
  centerCol: number;
  centerRow: number;
  color: string;
}

const ZONES: DistrictZone[] = [
  { id: 'khari_baoli',   label: 'Khari Baoli',   icon: '🌶️', centerCol: 5,  centerRow: 5,  color: PAL.khari },
  { id: 'chandni_chowk', label: 'Chandni Chowk', icon: '🧵', centerCol: 11, centerRow: 11, color: PAL.chandni },
  { id: 'jama_masjid',   label: 'Jama Masjid',   icon: '🍛', centerCol: 17, centerRow: 17, color: PAL.jama },
];

function zoneFor(col: number, row: number): DistrictZone {
  let best = ZONES[0];
  let minD = Infinity;
  for (const z of ZONES) {
    const d = Math.abs(col - z.centerCol) + Math.abs(row - z.centerRow);
    if (d < minD) { minD = d; best = z; }
  }
  return best;
}

// ─── DETERMINISTIC RANDOM ──────────────────────────────────────────────
function srand(a: number, b: number, s: number): number {
  const x = Math.sin(a * 127.1 + b * 311.7 + s * 1731.3) * 43758.5453;
  return x - Math.floor(x);
}

// ─── MAP GENERATION ────────────────────────────────────────────────────
type TileType = 'ground' | 'road' | 'alley' | 'plaza';
type BldgType = 'none' | 'shop' | 'house' | 'tall' | 'warehouse' | 'haveli' | 'mosque' | 'stall';

interface Tile {
  col: number; row: number;
  type: TileType;
  bldg: BldgType;
  bldgH: number;
  hasTree: boolean;
  hasLamp: boolean;
  hasCrate: boolean;
  awning: string | null;
  zone: DistrictZone;
  shade: number; // 0–1 per-tile tint variation
}

function genMap(): Tile[][] {
  const m: Tile[][] = [];
  for (let r = 0; r < MAP_ROWS; r++) {
    m[r] = [];
    for (let c = 0; c < MAP_COLS; c++) {
      const zone = zoneFor(c, r);
      const rv = srand(c, r, 0);
      const shade = srand(c, r, 99) * 0.12; // subtle per-tile brightness

      // Roads: main arteries at 7 & 15, narrow alleys every 5th
      const isMainH = r === 7 || r === 15;
      const isMainV = c === 7 || c === 15;
      const isAlley = !isMainH && !isMainV && ((r % 5 === 0) || (c % 5 === 0));
      // District center plazas (3×3)
      const nearCenter = Math.abs(c - zone.centerCol) <= 1 && Math.abs(r - zone.centerRow) <= 1;

      let type: TileType = 'ground';
      if (isMainH || isMainV) type = 'road';
      else if (isAlley) type = 'alley';
      if (nearCenter) type = 'plaza';

      // Buildings on ground tiles only (~65% fill)
      let bldg: BldgType = 'none';
      let bldgH = 0;
      if (type === 'ground' && rv > 0.35) {
        const b = srand(c, r, 42);
        if (b < 0.22)      { bldg = 'shop';      bldgH = 24 + Math.floor(srand(c, r, 7) * 10); }
        else if (b < 0.42) { bldg = 'house';     bldgH = 30 + Math.floor(srand(c, r, 8) * 14); }
        else if (b < 0.56) { bldg = 'tall';      bldgH = 44 + Math.floor(srand(c, r, 9) * 20); }
        else if (b < 0.66) { bldg = 'warehouse'; bldgH = 32 + Math.floor(srand(c, r, 10) * 10); }
        else if (b < 0.76) { bldg = 'haveli';    bldgH = 48 + Math.floor(srand(c, r, 11) * 16); }
        else if (b < 0.84) { bldg = 'mosque';    bldgH = 50 + Math.floor(srand(c, r, 12) * 12); }
        else               { bldg = 'stall';     bldgH = 16 + Math.floor(srand(c, r, 13) * 6); }
      }

      // Props — only on empty ground
      const empty = bldg === 'none' && type === 'ground';
      const hasTree = empty && rv > 0.65 && srand(c, r, 1) > 0.55;
      const hasCrate = empty && !hasTree && srand(c, r, 3) > 0.82;
      const hasLamp = (type === 'road' || type === 'alley') && srand(c, r, 2) > 0.88;

      // Awnings on shops & stalls
      const awnings = [PAL.awningRed, PAL.awningGreen, PAL.awningBlue, PAL.awningAmber];
      const awning = (bldg === 'shop' || bldg === 'stall') && srand(c, r, 4) > 0.25
        ? awnings[Math.floor(srand(c, r, 5) * awnings.length)]
        : null;

      m[r][c] = { col: c, row: r, type, bldg, bldgH, hasTree, hasLamp, hasCrate, awning, zone, shade };
    }
  }
  return m;
}

// ─── ISO PROJECTION ────────────────────────────────────────────────────
function iso(c: number, r: number) {
  return { x: (c - r) * (TILE_W / 2), y: (c + r) * (TILE_H / 2) };
}

function uniso(sx: number, sy: number) {
  const c = Math.floor((sx / (TILE_W / 2) + sy / (TILE_H / 2)) / 2);
  const r = Math.floor((sy / (TILE_H / 2) - sx / (TILE_W / 2)) / 2);
  return { col: c, row: r };
}

// ─── DRAW PRIMITIVES ───────────────────────────────────────────────────
function diamond(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string, stroke?: string) {
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w, y + h / 2);
  ctx.lineTo(x + w / 2, y + h);
  ctx.lineTo(x, y + h / 2);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 0.5; ctx.stroke(); }
}

function isoBox(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, bh: number, top: string, left: string, right: string) {
  // Top
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y - bh);
  ctx.lineTo(x + w, y + h / 2 - bh);
  ctx.lineTo(x + w / 2, y + h - bh);
  ctx.lineTo(x, y + h / 2 - bh);
  ctx.closePath(); ctx.fillStyle = top; ctx.fill();
  // Left
  ctx.beginPath();
  ctx.moveTo(x, y + h / 2 - bh);
  ctx.lineTo(x + w / 2, y + h - bh);
  ctx.lineTo(x + w / 2, y + h);
  ctx.lineTo(x, y + h / 2);
  ctx.closePath(); ctx.fillStyle = left; ctx.fill();
  // Right
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + h - bh);
  ctx.lineTo(x + w, y + h / 2 - bh);
  ctx.lineTo(x + w, y + h / 2);
  ctx.lineTo(x + w / 2, y + h);
  ctx.closePath(); ctx.fillStyle = right; ctx.fill();
}

// Windows drawn on the LEFT iso-face
function winL(ctx: CanvasRenderingContext2D, sx: number, by: number, lit: boolean) {
  ctx.fillStyle = lit ? PAL.windowLit : PAL.windowDim;
  // Small parallelogram on left wall
  ctx.beginPath();
  ctx.moveTo(sx, by);
  ctx.lineTo(sx + 4, by - 2);
  ctx.lineTo(sx + 4, by + 4);
  ctx.lineTo(sx, by + 6);
  ctx.closePath(); ctx.fill();
}

// Windows drawn on the RIGHT iso-face
function winR(ctx: CanvasRenderingContext2D, sx: number, by: number, lit: boolean) {
  ctx.fillStyle = lit ? PAL.windowLit : PAL.windowDim;
  ctx.beginPath();
  ctx.moveTo(sx, by - 2);
  ctx.lineTo(sx + 4, by);
  ctx.lineTo(sx + 4, by + 6);
  ctx.lineTo(sx, by + 4);
  ctx.closePath(); ctx.fill();
}

// ─── BUILDING RENDERERS ────────────────────────────────────────────────
function drawBldg(ctx: CanvasRenderingContext2D, t: Tile, sx: number, sy: number) {
  const bh = t.bldgH;
  const inset = 6; // building inset from tile edge
  const bw = TILE_W - inset * 2;
  const bd = TILE_H - (inset / 2) * 2;

  switch (t.bldg) {
    case 'shop': {
      isoBox(ctx, sx + inset, sy + inset / 2, bw, bd, bh, PAL.sandstone, PAL.brick1, PAL.brick3);
      // Windows on left & right walls
      winL(ctx, sx + inset + 6, sy + inset / 2 + bd / 2 - bh * 0.5, true);
      winL(ctx, sx + inset + 14, sy + inset / 2 + bd / 2 - bh * 0.5 + 4, false);
      winR(ctx, sx + inset + bw - 8, sy + inset / 2 + bd / 2 - bh * 0.5 + 2, true);
      // Door
      ctx.fillStyle = PAL.door;
      const doorX = sx + TILE_W / 2 - 2;
      const doorY = sy + TILE_H / 2 - 1;
      ctx.fillRect(doorX, doorY - 8, 4, 8);
      // Awning
      if (t.awning) {
        ctx.fillStyle = t.awning;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.moveTo(sx + inset + 2, sy + TILE_H / 2 - bh * 0.25);
        ctx.lineTo(sx + TILE_W - inset - 2, sy + TILE_H / 2 - bh * 0.25);
        ctx.lineTo(sx + TILE_W - inset + 2, sy + TILE_H / 2 - bh * 0.1);
        ctx.lineTo(sx + inset - 2, sy + TILE_H / 2 - bh * 0.1);
        ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 1;
      }
      break;
    }
    case 'house': {
      isoBox(ctx, sx + inset, sy + inset / 2, bw, bd, bh, PAL.sandstoneDk, PAL.brick2, '#5A5044');
      // Two rows of windows per face
      for (let i = 0; i < 2; i++) {
        const yOff = bh * (0.35 + i * 0.3);
        winL(ctx, sx + inset + 6, sy + inset / 2 + bd / 2 - yOff, i === 0);
        winL(ctx, sx + inset + 16, sy + inset / 2 + bd / 2 - yOff + 5, i === 1);
        winR(ctx, sx + inset + bw - 10, sy + inset / 2 + bd / 2 - yOff + 3, i === 0);
      }
      break;
    }
    case 'tall': {
      isoBox(ctx, sx + inset - 2, sy + inset / 2 - 1, bw + 4, bd + 2, bh, PAL.roofFlat, PAL.brick1, PAL.brick3);
      // Three rows of windows
      for (let i = 0; i < 3; i++) {
        const yOff = bh * (0.2 + i * 0.25);
        winL(ctx, sx + inset + 4, sy + inset / 2 + bd / 2 - yOff, i % 2 === 0);
        winL(ctx, sx + inset + 14, sy + inset / 2 + bd / 2 - yOff + 5, i % 2 === 1);
        winR(ctx, sx + inset + bw - 6, sy + inset / 2 + bd / 2 - yOff + 3, i % 2 === 0);
        winR(ctx, sx + inset + bw - 16, sy + inset / 2 + bd / 2 - yOff + 1, i % 2 === 1);
      }
      // District accent strip along roofline
      ctx.fillStyle = t.zone.color;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      const rty = sy + inset / 2 - bh;
      ctx.moveTo(sx + TILE_W / 2, rty - 1);
      ctx.lineTo(sx + TILE_W - inset + 2, rty + bd / 2);
      ctx.lineTo(sx + TILE_W / 2, rty + bd + 1);
      ctx.lineTo(sx + inset - 2, rty + bd / 2);
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
      break;
    }
    case 'warehouse': {
      isoBox(ctx, sx + 4, sy + 2, TILE_W - 8, TILE_H - 4, bh, '#6A5848', '#584838', '#4A3A2A');
      // Roller door on right face
      ctx.fillStyle = '#352C24';
      const rdx = sx + TILE_W / 2 + 4;
      const rdy = sy + TILE_H / 2 - bh * 0.55;
      ctx.fillRect(rdx, rdy, 10, bh * 0.4);
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#4A4038';
        ctx.fillRect(rdx + 1, rdy + 2 + i * (bh * 0.09), 8, 1);
      }
      break;
    }
    case 'haveli': {
      isoBox(ctx, sx + inset, sy + inset / 2, bw, bd, bh, PAL.haveli, PAL.haveliDark, '#6A4028');
      // Ornate arched windows
      for (let i = 0; i < 3; i++) {
        const yOff = bh * (0.2 + i * 0.25);
        const ly = sy + inset / 2 + bd / 2 - yOff;
        // Left face arched window
        ctx.fillStyle = PAL.windowLit;
        ctx.beginPath();
        ctx.arc(sx + inset + 10, ly + 1, 3, Math.PI, 0);
        ctx.lineTo(sx + inset + 13, ly + 7);
        ctx.lineTo(sx + inset + 7, ly + 7);
        ctx.closePath(); ctx.fill();
        // Right face
        ctx.beginPath();
        ctx.arc(sx + inset + bw - 10, ly + 3, 3, Math.PI, 0);
        ctx.lineTo(sx + inset + bw - 7, ly + 9);
        ctx.lineTo(sx + inset + bw - 13, ly + 9);
        ctx.closePath(); ctx.fill();
      }
      // Balcony accent
      ctx.fillStyle = t.zone.color;
      ctx.globalAlpha = 0.4;
      const balY = sy + inset / 2 + bd / 2 - bh * 0.5;
      ctx.beginPath();
      ctx.moveTo(sx + inset, balY);
      ctx.lineTo(sx + TILE_W / 2, balY + bd / 2);
      ctx.lineTo(sx + TILE_W / 2, balY + bd / 2 + 2);
      ctx.lineTo(sx + inset, balY + 2);
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
      break;
    }
    case 'mosque': {
      isoBox(ctx, sx + inset, sy + inset / 2, bw, bd, bh, PAL.mosque, PAL.mosqueDark, '#A09080');
      // Dome
      const domeX = sx + TILE_W / 2;
      const domeY = sy + TILE_H / 2 - bh - 2;
      ctx.fillStyle = PAL.dome;
      ctx.beginPath();
      ctx.arc(domeX, domeY, 9, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = PAL.mosqueDark;
      ctx.beginPath();
      ctx.ellipse(domeX, domeY, 9, 3, 0, 0, Math.PI);
      ctx.fill();
      // Crescent finial
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(domeX, domeY - 11, 2.5, 0, Math.PI * 2);
      ctx.fill();
      // Arched windows
      for (const wx of [sx + inset + 8, sx + TILE_W / 2, sx + TILE_W - inset - 8]) {
        const wy = sy + TILE_H / 2 - bh * 0.4;
        ctx.fillStyle = PAL.windowLit;
        ctx.beginPath();
        ctx.arc(wx, wy, 2.5, Math.PI, 0);
        ctx.lineTo(wx + 2.5, wy + 5);
        ctx.lineTo(wx - 2.5, wy + 5);
        ctx.closePath(); ctx.fill();
      }
      break;
    }
    case 'stall': {
      const topY = sy - bh;
      // Posts
      ctx.fillStyle = PAL.trunk;
      ctx.fillRect(sx + 12, topY + 5, 2, bh - 5);
      ctx.fillRect(sx + TILE_W - 14, topY + 5, 2, bh - 5);
      // Canopy cloth
      ctx.fillStyle = t.awning || PAL.awningRed;
      ctx.beginPath();
      ctx.moveTo(sx + 8, topY);
      ctx.lineTo(sx + TILE_W - 8, topY);
      ctx.lineTo(sx + TILE_W - 6, topY + 5);
      ctx.lineTo(sx + 6, topY + 5);
      ctx.closePath(); ctx.fill();
      // Scalloped edge
      ctx.fillStyle = t.awning || PAL.awningRed;
      ctx.globalAlpha = 0.6;
      for (let i = 0; i < 5; i++) {
        const cx = sx + 10 + i * 9;
        ctx.beginPath();
        ctx.arc(cx, topY + 6, 3, 0, Math.PI);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // Counter
      isoBox(ctx, sx + 10, sy + 5, TILE_W - 20, TILE_H - 10, 7, PAL.stall, PAL.wood, '#5A3A1A');
      // Goods dots
      const goods = ['#C04030', '#E8C840', PAL.pot, '#5A8A3A'];
      goods.forEach((g, i) => {
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(sx + 18 + i * 8, sy + TILE_H / 2 - 9, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }
  }
}

// ─── PROPS ─────────────────────────────────────────────────────────────
function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = PAL.trunk;
  ctx.fillRect(x + 1, y - 6, 3, 8);
  ctx.fillStyle = PAL.treeShadow;
  ctx.beginPath(); ctx.arc(x + 2, y - 11, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = PAL.treeFill;
  ctx.beginPath(); ctx.arc(x + 3, y - 13, 4.5, 0, Math.PI * 2); ctx.fill();
  // Highlight
  ctx.fillStyle = '#68A848';
  ctx.beginPath(); ctx.arc(x + 4, y - 15, 2.5, 0, Math.PI * 2); ctx.fill();
}

function drawLamp(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = PAL.lampPost;
  ctx.fillRect(x + 2, y - 14, 2, 14);
  // Lamp head
  ctx.fillStyle = '#3A3430';
  ctx.fillRect(x, y - 16, 6, 3);
  ctx.fillStyle = PAL.lampGlow;
  ctx.fillRect(x + 1, y - 15, 4, 1.5);
  // Glow halo
  const grad = ctx.createRadialGradient(x + 3, y - 14, 0, x + 3, y - 14, 12);
  grad.addColorStop(0, 'rgba(255,232,152,0.12)');
  grad.addColorStop(1, 'rgba(255,232,152,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(x - 10, y - 28, 26, 26);
}

function drawCrate(ctx: CanvasRenderingContext2D, x: number, y: number) {
  isoBox(ctx, x, y, 10, 5, 7, '#8A6A42', '#6A4A28', '#5A3A1A');
  // Cross straps
  ctx.strokeStyle = '#4A3018';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(x + 2, y - 5); ctx.lineTo(x + 8, y + 1);
  ctx.moveTo(x + 8, y - 5); ctx.lineTo(x + 2, y + 1);
  ctx.stroke();
}

// ─── COMPONENT ─────────────────────────────────────────────────────────
export default function VoxelWorldCanvas({
  economy,
  agents,
  selectedDistrict,
  onSelectDistrict,
  onOpenDeployModal,
}: VoxelWorldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Tile[][] | null>(null);

  const camRef = useRef({ panX: 0, panY: 0, zoom: 0.9 });
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0 });
  const [hoveredTile, setHoveredTile] = useState<{ col: number; row: number } | null>(null);
  const animRef = useRef(0);

  if (!mapRef.current) mapRef.current = genMap();
  const map = mapRef.current;

  // ─── MAIN RENDER ─────────────────────────────────────────────────
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctr = containerRef.current;
    if (!canvas || !ctr) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = ctr.clientWidth;
    const ch = ctr.clientHeight;

    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cam = camRef.current;

    // Background
    ctx.fillStyle = PAL.fog;
    ctx.fillRect(0, 0, cw, ch);

    ctx.save();
    ctx.translate(cw / 2 + cam.panX, ch / 3.5 + cam.panY);
    ctx.scale(cam.zoom, cam.zoom);

    // ── TILES ──────────────────────────────────────────────────────
    for (let r = 0; r < MAP_ROWS; r++) {
      for (let c = 0; c < MAP_COLS; c++) {
        const t = map[r][c];
        const { x: sx, y: sy } = iso(c, r);
        const hov = hoveredTile?.col === c && hoveredTile?.row === r;

        // Base fill with per-tile shade variation
        let fill: string;
        if (t.type === 'road') fill = PAL.road;
        else if (t.type === 'alley') fill = '#4A423A';
        else if (t.type === 'plaza') fill = PAL.plaza;
        else {
          // Slight hue shift per district + shade noise
          const baseColors: Record<DistrictId, string[]> = {
            khari_baoli:   [PAL.dirt, PAL.dirtLight],
            chandni_chowk: [PAL.dirtDark, PAL.dirtCool],
            jama_masjid:   ['#A08A62', '#968058'],
          };
          const pair = baseColors[t.zone.id];
          fill = t.shade > 0.06 ? pair[1] : pair[0];
        }

        if (hov) fill = '#D4B878';

        const stroke = t.type === 'plaza' ? PAL.plazaDark
          : t.type === 'road' ? PAL.roadEdge
          : t.type === 'alley' ? '#3A342E'
          : undefined;

        diamond(ctx, sx, sy, TILE_W, TILE_H, fill, stroke);

        // Road center line dots
        if (t.type === 'road') {
          ctx.fillStyle = PAL.roadMark;
          ctx.beginPath();
          ctx.arc(sx + TILE_W / 2, sy + TILE_H / 2, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Plaza paving: small inner diamond pattern
        if (t.type === 'plaza') {
          ctx.strokeStyle = PAL.plazaLine;
          ctx.lineWidth = 0.4;
          diamond(ctx, sx + 12, sy + 6, TILE_W - 24, TILE_H - 12, 'transparent', PAL.plazaLine);
          // Accent border
          if (t.zone) {
            ctx.strokeStyle = t.zone.color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(sx + TILE_W / 2, sy + 1);
            ctx.lineTo(sx + TILE_W - 1, sy + TILE_H / 2);
            ctx.lineTo(sx + TILE_W / 2, sy + TILE_H - 1);
            ctx.lineTo(sx + 1, sy + TILE_H / 2);
            ctx.closePath(); ctx.stroke();
          }
        }

        // Crates
        if (t.hasCrate) drawCrate(ctx, sx + 22, sy + 8);

        // Buildings
        if (t.bldg !== 'none') {
          // Drop shadow ellipse
          ctx.fillStyle = PAL.shadow;
          ctx.beginPath();
          ctx.ellipse(sx + TILE_W / 2, sy + TILE_H / 2 + 1, TILE_W / 3.5, TILE_H / 5, 0, 0, Math.PI * 2);
          ctx.fill();
          drawBldg(ctx, t, sx, sy);
        }

        // Trees
        if (t.hasTree) drawTree(ctx, sx + TILE_W / 2 - 3, sy + TILE_H / 2 - 2);

        // Lamps
        if (t.hasLamp) drawLamp(ctx, sx + TILE_W / 2 - 3, sy + TILE_H / 2);
      }
    }

    // ── DISTRICT LABELS ────────────────────────────────────────────
    for (const z of ZONES) {
      const { x: sx, y: sy } = iso(z.centerCol, z.centerRow);
      const cx = sx + TILE_W / 2;
      const cy = sy - 18;
      const isSel = z.id === selectedDistrict;

      // Soft glow under label
      const grd = ctx.createRadialGradient(cx, sy + TILE_H / 2, 0, cx, sy + TILE_H / 2, 50);
      grd.addColorStop(0, z.color + '22');
      grd.addColorStop(1, z.color + '00');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, sy + TILE_H / 2, 50, 0, Math.PI * 2);
      ctx.fill();

      // Label pill
      const lw = 100;
      const lh = 22;
      ctx.fillStyle = isSel ? 'rgba(10,8,6,0.92)' : 'rgba(10,8,6,0.8)';
      ctx.beginPath();
      ctx.roundRect(cx - lw / 2, cy - lh / 2, lw, lh, 6);
      ctx.fill();
      ctx.strokeStyle = isSel ? z.color : '#4A3B32';
      ctx.lineWidth = isSel ? 2 : 1;
      ctx.stroke();

      // Icon + text
      ctx.fillStyle = '#F3E5AB';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${z.icon} ${z.label}`, cx, cy);
    }

    // ── AGENTS ─────────────────────────────────────────────────────
    const now = Date.now();
    agents.forEach((agent, idx) => {
      const z = ZONES.find(z => z.id === agent.location) || ZONES[0];
      const phase = idx * 2.1;
      const bobY = Math.sin(now * 0.003 + phase) * 2;
      const ac = z.centerCol + Math.cos(now * 0.0008 + phase) * 2.2;
      const ar = z.centerRow + Math.sin(now * 0.0008 + phase) * 2.2;
      const { x: ax, y: ay } = iso(ac, ar);
      const cx = ax + TILE_W / 2;
      const cy = ay + bobY;

      // Ground shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(cx, ay + 5, 5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Agent circle
      ctx.fillStyle = z.color;
      ctx.beginPath();
      ctx.arc(cx, cy - 3, 6.5, 0, Math.PI * 2);
      ctx.fill();
      // White ring
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      // Dark outline
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Avatar emoji
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFF';
      ctx.fillText(agent.avatar, cx, cy - 3);

      // Name pill
      const name = agent.name.split(' ')[0];
      const nw = ctx.measureText(name).width + 8;
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.beginPath();
      ctx.roundRect(cx - nw / 2, cy + 6, nw, 9, 3);
      ctx.fill();
      ctx.fillStyle = '#F3E5AB';
      ctx.font = 'bold 6px monospace';
      ctx.fillText(name, cx, cy + 10.5);

      // Speech bubble (only show first 24 chars)
      if (agent.speechBubble) {
        const txt = agent.speechBubble.length > 24
          ? agent.speechBubble.slice(0, 22) + '…'
          : agent.speechBubble;
        ctx.font = 'bold 6px monospace';
        const bw = Math.min(ctx.measureText(txt).width + 10, 110);
        const bx = cx - bw / 2;
        const by = cy - 22;

        ctx.fillStyle = '#FFFBEB';
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, 12, 4);
        ctx.fill();
        ctx.strokeStyle = z.color;
        ctx.lineWidth = 0.7;
        ctx.stroke();
        // Nub
        ctx.fillStyle = '#FFFBEB';
        ctx.beginPath();
        ctx.moveTo(cx - 2, by + 12);
        ctx.lineTo(cx, by + 15);
        ctx.lineTo(cx + 2, by + 12);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = '#1A140F';
        ctx.fillText(txt, cx, by + 7.5);
      }
    });

    ctx.restore();

    // ── EDGE VIGNETTE ──────────────────────────────────────────────
    // Soft fade on all edges
    const edgeSize = 60;
    // Top
    let g = ctx.createLinearGradient(0, 0, 0, edgeSize);
    g.addColorStop(0, PAL.fog); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, edgeSize);
    // Bottom
    g = ctx.createLinearGradient(0, ch, 0, ch - edgeSize);
    g.addColorStop(0, PAL.fog); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(0, ch - edgeSize, cw, edgeSize);
    // Left
    g = ctx.createLinearGradient(0, 0, edgeSize, 0);
    g.addColorStop(0, PAL.fog); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(0, 0, edgeSize, ch);
    // Right
    g = ctx.createLinearGradient(cw, 0, cw - edgeSize, 0);
    g.addColorStop(0, PAL.fog); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(cw - edgeSize, 0, edgeSize, ch);

  }, [map, agents, selectedDistrict, hoveredTile]);

  // Animation loop
  useEffect(() => {
    let run = true;
    const loop = () => { if (!run) return; render(); animRef.current = requestAnimationFrame(loop); };
    loop();
    return () => { run = false; cancelAnimationFrame(animRef.current); };
  }, [render]);

  // Resize
  useEffect(() => {
    const fn = () => render();
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, [render]);

  // ── MOUSE ────────────────────────────────────────────────────────
  const handleDown = (e: React.MouseEvent) => {
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, startPanX: camRef.current.panX, startPanY: camRef.current.panY };
  };

  const handleMove = (e: React.MouseEvent) => {
    const d = dragRef.current;
    if (d.active) {
      camRef.current.panX = d.startPanX + (e.clientX - d.startX);
      camRef.current.panY = d.startPanY + (e.clientY - d.startY);
    }
    const ctr = containerRef.current;
    if (!ctr) return;
    const rect = ctr.getBoundingClientRect();
    const cam = camRef.current;
    const mx = (e.clientX - rect.left - rect.width / 2 - cam.panX) / cam.zoom;
    const my = (e.clientY - rect.top - rect.height / 3.5 - cam.panY) / cam.zoom;
    const { col, row } = uniso(mx, my);
    if (col >= 0 && col < MAP_COLS && row >= 0 && row < MAP_ROWS) setHoveredTile({ col, row });
    else setHoveredTile(null);
  };

  const handleUp = (e: React.MouseEvent) => {
    const d = dragRef.current;
    const wasDrag = Math.abs(e.clientX - d.startX) > 4 || Math.abs(e.clientY - d.startY) > 4;
    d.active = false;
    if (wasDrag) return;
    const ctr = containerRef.current;
    if (!ctr) return;
    const rect = ctr.getBoundingClientRect();
    const cam = camRef.current;
    const mx = (e.clientX - rect.left - rect.width / 2 - cam.panX) / cam.zoom;
    const my = (e.clientY - rect.top - rect.height / 3.5 - cam.panY) / cam.zoom;
    const { col, row } = uniso(mx, my);
    if (col >= 0 && col < MAP_COLS && row >= 0 && row < MAP_ROWS) {
      const tile = map[row]?.[col];
      if (tile) onSelectDistrict(tile.zone.id);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    camRef.current.zoom = Math.max(0.4, Math.min(2.5, camRef.current.zoom + (e.deltaY > 0 ? -0.08 : 0.08)));
  };

  const zoom = (d: number) => { camRef.current.zoom = Math.max(0.4, Math.min(2.5, camRef.current.zoom + d)); };
  const reset = () => { camRef.current.panX = 0; camRef.current.panY = 0; camRef.current.zoom = 0.9; };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[480px] bg-[#13100C] rounded-xl border border-[#2E241F] overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={handleUp}
        onMouseLeave={() => { dragRef.current.active = false; setHoveredTile(null); }}
        onWheel={handleWheel}
        className="w-full h-full min-h-[480px] cursor-grab active:cursor-grabbing"
      />

      {/* Hover tooltip */}
      {hoveredTile && map[hoveredTile.row]?.[hoveredTile.col] && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1 bg-[#1A140F]/95 text-[#F3E5AB] border border-[#3D3029] font-mono text-[10px] rounded-lg shadow-xl pointer-events-none backdrop-blur-sm">
          {(() => {
            const t = map[hoveredTile.row][hoveredTile.col];
            const bLabel = t.bldg !== 'none' ? t.bldg.replace('_', ' ') : t.type;
            return `${t.zone.icon} ${t.zone.label} · ${bLabel}`;
          })()}
        </div>
      )}

      {/* Cam controls */}
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-1">
        {[
          { label: '+', fn: () => zoom(0.15) },
          { label: '−', fn: () => zoom(-0.15) },
          { label: '⟲', fn: reset },
        ].map((b) => (
          <button key={b.label} onClick={b.fn}
            className="w-7 h-7 rounded-md bg-[#1A140F]/85 hover:bg-[#2E241F] text-[#A89F91] hover:text-[#F3E5AB] border border-[#2E241F] font-mono text-xs transition flex items-center justify-center backdrop-blur-sm">
            {b.label}
          </button>
        ))}
      </div>

      {/* District deploy bar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {ZONES.map((z) => (
          <button key={z.id} onClick={() => onOpenDeployModal(z.id)}
            className={`px-2.5 py-1 rounded-lg font-mono text-[9px] font-bold border transition flex items-center gap-1.5 backdrop-blur-sm ${
              selectedDistrict === z.id
                ? 'bg-[#D97706]/90 text-black border-[#F59E0B] shadow-md shadow-amber-900/30'
                : 'bg-[#1A140F]/85 text-[#8A7E75] border-[#2E241F] hover:border-[#D97706] hover:text-[#F3E5AB]'
            }`}>
            <span className="text-xs">{z.icon}</span>
            <span>{z.label}</span>
            <span className="opacity-50">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
