import {
  getInterviewQuestionById,
  reviewInterviewAnswer,
  type InterviewAnswerReview,
  type InterviewerLensId,
  type InterviewQuestion,
} from "@/lib/interview";

export type HarshReviewStreamEvent =
  | {
      event: "route";
      data: {
        runtime: "edge";
        transport: "sse";
        note: string;
      };
    }
  | {
      event: "token";
      data: {
        text: string;
      };
    }
  | {
      event: "review";
      data: {
        question: Pick<
          InterviewQuestion,
          "id" | "title" | "sourceCategoryId" | "sourceCategoryLabel"
        >;
        review: InterviewAnswerReview;
      };
    }
  | {
      event: "done";
      data: {
        ok: true;
      };
    };

export interface HarshReviewRequestPayload {
  questionId?: unknown;
  answer?: unknown;
  lensId?: unknown;
}

export interface AudioChunkAck {
  accepted: true;
  transport: "chunked_http_post";
  receivedBytes: number;
  sessionId: string;
  chunkIndex: number;
  nextStep: string;
  warning: string | null;
}

export interface InterviewBackgroundJobPayload {
  type?: unknown;
  userId?: unknown;
  payload?: unknown;
}

export interface InterviewBackgroundJob {
  id: string;
  type: string;
  userId: string | null;
  payload: unknown;
  acceptedAt: string;
  execution: "queued_background_worker";
}

export interface QueuePublisherConfig {
  qstashToken?: string;
  workerUrl?: string;
}

export interface QueuePublishResult {
  status: "published" | "missing_provider" | "publish_failed";
  httpStatus: number;
  job: InterviewBackgroundJob;
  message: string;
  providerMessageId: string | null;
  requiredEnvironment: string[];
}

const HEAVY_JOB_TYPES = new Set([
  "predictive_trajectory",
  "vector_cross_reference",
  "endurance_loop_analysis",
  "prompt_adherence_batch",
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function createJobId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `job-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function encodeServerSentEvent(
  event: string,
  data: unknown,
): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export function buildHarshReviewStreamEvents(
  payload: HarshReviewRequestPayload,
): HarshReviewStreamEvent[] {
  const questionId = normalizeOptionalString(payload.questionId);
  const answer = normalizeOptionalString(payload.answer);
  const lensId =
    normalizeOptionalString(payload.lensId) ?? "l7_bar_raiser";

  if (!questionId) {
    throw new Error("questionId is required.");
  }

  if (!answer) {
    throw new Error("answer is required.");
  }

  const question = getInterviewQuestionById(questionId);

  if (!question) {
    throw new Error("questionId must match the imported source bank.");
  }

  const review = reviewInterviewAnswer(
    question,
    answer,
    lensId as InterviewerLensId,
  );
  const topMiss = review.misses[0] ?? "No obvious miss, but rerun the answer under pressure.";

  return [
    {
      event: "route",
      data: {
        runtime: "edge",
        transport: "sse",
        note: "Harsh review is computed in the Edge route and streamed downstream with Server-Sent Events.",
      },
    },
    {
      event: "token",
      data: {
        text: `Verdict: ${review.verdictLabel}. Score: ${review.score}.`,
      },
    },
    {
      event: "token",
      data: {
        text: `Most important miss: ${topMiss}`,
      },
    },
    {
      event: "review",
      data: {
        question: {
          id: question.id,
          title: question.title,
          sourceCategoryId: question.sourceCategoryId,
          sourceCategoryLabel: question.sourceCategoryLabel,
        },
        review,
      },
    },
    {
      event: "done",
      data: {
        ok: true,
      },
    },
  ];
}

export function createSseResponse(
  events: readonly HarshReviewStreamEvent[],
): Response {
  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream<Uint8Array>({
      start(controller) {
        for (const item of events) {
          controller.enqueue(encoder.encode(encodeServerSentEvent(item.event, item.data)));
        }
        controller.close();
      },
    }),
    {
      headers: {
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Content-Type": "text/event-stream; charset=utf-8",
      },
    },
  );
}

export function buildAudioChunkAck({
  bodyBytes,
  sessionId,
  chunkIndex,
  hasTranscriptionProvider,
}: {
  bodyBytes: number;
  sessionId: string | null;
  chunkIndex: number | null;
  hasTranscriptionProvider: boolean;
}): AudioChunkAck {
  return {
    accepted: true,
    transport: "chunked_http_post",
    receivedBytes: bodyBytes,
    sessionId: sessionId ?? createJobId(),
    chunkIndex: chunkIndex ?? 0,
    nextStep: hasTranscriptionProvider
      ? "Forward this chunk to the configured transcription provider, then stream AI response downstream over SSE."
      : "Chunk accepted by the Vercel-safe intake path. Configure a transcription provider before expecting live transcripts.",
    warning: hasTranscriptionProvider
      ? null
      : "No transcription provider is configured. This route intentionally avoids fake WebSockets and fake transcripts.",
  };
}

export function createInterviewBackgroundJob(
  payload: InterviewBackgroundJobPayload,
): InterviewBackgroundJob {
  const requestedType = normalizeOptionalString(payload.type);
  const type =
    requestedType && HEAVY_JOB_TYPES.has(requestedType)
      ? requestedType
      : "predictive_trajectory";

  return {
    id: createJobId(),
    type,
    userId: normalizeOptionalString(payload.userId),
    payload: isPlainObject(payload.payload) ? payload.payload : {},
    acceptedAt: new Date().toISOString(),
    execution: "queued_background_worker",
  };
}

export async function publishInterviewBackgroundJob(
  job: InterviewBackgroundJob,
  config: QueuePublisherConfig,
  fetcher: typeof fetch = fetch,
): Promise<QueuePublishResult> {
  const requiredEnvironment = [
    "UPSTASH_QSTASH_TOKEN",
    "INTERVIEW_JOB_WORKER_URL",
  ];
  const token = normalizeOptionalString(config.qstashToken);
  const workerUrl = normalizeOptionalString(config.workerUrl);

  if (!token || !workerUrl) {
    return {
      status: "missing_provider",
      httpStatus: 503,
      job,
      message:
        "Heavy AI work is not accepted because the queue provider is not configured. Add QStash env vars so Vercel can return immediately while a worker processes the job.",
      providerMessageId: null,
      requiredEnvironment,
    };
  }

  const response = await fetcher(
    `https://qstash.upstash.io/v2/publish/${encodeURIComponent(workerUrl)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    },
  );

  if (!response.ok) {
    return {
      status: "publish_failed",
      httpStatus: 502,
      job,
      message: `QStash publish failed with HTTP ${response.status}.`,
      providerMessageId: null,
      requiredEnvironment,
    };
  }

  return {
    status: "published",
    httpStatus: 202,
    job,
    message:
      "Heavy AI job accepted. The frontend should listen over SSE or poll a status endpoint for completion.",
    providerMessageId: response.headers.get("upstash-message-id"),
    requiredEnvironment,
  };
}
