import "dotenv/config"
import express from "express"
import agentRoutes from "./routes/agent.route"
import { checkpointer } from "./graph/graph"
import { setupDatabase } from "./db/schema"

const app = express()
app.use(express.json())
app.use("/api/agent", agentRoutes)

// setup checkpointer tables before server starts
async function bootstrap() {
  await setupDatabase()        
  await checkpointer.setup()
  console.log("✅ Checkpointer ready")

  app.listen(3000, () => {
    console.log("🚀 Server running on port 3000")
  })
}

bootstrap()