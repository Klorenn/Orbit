import { useMemo } from 'react'

export function useProposals(posts) {
  const proposals = useMemo(() => posts
    .filter(p => p.type === 'Proposal')
    .map(p => ({
      id: p.id,
      title: p.title,
      status: p.status || 'Discussion',
      author: p.author,
      forVotes: p.upvotes || 0,
      comments: (p.comments || []).length,
      threadId: p.id,
      cat: p.cat,
      summary: p.excerpt ||
        (Array.isArray(p.body) ? p.body[0] : p.body || '')
          .replace(/[#*_>[\]-]/g, '')
          .slice(0, 150),
    })), [posts])

  return { proposals }
}
