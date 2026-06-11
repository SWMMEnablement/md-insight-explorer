# MD Insight Explorer

> _README added by Robert Dickinson via Comet._

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn--ui-000000?logo=shadcnui&logoColor=white)

## About

**MD Insight Explorer** is an interactive viewer for long-form hydrology research documents (a dissertation). It renders document sections with a table of contents, background information, tables and figures, data visualizations, and an interactive catchment map (Giralang), making a Markdown-based research document easy to navigate and explore.

It is part of the SWMMEnablement collection and is built on a modern Vite + React + TypeScript frontend styled with Tailwind CSS and shadcn/ui.

## What's Inside

| Area | Description |
| --- | --- |
| `src/components/DissertationViewer.tsx` | Main document/dissertation reader |
| `src/components/TableOfContents.tsx` | Navigable table of contents |
| `src/components/BackgroundInfo.tsx` | Background / introduction section |
| `src/components/TablesAndFigures.tsx` | Tables and figures with navigation |
| `src/components/DataVisualization.tsx` | Interactive data visualizations |
| `src/components/CatchmentMap.tsx` | Interactive Giralang catchment map |
| `src/components/NavLink.tsx` | In-document navigation links |
| `src/components/ui/` | shadcn/ui reusable UI primitives |
| `src/hooks/`, `src/lib/` | Custom React hooks and utilities |
| `public/` | Document content and static assets |

## Tech Stack

| Layer | Technology |
| --- | --- |
| Language | TypeScript |
| Framework | React |
| Build tool | Vite |
| Styling | Tailwind CSS |
| UI components | shadcn/ui |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/SWMMEnablement/md-insight-explorer.git
cd md-insight-explorer

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open the local URL printed by Vite (typically http://localhost:5173) in your browser.

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## License

No license file is currently included. Contact the SWMMEnablement organization regarding reuse.
