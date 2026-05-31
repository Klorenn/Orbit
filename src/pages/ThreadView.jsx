import { useState, useEffect } from 'react'
import { ME, catOf, who } from '../data/constants'
import { I } from '../components/Icons'
import { Vote } from '../components/Vote'
import { CategoryBadge } from '../components/CategoryBadge'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { Comment } from '../components/Comment'
import { ReactionBar } from '../components/ReactionBar'
import { WalletGate } from '../components/WalletGate'
import { renderRich } from '../components/MarkdownEditor'
import { MentionInput } from '../components/MentionInput'

/* ============================================================
   VIEW: THREAD (full page)
   ============================================================ */
export function ThreadView({ cat, id, posts, connected, onConnect, onVote, onAddComment, onReact, onReply, onReactPost }) {
  const post = posts.find(p=>p.id===id);
  const [draft, setDraft] = useState('');
  useEffect(()=>{ window.scrollTo(0,0); }, [id]);
  if (!post) return <div className="page-wrap"><p className="empty">Post not found. <a href="#/forum">Back to forum</a></p></div>;
  const u = who(post.author);
  const submit = () => { if(!draft.trim()) return; onAddComment(post.id, draft.trim()); setDraft(''); };
  return (
    <div className="page-wrap thread">
      <a className="back-link" href={'#/forum/'+post.cat}>{I.back()} {catOf(post.cat).name}</a>
      <div className="post-tags" style={{marginTop:12, marginBottom:14}}>
        <span className="tag type">{post.type}</span>
        <CategoryBadge cat={post.cat} soft />
        <span className="cid">◈ {post.cidStr}</span>
      </div>
      <h1 className="dt">{post.title}</h1>
      <div className="detail-author">
        <AmbassadorAvatar user={post.author} size={44} nft />
        <div>
          <div className="nm"><a href={'#/profile/'+u.name}>{u.name}</a> {u.role && <span className="role">{u.role}</span>}</div>
          <div className="sub">{u.city} · {post.time} ago</div>
        </div>
        <Vote count={post.upvotes} voted={post.upvoted} onToggle={()=>onVote(post.id)} row />
      </div>
      <div className="prose">{renderRich(post.body.join('\n\n'))}</div>
      {post.evidence.length>0 && (
        <>
          <h3 className="evi-head">Evidence · on Filecoin</h3>
          <div className="evidence">
            {post.evidence.map((e,i)=>(
              <div className="evi" key={i}><span className="ic">{I.doc()}</span><div><div className="en">{e.name}</div><div className="es">◈ {e.size}</div></div></div>
            ))}
          </div>
        </>
      )}
      <ReactionBar reactions={post.reactions} onReact={(emoji)=>onReactPost(post.id, emoji)} />
      <div className="comments">
        <h3>{post.comments.length} comment{post.comments.length!==1?'s':''}</h3>
        <WalletGate connected={connected} onConnect={onConnect} label="Connect your wallet to comment">
          <div className="composer">
            <AmbassadorAvatar user="you.fil" size={38} link={false} />
            <div className="cbox">
              <MentionInput value={draft} onChange={setDraft} placeholder="Add to the discussion… use @ to mention someone"
                onKeyDown={e=>{ if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)) submit(); }} />
              <div className="crow">
                <span className="hint">{I.shield()} Posting as {ME.name} · @ to mention · ⌘↵ to send</span>
                <button className="pill pill-blue" onClick={submit} style={{opacity:draft.trim()?1:.5}}>Comment</button>
              </div>
            </div>
          </div>
        </WalletGate>
        {post.comments.map(cm=><Comment key={cm.id} c={cm} onReact={(cid,emoji)=>onReact(post.id, cid, emoji)} onReply={(cid,text)=>onReply(post.id, cid, text)} />)}
        {post.comments.length===0 && <p className="empty" style={{textAlign:'left',padding:'8px 0'}}>No comments yet — be the first to weigh in.</p>}
      </div>
    </div>
  );
}
