import type { Project } from "./types";

export const kalshi: Project = {
  slug: "kalshi",
  title: "Kalshi Market Maker",
  tagline:
    "Market-making, analytics and trading platform for the Kalshi prediction market exchange",
  description:
    "A full-stack automated trading system for the Kalshi prediction market exchange. A microservice architecture handles market data ingestion, strategy-driven order execution, and a real-time monitoring dashboard, backed by TimescaleDB and Redis Streams.",

  type: "side",
  status: "live",
  startDate: "2025-09",

  role: "Solo",
  teamSize: 1,

  coverImage: "/projects/kalshi.png",
  systemDesign: "/projects/kalshi-architecture.svg",

  tech: {
    frontend: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind",
      "Radix UI",
      "Recharts",
    ],
    backend: ["Python", "FastAPI", "SQLAlchemy"],
    data: ["PostgreSQL", "TimescaleDB", "Redis"],
    infrastructure: ["Docker"],
    testing: ["pytest"],
    other: ["WebSockets"],
  },

  problem: [
    "Got interested in prediction markets and how they price probability, building on prior experience with crypto arbitrage back in 2017.",
    "Manual trading on Kalshi is time-consuming: hunting for opportunities across hundreds of markets, placing orders, and tracking performance is tedious and error-prone.",
    "Kalshi's liquidity incentive programs create real opportunities for market makers, but capturing them efficiently requires systematic analysis of orderbook depth, reward structure, and capital allocation.",
  ],

  approach: [
    "Split the system into isolated services: a Market Data Gateway holds a single WebSocket connection to Kalshi and publishes orderbook updates to Redis Streams; a DB Writer subscribes and persists to TimescaleDB; the API server manages trader lifecycles and serves the dashboard.",
    "Designed a modular, strategy-driven execution engine with pluggable strategies for placement, buffering, and auto-flatten behavior.",
    "Traders run as isolated subprocesses with state persisted to PostgreSQL and JSON, so they survive API restarts and can be reconnected to after recovery.",
    "Leveraged TimescaleDB hypertables for time-series data (trader logs, $/hr rate samples at 1-min resolution) to support fast post-mortem analysis across long sessions.",
    "Added per-service health checks, heartbeats in Redis, and centralized structured logging piped through a PostgreSQL sink, making the fleet observable from a single place.",
    "Built a Next.js dashboard showing trader groups by event, real-time order state, buffer %, queue position, incentive lifecycle, and rate history charts.",
    "Default dry-run mode for all traders so strategy iteration is safe by default; going live requires an explicit flag.",
  ],

  outcomes: [
    "Running in production and actively trading across multiple markets.",
    "Clean separation of concerns via microservices enables independent iteration on market data, execution, and the UI without cross-cutting changes.",
    "Full observability across the trader fleet through the dashboard, TimescaleDB-backed logs, and real-time heartbeats.",
  ],
};
