import { renderToStaticMarkup } from "react-dom/server";
import { GlyphDefs, PartGlyph } from "../components/Icons";
import { STARTER_SIZE, visibleStarterPort } from "../data/starDeltaLayout";
import { FLOATLESS_CLEAN_PARTS } from "../data/floatless";
import type { Placed, Wire } from "../components/Canvas";
import { partById } from "../data/catalog";
import {
  getTerminals,
  roundedPath,
  termPos,
} from "../data/terminals";
import { getWirePoints } from "./wireRouting";

export function exportPng(items: Placed[], wires: Wire[], name = "electro-panel") {
  if (items.length === 0) return false;

  /* bounds */
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  items.forEach((it) => {
    minX = Math.min(minX, it.x);
    minY = Math.min(minY, it.y);
    maxX = Math.max(maxX, it.x + (it.w ?? 96));
    maxY = Math.max(maxY, it.y + (it.h ?? 92) + (it.libraryPlaced ? 20 : 0));
  });
  wires.forEach((w) => {
    if (w.hidden) return;
    const [au, at] = w.a.split("::");
    const [bu, bt] = w.b.split("::");
    const aItem = items.find((i) => i.uid === au);
    const bItem = items.find((i) => i.uid === bu);
    if (aItem && bItem) {
      const ad = getTerminals(aItem.id).find((d) => d.id === at);
      const bd = getTerminals(bItem.id).find((d) => d.id === bt);
      if (ad && bd) {
        const pa = termPos(aItem, ad);
        const pb = termPos(bItem, bd);
        for (const point of getWirePoints(w, pa, pb)) {
          minX = Math.min(minX, point.x);
          minY = Math.min(minY, point.y);
          maxX = Math.max(maxX, point.x);
          maxY = Math.max(maxY, point.y);
        }
      }
    }
  });
  const pad = 48;
  minX -= pad;
  minY -= pad;
  maxX += pad;
  maxY += pad;
  const W = Math.ceil(maxX - minX);
  const H = Math.ceil(maxY - minY);

  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

  /* grid */
  let grid = "";
  for (let gx = Math.floor(minX / 24) * 24; gx < maxX; gx += 24) {
    const major = Math.round(gx / 120) * 120 === gx;
    grid += `<line x1="${gx - minX}" y1="0" x2="${gx - minX}" y2="${H}" stroke="rgba(148,163,184,${major ? 0.13 : 0.06})" stroke-width="1"/>`;
  }
  for (let gy = Math.floor(minY / 24) * 24; gy < maxY; gy += 24) {
    const major = Math.round(gy / 120) * 120 === gy;
    grid += `<line x1="0" y1="${gy - minY}" x2="${W}" y2="${gy - minY}" stroke="rgba(148,163,184,${major ? 0.13 : 0.06})" stroke-width="1"/>`;
  }

  /* wires */
  let wiresSvg = "";
  let connectorsSvg = "";
  wires.forEach((w) => {
    if (w.hidden) return;
    const [au, at] = w.a.split("::");
    const [bu, bt] = w.b.split("::");
    const aItem = items.find((i) => i.uid === au);
    const bItem = items.find((i) => i.uid === bu);
    if (!aItem || !bItem) return;
    const ad = getTerminals(aItem.id).find((d) => d.id === at);
    const bd = getTerminals(bItem.id).find((d) => d.id === bt);
    if (!ad || !bd) return;
    const pa = termPos(aItem, ad);
    const pb = termPos(bItem, bd);
    const pts = getWirePoints(w, pa, pb);
    const d = roundedPath(
      pts.map((p) => ({
        x: p.x - minX,
        y: p.y - minY,
      })),
      8
    );
    const color = w.previewColor ?? "#6cc6ff";
    const thickness = Math.max(2, Math.min(10, w.thickness ?? 4.5));
    wiresSvg += `<path d="${d}" stroke="#071320" stroke-width="${thickness + 3.9}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/>`;
    wiresSvg += `<path d="${d}" stroke="${color}" stroke-width="${thickness}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    wiresSvg += `<path d="${d}" stroke="#ffffff" stroke-width="${thickness * 0.28}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>`;
    [pa, pb].forEach((port, index) => {
      const component = index === 0 ? aItem : bItem;
      if (FLOATLESS_CLEAN_PARTS.has(component.id)) return;
      const x = port.x - minX;
      const y = port.y - minY;
      connectorsSvg += `<circle cx="${x}" cy="${y}" r="${Math.max(6.3, thickness / 2 + 3)}" fill="#081522" stroke="${color}" stroke-width="2.1"/><circle cx="${x}" cy="${y}" r="3.5" fill="#dcecf2" stroke="#526778" stroke-width="0.8"/>`;
    });
  });

  /* components */
  const structural = new Set(["panel-s", "panel-m", "panel-l", "dist-panel", "cabinet", "subplate", "box", "din", "duct", "duct-wide", "textlabel"]);
  const ordered = [...items].filter((item) => item.id !== "sd-panel").sort((a, b) => Number(structural.has(a.id)) - Number(structural.has(b.id)));
  const glyphMarkup = (it: Placed) => renderToStaticMarkup(
    <PartGlyph part={it.id} color={it.color} skin={it.skin} label={it.name} />
  );
  const innerGlyph = (it: Placed) => glyphMarkup(it).replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  let backdropsSvg = "";
  items.filter((it) => it.id === "sd-panel").forEach((it) => {
    const native = STARTER_SIZE[it.id] ?? { w: 64, h: 64 };
    backdropsSvg += `<g transform="translate(${it.x - minX},${it.y - minY}) scale(${(it.w ?? native.w) / native.w},${(it.h ?? native.h) / native.h})">${innerGlyph(it)}</g>`;
  });
  let partsSvg = "";
  let terminalsSvg = "";
  ordered.forEach((it) => {
    const inner = innerGlyph(it);
    const label = it.name?.trim() || partById(it.id)?.en || "";
    const terms = getTerminals(it.id);
    let dots = "";
    terms.filter((td) => !FLOATLESS_CLEAN_PARTS.has(it.id) && it.id !== "floatless-level" && (it.skin !== "starter" || visibleStarterPort(it.id, td.id))).forEach((td) => {
      const p = termPos(it, td);
      dots += `<circle cx="${p.x - minX}" cy="${p.y - minY}" r="2.4" fill="${td.color ?? "#cbd5e1"}" stroke="#0b1322" stroke-width="1"/>`;
    });
    if (it.w && it.h) {
      const native = it.skin === "starter" ? STARTER_SIZE[it.id] : undefined;
      partsSvg += `
        <g transform="translate(${it.x - minX},${it.y - minY}) scale(${it.w / (native?.w ?? 64)},${it.h / (native?.h ?? 64)})">${inner}</g>`;
      if (it.libraryPlaced) {
        partsSvg += `<text x="${it.x + it.w / 2 - minX}" y="${it.y + it.h + 15 - minY}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="11" fill="#9fb4c9">${esc(label)}</text>`;
      }
    } else {
      partsSvg += `
        <g transform="translate(${it.x + 12 - minX},${it.y + 4 - minY}) scale(${72 / 64})">${inner}</g>
        <text x="${it.x + 48 - minX}" y="${it.y + 86 - minY}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="9" fill="#8fa3c0">${esc(label)}</text>`;
    }
    terminalsSvg += dots;
  });

  // Embedded gradients make moulded casings and metal screws render in the downloaded PNG.
  const defs = renderToStaticMarkup(<GlyphDefs />).match(/<defs>[\s\S]*?<\/defs>/)?.[0] ?? "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${defs}
    <rect width="${W}" height="${H}" fill="#0b1322"/>
    ${grid}
    ${backdropsSvg}
    ${partsSvg}
    ${wiresSvg}
    ${connectorsSvg}
    ${terminalsSvg}
    <text x="${W - 14}" y="${H - 12}" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="11" fill="#475569">Electro Panel — ${esc(new Date().toLocaleString())}</text>
  </svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = W * scale;
    canvas.height = H * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0b1322";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob((b) => {
      if (!b) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = `${name}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }, "image/png");
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
  return true;
}
