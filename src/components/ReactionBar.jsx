import { useState } from 'react';
import { I } from './Icons';

const REACTIONS = ['👍', '🚀', '🔥', '❤️', '🎉', '👀', '🙌', '😄'];

export function ReactionBar({ reactions, onReact }) {
  const [picker, setPicker] = useState(false);
  const r = reactions || {};
  const keys = Object.keys(r).filter((k) => r[k].count > 0);
  return (
    <div className="post-reacts">
      {keys.map((k) => (
        <button key={k} className={'react-chip' + (r[k].mine ? ' mine' : '')} onClick={() => onReact(k)}>
          <span className="re">{k}</span> {r[k].count}
        </button>
      ))}
      <div className="react-wrap" onMouseLeave={() => setPicker(false)}>
        <button className={'react-add' + (picker ? ' on' : '')} onClick={() => setPicker((p) => !p)}>
          {I.smile()} React
        </button>
        {picker && (
          <div className="emoji-pop">
            {REACTIONS.map((e) => (
              <button key={e} type="button" onClick={() => { onReact(e); setPicker(false); }}>
                {e}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
