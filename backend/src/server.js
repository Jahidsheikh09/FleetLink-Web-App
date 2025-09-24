import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import { connectToDatabase } from "./config/db.js";

const basePort = Number(process.env.PORT) || 4000;

async function start() {
  try {
    await connectToDatabase();
    let currentPort = basePort;
    const server = app.listen(currentPort, () => {
      console.log(`Backend listening on port ${currentPort}`);
    });
    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        currentPort += 1;
        app.listen(currentPort, () => {
          console.log(`Port in use. Switched to ${currentPort}`);
        });
      } else {
        console.error('Failed to start server', err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  start();
}

export { start };
