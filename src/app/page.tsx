import Image from "next/image";
import Link from "next/link";

const categories = [
  { label: "Reports", href: "/forum/reports", color: "bg-blue-500" },
  { label: "Projects", href: "/forum/projects", color: "bg-purple-500" },
  { label: "Events", href: "/forum/events", color: "bg-yellow-500" },
  { label: "Feedback", href: "/forum/feedback", color: "bg-green-500" },
  { label: "Announcements", href: "/forum/announcements", color: "bg-red-500" },
  { label: "Get Started", href: "/forum/get-started", color: "bg-teal-500" },
  { label: "Governance", href: "/forum/governance", color: "bg-gray-500" },
];

const testimonials = [
  {
    quote: "Finally I can see what other ambassadors are building.",
    name: "Olga",
    city: "Santiago, Chile",
    color: "#0090FF",
  },
  {
    quote: "Wallet-gating means real identity without the paperwork.",
    name: "Kwame",
    city: "Accra, Ghana",
    color: "#FFD60A",
  },
  {
    quote: "Our reports live on Filecoin now. As they should.",
    name: "Mira",
    city: "Lisbon, Portugal",
    color: "#A855F7",
  },
];

export default function Home() {
  return (
    <div className="bg-[#F5F5F5]">
      {/* ===== HERO ===== */}
      <section className="relative h-screen min-h-[640px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/assets/hero-poster.png"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/assets/hero.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(10,12,30,.72) 0%, rgba(10,12,30,.38) 42%, rgba(10,12,30,.12) 70%), linear-gradient(to top, rgba(10,12,30,.55), transparent 38%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-[88rem] mx-auto px-6 w-full pt-20 pb-10 flex flex-col justify-between h-full">
          <div className="flex flex-col mt-auto mb-auto">
            <div className="inline-flex items-center gap-[9px] px-4 py-2 rounded-full bg-white/[0.14] border border-white/20 backdrop-blur-[8px] text-[13px] font-medium tracking-[0.01em] text-white mb-4">
              <span className="w-[6px] h-[6px] rounded-full bg-[#0090FF] shadow-[0_0_8px_#0090FF]" />
              The Filecoin ambassador forum
            </div>

            <h1 className="text-[clamp(42px,6vw,74px)] font-semibold tracking-[-0.045em] leading-[1.0] text-white max-w-[16ch] mt-[22px]">
              A constellation of voices, building Filecoin together.
            </h1>

            <p className="mt-5 max-w-[46ch] text-[clamp(16px,1.3vw,19px)] leading-[1.55] text-white/[0.82] font-normal">
              The wallet-gated forum where Filecoin ambassadors publish reports,
              propose projects, and shape the future of decentralized storage —
              transparently, on-chain.
            </p>

            <Link
              href="/connect"
              className="mt-8 inline-flex items-center gap-3 bg-white text-gray-950 pl-[26px] pr-2 py-[7px] rounded-full font-medium text-base hover:bg-gray-100 transition-colors group"
            >
              Connect Wallet to Join
              <span className="w-[38px] h-[38px] rounded-full bg-gray-950 text-white grid place-items-center group-hover:translate-x-[3px] transition-transform">
                <svg
                  width="20"
                  height="20"
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

          <div className="mt-auto w-full overflow-hidden -mx-6 px-6" style={{ maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}>
            <div className="flex gap-[52px] animate-marquee w-max text-white/70 text-sm">
              {["Protocol Labs", "IPFS", "Lotus", "FVM", "Lighthouse", "Boost", "web3.storage", "Singularity", "Protocol Labs", "IPFS", "Lotus", "FVM", "Lighthouse", "Boost", "web3.storage", "Singularity"].map((name, i) => (
                <span key={i} className="whitespace-nowrap">{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== MEET ORBIT ===== */}
      <section className="py-16 px-6">
        <div className="max-w-[1086px] mx-auto">
          <div className="grid grid-cols-[220px_310px_1fr_150px] gap-4 items-start mb-6">
            <div className="pt-6">
              <h2 className="text-[48px] font-semibold tracking-[-0.035em] leading-none whitespace-nowrap">
                Meet Orbit.
              </h2>
              <Link
                href="/docs"
                className="mt-5 inline-flex items-center gap-3 bg-gray-950 text-white pl-6 pr-2 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Discover it
                <span className="w-[36px] h-[36px] rounded-full bg-white text-gray-950 grid place-items-center">
                  <svg
                    width="16"
                    height="16"
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

            <div className="flex justify-center">
              <Image
                src="/assets/blue.png"
                alt="Orbit astronaut"
                width={270}
                height={270}
                className="drop-shadow-[0_14px_26px_rgba(0,0,0,0.18)] -rotate-3"
              />
            </div>

            <p className="text-[22px] leading-relaxed text-gray-500 max-w-[390px] mt-8">
              Orbit is the wallet-gated forum where Filecoin ambassadors publish
              their work in the open — reports, proposals, and debate, all
              anchored to real on-chain identity.
            </p>

            <Image
              src="/assets/red.png"
              alt="Orbit astronaut"
              width={150}
              height={150}
              className="mt-6 rotate-6 drop-shadow-[0_14px_26px_rgba(0,0,0,0.18)]"
            />
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-4 gap-3.5 mt-6">
            {/* Scene card */}
            <div className="col-span-2 relative rounded-[18px] overflow-hidden min-h-[326px]">
              <Image
                src="/assets/space.png"
                alt=""
                fill
                className="object-cover z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/60 via-[#0a0e27]/30 to-[#0a0e27]/20 z-10" />
              <Image
                src="/assets/yellow.png"
                alt=""
                width={112}
                height={112}
                className="absolute z-20 top-11 left-6 -rotate-6 drop-shadow-[0_10px_22px_rgba(0,0,0,0.4)]"
              />
              <Image
                src="/assets/purple.png"
                alt=""
                width={116}
                height={116}
                className="absolute z-20 bottom-10 left-7 rotate-3 drop-shadow-[0_10px_22px_rgba(0,0,0,0.4)]"
              />
              <div className="absolute z-20 top-7 left-[24%] right-8">
                <h3 className="text-[26px] font-semibold tracking-[-0.02em] text-white mb-3.5">
                  Visible work, finally
                </h3>
                <p className="text-sm text-white/90 max-w-[28ch] mt-24">
                  Every event report and proposal lives in one public forum —
                  readable by anyone, attributed to a real on-chain identity. No
                  more work trapped in Airtable, Slack, or Drive.
                </p>
              </div>
            </div>

            {/* Dark card — Identity */}
            <div className="bg-[#2B2644] rounded-[18px] p-7 flex flex-col min-h-[326px]">
              <div className="flex justify-between items-start">
                <h3 className="text-[26px] font-semibold tracking-[-0.02em] leading-tight text-white">
                  Identity without paperwork
                </h3>
                <span className="w-[42px] h-[42px] rounded-xl bg-white/10 grid place-items-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <rect x="2" y="6" width="20" height="14" rx="3" />
                    <path d="M2 10h20" />
                    <circle cx="17.5" cy="14.5" r="1.3" fill="currentColor" stroke="none" />
                  </svg>
                </span>
              </div>
              <Image
                src="/assets/green.png"
                alt=""
                width={205}
                height={205}
                className="self-center mt-6 rotate-3 drop-shadow-[0_12px_26px_rgba(0,0,0,0.4)]"
              />
              <p className="text-sm text-white/60 mt-auto pt-4">
                Sign in with your wallet. No emails, no passwords, no central
                gatekeeper — your wallet is your key.
              </p>
            </div>

            {/* Light card — Filecoin */}
            <div className="bg-white border border-gray-200/60 rounded-[18px] p-7 flex flex-col min-h-[326px]">
              <div className="flex justify-between items-start">
                <h3 className="text-[26px] font-semibold tracking-[-0.02em] leading-tight text-gray-950">
                  Stored on Filecoin
                </h3>
                <span className="w-[42px] h-[42px] rounded-xl bg-gray-950/5 grid place-items-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-950"
                  >
                    <ellipse cx="12" cy="5" rx="8" ry="3" />
                    <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
                    <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
                  </svg>
                </span>
              </div>
              <Image
                src="/assets/red.png"
                alt=""
                width={185}
                height={185}
                className="self-center mt-3.5 -rotate-3"
              />
              <p className="text-sm text-gray-500 mt-auto pt-4">
                Reports and evidence are pinned to IPFS and persisted through
                Filecoin storage deals. We eat our own dog food.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-[88rem] mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-medium text-gray-400 tracking-tight">
              Explore the forum
            </span>
            <h2 className="text-5xl font-semibold tracking-[-0.035em] text-gray-950 mt-3">
              Seven spaces.
              <br />
              <span className="text-gray-400">Every voice has a place.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group bg-[#F5F5F5] border border-gray-200/60 rounded-[18px] p-6 flex flex-col gap-5 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-3 h-3 rounded-full ${cat.color} ring-4 ring-opacity-20 ${cat.color.replace("bg-", "ring-")}`}
                  />
                  <span className="w-8 h-8 rounded-full bg-white border border-gray-200 grid place-items-center text-gray-400 group-hover:text-gray-950 group-hover:border-gray-950 transition-colors duration-300">
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
                </div>
                <div>
                  <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-gray-950 group-hover:text-gray-600 transition-colors duration-300">
                    {cat.label}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
                    {cat.label === "Reports" &&
                      "Ambassador field reports and event recaps"}
                    {cat.label === "Projects" &&
                      "Propose and track community projects"}
                    {cat.label === "Events" &&
                      "Upcoming meetups, hackathons, and summits"}
                    {cat.label === "Feedback" &&
                      "Open discussion on the Filecoin ecosystem"}
                    {cat.label === "Announcements" &&
                      "Official updates from the core team"}
                    {cat.label === "Get Started" &&
                      "Onboarding guides for new ambassadors"}
                    {cat.label === "Governance" &&
                      "Meta-discussion about the forum itself"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VOICES ===== */}
      <section className="py-16 px-6">
        <div className="max-w-[88rem] mx-auto">
          <div className="max-w-2xl">
            <span className="text-sm font-medium text-gray-400">
              From the ambassadors
            </span>
            <h2 className="text-4xl font-semibold tracking-[-0.035em] text-gray-950 mt-2">
              Voices from the constellation.
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Hundreds of ambassadors across dozens of cities — finally sharing
              one record of the work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-gray-200/60 rounded-[22px] p-8 flex flex-col justify-between min-h-[280px] hover:-translate-y-1 transition-transform"
              >
                <p className="text-xl font-medium tracking-[-0.02em] leading-snug">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 mt-7">
                  <span
                    className="w-10 h-10 rounded-full flex-none"
                    style={{ background: t.color }}
                  />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== JOIN CTA ===== */}
      <section className="pb-20 px-6" id="join">
        <div className="max-w-[88rem] mx-auto">
          <div className="relative bg-[#090820] rounded-[34px] overflow-hidden shadow-[0_26px_80px_rgba(8,8,25,0.16)] py-24 md:py-32">
            {/* Constellation lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1200 460"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
              aria-hidden="true"
            >
              <line x1="170" y1="120" x2="430" y2="250" stroke="#fff" strokeWidth="1.4" strokeDasharray="3 7" opacity="0.3" />
              <line x1="430" y1="250" x2="720" y2="110" stroke="#fff" strokeWidth="1.4" strokeDasharray="3 7" opacity="0.3" />
              <line x1="430" y1="250" x2="640" y2="380" stroke="#fff" strokeWidth="1.4" strokeDasharray="3 7" opacity="0.3" />
              <line x1="720" y1="110" x2="1010" y2="220" stroke="#fff" strokeWidth="1.4" strokeDasharray="3 7" opacity="0.3" />
              <line x1="640" y1="380" x2="1010" y2="220" stroke="#fff" strokeWidth="1.4" strokeDasharray="3 7" opacity="0.3" />
              <circle cx="170" cy="120" r="5" fill="#FFD60A" />
              <circle cx="430" cy="250" r="7" fill="#0090FF" />
              <circle cx="720" cy="110" r="5" fill="#FF3B30" />
              <circle cx="640" cy="380" r="5" fill="#A855F7" />
              <circle cx="1010" cy="220" r="5" fill="#10B981" />
            </svg>

            {/* Glow blobs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#0090FF] blur-[100px] opacity-20" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#A855F7] blur-[100px] opacity-20" />

            {/* Content */}
            <div className="relative z-10 text-center px-6">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.035em] text-white">
                Ready to add your voice?
              </h2>
              <p className="mt-4 text-lg text-white/70 max-w-lg mx-auto leading-relaxed">
                Connect your wallet. Read freely. Post if you hold the Orbit
                Ambassador NFT.
              </p>
              <Link
                href="/connect"
                className="mt-8 inline-flex items-center gap-3 bg-white text-gray-950 pl-[26px] pr-2 py-[7px] rounded-full font-medium text-base hover:bg-gray-100 transition-colors group shadow-[0_18px_44px_rgba(0,0,0,0.34)]"
              >
                Connect Wallet
                <span className="w-[38px] h-[38px] rounded-full bg-gray-950 text-white grid place-items-center group-hover:translate-x-[3px] transition-transform">
                  <svg
                    width="20"
                    height="20"
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
              <p className="mt-5 text-sm text-white/40">
                Don&apos;t have the NFT yet?{" "}
                <Link href="/docs" className="text-[#0090FF] hover:underline">
                  Apply to the Orbit Program →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-gray-200/60 py-18 px-6">
        <div className="max-w-[88rem] mx-auto">
          <div className="grid grid-cols-[1.7fr_1fr_1fr_1fr_1fr] gap-9">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gray-950 flex items-center justify-center">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    viewBox="0 0 256 256"
                    fill="none"
                    aria-hidden="true"
                  >
                    <ellipse
                      cx="128"
                      cy="128"
                      rx="98"
                      ry="52"
                      transform="rotate(-20 128 128)"
                      stroke="currentColor"
                      strokeWidth="15"
                    />
                    <circle cx="128" cy="128" r="33" fill="currentColor" />
                    <circle cx="173" cy="69" r="17" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-2xl font-semibold tracking-tight">
                  Orbit
                </span>
              </div>
              <p className="mt-3.5 text-sm text-gray-500 max-w-[26ch]">
                A constellation of voices.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Forum", "Reports", "Projects"],
              },
              {
                title: "Community",
                links: ["Discord", "GitHub", "X"],
              },
              {
                title: "Governance",
                links: ["FIPs", "Metropolis", "Constellation"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Conduct"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3.5">
                  {col.title}
                </h5>
                {col.links.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    className="block text-sm text-gray-500 py-1.5 hover:text-gray-950 transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-14 pt-6 border-t border-gray-200/60 text-sm text-gray-400">
            <span>Built on Filecoin · Stored on IPFS · &copy; 2026 Orbit</span>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-950 transition-colors"
                aria-label="X"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-950 transition-colors"
                aria-label="GitHub"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0024 12.5C24 5.87 18.63.5 12 .5z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-950 transition-colors"
                aria-label="Discord"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.317 4.369A19.79 19.79 0 0015.885 3c-.2.358-.43.84-.59 1.222a18.27 18.27 0 00-5.487 0A12.6 12.6 0 009.21 3a19.74 19.74 0 00-4.43 1.369C1.99 8.59 1.225 12.7 1.6 16.75a19.94 19.94 0 006.073 3.07c.49-.668.927-1.377 1.302-2.122a12.9 12.9 0 01-2.05-.984c.172-.126.34-.258.502-.394 3.95 1.84 8.22 1.84 12.122 0 .164.14.332.272.502.394-.654.388-1.345.72-2.052.984.375.745.81 1.453 1.3 2.122a19.9 19.9 0 006.075-3.07c.44-4.69-.752-8.766-3.158-12.381zM8.02 14.331c-1.183 0-2.157-1.085-2.157-2.42 0-1.334.955-2.42 2.157-2.42 1.21 0 2.176 1.095 2.157 2.42 0 1.335-.955 2.42-2.157 2.42zm7.96 0c-1.183 0-2.157-1.085-2.157-2.42 0-1.334.955-2.42 2.157-2.42 1.21 0 2.176 1.095 2.157 2.42 0 1.335-.946 2.42-2.157 2.42z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
