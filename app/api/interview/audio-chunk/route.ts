import { buildAudioChunkAck } from "@/lib/vercelInterviewPipeline";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function parseChunkIndex(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : null;
}

export async function POST(request: Request) {
  const body = await request.arrayBuffer();
  const sessionId = request.headers.get("x-drill-session-id");
  const chunkIndex = parseChunkIndex(request.headers.get("x-audio-chunk-index"));
  const hasTranscriptionProvider =
    Boolean(process.env.TRANSCRIPTION_API_URL?.trim()) ||
    Boolean(process.env.OPENAI_API_KEY?.trim());

  return Response.json(
    buildAudioChunkAck({
      bodyBytes: body.byteLength,
      sessionId,
      chunkIndex,
      hasTranscriptionProvider,
    }),
    {
      status: 202,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
