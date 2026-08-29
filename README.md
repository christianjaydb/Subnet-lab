# SubnetLab

An interactive IPv4 subnetting learning tool — built as a portfolio project
to demonstrate practical networking fundamentals and front-end engineering.

Live features:

- **Subnet Calculator** — enter any IPv4 address and CIDR prefix (`/0`-`/32`)
  and get the subnet mask, network/broadcast addresses, usable host range,
  address counts, and IP class, all computed client-side.
- **Network Visualizer** — a range diagram plus a bit-level "ruler" showing
  exactly which of the 32 bits are network bits vs. host bits.
- **Practice Mode** — randomly generated subnetting questions across six
  question types, with instant grading, a running score, and a worked
  explanation for every answer.
- **Networking Basics** — plain-language explanations of IP addresses,
  subnet masks, CIDR, network/broadcast addresses, host ranges, and default
  gateways.
- **CIDR Reference Table** — a responsive table of common prefixes from
  `/8` to `/32`, generated from the same math the calculator uses.

## Tech stack

- React 19 + Vite
- Plain CSS (no framework) — design tokens in `src/styles/tokens.css`
- No backend, no dependencies beyond React — everything runs in the browser

## Project structure

```text
src/
├── components/            # Navbar, Hero, Calculator, ResultCard,
│                           # NetworkVisualizer, BitRuler, PracticeQuiz,
│                           # Basics, CIDRTable, Footer
├── utils/
│   └── subnetCalculator.js  # All IPv4/CIDR math + question generation
├── styles/
│   └── tokens.css         # Color, type, and layout design tokens
├── App.jsx
└── main.jsx
```

## Running locally

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint       # lint with oxlint
```

## Notes on the math

All subnet calculations live in `src/utils/subnetCalculator.js` as pure
functions — nothing is hardcoded per-input. `/31` (RFC 3021 point-to-point
links) and `/32` (single-host routes) are handled as their own cases, since
neither has a network/broadcast address distinct from the usable range.
