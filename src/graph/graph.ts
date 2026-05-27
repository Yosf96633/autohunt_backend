import { StateGraph } from "@langchain/langgraph"
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres"
import { AgentState } from "./state"
import { cvParserNode } from "./nodes/cvParser.node"
import { scraperNode } from "./nodes/scraper.node"
import { scorerNode } from "./nodes/scorer.node"
import { filterNode } from "./nodes/filter.node"
import { coverLetterNode } from "./nodes/coverLetter.node"
import { humanCheckNode } from "./nodes/humanCheck.node"
import { applicatorNode } from "./nodes/applicator.node"
import { trackerNode } from "./nodes/tracker.node"
import { digestNode } from "./nodes/digest.node"

export const checkpointer = PostgresSaver.fromConnString(
  process.env.DATABASE_URL!
)

const workflow = new StateGraph(AgentState)
  .addNode("cvParser", cvParserNode)
  .addNode("scraper", scraperNode)
  // .addNode("scorer", scorerNode)
  // .addNode("filter", filterNode)
  // .addNode("coverLetter", coverLetterNode)
  // .addNode("humanCheck", humanCheckNode)
  // .addNode("applicator", applicatorNode)
  // .addNode("tracker", trackerNode)
  // .addNode("digestSummary", digestNode)
  .addEdge("__start__", "cvParser")
  .addEdge("cvParser", "scraper")
  .addEdge("scraper" , "__end__")
  // .addEdge("scraper", "scorer")
  // .addEdge("scorer", "filter")
  // .addEdge("filter", "coverLetter")
  // .addEdge("coverLetter", "humanCheck")
  // .addEdge("humanCheck", "applicator")
  // .addEdge("applicator", "tracker")
  // .addEdge("tracker", "digestSummary")
  // .addEdge("digestSummary", "__end__")

export const graph = workflow.compile({ checkpointer })