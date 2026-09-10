import "dotenv/config"
import { buildApp } from "./app"
import { env } from "./config/env"

async function start() {
  const app = await buildApp()

  try {
    await app.listen({ port: env.port, host: "0.0.0.0" })
    app.log.info(`API rodando em http://localhost:${env.port}`)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }

  const shutdown = async () => {
    app.log.info("Shutting down...")
    await app.close()
    process.exit(0)
  }

  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
}

start()
