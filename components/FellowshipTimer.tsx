'use client';

import { useEffect, useMemo, useState } from 'react';

function formatClock(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

interface FellowshipTimerProps {
  compact?: boolean;
}

export function FellowshipTimer({ compact = false }: FellowshipTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!running) {
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const minutes = useMemo(() => Math.max(1, Math.round(seconds / 60)), [seconds]);

  async function stopAndSave() {
    if (seconds === 0) {
      setStatus('No time recorded yet.');
      return;
    }

    setRunning(false);
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/time-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: 'FELLOWSHIP',
          minutes,
          note: note.trim() || 'Fellowship timer session'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save fellowship session.');
      }

      setStatus(`Saved ${minutes} fellowship minutes.`);
      setSeconds(0);
      setNote('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unexpected error while saving timer.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Fellowship Timer</p>
          <p className={`font-mono ${compact ? 'text-2xl' : 'text-3xl'} font-semibold text-slate-900`}>
            {formatClock(seconds)}
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">{minutes} min to log</div>
      </div>

      <input
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Optional note"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setRunning(true)}
          disabled={running || loading}
          className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Start
        </button>
        <button
          type="button"
          onClick={() => setRunning(false)}
          disabled={!running || loading}
          className="rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={stopAndSave}
          disabled={loading || seconds === 0}
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Stop & Save
        </button>
      </div>

      {status ? <p className="text-xs text-slate-600">{status}</p> : null}
    </div>
  );
}
