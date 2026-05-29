const statuses = [
  { label: "Draft", color: "bg-gray-200 text-gray-700" },
  { label: "Discussion", color: "bg-blue-100 text-blue-700" },
  { label: "Voting", color: "bg-yellow-100 text-yellow-700" },
  { label: "Approved", color: "bg-green-100 text-green-700" },
];

const proposals = [
  {
    title: "Ambassador reward restructure",
    status: "Voting",
    author: "0x1234...5678",
    date: "2 days ago",
    summary:
      "Proposal to update reward tiers for ambassador contributions with new categories and multipliers.",
  },
  {
    title: "Regional hub expansion — Southeast Asia",
    status: "Discussion",
    author: "0xabcd...ef01",
    date: "5 days ago",
    summary:
      "Launch three new regional hubs across Southeast Asia with dedicated coordinators.",
  },
  {
    title: "Quarterly reporting template v2",
    status: "Approved",
    author: "0xdead...beef",
    date: "2 weeks ago",
    summary:
      "Standardized reporting template for all ambassador quarterly submissions.",
  },
  {
    title: "Filecoin grant program for ambassadors",
    status: "Draft",
    author: "0xcafe...babe",
    date: "1 week ago",
    summary:
      "Create a grant program for ambassador-led initiatives funded by the community treasury.",
  },
];

export default function ProposalsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <span className="text-sm font-medium text-gray-400 tracking-tight">
          Governance
        </span>
        <h1 className="text-5xl font-semibold tracking-[-0.035em] text-gray-950 mt-2">
          Active proposals
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl">
          Projects in debate. Each proposal goes through Draft → Discussion →
          Voting → Approved. Your voice shapes the future of Filecoin
          governance.
        </p>

        <div className="flex flex-col gap-3.5 mt-12">
          {proposals.map((p) => (
            <div
              key={p.title}
              className="bg-white border border-gray-200/60 rounded-[18px] p-6 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-gray-950">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    {p.summary}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                    <span>by {p.author}</span>
                    <span>{p.date}</span>
                  </div>
                </div>
                <span
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                    statuses.find((s) => s.label === p.status)?.color
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Coming soon: submit proposals on-chain
        </p>
      </div>
    </div>
  );
}
