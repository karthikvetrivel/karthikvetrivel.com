/* All visitor-facing content lives here — edit this file to update the page. */
'use strict';

const PROFILE = {
  name: 'Karthik Vetrivel',
  github: 'https://github.com/karthikvetrivel',
  linkedin: 'https://linkedin.com/in/kvetriv',
  email: 'kvvetrivel@gmail.com',
};

// One "ball" per career stop, left-to-right in chronological order.
const JOBS = [
  {
    name: 'STANFORD + META AI', ballName: 'CARDINAL BALL',
    color: '#8C1515', color2: '#0668E1', soft: '#e8b8b8',
    role: 'Research Intern',
    dates: 'Jun – Dec 2022',
    type: 'RESEARCH', level: 5,
    blurb: 'Joint Stanford + Meta AI research on deep-learning human motion generation — published at CVPR ’23.',
    accomplishments: [
      'Built the dataset and training pipeline behind the paper.',
      'Cut live neural-avatar latency 200ms → 15ms (13×).',
    ],
    logo: 'stanford-meta',
  },
  {
    name: 'TESLA', ballName: 'VOLT BALL',
    color: '#E82127', soft: '#ffc2c4',
    role: 'ML Engineering Intern, Autopilot',
    dates: 'Jan – Mar 2024',
    type: 'ELECTRIC', level: 30,
    blurb: 'ML engineering on Autopilot — training at multi-node GPU scale, shipping inference to real cars.',
    accomplishments: [
      'Distributed out-of-core XGBoost training on 500GB+ datasets.',
      'Mixture-of-Experts park mode for Model 3 & Y — sub-200ms on-vehicle.',
    ],
    logo: 'tesla',
  },
  {
    name: 'NVIDIA', ballName: 'TENSOR BALL',
    color: '#76B900', soft: '#d4ecaa',
    role: 'Software Engineer, AI Infrastructure',
    dates: '2025 – Present',
    type: 'AI / GPU', level: 60,
    blurb: 'I work on GPU Operator — NVIDIA’s open-source platform (10k+ GitHub stars) powering GPU provisioning for large-scale LLM training.',
    accomplishments: [
      'Shipped the ISV self-certification framework — featured at GTC ’26.',
      'Zero-downtime GPU driver upgrades across 1000+ GPU clusters.',
      'Graph-fusion transforms in TensorRT-LLM for SSM & MoE inference.',
    ],
    logo: 'nvidia',
  },
];

// Talking to the professor (Karthik, as the NPC).
const NPC_DIALOGUE = {
  intro: [
    "Oh! A visitor!\nWelcome to my lab.",
    "I'm " + PROFILE.name + ". I love solving infrastructure problems that make deploying AI in the world easy.",
  ],
  prompt: 'What would you like to know?',
  branches: [
    {
      label: 'THE JOURNEY',
      pages: [
        'My journey began at Stanford, where I studied computer science and learned from some of the smartest classmates and professors I could have asked for.',
        'During my summers, I worked on research with a joint Meta–Stanford team, explored ML systems at Tesla, and built serverless inference infrastructure at NVIDIA.',
        'The three balls on the table hold the whole story. Go ahead — examine them, left to right!',
      ],
    },
    {
      label: 'THIS LAB',
      pages: [
        'The PC connects to my GitHub, the bookshelves hold my skills, and the posters are my resume.',
        'The door? That leads to my inbox. Use it any time.',
      ],
    },
    {
      label: 'LATER!',
      pages: ['Come back any time. The lab door is always open!'],
    },
  ],
};

// Favorite books — one per bookshelf section, mapped to shelves in game.js.
const BOOKS = [
  { title: 'DIE WITH ZERO', author: 'Bill Perkins' },
  { title: 'ONE HUNDRED YEARS OF SOLITUDE', author: 'Gabriel García Márquez' },
  { title: 'THE COVENANT OF WATER', author: 'Abraham Verghese' },
  { title: 'CATCH-22', author: 'Joseph Heller' },
  { title: "SURELY YOU'RE JOKING, MR. FEYNMAN!", author: 'Richard P. Feynman' },
  { title: "FERMAT'S LAST THEOREM", author: 'Simon Singh' },
];

// First-load intro — one page; the on-screen hint pills teach the controls.
// _KEYS for keyboard devices, _TOUCH for touchscreens.
const FIRST_STEPS_KEYS = [
  'You step into the lab. A professor looks up — go say hi!\n\n▼ CLICK OR PRESS ENTER',
];
const FIRST_STEPS_TOUCH = [
  'You step into the lab. A professor looks up — go say hi!\n\n▼ TAP HERE',
];
