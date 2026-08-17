// Card sizing constants (spec 0004, AC-9/AC-13): one shared height per
// breakpoint tier; a card's width follows from its own cover image's
// natural aspect ratio at that tier's height. Component-level constants,
// not design tokens (see docs/specs/0004-interactive-project-carousel).
// Starting values only — tune live in the dev server against the real
// project photos, then update here.
export const CARD_HEIGHT_MOBILE = 320;
export const CARD_HEIGHT_TABLET = 420;
// Trimmed from 550 (single-frame layout experiment): the carousel is one
// of two levers absorbing the "fit bio + carousel in one frame" cut, the
// other being the bio section's own spacing (index.astro).
export const CARD_HEIGHT_DESKTOP = 480;

// Desktop-tier width envelope used for build-time validation (AC-13).
// Width scales strictly proportionally with height within a tier, so
// checking against the desktop tier alone is sufficient (tablet/mobile
// are smaller proportional versions of the same ratio). Scaled down from
// [400, 850] in proportion to the height cut above.
export const DESKTOP_CARD_WIDTH_MIN = 350;
export const DESKTOP_CARD_WIDTH_MAX = 750;

export function computeDesktopCardWidth(aspectRatio: number): number {
  return Math.round(aspectRatio * CARD_HEIGHT_DESKTOP);
}

export function assertCardWidthInRange(
  entryId: string,
  aspectRatio: number,
): void {
  const width = computeDesktopCardWidth(aspectRatio);
  if (width < DESKTOP_CARD_WIDTH_MIN || width > DESKTOP_CARD_WIDTH_MAX) {
    throw new Error(
      `Project "${entryId}": cover image's aspect ratio (${aspectRatio.toFixed(3)}) produces a desktop card width of ${width}px, outside the allowed [${DESKTOP_CARD_WIDTH_MIN}, ${DESKTOP_CARD_WIDTH_MAX}]px range (src/lib/cardSize.ts). Crop or resize the cover image so it fits, or adjust the range.`,
    );
  }
}
