import https from "https";
import { env } from "../../config/env";

export const keepAlive = () => {
  // Only run in production
  if (env.NODE_ENV !== "production") return;

  const url = env.SERVER_URL; // your Render URL e.g. https://esim-server.onrender.com

  setInterval(
    () => {
      https
        .get(`${url}/api/health`, (res) => {
          console.log(`Keep-alive ping: ${res.statusCode}`);
        })
        .on("error", (err) => {
          console.error("Keep-alive error:", err.message);
        });
    },
    14 * 60 * 1000,
  ); // every 14 minutes

  console.log("Keep-alive started");
};
