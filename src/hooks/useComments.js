import { supabase } from '../lib/supabase'

export function useComments() {
  const addComment = async ({ postId, author, text, parentId = null }) => {
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, author, text, parent_id: parentId })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  return { addComment }
}
