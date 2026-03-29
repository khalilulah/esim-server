import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { keepAlive } from "./shared/utils/keepAlive";

const start = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
    keepAlive();
  });
};

start();
