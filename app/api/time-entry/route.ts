import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { ensureBaseData } from '@/lib/data';
import { TimeCategory } from '@/lib/domain';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  await ensureBaseData();

  const body = (await request.json()) as {
    category?: string;
    minutes?: number;
    note?: string;
    dateTime?: string;
  };

  const category = (body.category ?? 'FELLOWSHIP').toUpperCase();
  const minutes = Math.max(1, Math.round(body.minutes ?? 0));
  const note = body.note?.trim();
  const parsedDate = body.dateTime ? new Date(body.dateTime) : new Date();

  if (!Object.values(TimeCategory).includes(category as TimeCategory)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  if (!Number.isFinite(minutes) || minutes <= 0) {
    return NextResponse.json({ error: 'Minutes must be positive' }, { status: 400 });
  }

  await prisma.timeEntry.create({
    data: {
      category: category as TimeCategory,
      minutes,
      note: note && note.length > 0 ? note : null,
      dateTime: Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate
    }
  });

  revalidatePath('/');
  revalidatePath('/log');
  revalidatePath('/health');

  return NextResponse.json({ ok: true });
}
