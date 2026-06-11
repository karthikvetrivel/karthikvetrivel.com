/* Game engine: map, movement, dialogue, menus, detail panel, input, render. */
'use strict';

const TILE = 16, COLS = 13, ROWS = 14;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Map legend (collision/interaction; visuals come from the embedded
   FRLG lab background): E equipment  C pc  Y workbench  p poster
   w window  B bookshelf  x doc trays  M orb machine  T table
   q plant  D door mat  X void  . floor                              */
const MAP = [
  'EECCYYppwBBBB',
  'EECCYYppwBBBB',
  'x............',
  'xMM..........',
  'xMM.....TTT..',
  'MMM.....TTT..',
  '.............',
  'BBBBB...BBBBB',
  'BBBBB...BBBBB',
  '.............',
  '.............',
  'q...........q',
  'XXXXXDDDXXXXX',
  'XXXXXXXXXXXXX',
];
const SOLID = 'ECYpwBxMTqDX';
const INTERACTABLE = 'ECYpwBxMTqD';   // SOLID minus the void; all answer to a press
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const NPC_POS = { x: 6, y: 7 };
const BALL_COLS = [8, 9, 10];   // table columns holding the three balls

/* ── room background (the FRLG lab, 1:1) ── */
const bg = makeCanvas(COLS * TILE, ROWS * TILE);
{
  const img = new Image();
  img.onload = () => bg.getContext('2d').drawImage(img, 0, 0);
  img.src = 'assets/lab-bg.png';
}

/* ── game state ───────────────────────────────────────────────── */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const player = {
  x: 6, y: 10, px: 6 * TILE, py: 10 * TILE,
  dir: 'up', moving: false, fromX: 6, fromY: 10, toX: 6, toY: 10,
  t: 0, step: 0, turnTimer: 0,
};
const MOVE_TIME = 0.19, TURN_DELAY = 0.07;

let mode = 'explore';     // explore | dialogue | menu | panel
const held = { up: false, down: false, left: false, right: false };
let time = 0;

function solidAt(x, y) {
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return true;
  if (x === NPC_POS.x && y === NPC_POS.y) return true;
  return SOLID.includes(MAP[y][x]);
}

/* ── dialogue engine ──────────────────────────────────────────── */
const dlgEl = document.getElementById('dlg');
const dlgText = document.getElementById('dlg-text');
const dlgMore = document.getElementById('dlg-more');
const menuEl = document.getElementById('menu');

const dlg = { pages: [], page: 0, chars: 0, typing: false, onDone: null, acc: 0 };

function showDialogue(pages, onDone) {
  dlg.pages = pages.slice(); dlg.page = 0; dlg.onDone = onDone || null;
  mode = 'dialogue';
  dlgEl.hidden = false;
  startPage();
}
function startPage() {
  dlg.chars = REDUCED ? dlg.pages[dlg.page].length : 0;
  dlg.typing = !REDUCED;
  dlg.acc = 0;
  paintPage();
}
function paintPage() {
  const full = dlg.pages[dlg.page];
  dlgText.textContent = full.slice(0, dlg.chars);
  const done = dlg.chars >= full.length;
  if (done) dlg.typing = false;
  dlgMore.hidden = !done;
}
function advanceDialogue() {
  if (dlg.typing) { dlg.chars = dlg.pages[dlg.page].length; paintPage(); return; }
  Sound.blip();
  if (dlg.page < dlg.pages.length - 1) { dlg.page++; startPage(); return; }
  dlgEl.hidden = true;
  const fn = dlg.onDone; dlg.onDone = null;
  if (fn) fn(); else mode = 'explore';
}

/* ── choice menu ──────────────────────────────────────────────── */
const menu = { options: [], sel: 0, onPick: null };
function showMenu(prompt, options, onPick) {
  menu.options = options; menu.sel = 0; menu.onPick = onPick;
  showDialogue([prompt], openMenuNow);
}
function openMenuNow() {
  mode = 'menu';
  dlgEl.hidden = false;          // keep the prompt on screen under the menu
  dlgMore.hidden = true;
  menuEl.innerHTML = '';
  menu.options.forEach((opt, i) => {
    const d = document.createElement('div');
    d.className = 'opt' + (i === 0 ? ' sel' : '');
    d.textContent = opt;
    d.setAttribute('role', 'menuitem');
    d.addEventListener('click', () => { menu.sel = i; pickMenu(); });
    menuEl.appendChild(d);
  });
  menuEl.hidden = false;
}
function paintMenu() {
  [...menuEl.children].forEach((el, i) => el.classList.toggle('sel', i === menu.sel));
}
function pickMenu() {
  Sound.confirm();
  menuEl.hidden = true; dlgEl.hidden = true;
  const fn = menu.onPick; menu.onPick = null;
  mode = 'explore';
  if (fn) fn(menu.sel);
}
function cancelMenu() {
  Sound.blip();
  menu.sel = menu.options.length - 1; paintMenu();
  pickMenu();
}

/* ── detail panel ─────────────────────────────────────────────── */
const panelEl = document.getElementById('panel');
const panelArt = document.getElementById('panel-art');
const iconSprite = document.getElementById('icon-sprite');
const ballSprite = document.getElementById('ball-sprite');

function openPanel(job) {
  mode = 'panel';
  document.getElementById('panel-ballname').textContent = job.ballName;
  document.getElementById('panel-level').textContent = 'LV. ' + job.level;
  document.getElementById('panel-co').textContent = job.name;
  document.getElementById('panel-role').textContent = job.role;
  document.getElementById('panel-dates').textContent = job.dates;
  document.getElementById('panel-type').textContent = job.type + ' TYPE';
  document.getElementById('panel-blurb').textContent = job.blurb;
  const acc = document.getElementById('panel-acc');
  acc.innerHTML = '';
  job.accomplishments.forEach((a) => {
    const li = document.createElement('li'); li.textContent = a; acc.appendChild(li);
  });
  panelEl.style.setProperty('--job-color', job.color);
  panelEl.style.setProperty('--job-soft', job.soft);
  renderIcon(iconSprite, job.icon, job.color);
  renderBall(ballSprite, job.color);
  panelArt.classList.remove('opening');
  void panelArt.offsetWidth;                // restart CSS animation
  panelArt.classList.add('opening');
  panelEl.hidden = false;
  Sound.open();
  document.getElementById('panel-close').focus({ preventScroll: true });
}
function closePanel() {
  panelEl.hidden = true;
  mode = 'explore';
  consoleEl.focus({ preventScroll: true });
}
document.getElementById('panel-close').addEventListener('click', closePanel);

/* ── interactions ─────────────────────────────────────────────── */
function openLink(url) { window.open(url, '_blank', 'noopener'); }

function interact() {
  const d = DIRS[player.dir];
  const fx = player.x + d[0], fy = player.y + d[1];

  if (fx === NPC_POS.x && fy === NPC_POS.y) return talkToNPC();

  const ch = (MAP[fy] || '')[fx];
  if (ch === 'T') {
    const bi = BALL_COLS.indexOf(fx);
    if (bi >= 0 && (fy === 4 || fy === 5)) {
      const job = JOBS[bi];
      showDialogue(['You examine the ' + job.ballName + '…'], () => openPanel(job));
    } else {
      showDialogue(['A sturdy lab table. Three strange balls rest on the green felt.']);
    }
  } else if (ch === 'C') {
    showMenu('The lab PC hums softly. Its screen lists public repositories.', ['OPEN GITHUB', 'CLOSE'], (i) => {
      if (i === 0) openLink(PROFILE.github);
    });
  } else if (ch === 'B') {
    showDialogue(BOOKSHELF_PAGES);
  } else if (ch === 'p') {
    showMenu("A neatly pinned poster. It's a resume — one page, no fluff.", ['VIEW RESUME', 'CLOSE'], (i) => {
      if (i === 0) openLink(PROFILE.resumeUrl);
    });
  } else if (ch === 'w') {
    showDialogue(['Through the window, the route stretches off into the distance…']);
  } else if (ch === 'D') {
    showMenu('The door to the outside world. Get in touch?', ['SEND EMAIL', 'STAY'], (i) => {
      if (i === 0) openLink('mailto:' + PROFILE.email);
    });
  } else if (ch === 'M') {
    showDialogue(['The analyzer hums. Its red dome pulses gently…', 'It seems to power the whole lab.']);
  } else if (ch === 'E') {
    showDialogue(['Banks of lab equipment blink and whir. Best not to touch.']);
  } else if (ch === 'Y') {
    showDialogue(['A workbench covered in half-finished experiments.']);
  } else if (ch === 'x') {
    showDialogue(['Document trays, neatly sorted. Research notes going back years.']);
  } else if (ch === 'q') {
    showDialogue(["A leafy lab plant. It's surprisingly well cared for."]);
  }
}

let npcMet = false;
function talkToNPC() {
  const intro = npcMet ? [NPC_DIALOGUE.intro[0]] : NPC_DIALOGUE.intro;
  npcMet = true;
  showDialogue(intro, npcMenu);
}
function npcMenu() {
  showMenu(NPC_DIALOGUE.prompt, NPC_DIALOGUE.branches.map((b) => b.label), (i) => {
    const branch = NPC_DIALOGUE.branches[i];
    const isBye = i === NPC_DIALOGUE.branches.length - 1;
    showDialogue(branch.pages, isBye ? null : npcMenu);
  });
}

/* ── input ────────────────────────────────────────────────────── */
const consoleEl = document.getElementById('console');

const KEYMAP = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
};
const ACTION = ['KeyZ', 'Enter', 'Space'];
const BACK = ['KeyX', 'Escape'];

function pressAction() {
  if (mode === 'explore') interact();
  else if (mode === 'dialogue') advanceDialogue();
  else if (mode === 'menu') pickMenu();
  else if (mode === 'panel') closePanel();
}
function pressBack() {
  if (mode === 'dialogue') advanceDialogue();
  else if (mode === 'menu') cancelMenu();
  else if (mode === 'panel') closePanel();
}
function pressDir(dir) {
  if (mode === 'menu') {
    if (dir === 'up') menu.sel = (menu.sel + menu.options.length - 1) % menu.options.length;
    if (dir === 'down') menu.sel = (menu.sel + 1) % menu.options.length;
    Sound.blip();
    paintMenu();
  }
}

window.addEventListener('keydown', (e) => {
  const dir = KEYMAP[e.code];
  if (dir) {
    e.preventDefault();
    if (!held[dir]) pressDir(dir);
    held[dir] = true;
    return;
  }
  if (ACTION.includes(e.code)) {
    // let real buttons keep their native Enter/Space behavior
    if (e.target instanceof HTMLElement && e.target.tagName === 'BUTTON' && e.code !== 'KeyZ') return;
    e.preventDefault();
    pressAction();
  } else if (BACK.includes(e.code)) {
    e.preventDefault();
    pressBack();
  }
});
window.addEventListener('keyup', (e) => {
  const dir = KEYMAP[e.code];
  if (dir) held[dir] = false;
});
window.addEventListener('blur', () => { for (const k in held) held[k] = false; });

dlgEl.addEventListener('click', () => { if (mode === 'dialogue') advanceDialogue(); });

/* touch controls */
function bindPad(id, dir) {
  const el = document.getElementById(id);
  const on = (e) => { e.preventDefault(); if (!held[dir]) pressDir(dir); held[dir] = true; };
  const off = (e) => { e.preventDefault(); held[dir] = false; };
  el.addEventListener('pointerdown', on);
  el.addEventListener('pointerup', off);
  el.addEventListener('pointercancel', off);
  el.addEventListener('pointerleave', off);
}
bindPad('btn-up', 'up'); bindPad('btn-down', 'down');
bindPad('btn-left', 'left'); bindPad('btn-right', 'right');
document.getElementById('btn-a').addEventListener('pointerdown', (e) => { e.preventDefault(); pressAction(); });
document.getElementById('btn-b').addEventListener('pointerdown', (e) => { e.preventDefault(); pressBack(); });

/* ── first-visit hints ────────────────────────────────────────── */
const FINE_POINTER = matchMedia('(hover: hover) and (pointer: fine)').matches;
const hintMove = document.getElementById('hint-move');
const hintAct = document.getElementById('hint-act');
if (!FINE_POINTER) {
  hintMove.textContent = 'WALK WITH THE PAD BELOW';
  hintAct.textContent = 'TAP A TO EXAMINE';
}
let hasMoved = false;

function facingInteractable() {
  const d = DIRS[player.dir];
  const fx = player.x + d[0], fy = player.y + d[1];
  if (fx === NPC_POS.x && fy === NPC_POS.y) return true;
  const ch = (MAP[fy] || '')[fx];
  return !!ch && INTERACTABLE.includes(ch);
}
function updateHints() {
  const idle = mode === 'explore' && !player.moving;
  hintMove.hidden = !idle || hasMoved;
  hintAct.hidden = !idle || !facingInteractable();
}

/* ── update & render ──────────────────────────────────────────── */
function updatePlayer(dt) {
  if (player.moving) {
    player.t += dt / MOVE_TIME;
    if (player.t >= 1) {
      player.t = 0; player.moving = false;
      player.x = player.toX; player.y = player.toY;
      player.px = player.x * TILE; player.py = player.y * TILE;
      player.step ^= 1;
    } else {
      player.px = (player.fromX + (player.toX - player.fromX) * player.t) * TILE;
      player.py = (player.fromY + (player.toY - player.fromY) * player.t) * TILE;
    }
  }
  if (player.moving || mode !== 'explore') return;

  const dir = held.up ? 'up' : held.down ? 'down' : held.left ? 'left' : held.right ? 'right' : null;
  if (!dir) { player.turnTimer = 0; return; }

  if (player.dir !== dir) { player.dir = dir; player.turnTimer = TURN_DELAY; return; }
  if (player.turnTimer > 0) { player.turnTimer -= dt; return; }

  const d = DIRS[dir];
  const nx = player.x + d[0], ny = player.y + d[1];
  if (solidAt(nx, ny)) return;
  player.moving = true; player.t = 0;
  hasMoved = true;
  player.fromX = player.x; player.fromY = player.y;
  player.toX = nx; player.toY = ny;
}

function playerSprite() {
  const frames = SPRITES[player.dir];
  if (!player.moving) return frames[0];
  const mid = player.t > 0.2 && player.t < 0.8;
  return mid ? frames[1 + player.step] : frames[0];
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0);

  // balls on the green table (subtle glint cycles between them)
  BALL_COLS.forEach((c, i) => {
    const bx = c * TILE + 3, by = 4 * TILE + 3;
    ctx.drawImage(ballCanvases[i], bx, by);
    if (!REDUCED && Math.floor(time * 1.4) % 4 === i) {
      const ph = (time * 1.4) % 1;
      if (ph < 0.4) { ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillRect(bx + 3, by + 2, 1, 1); }
    }
  });

  // NPC (gentle idle bob) — sprites are taller than a tile; feet sit in the tile
  const bob = (!REDUCED && Math.floor(time * 1.6) % 2) ? 1 : 0;
  const npcImg = SPRITES.npc[0];
  ctx.drawImage(npcImg, NPC_POS.x * TILE, NPC_POS.y * TILE - (npcImg.height - TILE) + bob);

  const pImg = playerSprite();
  ctx.drawImage(pImg, Math.round(player.px), Math.round(player.py) - (pImg.height - TILE));
}

let last = 0;
function frame(ts) {
  const dt = Math.min((ts - last) / 1000 || 0, 0.05);
  last = ts; time += dt;

  if (dlg.typing) {
    dlg.acc += dt * 45;                         // chars per second
    const add = Math.floor(dlg.acc);
    if (add > 0) {
      dlg.acc -= add;
      dlg.chars = Math.min(dlg.chars + add, dlg.pages[dlg.page].length);
      if (dlg.chars % 3 === 0) Sound.blip();
      paintPage();
    }
  }

  updatePlayer(dt);
  updateHints();
  render();
  requestAnimationFrame(frame);
}

/* ── responsive integer scaling ───────────────────────────────── */
function fit() {
  const availW = Math.min(window.innerWidth - 56, 880);
  const availH = window.innerHeight - 190;
  const scale = Math.max(1, Math.min(Math.floor(availW / canvas.width), Math.floor(availH / canvas.height), 4));
  canvas.style.width = canvas.width * scale + 'px';
  canvas.style.height = canvas.height * scale + 'px';
  const font = Math.max(8, Math.min(5 * scale, 15));
  document.getElementById('screen').style.setProperty('--dlg-font', font + 'px');
}
window.addEventListener('resize', fit);
fit();

consoleEl.focus({ preventScroll: true });
requestAnimationFrame(frame);
showDialogue(FINE_POINTER ? FIRST_STEPS_KEYS : FIRST_STEPS_TOUCH);
