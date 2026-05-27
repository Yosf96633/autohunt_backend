import "dotenv/config"
import express from "express"
import cors from "cors"
import agentRoutes from "./routes/agent.route"
import { checkpointer } from "./graph/graph"
import { setupDatabase } from "./db/schema"

const app = express()
const PORT = Number(process.env.PORT!)

app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5501", "http://localhost:3000"],
  credentials: true,
}))

app.use(express.json())
app.use("/api/agent", agentRoutes)

async function bootstrap() {
  await setupDatabase()        
  await checkpointer.setup()
  console.log("✅ Checkpointer ready")

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
}

bootstrap()