import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";

async function start() {
  try {
    await connectDB();
  } catch {
    // eslint-disable-next-line no-console
    console.error("[server] Could not connect to MongoDB. Exiting.");
    process.exit(1);
  }

  const app = createApp();

  const server = app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(
      `[server] Atlas AI API listening on http://localhost:${env.port} ` +
        `(${env.nodeEnv}${env.aiEnabled ? "" : ", AI disabled"})`,
    );
  });

  // Graceful shutdown.
  const shutdown = (signal) => {
    // eslint-disable-next-line no-console
    console.log(`\n[server] ${signal} received, shutting down…`);
    server.close(() => process.exit(0));
    // Force-exit if it hangs.
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  process.on("unhandledRejection", (reason) => {
    // eslint-disable-next-line no-console
    console.error("[server] Unhandled rejection:", reason);
  });
}

start();
