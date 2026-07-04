import mongoose from "mongoose";
import { env } from "./env.js";

mongoose.set("strictQuery", true);

/**
 * Connect to MongoDB with bounded retry + exponential backoff.
 * Throws (after exhausting retries) so the caller can decide whether to exit.
 */
export async function connectDB({ retries = 5, delayMs = 1500 } = {}) {
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await mongoose.connect(env.mongoUri, {
        serverSelectionTimeoutMS: 8000,
      });
      // eslint-disable-next-line no-console
      console.log(`[db] Connected to MongoDB (${redact(env.mongoUri)})`);
      return mongoose.connection;
    } catch (err) {
      attempt += 1;
      if (attempt > retries) {
        // eslint-disable-next-line no-console
        console.error(
          `[db] Failed to connect after ${retries} retries: ${err.message}`,
        );
        throw err;
      }
      const wait = delayMs * 2 ** (attempt - 1);
      // eslint-disable-next-line no-console
      console.warn(
        `[db] Connection attempt ${attempt} failed (${err.message}). ` +
          `Retrying in ${wait}ms…`,
      );
      await sleep(wait);
    }
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Hide credentials when logging the connection string.
function redact(uri) {
  try {
    return uri.replace(/\/\/([^:@/]+):([^@]+)@/, "//$1:****@");
  } catch {
    return "mongodb";
  }
}
