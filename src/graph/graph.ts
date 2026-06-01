import { StateGraph } from "@langchain/langgraph";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { AgentState, AgentStateType } from "./state";
import { cvParserNode } from "./nodes/cvParser.node";
import { scraperNode } from "./nodes/scraper.node";
import { scorerNode } from "./nodes/scorer.node";
import { filterNode } from "./nodes/filter.node";
import { coverLetterNode } from "./nodes/coverLetter.node";
import { humanCheckNode } from "./nodes/humanCheck.node";
import { applicatorNode } from "./nodes/applicator.node";
import { trackerNode } from "./nodes/tracker.node";
import { digestNode } from "./nodes/digest.node";

export const checkpointer = PostgresSaver.fromConnString(
  process.env.DATABASE_URL!,
);

const workflow = new StateGraph(AgentState)
  .addNode("cvParser", cvParserNode)
  .addNode("scraper", scraperNode)
  .addNode("scorer", scorerNode)
  .addNode("filter", filterNode)
  .addNode("coverLetter", coverLetterNode)
  .addNode("humanCheck", humanCheckNode)
  .addNode("applicator", applicatorNode)
  .addNode("tracker", trackerNode)
  .addNode("digestSummary", digestNode)
  .addEdge("__start__", "cvParser")
  .addEdge("cvParser", "scraper")
  .addEdge("scraper", "scorer")
  .addEdge("scorer", "filter")
  .addConditionalEdges(
    "filter",
    (state: AgentStateType) => {
      const { filteredJobs } = state;

      if (filteredJobs.length === 0) return "noJobs";

      return "hasJobs";
    },
    {
      hasJobs: "coverLetter",
      noJobs: "digestSummary",
    },
  )
  .addEdge("coverLetter", "humanCheck")
  .addEdge("humanCheck", "applicator")
  .addEdge("applicator", "tracker")
  .addEdge("tracker", "digestSummary")
  .addEdge("digestSummary", "__end__");

export const graph = workflow.compile({ checkpointer });
