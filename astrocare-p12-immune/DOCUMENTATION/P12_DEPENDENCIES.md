# AstroCare P12 — Dependencies & Environment Specification

## 1. Runtime Dependencies

| Package | Version Requirement | Purpose in Module P12 |
| :--- | :--- | :--- |
| `react` | `^18.3.1` | Core React component runtime |
| `react-dom` | `^18.3.1` | DOM renderer for React |
| `react-router-dom` | `^6.28.0` | Declarative routing for all 9 P12 pages |
| `recharts` | `^2.15.0` | Responsive SVG charts (area, line, bar, donut) |
| `lucide-react` | `^0.468.0` | Biomedical and aerospace telemetry iconography |

---

## 2. Development & Testing Dependencies

| Package | Version Requirement | Purpose |
| :--- | :--- | :--- |
| `vite` | `^6.0.3` | High-performance build tool and dev server |
| `@vitejs/plugin-react` | `^4.3.4` | Vite plugin for React JSX compilation |
| `typescript` | `^5.7.2` | Static type checking and TypeScript contracts |
| `tailwindcss` | `^3.4.17` | Utility-first dark space theme styling |
| `postcss` | `^8.4.49` | CSS post-processing |
| `autoprefixer` | `^10.4.20` | CSS vendor prefixing |
| `vitest` | `^2.1.8` | Vite-native unit and integration test runner |
| `jsdom` | `^25.0.1` | DOM environment simulation for tests |
| `@testing-library/react` | `^16.1.0` | React testing utilities |
| `@testing-library/jest-dom` | `^6.6.3` | Custom DOM matchers for Vitest |
| `jszip` | `^3.10.1` | Archive creation and verification |
| `@types/node` | `^22.10.2` | Node.js type definitions |
| `@types/react` | `^18.3.18` | React type definitions |
| `@types/react-dom` | `^18.3.5` | React-DOM type definitions |

---

## 3. Environment Compatibility
- **Node.js:** >= 18.0.0 (Tested on Node.js v24.20.0)
- **Package Manager:** npm (or yarn / pnpm)
- **Operating Systems:** Windows 10/11, macOS, Linux
