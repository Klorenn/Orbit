import { useState } from 'react';
import { I } from './Icons';
import { who, AMBASSADORS } from '../data/constants';
import { AmbassadorAvatar } from './AmbassadorAvatar';
import { MentionInput } from './MentionInput';

const REACTIONS = ['👍', '🚀', '🔥', '❤️', '🎉', '👀', '🙌', '😄'];

function renderMentions(text) {
  const parts = String(text).split(/(@[a-z0-9_.]+)/gi);
  return parts.map((p, i) => {
    if (/^@[a-z0-9_.]+$/i.test(p)) {
      const raw = p.slice(1);
      const u = AMBASSADORS[raw] || AMBASSADORS[raw + '.fil'];
      if (u) return <a key={i} className="mention" href={'#/profile/' + u.name}>@{u.name}</a>;
    }
    return <span key={i}>{p}</span>;
  });
}

export function Comment({ c, onReact, onReply, depth = 0 }) {
  const u = who(c.author);
  const [picker, setPicker] = useState(false);
  const [replying, setReplying] = useState(false);
  const [draft, setDraft] = useState('');
  const reactions = c.reactions || {};
  const keys = Object.keys(reactions).filter((k) => reactions[k].count > 0);
  const submit = () => {
    if (draft.trim()) {
      onReply(c.id, draft.trim());
      setDraft('');
      setReplying(false);
    }
  };
  return (
    <div className={'cmt' + (depth ? ' cmt-reply' : '')}>
      <AmbassadorAvatar user={c.author} size={depth ? 30 : 38} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="ch">
          <span className="nm">{u.name}</span>
          {u.role && <span className="role">{u.role}</span>}
          <span className="tm">· {c.time} ago</span>
        </div>
        <p className="ctext">{renderMentions(c.text)}</p>
        {keys.length > 0 && (
          <div className="react-row">
            {keys.map((k) => (
              <button key={k} className={'react-chip' + (reactions[k].mine ? ' mine' : '')} onClick={() => onReact(c.id, k)}>
                <span className="re">{k}</span> {reactions[k].count}
              </button>
            ))}
          </div>
        )}
        <div className="cact">
          <div className="react-wrap" onMouseLeave={() => setPicker(false)}>
            <button className={picker ? 'on' : ''} onClick={() => setPicker((p) => !p)}>
              {I.smile()} React
            </button>
            {picker && (
              <div className="emoji-pop">
                {REACTIONS.map((e) => (
                  <button key={e} type="button" onClick={() => { onReact(c.id, e); setPicker(false); }}>
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
          {depth === 0 && (
            <button onClick={() => setReplying((r) => !r)}>{I.reply()} Reply</button>
          )}
        </div>
        {replying && (
          <div className="reply-box">
            <MentionInput
              autoFocus
              value={draft}
              onChange={setDraft}
              placeholder={'Reply to ' + u.name + '… use @ to mention'}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(); }}
            />
            <div className="rb-row">
              <button className="pill pill-line" onClick={() => { setReplying(false); setDraft(''); }}>Cancel</button>
              <button className="pill pill-blue" onClick={submit} style={{ opacity: draft.trim() ? 1 : 0.5 }}>Reply</button>
            </div>
          </div>
        )}
        {c.replies && c.replies.length > 0 && (
          <div className="reply-thread">
            {c.replies.map((r) => (
              <Comment key={r.id} c={r} onReact={onReact} onReply={onReply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
