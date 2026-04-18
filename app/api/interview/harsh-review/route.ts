import {
  buildHarshReviewStreamEvents,
  createSseResponse,
  type HarshReviewRequestPayload,
} from "@/lib/vercelInterviewPipeline";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: HarshReviewRequestPayload;

  try {
    payload = (await request.json()) as HarshReviewRequestPayload;
  } catch {
    return Response.json(
      {
        error: "Request body must be JSON.",
      },
      { status: 400 },
    );
  }

  try {
    return createSseResponse(buildHarshReviewStreamEvents(payload));
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to stream harsh review.",
      },
      { status: 400 },
    );
  }
}
