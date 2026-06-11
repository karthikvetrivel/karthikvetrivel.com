# Karthik's Lab

A portfolio site styled as a GBA-era Pokémon lab. Walk around the room,
talk to the professor (me), and examine the three balls on the table —
one per career stop (Stanford, Tesla Autopilot, NVIDIA). The PC links to
GitHub, the bookshelves hold skills, the posters are the resume, and the
door sends email.

## Running

It's a static site with no build step. Open `index.html` directly in a
browser, or serve the folder:

```sh
python3 -m http.server
# → http://localhost:8000
```

## Project structure

```
index.html              Page markup
styles/main.css         All styling (page chrome, dialogue box, detail panel)
js/data.js              ★ All visitor-facing content — edit this file
js/sprites.js           Pixel art (palettes, sprite string-maps, renderers)
js/audio.js             Chiptune loop + SFX (Web Audio, off by default)
js/game.js              Engine: map, movement, dialogue, panel, input, render
assets/lab-bg.png       The room background (208×224)
assets/reference/       Source pixel art the sprites/room are sampled from
```

The scripts are plain (non-module) and load in order — `data.js` →
`sprites.js` → `audio.js` → `game.js` — so the page also works over
`file://` with no server.

## Editing content

Everything a visitor reads lives in `js/data.js`: profile links, the three
career stops (role, dates, type, level, blurb, accomplishments), the professor's
dialogue branches, and the bookshelf pages — all filled from the resume
in `assets/336_resume.pdf`.

## Pixel art workflow

The sprites and room are transcribed 1:1 from the reference images in
`assets/reference/` (FRLG overworld sprite sheet + lab interior). Don't
hand-edit the art freehand — sample the references and regenerate the
string-maps in `js/sprites.js` / the background PNG. One deliberate
deviation from the references: the professor is customized (brown skin,
black hair, blue button-up, visible eyes).

## Controls

Arrows/WASD to walk, Z/Enter to talk or examine, X/Esc to go back.
Touch devices get an on-screen D-pad. Respects `prefers-reduced-motion`.
