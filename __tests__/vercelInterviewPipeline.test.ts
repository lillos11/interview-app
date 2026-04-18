import { describe, expect, it, vi } from "vitest";

import { INTERVIEW_QUESTIONS } from "../lib/interview";
import {
  buildAudioChunkAck,
  buildHarshReviewStreamEvents,
  createInterviewBackgroundJob,
  createSseResponse,
  publishInterviewBackgroundJob,
} from "../lib/vercelInterviewPipeline";

describe("Vercel interview pipeline", () => {
  it("builds an Edge/SSE harsh review from source-bank prompts only", async () => {
    const question =
      INTERVIEW_QUESTIONS.find(
        (entry) => entry.sourceCategoryId === "deliver-results",
      ) ?? INTERVIEW_QUESTIONS[0];
    const events = buildHarshReviewStreamEvents({
      questionId: question.id,
      lensId: "l7_bar_raiser",
      answer:
        "I reset the cadence, moved labor, and improved throughput by 18 percent while protecting the customer promise.",
    });
    const response = createSseResponse(events);
    const body = await response.text();

    expect(events[0]).toMatchObject({
      event: "route",
      data: {
        runtime: "edge",
        transport: "sse",
      },
    });
    expect(events.some((event) => event.event === "review")).toBe(true);
    expect(response.headers.get("content-type")).toContain("text/event-stream");
    expect(body).toContain("event: review");
    expect(body).toContain(question.sourceCategoryLabel);
  });

  it("rejects harsh reviews for questions outside the imported source bank", () => {
    expect(() =>
      buildHarshReviewStreamEvents({
        questionId: "made-up-question",
        answer: "I did something vague.",
      }),
    ).toThrow("source bank");
  });

  it("acknowledges upstream audio with chunked HTTP instead of fake WebSockets", () => {
    const ack = buildAudioChunkAck({
      bodyBytes: 4096,
      sessionId: "session-1",
      chunkIndex: 3,
      hasTranscriptionProvider: false,
    });

    expect(ack).toMatchObject({
      accepted: true,
      transport: "chunked_http_post",
      receivedBytes: 4096,
      sessionId: "session-1",
      chunkIndex: 3,
    });
    expect(ack.warning).toContain("avoids fake WebSockets");
  });

  it("refuses to fake heavy-job queueing when QStash is not configured", async () => {
    const job = createInterviewBackgroundJob({
      type: "predictive_trajectory",
      userId: "candidate-1",
      payload: { days: 14 },
    });
    const result = await publishInterviewBackgroundJob(job, {});

    expect(result.status).toBe("missing_provider");
    expect(result.httpStatus).toBe(503);
    expect(result.requiredEnvironment).toEqual([
      "UPSTASH_QSTASH_TOKEN",
      "INTERVIEW_JOB_WORKER_URL",
    ]);
  });

  it("publishes heavy jobs through QStash when provider config exists", async () => {
    const job = createInterviewBackgroundJob({
      type: "endurance_loop_analysis",
      payload: { loopId: "loop-1" },
    });
    const fetcher = vi.fn(async () => {
      return new Response(null, {
        status: 202,
        headers: {
          "upstash-message-id": "msg-123",
        },
      });
    });

    const result = await publishInterviewBackgroundJob(
      job,
      {
        qstashToken: "token",
        workerUrl: "https://worker.example.com/interview",
      },
      fetcher,
    );

    expect(result.status).toBe("published");
    expect(result.httpStatus).toBe(202);
    expect(result.providerMessageId).toBe("msg-123");
    expect(fetcher).toHaveBeenCalledWith(
      "https://qstash.upstash.io/v2/publish/https%3A%2F%2Fworker.example.com%2Finterview",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer token",
        }),
      }),
    );
  });
});
