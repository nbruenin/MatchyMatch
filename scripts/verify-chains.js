const puzzles = [
  { id:1,  start:'COLD', end:'WARM', par:4, solution:['COLD','CORD','WORD','WARD','WARM'] },
  { id:2,  start:'HATE', end:'LOVE', par:3, solution:['HATE','HAVE','LAVE','LOVE'] },
  { id:3,  start:'LEAD', end:'GOLD', par:3, solution:['LEAD','BEAD','BOLD','GOLD'] },
  { id:4,  start:'HAND', end:'FOOT', par:5, solution:['HAND','BAND','BOND','FOND','FOOD','FOOT'] },
  { id:5,  start:'HEAD', end:'TAIL', par:5, solution:['HEAD','HEAL','TEAL','TELL','TALL','TAIL'] },
  { id:6,  start:'FIRE', end:'COLD', par:4, solution:['FIRE','FORE','FORD','CORD','COLD'] },
  { id:7,  start:'MINE', end:'GOLD', par:6, solution:['MINE','WINE','VINE','VANE','CANE','LANE','LAND','LARD','CARD','CORD','COLD','BOLD','GOLD'] },
  { id:8,  start:'LOVE', end:'HATE', par:3, solution:['LOVE','LAVE','HAVE','HATE'] },
  { id:9,  start:'DARK', end:'GLOW', par:4, solution:['DARK','LARK','LORE','GORE','GLOW'] },
  { id:10, start:'BOOK', end:'READ', par:6, solution:['BOOK','LOOK','LOCK','ROCK','RACK','RACE','LACE','LEAD','READ'] },
  { id:11, start:'MOON', end:'STAR', par:6, solution:['MOON','MOAN','LOAN','LEAN','BEAN','BEAT','SEAT','SEAR','STAR'] },
  { id:12, start:'CATS', end:'DOGS', par:4, solution:['CATS','BATS','BAGS','DAGS','DOGS'] },
  { id:13, start:'WORK', end:'PLAY', par:7, solution:['WORK','WORD','WARD','WARY','VARY','VERY','VEAL','PEAL','PLAY'] },
  { id:14, start:'FAST', end:'SLOW', par:7, solution:['FAST','PAST','PEST','BEST','BELT','MELT','MALT','SALT','SILT','SILO','SILK','MILK','MILD','WILD','WILE','WIFE','LIFE','LIFT','LIST','FIST','FISH','DISH','WISH','WASH','CASH','CAST','LAST','LASH','GASH','GLOW'] },
  { id:15, start:'RAIN', end:'SNOW', par:8, solution:['RAIN','REIN','VEIN','VAIN','MAIN','MAID','SAID','SLID','SLIM','SWIM','SWAM','SHAM','SHAW','SHOW','SNOW'] },
];

function diffCount(a, b) {
  if (a.length !== b.length) return 999;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

puzzles.forEach(p => {
  const sol = p.solution;
  let ok = true;
  for (let i = 1; i < sol.length; i++) {
    const d = diffCount(sol[i-1], sol[i]);
    if (d !== 1) {
      console.error('FAIL puzzle', p.id, sol[i-1], '->', sol[i], 'diff=', d);
      ok = false;
    }
  }
  if (ok) console.warn('OK puzzle', p.id, p.start, '->', p.end, 'steps:', sol.length - 1);
});
