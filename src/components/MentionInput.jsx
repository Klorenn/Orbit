import { useState, useEffect, useRef } from 'react';
import { AMBASSADORS } from '../data/constants';
import { AmbassadorAvatar } from './AmbassadorAvatar';

function caretXY(ta, pos) {
  const div = document.createElement('div');
  const cs = getComputedStyle(ta);
  ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textTransform',
   'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
   'borderTopWidth', 'borderLeftWidth', 'boxSizing'].forEach((p) => { div.style[p] = cs[p]; });
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordWrap = 'break-word';
  div.style.width = ta.clientWidth + 'px';
  div.style.top = '0';
  div.style.left = '-9999px';
  div.textContent = ta.value.slice(0, pos);
  const span = document.createElement('span');
  span.textContent = '​';
  div.appendChild(span);
  document.body.appendChild(div);
  const x = span.offsetLeft;
  const y = span.offsetTop;
  const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4;
  document.body.removeChild(div);
  return { x, y, lh };
}

export function MentionInput({ value, onChange, placeholder, onKeyDown, autoFocus }) {
  const ref = useRef(null);
  const [men, setMen] = useState(null);
  const [active, setActive] = useState(0);
  const people = Object.values(AMBASSADORS).filter((u) => u.name !== 'you.fil' && u.role !== 'Core');
  const filtered = men
    ? people.filter((u) => u.name.toLowerCase().includes(men.query.toLowerCase())).slice(0, 6)
    : [];
  useEffect(() => { if (active >= filtered.length) setActive(0); }, [men, filtered.length]);

  const handle = (e) => {
    const el = e.target;
    onChange(el.value);
    const before = el.value.slice(0, el.selectionStart);
    const m = before.match(/(?:^|\s)@([\w.]*)$/);
    if (m) {
      const start = el.selectionStart - m[1].length - 1;
      const { x, y, lh } = caretXY(el, start);
      setMen({ start, query: m[1], x, y: y + lh - el.scrollTop });
    } else {
      setMen(null);
    }
  };

  const pick = (u) => {
    const el = ref.current;
    const caret = el.selectionStart;
    const head = value.slice(0, men.start);
    const tail = value.slice(caret);
    const ins = '@' + u.name + ' ';
    const next = head + ins + tail;
    onChange(next);
    setMen(null);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = (head + ins).length;
    });
  };

  const key = (e) => {
    if (men && filtered.length) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % filtered.length); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + filtered.length) % filtered.length); return; }
      if (e.key === 'Enter') { e.preventDefault(); pick(filtered[active]); return; }
      if (e.key === 'Escape') { setMen(null); return; }
    }
    if (onKeyDown) onKeyDown(e);
  };

  return (
    <div className="mention-wrap">
      <textarea ref={ref} value={value} onChange={handle} onKeyDown={key} placeholder={placeholder} autoFocus={autoFocus} />
      {men && filtered.length > 0 && (
        <div className="mention-menu" style={{ left: Math.min(Math.max(8, men.x), 280), top: men.y + 6 }}>
          {filtered.map((u, i) => (
            <button
              type="button"
              key={u.name}
              className={'mention-item' + (i === active ? ' on' : '')}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => { e.preventDefault(); pick(u); }}
            >
              <AmbassadorAvatar user={u.name} size={28} link={false} />
              <span className="mm-txt">
                <span className="mm-name">{u.name}</span>
                <span className="mm-city">{u.city}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
