/* Chiptune loop + sound effects (Web Audio). Off until the user toggles it. */
'use strict';

/* ── sound (off until toggled — chiptune loop + blips) ────────── */
const Sound = {
  ctx: null, master: null, on: false, step: 0, nextAt: 0, timer: null,
  LEAD: [
    72,0,76,0, 79,0,76,0, 81,0,79,0, 76,0,74,0,
    72,0,76,0, 79,0,81,0, 84,0,0,0, 81,79,76,0,
    77,0,76,0, 74,0,76,0, 77,0,79,0, 81,0,79,0,
    76,0,74,0, 72,0,74,0, 76,0,0,0, 0,0,0,0,
  ],
  BASS: [
    48,0,0,0, 55,0,0,0, 48,0,0,0, 55,0,0,0,
    45,0,0,0, 52,0,0,0, 45,0,0,0, 52,0,0,0,
    41,0,0,0, 48,0,0,0, 41,0,0,0, 48,0,0,0,
    43,0,0,0, 50,0,0,0, 43,0,0,0, 50,0,0,0,
  ],
  freq(m) { return 440 * Math.pow(2, (m - 69) / 12); },
  ensure() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.16;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },
  note(midi, t, dur, type, vol) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = this.freq(midi);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur + 0.02);
  },
  schedule() {
    const STEP = 0.16;
    while (this.nextAt < this.ctx.currentTime + 0.15) {
      const i = this.step % 64;
      if (this.LEAD[i]) this.note(this.LEAD[i], this.nextAt, 0.14, 'square', 0.22);
      if (this.BASS[i]) this.note(this.BASS[i], this.nextAt, 0.3, 'triangle', 0.4);
      this.nextAt += STEP; this.step++;
    }
  },
  toggle() {
    this.ensure();
    this.on = !this.on;
    const btn = document.getElementById('sound-btn');
    btn.setAttribute('aria-pressed', String(this.on));
    btn.textContent = this.on ? '♪ ON' : '♪ OFF';
    if (this.on) {
      this.nextAt = this.ctx.currentTime + 0.05; this.step = 0;
      this.timer = setInterval(() => this.schedule(), 40);
    } else {
      clearInterval(this.timer);
    }
  },
  fx(fn) { if (this.on && this.ctx) fn(); },
  blip() { this.fx(() => this.note(96, this.ctx.currentTime, 0.05, 'square', 0.12)); },
  confirm() {
    this.fx(() => {
      this.note(84, this.ctx.currentTime, 0.07, 'square', 0.16);
      this.note(91, this.ctx.currentTime + 0.07, 0.1, 'square', 0.16);
    });
  },
  open() {
    this.fx(() => {
      [72, 76, 79, 84, 88].forEach((m, i) => this.note(m, this.ctx.currentTime + i * 0.06, 0.1, 'square', 0.15));
    });
  },
};
document.getElementById('sound-btn').addEventListener('click', () => Sound.toggle());
