import { NextRequest, NextResponse } from "next/server";
import { getWriteClient } from "@/sanity/client";
import { field, isBot } from "@/lib/form-guard";

export async function POST(request: NextRequest) {
  const client = getWriteClient();
  if (!client) {
    return NextResponse.json(
      {
        error:
          "Sanity isn't configured yet. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN.",
      },
      { status: 503 }
    );
  }

  const form = await request.formData();
  if (isBot(form)) {
    return NextResponse.json({ ok: true });
  }
  const email = field(form, "email", 200)?.toLowerCase();

  if (!email || !/^[^s@]+@[^s@]+.[^s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const existing = await client.fetch<string | null>(
    `*[_type == "subscriber" && email == $email][0]._id`,
    { email }
  );
  if (existing) {
    return NextResponse.json({ ok: true, id: existing });
  }

  const doc = await client.create({
    _type: "subscriber",
    email,
    subscribedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, id: doc._id });
}
