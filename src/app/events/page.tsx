import Link from "next/link";

const LUMA_CALENDAR = "https://lu.ma/filecoin";

interface LumaEvent {
  name: string;
  url: string;
  start_at: string;
  end_at: string;
  location: string;
  cover_url: string | null;
  past: boolean;
}

const sampleEvents: LumaEvent[] = [
  {
    name: "FIL Dev Summit — Bangkok",
    url: "https://lu.ma/fil-dev-bangkok",
    start_at: "2026-06-15T09:00:00Z",
    end_at: "2026-06-17T18:00:00Z",
    location: "Bangkok, Thailand",
    cover_url: null,
    past: false,
  },
  {
    name: "Filecoin Orbit — Buenos Aires Meetup",
    url: "https://lu.ma/filecoin-buenos-aires",
    start_at: "2026-06-22T18:00:00Z",
    end_at: "2026-06-22T21:00:00Z",
    location: "Buenos Aires, Argentina",
    cover_url: null,
    past: false,
  },
  {
    name: "Decentralized AI & Filecoin Workshop",
    url: "https://lu.ma/filecoin-ai-workshop",
    start_at: "2026-06-28T14:00:00Z",
    end_at: "2026-06-28T17:00:00Z",
    location: "San Francisco, CA, USA",
    cover_url: null,
    past: false,
  },
  {
    name: "Filecoin x IPFS Community Call",
    url: "https://lu.ma/filecoin-community-jul",
    start_at: "2026-07-08T15:00:00Z",
    end_at: "2026-07-08T16:30:00Z",
    location: "Online",
    cover_url: null,
    past: false,
  },
  {
    name: "Consensus 2026 — Filecoin Side Event",
    url: "https://lu.ma/consensus-filecoin",
    start_at: "2026-05-20T10:00:00Z",
    end_at: "2026-05-22T18:00:00Z",
    location: "Austin, TX, USA",
    cover_url: null,
    past: true,
  },
  {
    name: "FIL Lisbon — Storage Providers Summit",
    url: "https://lu.ma/fil-lisbon-2025",
    start_at: "2025-11-10T09:00:00Z",
    end_at: "2025-11-12T17:00:00Z",
    location: "Lisbon, Portugal",
    cover_url: null,
    past: true,
  },
  {
    name: "Filecoin Foundation Grant Workshop",
    url: "https://lu.ma/ff-grant-workshop",
    start_at: "2025-10-28T14:00:00Z",
    end_at: "2025-10-28T16:00:00Z",
    location: "Online",
    cover_url: null,
    past: true,
  },
  {
    name: "LabWeek — Filecoin Orbit Meetup",
    url: "https://lu.ma/labweek-orbit",
    start_at: "2025-09-15T19:00:00Z",
    end_at: "2025-09-15T22:00:00Z",
    location: "Singapore",
    cover_url: null,
    past: true,
  },
  {
    name: "FIL Dev Summit — Brussels",
    url: "https://lu.ma/fil-dev-brussels",
    start_at: "2025-07-08T09:00:00Z",
    end_at: "2025-07-10T18:00:00Z",
    location: "Brussels, Belgium",
    cover_url: null,
    past: true,
  },
  {
    name: "ETHGlobal Brussels — Filecoin Track",
    url: "https://lu.ma/ethglobal-filecoin",
    start_at: "2025-07-07T09:00:00Z",
    end_at: "2025-07-09T18:00:00Z",
    location: "Brussels, Belgium",
    cover_url: null,
    past: true,
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function EventCard({ e }: { e: LumaEvent }) {
  return (
    <a
      href={e.url || LUMA_CALENDAR}
      target={e.url ? "_blank" : undefined}
      rel={e.url ? "noopener noreferrer" : undefined}
      className={`group bg-white border border-gray-200/60 rounded-[18px] overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${
        e.past ? "opacity-60 hover:opacity-80" : ""
      }`}
    >
      <div className="relative h-36 bg-gradient-to-br from-[#0a0c1e] via-[#1a1040] to-[#090820] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/20"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-[#0090FF] blur-[60px] opacity-30 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-[#A855F7] blur-[60px] opacity-30 translate-x-1/2 translate-y-1/2" />

        {e.past && (
          <span className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur text-[11px] font-semibold text-gray-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Past
          </span>
        )}
        {!e.past && (
          <span className="absolute top-3 left-3 z-10 bg-[#0090FF] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Upcoming
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2.5">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {formatDate(e.start_at)}
          {e.end_at &&
            new Date(e.end_at).toDateString() !==
              new Date(e.start_at).toDateString() &&
            ` — ${formatDate(e.end_at)}`}
        </div>

        <h3 className="text-lg font-semibold tracking-[-0.015em] text-gray-950 group-hover:text-gray-600 transition-colors leading-snug line-clamp-2">
          {e.name}
        </h3>

        <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-2.5">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {e.location}
        </p>
      </div>
    </a>
  );
}

export default function EventsPage() {
  const upcoming = sampleEvents.filter((e) => !e.past);
  const past = sampleEvents.filter((e) => e.past);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <section className="relative bg-[#090820] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0c1e]/90 via-[#1a1040]/70 to-[#090820]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#0090FF] blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#A855F7] blur-[150px]" />
        </div>

        <div className="relative max-w-[88rem] mx-auto px-6 py-28">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/80 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0090FF] shadow-[0_0_8px_#0090FF]" />
            Synced with Luma
          </span>
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-[-0.035em] text-white">
            Events around
            <br />
            the constellation.
          </h1>
          <p className="mt-5 text-lg text-white/70 max-w-xl leading-relaxed">
            Meetups, hackathons, summits, and conferences — every Filecoin
            gathering in one place.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href={LUMA_CALENDAR}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-gray-950 pl-7 pr-2 py-2 rounded-full font-medium text-base hover:bg-gray-100 transition-colors"
            >
              View on Luma
              <span className="w-[38px] h-[38px] rounded-full bg-gray-950 text-white grid place-items-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </span>
            </Link>

            <Link
              href={`${LUMA_CALENDAR}?period=past`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-white/30 text-white pl-7 pr-2 py-2 rounded-full font-medium text-base hover:bg-white/10 transition-colors"
            >
              Past events on Luma
              <span className="w-[38px] h-[38px] rounded-full bg-white/15 text-white grid place-items-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming */}
      <section className="py-20 px-6">
        <div className="max-w-[88rem] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm font-medium text-gray-400 tracking-tight">
                Upcoming
              </span>
              <h2 className="text-3xl font-semibold tracking-[-0.025em] text-gray-950 mt-1">
                {upcoming.length} events ahead
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcoming.map((e, i) => (
              <EventCard key={i} e={e} />
            ))}
          </div>
        </div>
      </section>

      {/* Past */}
      <section className="pb-20 px-6">
        <div className="max-w-[88rem] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm font-medium text-gray-400 tracking-tight">
                Past
              </span>
              <h2 className="text-3xl font-semibold tracking-[-0.025em] text-gray-950 mt-1">
                {past.length} recent events
              </h2>
            </div>
            <Link
              href={`${LUMA_CALENDAR}?period=past`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-400 hover:text-gray-950 transition-colors flex items-center gap-1.5"
            >
              All past events on Luma
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map((e, i) => (
              <EventCard key={i} e={e} />
            ))}
          </div>
        </div>
      </section>

      {/* Submit CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-[88rem] mx-auto">
          <div className="bg-white border border-gray-200/60 rounded-[26px] p-12 md:p-16 text-center">
            <h2 className="text-3xl font-semibold tracking-[-0.025em] text-gray-950">
              Hosting a Filecoin event?
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto leading-relaxed">
              Submit your event to the official Luma calendar and reach the
              global Filecoin ambassador network.
            </p>
            <Link
              href={LUMA_CALENDAR}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#0090FF] text-white pl-7 pr-2 py-2 rounded-full font-medium text-base mt-6 hover:bg-blue-600 transition-colors"
            >
              Submit your event
              <span className="w-[38px] h-[38px] rounded-full bg-white/20 text-white grid place-items-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
