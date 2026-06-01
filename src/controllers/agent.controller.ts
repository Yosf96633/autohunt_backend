import type { Request, Response } from "express";
import { graph } from "../graph/graph";
import { Command } from "@langchain/langgraph";

// ── SSE helper
function sendEvent(res: Response, data: object) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

// ── SSE headers setup
function setupSSE(res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
}

export async function runAgent(req: Request, res: Response) {
  try {
    if (!req.file) {
      res.status(400).json({ error: "CV file is required" });
      return;
    }

    const preferences = JSON.parse(req.body.preferences);
    const runId = req.body.thread_id as string;
    const mock = req.body.mock === "true" || req.body.mock === true;

    // setupSSE(res);

    // const stream = graph.streamEvents(
    //   {
    //     cvBuffer: req.file.buffer,
    //     preferences,
    //     parsedCV: null,
    //     rawJobs: [],
    //     scoredJobs: [],
    //     mock,
    //     filteredJobs: [],
    //     coverLetters: {},
    //     applications: [],
    //     digest: "",
    //     status: "parsing_cv",
    //     runId,
    //     error: null,
    //   },
    //   {
    //     version: "v2",
    //     configurable: { thread_id: runId },
    //   },
    // );

    // for await (const event of stream) {
    //   if (event.event === "on_chain_start" && event.name !== "LangGraph") {
    //     sendEvent(res, { type: "node_start", node: event.name });
    //   }

    //   if (event.event === "on_chain_end" && event.name !== "LangGraph") {
    //     sendEvent(res, { type: "node_end", node: event.name });
    //   }

    //   if (event.event === "on_chat_model_stream") {
    //     const token = event.data?.chunk?.content;
    //     if (token) {
    //       sendEvent(res, { type: "token", content: token });
    //     }
    //   }

    //   if (event.event === "on_chain_error") {
    //     sendEvent(res, {
    //       type: "error",
    //       message: String(event.data?.error),
    //     });
    //   }
    // }

    // // ── after stream ends check for interrupt
    // const graphState = await graph.getState({
    //   configurable: { thread_id: runId },
    // });

    // const activeTasks = graphState.tasks ?? [];
    // const interruptedTask = activeTasks.find(
    //   (task) => task.interrupts && task.interrupts.length > 0,
    // );

    // if (interruptedTask) {
    //   const interruptPayload = interruptedTask.interrupts[0]?.value;

    //   sendEvent(res, {
    //     type: "interrupted",
    //     node: interruptedTask.name,
    //     runId,
    //     status: "awaiting_review",
    //     jobs: interruptPayload?.jobs ?? [],
    //   });
    // } else {
    //   sendEvent(res, { type: "done" });
    // }

    // res.end();

    const temp = await graph.invoke(
      {
        cvBuffer: req.file.buffer,
        preferences,
        parsedCV: null,
        rawJobs: [],
        scoredJobs: [],
        mock,
        filteredJobs: [],
        coverLetters: {},
        applications: [],
        digest: "",
        status: "parsing_cv",
        runId,
        error: null,
      },

      {
        configurable: { thread_id: runId },
      },
    );
    res.json({
      success : true ,
      data : temp,
    })
  } catch (error) {
    console.error("Agent error:", error);
    sendEvent(res, { type: "error", message: "Agent failed" });
    res.end();
  }
}

export async function resumeAgent(req: Request, res: Response) {
  try {
    const thread_id = req.params.thread_id;
    const data = req.body;

    if (!thread_id) {
      res
        .status(400)
        .json({ success: false, message: "Thread ID is missing!" });
      return;
    }

    setupSSE(res);

    const stream = graph.streamEvents(
      new Command({ resume: data.approved_ids }),
      {
        version: "v2",
        configurable: { thread_id },
      },
    );

    for await (const event of stream) {
      // node started
      if (event.event === "on_chain_start" && event.name !== "LangGraph") {
        sendEvent(res, {
          type: "node_start",
          node: event.name,
        });
      }

      // node finished
      if (event.event === "on_chain_end" && event.name !== "LangGraph") {
        sendEvent(res, {
          type: "node_end",
          node: event.name,
        });
      }

      // graph fully done — send digest
      if (event.event === "on_chain_end" && event.name === "LangGraph") {
        const output = event.data?.output;
        if (output?.digest) {
          sendEvent(res, {
            type: "completed",
            summary: JSON.parse(output.digest),
          });
        }
      }
    }

    sendEvent(res, { type: "done" });
    res.end();
  } catch (error) {
    console.error("Resume error:", error);
    sendEvent(res, { type: "error", message: "Resume failed" });
    res.end();
  }
}
