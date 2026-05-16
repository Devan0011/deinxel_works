# Deinxel Digital Studio

Deinxel Digital Studio is an artisan digital experiences platform and elite systems architecture for visionary brands. It features a cinematic, high-performance UI built with modern web technologies.

## Features

- **Cinematic Experience**: Immersive animations using GSAP and high-end aesthetic design.
- **Service Catalog**: Detailed overview of studio capabilities (Creative Direction, System Design, Brand Strategy).
- **Interactive Portfolio**: Parallax-powered gallery showcasing recent digital legacies.
- **Client Portal**: A secure space for clients to view assets, initiate chats, and manage configurations.
- **Agency Console (Admin)**: Central command for agency staff to manage inquiries and session requests.
- **Real-time Interaction**: Integrated chat and dynamic forms for seamless communication.

## Tech Stack

- **Frontend**: Vite, TypeScript, Tailwind CSS
- **Animations**: GSAP (GreenSock Animation Platform)
- **Icons**: Lucide
- **Backend / Database**: Supabase (PostgreSQL, Auth, Storage)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

### Development

Run the development server:
```bash
npm run dev
```

### Building

Build the project for production:
```bash
npm run build
```

## Structure

- `index.html`: Main entry point and high-level layout.
- `src/main.ts`: Application logic, animations, and state management.
- `src/lib/ui.ts`: Dynamic component rendering (Service cards, Portfolio, Pricing).
- `src/lib/supabase.ts`: Database and authentication client configuration.
- `supabase_schema.sql`: SQL schema for setting up the database.
