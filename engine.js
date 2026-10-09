/* Leather math - exact arithmetic on labeled published leathercraft norms. */
const TIP_CM = 12, FOLD_CM = 10, LAST_HOLE_CM = 15; // labeled belt allowances
const HOLES = 5, HOLE_SPACING_CM = 2.5; // labeled norms
const CUT_LOSS = 0.15; // labeled cutting/layout loss
const THREAD_FACTOR = 4; // labeled saddle-stitch rule of thumb
const CM2_PER_SQFT = 929.0304;
const r1 = x => Math.round(x * 10) / 10;
const r2 = x => Math.round(x * 100) / 100;
const bad = m => { throw new Error(m); };

function belt(waistCm) {
  if (!Number.isFinite(waistCm) || waistCm <= 0) bad('waist must be positive');
  if (waistCm > 300) bad('that waist looks like a typo');
  const blankCm = waistCm + TIP_CM + FOLD_CM + LAST_HOLE_CM;
  const middleHoleFromTipCm = TIP_CM + (HOLES - 1) / 2 * HOLE_SPACING_CM;
  let verdict;
  if (blankCm < 100) verdict = 'a short strap - one shoulder off the hide (labeled)';
  else if (blankCm <= 140) verdict = 'a standard belt blank (labeled)';
  else verdict = 'a long blank - plan the hide layout (labeled)';
  return { blankCm: r1(blankCm), holes: HOLES, spacingCm: HOLE_SPACING_CM, middleHoleFromTipCm: r1(middleHoleFromTipCm), verdict };
}

function hide(widthCm, lengthCm, count) {
  for (const [v, m] of [[widthCm, 'piece width must be positive'], [lengthCm, 'piece length must be positive'], [count, 'piece count must be positive']])
    if (!Number.isFinite(v) || v <= 0) bad(m);
  const areaCm2 = widthCm * lengthCm * count * (1 + CUT_LOSS);
  const sqft = areaCm2 / CM2_PER_SQFT;
  let verdict;
  if (sqft < 2) verdict = 'scrap-bin territory (labeled)';
  else if (sqft < 8) verdict = 'a half-side should cover it (labeled)';
  else verdict = 'a full hide conversation (labeled)';
  return { areaCm2: r1(areaCm2), sqft: r2(sqft), lossPct: r2(CUT_LOSS * 100), verdict };
}

function thread(seamCm, stitchesPerCm) {
  if (!Number.isFinite(seamCm) || seamCm <= 0) bad('seam length must be positive');
  if (!Number.isFinite(stitchesPerCm) || stitchesPerCm <= 0) bad('stitches per cm must be positive');
  const stitches = Math.ceil(seamCm * stitchesPerCm);
  const totalCm = seamCm * THREAD_FACTOR;
  const perNeedleCm = totalCm / 2;
  let verdict;
  if (totalCm < 100) verdict = 'a wrist of thread (labeled)';
  else if (totalCm < 400) verdict = 'an arm-span pull (labeled)';
  else verdict = 'wind a long one - wax it first (labeled)';
  return { stitches, totalCm: r1(totalCm), perNeedleCm: r1(perNeedleCm), factor: THREAD_FACTOR, verdict };
}

const api = { TIP_CM, FOLD_CM, LAST_HOLE_CM, HOLES, HOLE_SPACING_CM, CUT_LOSS, THREAD_FACTOR, belt, hide, thread };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.Leathermath = api;
