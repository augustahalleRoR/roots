import { NextRequest, NextResponse } from "next/server";
import { getWriteClient } from "@/sanity/client";
import { notifyNewSubmission } from "@/lib/notify";
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

  const rootSlug = field(form, "rootSlug", 200);
  const name = field(form, "name", 200);
  const email = field(form, "email", 200);
  const note = field(form, "note", 3000);

  if (!rootSlug || !name || !email || !note) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const rootId = await client.fetch<string | null>(
    `*[_type == "root" && slug.current == $slug][0]._id`,
    { slug: rootSlug }
  );

  if (!rootId) {
    return NextResponse.json({ error: "Could not find that story." }, { status: 404 });
  }

  const doc = await client.create({
    _type: "connectRequest",
    root: { _type: "reference", _ref: rootId },
    name,
    email,
    note,
    status: "new",
  });

  await notifyNewSubmission({
    subject: `New introduction request for ${rootSlug}`,
    heading: `Someone wants to be introduced (${rootSlug})`,
    fields: [
      { label: "From", value: name },
      { label: "Email", value: email },
      { label: "Note", value: note },
    ],
    studioPath: "/studio/structure/connectRequest",
  });

  return NextResponse.json({ ok: true, id: doc._id });
}
