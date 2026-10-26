import type { Part } from "../data/catalog";

// Thumbnails stay compact; new canvas placements keep their aspect ratio
// while displaying at a larger working size.
export const CANVAS_PART_SIZE = 144;

export function canvasSizeFor(part?: Part): { w: number; h: number } {
  if (!part?.size) return { w: CANVAS_PART_SIZE, h: CANVAS_PART_SIZE };

  const { w, h } = part.size;
  const longest = Math.max(w, h);
  const scale = longest < CANVAS_PART_SIZE ? CANVAS_PART_SIZE / longest : 1;
  return { w: Math.round(w * scale), h: Math.round(h * scale) };
}