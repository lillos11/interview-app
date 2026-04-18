import {
  createInterviewBackgroundJob,
  publishInterviewBackgroundJob,
  type InterviewBackgroundJobPayload,
} from "@/lib/vercelInterviewPipeline";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: InterviewBackgroundJobPayload;

  try {
    payload = (await request.json()) as InterviewBackgroundJobPayload;
  } catch {
    return Response.json(
      {
        error: "Request body must be JSON.",
      },
      { status: 400 },
    );
  }

  const job = createInterviewBackgroundJob(payload);
  const result = await publishInterviewBackgroundJob(job, {
    qstashToken: process.env.UPSTASH_QSTASH_TOKEN,
    workerUrl: process.env.INTERVIEW_JOB_WORKER_URL,
  });

  return Response.json(result, {
    status: result.httpStatus,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
