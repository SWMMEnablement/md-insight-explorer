# MD Insight Explorer — Project Handover Document

> **App Name:** MD Insight Explorer  
> **Published URL:** https://md-insight-explorer.lovable.app  
> **Lovable Project:** https://lovable.dev/projects/fdf6e6ea-1b7e-4b30-a505-ba44d472c792  
> **Date:** 2026-02-12  

---

## 1. Overview

MD Insight Explorer is an interactive web-based viewer for Allan Goyen's PhD dissertation: *"Spatial and Temporal Effects on Urban Rainfall/Runoff Modelling"* (University of Technology Sydney, 2000). It renders a large Markdown document (~22,703 lines) with full navigation, search, data visualizations, an interactive Mapbox map, and multi-format export.

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | ^18.3.1 |
| Build Tool | Vite | (via Lovable) |
| Language | TypeScript | strict |
| Styling | Tailwind CSS + CSS Variables (HSL design tokens) | |
| UI Components | shadcn/ui (Radix primitives) | |
| Markdown Rendering | react-markdown + remark-gfm + rehype-raw | ^10.1.0 |
| Charts | Recharts | ^2.15.4 |
| Maps | mapbox-gl | ^3.16.0 |
| Routing | react-router-dom | ^6.30.1 |
| State Management | React useState/useEffect (no global store) | |
| Data Fetching | @tanstack/react-query (configured, not heavily used) | ^5.83.0 |
| SEO | react-helmet | ^6.1.0 |
| Notifications | sonner + radix toast | |
| Package Manager | npm / bun | |

---

## 3. Project Structure

```
├── public/
│   ├── dissertation.md          # The full PhD thesis in Markdown (~22,703 lines)
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── App.tsx                  # Root app — routing, providers (QueryClient, Tooltip, Toasters)
│   ├── App.css                  # Minimal app-level styles
│   ├── main.tsx                 # Entry point
│   ├── index.css                # Design system — all CSS variables, prose styles, dark mode
│   ├── vite-env.d.ts
│   ├── lib/
│   │   └── utils.ts             # cn() utility (clsx + tailwind-merge)
│   ├── hooks/
│   │   ├── use-mobile.tsx       # Mobile breakpoint detection hook
│   │   └── use-toast.ts         # Toast state hook
│   ├── pages/
│   │   ├── Index.tsx            # Home page — renders DissertationViewer + SEO meta tags
│   │   └── NotFound.tsx         # 404 page
│   └── components/
│       ├── DissertationViewer.tsx   # Main orchestrator component (287 lines)
│       ├── TableOfContents.tsx      # Parses MD headings + HTML TOC tables into navigable tree
│       ├── TablesAndFigures.tsx     # Extracts & lists all tables/figures with line navigation
│       ├── DataVisualization.tsx    # Recharts-based charts (rainfall, runoff, pie, storm events table)
│       ├── CatchmentMap.tsx         # Mapbox GL interactive map of Giralang catchment
│       ├── BackgroundInfo.tsx       # Static research context cards
│       ├── NavLink.tsx              # Wrapper around react-router NavLink with className support
│       └── ui/                      # ~50+ shadcn/ui components (accordion, dialog, tabs, etc.)
├── index.html                   # Root HTML with OG/Twitter meta tags
├── tailwind.config.ts           # Extended theme: academic colors, sidebar, animations
├── components.json              # shadcn/ui config
├── vite.config.ts               # Vite config with path aliases (@/ → ./src)
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── eslint.config.js
```

---

## 4. Key Components — Detailed Breakdown

### 4.1 `DissertationViewer.tsx` (Main Orchestrator)

**Location:** `src/components/DissertationViewer.tsx` (287 lines)  
**Role:** The central component that ties everything together.

**State:**
- `content` (string) — Raw markdown loaded from `/dissertation.md`
- `searchTerm` (string) — Text search filter
- `activeTab` (string) — Current tab: `document`, `contents`, `tables`, `visualizations`, `background`
- `isLoading` (boolean) — Loading state for markdown fetch
- `targetLine` (number | null) — Line number to scroll to (from table/figure navigation)

**Features:**
- **Markdown fetching:** `useEffect` fetches `/dissertation.md` on mount
- **Search highlighting:** Regex-based `<mark>` injection into markdown before rendering
- **Multi-format export:** Dropdown menu with MD, TXT, HTML download via Blob URLs
- **Line navigation:** `handleNavigateToLine()` switches to document tab and scrolls to estimated position (24px/line)
- **Tab layout:** 5 tabs — Document (with sidebar), Contents, Tables, Data, Background
- **Sidebar:** Sticky left panel (hidden on mobile) with nested TOC and tables quick-nav

**Export logic (`handleExport`):**
- **MD:** Raw content as `text/markdown`
- **TXT:** Raw content as `text/plain`
- **HTML:** Wraps content in a basic HTML document with inline styles, escapes `<` and `>`

**⚠️ Note:** This file is approaching refactoring territory. Consider extracting the header, search bar, and export logic into separate components.

---

### 4.2 `TableOfContents.tsx`

**Location:** `src/components/TableOfContents.tsx` (156 lines)  
**Props:** `content: string`, `compact?: boolean`

**Parsing logic:**
1. Scans for HTML `<strong>` tags inside `<table>` elements (the dissertation's HTML TOC format)
2. Matches chapter numbers (`X.`) and section numbers (`X.X`)
3. Also parses standard Markdown `#` and `##` headers
4. Builds a tree structure with parent chapters and child sections

**UI:** Collapsible tree with expand/collapse buttons. Compact mode uses smaller text for sidebar.

---

### 4.3 `TablesAndFigures.tsx`

**Location:** `src/components/TablesAndFigures.tsx` (251 lines)  
**Props:** `content: string`, `compact?: boolean`, `onNavigate?: (lineNumber: number) => void`

**Parsing logic:**
- Regex for `**Figure X.X.X** description` and `**Table X.X.X** description`
- Also detects markdown pipe tables (`|` columns with `---` separator rows)
- Deduplicates nearby matches (within 3 lines)

**UI:** Two sub-tabs (Tables / Figures) with clickable cards showing title, line number, and navigation.

---

### 4.4 `DataVisualization.tsx`

**Location:** `src/components/DataVisualization.tsx` (284 lines)

**Charts (all using Recharts):**
1. **Rainfall Intensity** — Bar chart (mm/hr over 15-min intervals)
2. **Observed vs Modeled Runoff** — Dual line chart (L/s, solid vs dashed)
3. **Catchment Surface Composition** — Pie chart (Impervious 45%, Pervious 35%, Roads 20%)
4. **Storm Events** — HTML table with 4 major events (date, depth, peak, duration)

**Stats cards:** Total Area (62.9 ha), Allotments (526), Monitoring Period (3 years), Storm Events (50+)

**Sub-tabs:** Map, Rainfall, Runoff, Surfaces, Events

**Data:** All hardcoded sample data representative of the Giralang catchment study. Not from a database.

---

### 4.5 `CatchmentMap.tsx`

**Location:** `src/components/CatchmentMap.tsx` (354 lines)

**Map provider:** Mapbox GL JS  
**Default token:** Hardcoded public token (`pk.eyJ1...`) — user can override via input field  
**Center:** Giralang, Canberra, ACT, Australia `[149.0833, -35.2167]`  
**Zoom:** 14.5 with 45° pitch  
**Style:** `mapbox://styles/mapbox/satellite-streets-v12`

**Map layers:**
- Urban catchment boundary (blue dashed polygon, 62.9 ha)
- Rural catchment boundary (teal dashed polygon, 19.6 ha)

**Markers (6 stations):**
| Station | Type | Coordinates | Pipe Size |
|---------|------|-------------|-----------|
| Catchment Outlet Gauge | Flow Meter | 149.0865, -35.2190 | 1800mm |
| Rainfall Gauge - Gundulu Place | Rain Gauge | 149.0835, -35.2165 | — |
| Rainfall Gauge - Chuculba Crescent | Rain Gauge | 149.0845, -35.2170 | — |
| 12 Roof Micro-Catchment | Flow Meter | 149.0840, -35.2167 | 300mm |
| 14 Lot Micro-Catchment | Flow Meter | 149.0838, -35.2173 | 450mm |
| Rural/Urban Interface | Flow Meter | 149.0820, -35.2145 | 900mm |

**Popups:** HTML popups with station name, type, and description.

**⚠️ Security note:** The Mapbox token is hardcoded as a public token. If you move this project, you should use your own Mapbox token or move it to environment variables.

---

### 4.6 `BackgroundInfo.tsx`

**Location:** `src/components/BackgroundInfo.tsx` (202 lines)

**Static content sections:**
1. **Research Areas** — 4 cards: Urban Hydrology, Rainfall-Runoff Modeling, Spatial & Temporal Effects, Stormwater Management
2. **Historical Development** — Timeline: 1960s-2000s
3. **Related Research & Resources** — 3 external links (ScienceDirect, Copernicus, EPA SWMM)
4. **Key Research Contributions** — 4 bullet points

All content is hardcoded. No external data fetching.

---

## 5. Design System

### CSS Variables (defined in `src/index.css`)

All colors use **HSL format** for Tailwind compatibility.

**Core tokens:**
| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--background` | `0 0% 100%` | `215 28% 12%` |
| `--foreground` | `215 25% 15%` | `210 40% 98%` |
| `--primary` | `207 90% 54%` | `207 90% 61%` |
| `--secondary` | `199 89% 48%` | `199 89% 52%` |
| `--accent` | `180 82% 44%` | `180 82% 50%` |
| `--muted` | `210 40% 96%` | `217 32% 20%` |

**Custom academic tokens:** `--academic-navy`, `--academic-blue`, `--academic-light-blue`, `--academic-gray`, `--code-bg`, `--australia-blue`, `--ocean-blue`, `--reef-turquoise`

**Custom CSS properties:**
- `--gradient-header` — 135deg gradient from primary to accent
- `--shadow-card` — Subtle card shadow with primary tint
- `--shadow-elevated` — Stronger elevation shadow

**Prose styles:** Custom `.prose` classes for h1-h3, p, table, blockquote, code, pre, ul/ol/li — all using design tokens.

### Tailwind Config (`tailwind.config.ts`)

- Extended with all design token colors mapped to `hsl(var(--token))`
- Custom `academic` color group, `australia-blue`, `ocean-blue`, `reef-turquoise`, `code-bg`
- Sidebar color tokens for potential sidebar UI
- Border radius derived from `--radius: 0.75rem`
- Accordion open/close animations

---

## 6. Routing

| Route | Page | Component |
|-------|------|-----------|
| `/` | Home | `Index.tsx` → `DissertationViewer` |
| `*` | 404 | `NotFound.tsx` |

Single-page app with only one real route. React Router v6 with `BrowserRouter`.

---

## 7. SEO Configuration

**`index.html`:**
- Title, description, author meta tags
- Open Graph tags (title, description, type, image)
- Twitter card tags (summary_large_image)
- OG image points to Lovable's default: `https://lovable.dev/opengraph-image-p98pqg.png`

**`Index.tsx` (react-helmet):**
- Dynamic title: "Urban Rainfall/Runoff Modelling - Allan Goyen PhD Thesis"
- Keywords: urban hydrology, rainfall runoff modeling, stormwater management, catchment analysis
- OG title and description

---

## 8. Data Sources

| Data | Source | Location |
|------|--------|----------|
| Dissertation text | Static Markdown file | `public/dissertation.md` |
| Chart data | Hardcoded in component | `DataVisualization.tsx` |
| Map coordinates | Hardcoded in component | `CatchmentMap.tsx` |
| Background info | Hardcoded in component | `BackgroundInfo.tsx` |
| TOC structure | Parsed from dissertation.md at runtime | `TableOfContents.tsx` |
| Tables/Figures index | Parsed from dissertation.md at runtime | `TablesAndFigures.tsx` |

**No database, no API calls, no authentication.** All data is either static files or hardcoded.

---

## 9. External Dependencies & API Keys

| Dependency | Purpose | API Key Required? |
|------------|---------|-------------------|
| Mapbox GL JS | Interactive satellite map | Yes — public token hardcoded in `CatchmentMap.tsx` |
| react-markdown | Markdown rendering | No |
| Recharts | Data visualization charts | No |
| shadcn/ui | UI component library | No |

**⚠️ Mapbox Token:** Currently hardcoded as `pk.eyJ1IjoiZGlja2luc29ucmUiLCJhIjoiY21oczd6eDllMWdoNDJpcTZ5dW9wN2J3aiJ9.Hwy-aXZytiY9I4q1WLnMmA`. Replace with your own token if redeploying.

---

## 10. Build & Development

```bash
# Install dependencies
npm install

# Start dev server (port 8080)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Path aliases:** `@/` maps to `./src/` (configured in `vite.config.ts` and `tsconfig.app.json`)

---

## 11. Key Patterns & Conventions

1. **Component organization:** Feature components in `src/components/`, UI primitives in `src/components/ui/`
2. **Styling:** Tailwind utility classes using semantic design tokens. Never use raw color values in components.
3. **State:** Local component state only (no Redux, Zustand, etc.)
4. **Icons:** `lucide-react` icon library throughout
5. **Responsive:** Mobile-first with `sm:`, `md:`, `lg:` breakpoints. Sidebar hidden below `lg`.
6. **Dark mode:** Supported via `.dark` class (next-themes installed but toggle not exposed in UI)

---

## 12. Known Limitations & Improvement Opportunities

| Issue | Details |
|-------|---------|
| **Large main component** | `DissertationViewer.tsx` (287 lines) should be split into Header, SearchBar, DocumentView, etc. |
| **Line-based scrolling** | `handleNavigateToLine` uses a rough 24px/line estimate. Could use element IDs instead. |
| **No dark mode toggle** | `next-themes` is installed but no UI toggle exists |
| **Static chart data** | All visualization data is hardcoded, not derived from the actual dissertation |
| **Search performance** | Regex replacement on 22K-line string on every keystroke (no debounce) |
| **HTML export** | Wraps raw markdown in `<pre>` instead of rendering as proper HTML |
| **No PDF export** | Users may expect PDF download capability |
| **Mapbox token exposed** | Public token in source code — should be env variable |
| **No backend** | Purely frontend, no persistence or user accounts |

---

## 13. Migration Checklist

When moving this to another app/project:

- [ ] Copy all files in `src/components/` (including `ui/` directory)
- [ ] Copy `src/pages/Index.tsx`
- [ ] Copy `public/dissertation.md`
- [ ] Copy `src/index.css` (design system) and `tailwind.config.ts`
- [ ] Copy `src/lib/utils.ts` and `src/hooks/`
- [ ] Install all npm dependencies (see `package.json`)
- [ ] Replace the Mapbox token in `CatchmentMap.tsx` with your own
- [ ] Update OG image URLs in `index.html`
- [ ] Update the Lovable project URL references in `README.md`
- [ ] Verify `vite.config.ts` path alias configuration matches your setup
- [ ] If not using Lovable, remove `lovable-tagger` from `vite.config.ts`

---

## 14. Full Dependency List

```json
{
  "@hookform/resolvers": "^3.10.0",
  "@radix-ui/react-*": "(~30 Radix UI packages for shadcn/ui)",
  "@tanstack/react-query": "^5.83.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "cmdk": "^1.1.1",
  "date-fns": "^3.6.0",
  "embla-carousel-react": "^8.6.0",
  "input-otp": "^1.4.2",
  "lucide-react": "^0.462.0",
  "mapbox-gl": "^3.16.0",
  "next-themes": "^0.3.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-helmet": "^6.1.0",
  "react-hook-form": "^7.61.1",
  "react-markdown": "^10.1.0",
  "react-resizable-panels": "^2.1.9",
  "react-router-dom": "^6.30.1",
  "react-syntax-highlighter": "^16.1.0",
  "recharts": "^2.15.4",
  "rehype-raw": "^7.0.0",
  "remark-gfm": "^4.0.1",
  "sonner": "^1.7.4",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7",
  "vaul": "^0.9.9",
  "zod": "^3.25.76"
}
```

---

*Generated: 2026-02-12 | MD Insight Explorer Handover*
