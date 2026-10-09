const M = require('./engine.js');
const E = require('./expected.json');
let n = 0, fail = 0;
const eq = (a, b, tag) => {
  n++;
  if (JSON.stringify(a) !== JSON.stringify(b)) { fail++; console.error('FAIL', tag, JSON.stringify(a), '!=', JSON.stringify(b)); }
};
for (const c of E.belt) { let r; try { r = M.belt(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'belt ' + c.in); }
for (const c of E.hide) { let r; try { r = M.hide(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'hide ' + c.in); }
for (const c of E.thread) { let r; try { r = M.thread(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'thread ' + c.in); }
// anchors
const a = M.belt(90);
eq(a.blankCm, 127, 'anchor blank'); eq(a.middleHoleFromTipCm, 17, 'anchor midhole');
eq(M.hide(10, 15, 2).areaCm2, 345, 'anchor area');
const t = M.thread(50, 0.5);
eq(t.stitches, 25, 'anchor stitches'); eq(t.totalCm, 200, 'anchor total'); eq(t.perNeedleCm, 100, 'anchor per needle');
// monotonic
n++; if (!(M.belt(100).blankCm > M.belt(80).blankCm)) { fail++; console.error('FAIL monotone belt'); }
n++; if (!(M.hide(20, 30, 4).sqft > M.hide(10, 15, 2).sqft)) { fail++; console.error('FAIL monotone hide'); }
n++; if (!(M.thread(100, 0.5).totalCm > M.thread(50, 0.5).totalCm)) { fail++; console.error('FAIL monotone thread'); }
// errors
const errs = [
  () => M.belt(0), () => M.belt(-5), () => M.belt(NaN), () => M.belt(500),
  () => M.hide(0, 10, 1), () => M.hide(10, 0, 1), () => M.hide(10, 10, 0),
  () => M.thread(0, 0.5), () => M.thread(50, 0), () => M.thread(-1, 0.5),
];
const msgs = ['waist must be positive','waist must be positive','waist must be positive','that waist looks like a typo',
  'piece width must be positive','piece length must be positive','piece count must be positive',
  'seam length must be positive','stitches per cm must be positive','seam length must be positive'];
errs.forEach((f, i) => {
  n++;
  try { f(); fail++; console.error('FAIL no-throw', i); }
  catch (e) { if (e.message !== msgs[i]) { fail++; console.error('FAIL msg', i, e.message, 'want', msgs[i]); } }
});
console.log(fail ? fail + ' FAILURES / ' + n : n + '/' + n + ' checks pass');
process.exit(fail ? 1 : 0);
