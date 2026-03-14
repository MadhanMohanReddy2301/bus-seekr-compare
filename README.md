<div align="center">

# 🚌 Bus Seekr Compare

### Smart Bus Search & Fare Comparison Platform

[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Components-000000?style=for-the-badge)](https://ui.shadcn.com)

---

**A modern, responsive bus search and fare comparison web application.** Search routes across operators, compare prices and schedules, filter results by preferences, and find the best travel options — all in a clean, intuitive interface.

[Getting Started](#-getting-started) · [Features](#-features) · [Project Structure](#-project-structure) · [API Config](#-api-configuration) · [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Configuration](#-api-configuration)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Bus Seekr Compare is a **travel search platform** that aggregates bus routes and fares, helping users quickly find and compare the best options for their journey. Built with a modern React stack and a centralized API configuration system, it's designed for fast iteration, clean UX, and seamless integration with bus booking APIs.

---

## ✨ Features

| Feature | Description |
|:--------|:------------|
| 🔍 **Smart Search** | Search bus routes between cities with real-time city suggestion autocomplete |
| 📊 **Fare Comparison** | Compare prices, schedules, and amenities across multiple bus operators |
| 🎛️ **Advanced Filters** | Filter results by price range, departure time, bus type, and amenities |
| 📱 **Responsive Design** | Fully responsive layout that works seamlessly on desktop, tablet, and mobile |
| ⚡ **Fast & Lightweight** | Powered by Vite for instant HMR and optimized production builds |
| 🎨 **Modern UI** | Clean, accessible interface built with shadcn/ui and Tailwind CSS |
| 🔌 **Centralized API Layer** | Type-safe, environment-aware API configuration system |

---

## 🛠️ Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Framework** | React 18 with TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS + shadcn/ui (Radix UI primitives) |
| **State & Data** | React Query (TanStack Query) |
| **Routing** | React Router DOM |
| **Forms** | React Hook Form + Zod validation |
| **Charts** | Recharts |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
bus-seekr-compare/
│
├── public/                          # 🌐 Static assets
│
├── src/
│   ├── components/                  # 🧩 Application components
│   │   ├── ui/                      #    shadcn/ui base components
│   │   ├── SearchForm.tsx           #    Route search with city autocomplete
│   │   ├── SearchResults.tsx        #    Bus listing & comparison cards
│   │   └── FilterSidebar.tsx        #    Price, time & amenity filters
│   │
│   ├── config/                      # ⚙️ API configuration
│   │   └── api.ts                   #    Centralized endpoint management
│   │
│   ├── hooks/                       # 🪝 Custom React hooks
│   ├── lib/                         # 📚 Utility functions
│   ├── pages/                       # 📄 Route pages
│   │   ├── Index.tsx                #    Home / search page
│   │   └── NotFound.tsx             #    404 page
│   │
│   ├── App.tsx                      # 🏠 Root application component
│   ├── App.css                      # 🎨 Global styles
│   ├── index.css                    # 🎨 Tailwind directives
│   └── main.tsx                     # 🚀 Application entry point
│
├── index.html                       # 📄 HTML entry point
├── package.json                     # 📦 Dependencies & scripts
├── tailwind.config.ts               # 🎨 Tailwind configuration
├── vite.config.ts                   # ⚡ Vite configuration
├── tsconfig.json                    # 📘 TypeScript configuration
├── env.example                      # 🔑 Environment variables template
├── API_CONFIG.md                    # 📖 API integration guide
└── components.json                  # 🧩 shadcn/ui configuration
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Purpose |
|:------------|:--------|:--------|
| **Node.js** | 18+ | Runtime environment |
| **npm** or **bun** | Latest | Package manager |

### 1. Clone the Repository

```bash
git clone https://github.com/MadhanMohanReddy2301/bus-seekr-compare.git
cd bus-seekr-compare
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp env.example .env
# Edit .env with your API base URL
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔌 API Configuration

The project uses a **centralized API configuration system** located at `src/config/api.ts`. All API endpoints are managed in a single file for easy maintenance and type safety.

### Available Endpoints

| Endpoint | Method | Description |
|:---------|:------:|:------------|
| `/city-suggestions/` | `GET` | Autocomplete city name suggestions |
| `/bus-search/` | `POST` | Search buses between source and destination |
| `/bus-details/` | `GET` | Detailed information for a specific bus |
| `/route-info/` | `GET` | Route metadata between two cities |
| `/booking/` | `POST` | Create a bus ticket booking |

### Key Features

- **Type-safe API calls** with TypeScript interfaces
- **Environment-aware** URLs (proxy in dev, direct in production)
- **Built-in CORS handling** via Vite dev server proxy
- **Standardized error handling** across all endpoints

> For detailed API integration instructions, see [API_CONFIG.md](API_CONFIG.md).

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|:---------|:--------:|:------------|
| `VITE_API_BASE_URL` | ✅ | Backend API base URL (e.g., `http://localhost:8000`) |
| `VITE_API_PROXY_BASE_URL` | ❌ | Dev proxy path (default: `/api`) |
| `VITE_NODE_ENV` | ❌ | Environment mode (`development` / `production`) |

---

## 🚢 Deployment

| Method | Description |
|:-------|:------------|
| **Lovable** | Open the [Lovable project](https://lovable.dev) → Share → Publish |
| **Netlify / Vercel** | Connect the repo and deploy with default Vite settings |
| **Manual** | Run `npm run build` and serve the `dist/` folder with any static host |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/new-filter`)
3. **Commit** your changes (`git commit -m 'feat: add new filter option'`)
4. **Push** to the branch (`git push origin feature/new-filter`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing component structure in `src/components/`
- Use shadcn/ui primitives for new UI elements
- Add new API endpoints in `src/config/api.ts`
- Validate forms with Zod schemas

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using [React](https://react.dev), [Vite](https://vitejs.dev), and [shadcn/ui](https://ui.shadcn.com)**

⭐ Star this repository if you find it useful!

</div>
