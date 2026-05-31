import { supabase } from '../lib/supabase'

export function useVotes() {
  const toggleVote = async ({ postId, voter, currentlyVoted }) => {
    if (currentlyVoted) {
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('post_id', postId)
        .eq('voter', voter)
      if (error) throw new Error(error.message)
    } else {
      const { error } = await supabase
        .from('votes')
        .insert({ post_id: postId, voter })
      if (error) throw new Error(error.message)
    }
  }

  return { toggleVote }
}
