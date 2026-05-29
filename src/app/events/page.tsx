import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const LUMA_CALENDAR = "https://lu.ma/filecoin";
const LUMA_EMBED = "https://lu.ma/embed/calendar/cal-7edcf598-6d77-4c46-8cb5-ff21a0cf4c5d/events";

async function fetchLumaEvents() {
  try {
    const res = await fetch(
      "https://api.lu.ma/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Orbit/1.0",
        },
        body: JSON.stringify({
          query: `
            query GetCalendarEvents($calendarApiId: String!) {
              calendar(api_id: $calendarApiId) {
                name
                events(filter: { limit: 12 }) {
                  entries {
                    event {
                      name
                      url
                      start_at
                      end_at
                      geo_address_json {
                        city
                        country
                      }
                      cover_url
                      series_api_id
                    }
                  }
                }
              }
            }
          `,
          variables: {
            calendarApiId: "filecoin",
          },
        }),
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.calendar?.events?.entries ?? [];
  } catch {
    return null;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export default async function EventsPage() {
  const entries = await fetchLumaEvents();

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
            Filecoin community events
          </span>
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-[-0.035em] text-white">
            Events around
            <br />
            the constellation.
          </h1>
          <p className="mt-5 text-lg text-white/70 max-w-xl leading-relaxed">
            Meetups, hackathons, summits, and conferences — every Filecoin
            gathering in one place. Synced from the official Luma calendar.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href={LUMA_CALENDAR}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-gray-950 pl-7 pr-2 py-2 rounded-full font-medium text-base hover:bg-gray-100 transition-colors"
            >
              Open Luma Calendar
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
              Past Events
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

      {/* Events Grid */}
      <section className="py-20 px-6">
        <div className="max-w-[88rem] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm font-medium text-gray-400 tracking-tight">
                Upcoming
              </span>
              <h2 className="text-3xl font-semibold tracking-[-0.025em] text-gray-950 mt-1">
                {entries && entries.length > 0
                  ? `${entries.length} upcoming events`
                  : "Events from Luma"}
              </h2>
            </div>
            <Link
              href={LUMA_CALENDAR}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-400 hover:text-gray-950 transition-colors flex items-center gap-1.5"
            >
              View all on Luma
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

          {entries && entries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {entries.map((entry: any) => {
                const e = entry.event;
                const isPast = new Date(e.start_at) < new Date();

                return (
                  <a
                    key={e.url}
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group bg-white border border-gray-200/60 rounded-[18px] overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${
                      isPast ? "opacity-60" : ""
                    }`}
                  >
                    {e.cover_url && (
                      <div className="relative h-44 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                        <img
                          src={e.cover_url}
                          alt={e.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {isPast && (
                          <span className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur text-xs font-medium text-gray-700 px-2.5 py-1 rounded-full">
                            Past
                          </span>
                        )}
                      </div>
                    )}

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
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
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {formatDate(e.start_at)}
                        {e.end_at && ` — ${formatDate(e.end_at)}`}
                      </div>

                      <h3 className="text-lg font-semibold tracking-[-0.015em] text-gray-950 group-hover:text-gray-600 transition-colors line-clamp-2">
                        {e.name}
                      </h3>

                      {e.geo_address_json && (
                        <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
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
                          {[e.geo_address_json.city, e.geo_address_json.country]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 mx-auto grid place-items-center mb-6">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    ry="2"
                  />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-950 mb-2">
                Syncing with Luma
              </h3>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                Pulling the latest events from the official Filecoin Luma
                calendar. In the meantime, browse all events directly on Luma.
              </p>
              <Link
                href={LUMA_CALENDAR}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gray-950 text-white pl-6 pr-2 py-2 rounded-full text-sm font-medium mt-6 hover:bg-gray-800 transition-colors"
              >
                Browse on Luma
                <span className="w-[32px] h-[32px] rounded-full bg-white text-gray-950 grid place-items-center">
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
                </span>
              </Link>
            </div>
          )}
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
              Submit your event to the official calendar and reach the global
              Filecoin ambassador network.
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
