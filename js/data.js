/* All visitor-facing content lives here — edit this file to update the page. */
'use strict';

const PROFILE = {
  name: 'Karthik Vetrivel',
  github: 'https://github.com/karthikvetrivel',
  linkedin: 'https://linkedin.com/in/kvetriv',
  resumeUrl: 'assets/336_resume.pdf',
  email: 'kvvetrivel@gmail.com',
};

// One "ball" per career stop, left-to-right in chronological order.
const JOBS = [
  {
    name: 'STANFORD', ballName: 'CARDINAL BALL',
    color: '#8C1515', soft: '#e8b8b8',
    role: 'B.S./M.S. Computer Science',
    dates: '2021 – 2025',
    type: 'ACADEMIC', level: 5,
    blurb: 'B.S./M.S. in Computer Science (3.9/4.05 GPA), with research at the Stanford AI Lab on deep-learning human motion generation — published at CVPR ’23.',
    accomplishments: [
      'Published at CVPR ’23 — built the dataset and training pipeline for human motion generation.',
      'Cut live neural-avatar latency from 200ms to 15ms (13×) with C and Linux socket-level optimizations.',
      'Coursework: computer vision & deep learning, ML, NLP, parallel computing, distributed systems, OS.',
    ],
    icon: 'tree',
  },
  {
    name: 'TESLA', ballName: 'VOLT BALL',
    color: '#E82127', soft: '#ffc2c4',
    role: 'ML Engineering Intern, Autopilot',
    dates: 'Jan – Mar 2024',
    type: 'ELECTRIC', level: 30,
    blurb: 'Machine learning engineering on Autopilot — training at multi-node GPU scale and shipping inference to real cars.',
    accomplishments: [
      'Built an out-of-core distributed GPU training pipeline for XGBoost, scaling to 500GB+ datasets.',
      'Designed a Mixture-of-Experts network for automatic park mode on Model 3 & Y — sub-200ms inference on vehicle hardware.',
    ],
    icon: 'bolt',
  },
  {
    name: 'NVIDIA', ballName: 'TENSOR BALL',
    color: '#76B900', soft: '#d4ecaa',
    role: 'Software Engineer, AI Infrastructure',
    dates: '2025 – Present',
    type: 'AI / GPU', level: 60,
    blurb: 'I work on GPU Operator — NVIDIA’s open-source platform (10k+ GitHub stars) powering GPU provisioning for large-scale LLM training and inference across AWS, GCP, and Azure.',
    accomplishments: [
      'Designed and shipped the ISV self-certification framework — featured at GTC ’26.',
      'Architected zero-downtime GPU driver upgrades across DGX Cloud and 1000+ GPU training clusters.',
      'Contributed graph-fusion transforms and pattern matchers to TensorRT-LLM for SSM and MoE inference.',
      'Started as an SWE intern in 2024, building Kubernetes operators for NVIDIA Cloud Functions.',
    ],
    icon: 'chip',
  },
];

// Talking to the professor (Karthik, as the NPC).
const NPC_DIALOGUE = {
  intro: [
    "Oh! A visitor!\nWelcome to my lab.",
    "I'm " + PROFILE.name + ". I build the infrastructure that trains and serves AI.",
  ],
  prompt: 'What would you like to know?',
  branches: [
    {
      label: 'THE JOURNEY',
      pages: [
        'My journey runs Stanford, then Tesla Autopilot, and now NVIDIA. Each stop taught me something different.',
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

const BOOKSHELF_PAGES = [
  'A shelf of well-worn books. The spines read like a skill tree…',
  'LANGUAGES: Python, C, C++, Go, CUDA, Java, TypeScript. ML/AI: PyTorch, TensorFlow, Transformers, FP8 quantization, NCCL, DeepSpeed.',
  'SYSTEMS: Linux, Kubernetes, Docker, AWS, Azure, GCP, eBPF. EDUCATION: B.S./M.S. Computer Science, Stanford University, 2021 – 2025.',
];

// First-load tutorial — _KEYS for keyboard devices, _TOUCH for touchscreens.
const FIRST_STEPS_KEYS = [
  'You step into the lab. A professor looks up from a table of strange spheres…\n\n▼ CLICK HERE OR PRESS ENTER',
  'Walk around with the ARROW KEYS or WASD.',
  'When PRESS ENTER TO EXAMINE pops up, give it a try. Everything in the lab has a story — start with the professor!',
];
const FIRST_STEPS_TOUCH = [
  'You step into the lab. A professor looks up from a table of strange spheres…\n\n▼ TAP HERE TO CONTINUE',
  'Walk around with the pad at the bottom of the screen.',
  'When TAP A TO EXAMINE pops up, give it a try. Everything in the lab has a story — start with the professor!',
];
