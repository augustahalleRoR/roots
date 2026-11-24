import Link from "next/link";

export const metadata = {
  title: "Privacy — Roots",
  description: "What Roots collects, why, and how we handle the stories people share with us.",
};

// Plain-language privacy and consent note. Not legal advice -- written to
// describe what the site actually does today.
const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "The short version",
    body: (
      <>
        <p>
          Roots is a collection of real people&rsquo;s stories, so trust
          matters more than anything else here. We only publish a portrait
          after checking in with the person in it. We never publish or sell
          anyone&rsquo;s contact details. And if you want something changed
          or taken down, we&rsquo;ll do it.
        </p>
      </>
    ),
  },
  {
    title: "What we collect",
    body: (
      <ul>
        <li>
          <strong>When you add someone (or yourself) to the map:</strong> their
          name, where they are, any photos you add, a quote, and the story
          you write. We also ask for your email so we can follow up.
        </li>
        <li>
          <strong>When you request an introduction:</strong> your name,
          email, and note.
        </li>
        <li>
          <strong>When you sign up for updates:</strong> your email address.
        </li>
        <li>
          <strong>When you visit:</strong> anonymous visit counts (which
          pages are read, roughly where from) through Vercel Web Analytics,
          which doesn&rsquo;t use cookies or track you across other sites.
        </li>
      </ul>
    ),
  },
  {
    title: "What goes public, and what doesn't",
    body: (
      <>
        <p>
          Nothing you submit is published automatically. A person on our
          team reads every submission, and we contact the person being
          featured before their portrait goes up. What appears on the site
          is the portrait itself: name, place, photo, quote, and story.
        </p>
        <p>
          Email addresses and other contact details are never shown on the
          site. Introduction requests are read by us and passed along by us;
          we don&rsquo;t hand out anyone&rsquo;s email.
        </p>
      </>
    ),
  },
  {
    title: "Where it's kept",
    body: (
      <p>
        Submissions are stored in Sanity, the system we use to manage the
        site&rsquo;s content, and the site runs on Vercel. When something
        new comes in, we may get an email alert about it. Only the Roots
        team can see submissions.
      </p>
    ),
  },
  {
    title: "Emails from us",
    body: (
      <p>
        If you sign up for updates, we&rsquo;ll only write when there&rsquo;s
        something new, like fresh portraits. You can ask to be removed at
        any time.
      </p>
    ),
  },
  {
    title: "Changes and take-downs",
    body: (
      <p>
        If you&rsquo;re featured on Roots and want something corrected,
        updated, or removed, or you&rsquo;d like your email taken off our
        list, get in touch and we&rsquo;ll take care of it. You can reach the
        team through{" "}
        <a
          href="https://rootsontheroad.squarespace.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Roots on the Road
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-16 sm:px-10 sm:pt-20">
      <p className="section-label">Privacy &amp; consent</p>
      <h1 className="mt-4 font-display text-5xl text-ink sm:text-6xl">
        How we handle what you share.
      </h1>
      <div className="mt-14 space-y-12">
        {sections.map((s) => (
          <section key={s.title} className="border-t border-line pt-8">
            <h2 className="font-display text-3xl text-ink">{s.title}</h2>
            <div className="mt-4 space-y-4 text-[17px] leading-relaxed text-ink-soft [&_a]:text-ink [&_a]:underline [&_a]:decoration-line [&_a]:underline-offset-4 [&_li]:mt-3 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-5">
              {s.body}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-16 border-t border-line pt-8 text-[15px] text-ink-soft">
        Know someone who belongs here?{" "}
        <Link href="/add" className="text-ink underline decoration-line underline-offset-4 hover:text-moss">
          Add them to the map
        </Link>
        .
      </p>
    </div>
  );
}
