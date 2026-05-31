import { useState, useEffect, useRef } from 'react';
import { I } from './Icons';

/* ---------- caret pixel position inside a textarea (mirror technique) ---------- */
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

/* ---------- inline markdown helper ---------- */
function inlineMD(s) {
  const parts = [];
  let rest = s;
  let key = 0;
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\))/;
  let m;
  while ((m = rest.match(re))) {
    if (m.index > 0) parts.push(rest.slice(0, m.index));
    if (m[2]) parts.push(<strong key={key++}>{m[2]}</strong>);
    else if (m[3]) parts.push(<em key={key++}>{m[3]}</em>);
    else if (m[4]) parts.push(<a key={key++} href={m[5]}>{m[4]}</a>);
    rest = rest.slice(m.index + m[0].length);
  }
  if (rest) parts.push(rest);
  return parts;
}

/* ---------- embed helpers ---------- */
function parseEmbed(url) {
  let u;
  try { u = new URL(url); } catch (e) { return null; }
  const host = u.hostname.replace(/^www\./, '');
  const path = u.pathname;
  let yt = null;
  if (host === 'youtu.be') yt = path.slice(1);
  else if (host.endsWith('youtube.com')) {
    if (path.startsWith('/watch')) yt = u.searchParams.get('v');
    else if (path.startsWith('/embed/')) yt = path.split('/')[2];
    else if (path.startsWith('/shorts/')) yt = path.split('/')[2];
  }
  if (yt) return { type: 'youtube', id: yt, url };
  if (host === 'github.com') { const seg = path.split('/').filter(Boolean); if (seg[0]) return { type: 'github', owner: seg[0], repo: seg[1], url }; }
  if (host === 'x.com' || host === 'twitter.com') { const seg = path.split('/').filter(Boolean); return { type: 'x', user: seg[0], url }; }
  if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) { const seg = path.split('/').filter(Boolean); return { type: 'tiktok', user: (seg[0] || '').replace('@', ''), url }; }
  if (host === 'wa.me' || host === 'api.whatsapp.com' || host === 'chat.whatsapp.com') return { type: 'whatsapp', target: path.replace('/', '') || u.searchParams.get('phone') || '', url };
  if (host === 't.me' || host === 'telegram.me') return { type: 'telegram', target: '@' + path.replace(/\//g, ''), url };
  if (host === 'discord.gg' || host.endsWith('discord.com')) return { type: 'discord', url };
  if (host.endsWith('instagram.com')) return { type: 'instagram', target: path.replace(/\//g, ' ').trim(), url };
  if (host.endsWith('figma.com')) return { type: 'generic', brand: 'Figma', host, path, url };
  return { type: 'generic', host, path, url };
}

function Embed({ url }) {
  const e = parseEmbed(url);
  if (!e) return <a href={url}>{url}</a>;
  if (e.type === 'youtube') {
    return (
      <div className="embed embed-video">
        <iframe
          src={'https://www.youtube-nocookie.com/embed/' + e.id}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }
  const card = (icon, brand, title, sub, cls) => (
    <a className={'embed embed-card ' + cls} href={url} target="_blank" rel="noopener">
      <span className="emb-ic">{icon}</span>
      <div className="emb-body">
        <span className="emb-brand">{brand}</span>
        <span className="emb-title">{title}</span>
        {sub && <span className="emb-sub">{sub}</span>}
      </div>
      <span className="emb-ext">{I.ext()}</span>
    </a>
  );
  if (e.type === 'github') return card(I.gh(), 'GitHub', e.owner + (e.repo ? ' / ' + e.repo : ''), e.repo ? 'Open-source repository' : 'GitHub profile', 'emb-github');
  if (e.type === 'x') return card(I.x(), 'X', '@' + (e.user || ''), 'View on X', 'emb-x');
  if (e.type === 'tiktok') return card(I.tiktok(), 'TikTok', e.user ? '@' + e.user : 'Open', 'Watch on TikTok', 'emb-tt');
  if (e.type === 'whatsapp') return card(I.whatsapp(), 'WhatsApp', e.target ? 'Chat ' + e.target : 'Open chat', 'Tap to message on WhatsApp', 'emb-wa');
  if (e.type === 'telegram') return card(I.telegram(), 'Telegram', e.target || 'Open', 'Open in Telegram', 'emb-tg');
  if (e.type === 'discord') return card(I.discord(), 'Discord', 'Join the server', 'Open invite in Discord', 'emb-dc');
  if (e.type === 'instagram') return card(I.instagram(), 'Instagram', e.target || 'Open', 'View on Instagram', 'emb-ig');
  return card(I.globe(), e.brand || e.host, e.path && e.path !== '/' ? decodeURIComponent(e.path.replace(/^\//, '')) : e.host, e.host, 'emb-generic');
}

const URL_RE = /^(https?:\/\/[^\s]+)$/;
const IMG_RE = /^!\[([^\]]*)\]\(([^)]+)\)$/;

/* ---------- rich renderer: markdown + bare-URL lines become embeds ---------- */
export function renderRich(text) {
  const blocks = String(text).split(/\n{2,}/);
  return blocks.map((b, i) => {
    const t = b.trim();
    if (!t) return null;
    const img = t.match(IMG_RE);
    if (img) return <img key={i} className="post-img" src={img[2]} alt={img[1] || ''} />;
    if (t === '---' || t === '***') return <hr key={i} className="post-hr" />;
    if (t.startsWith('```')) {
      const code = t.replace(/^```[^\n]*\n?/, '').replace(/```$/, '');
      return <pre key={i} className="post-code"><code>{code}</code></pre>;
    }
    if (t.startsWith('|') && t.includes('\n')) {
      const rows = t.split('\n').filter((r) => r.trim());
      const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(rows[0]);
      const bodyRows = rows.slice(rows[1] && /^[\s|:-]+$/.test(rows[1]) ? 2 : 1);
      return (
        <div key={i} className="post-table-wrap">
          <table className="post-table">
            <thead><tr>{head.map((h, j) => <th key={j}>{inlineMD(h)}</th>)}</tr></thead>
            <tbody>{bodyRows.map((r, j) => <tr key={j}>{cells(r).map((c, k) => <td key={k}>{inlineMD(c)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    }
    if (URL_RE.test(t)) return <Embed key={i} url={t} />;
    if (t.startsWith('# ')) return <h2 key={i} className="prose-h1">{inlineMD(t.slice(2))}</h2>;
    if (t.startsWith('## ')) return <h3 key={i}>{inlineMD(t.slice(3))}</h3>;
    if (t.startsWith('### ')) return <h4 key={i} className="prose-h3">{inlineMD(t.slice(4))}</h4>;
    if (t.startsWith('> ')) return <blockquote key={i} className="prose-quote">{inlineMD(t.slice(2))}</blockquote>;
    if (/^\s*(-|\d+\.)\s/.test(t)) {
      const ordered = /^\s*\d+\.\s/.test(t);
      const items = t.split('\n').filter((l) => l.trim()).map((l) => l.replace(/^\s*(-|\d+\.)\s/, ''));
      const lis = items.map((it, j) => <li key={j}>{inlineMD(it)}</li>);
      return ordered ? <ol key={i}>{lis}</ol> : <ul key={i}>{lis}</ul>;
    }
    return <p key={i}>{inlineMD(t)}</p>;
  });
}

/* ---------- render simple markdown to elements ---------- */
export function renderMD(text) {
  const blocks = text.split(/\n{2,}/);
  return blocks.map((b, i) => {
    if (b.startsWith('## ')) return <h3 key={i}>{inlineMD(b.slice(3))}</h3>;
    if (/^\s*-\s/.test(b)) {
      const items = b.split('\n').filter((l) => l.trim()).map((l) => l.replace(/^\s*-\s/, ''));
      return <ul key={i}>{items.map((it, j) => <li key={j}>{inlineMD(it)}</li>)}</ul>;
    }
    return <p key={i}>{inlineMD(b)}</p>;
  });
}

/* ---------- slash command menu data ---------- */
const SLASH_GROUPS = [
  { group: 'Headings', items: [
    { key: 'h1', label: 'Heading 1', desc: 'Big section title', ic: () => <b className="si-h">H1</b>, kind: 'line', val: '# ' },
    { key: 'h2', label: 'Heading 2', desc: 'Medium heading', ic: () => <b className="si-h">H2</b>, kind: 'line', val: '## ' },
    { key: 'h3', label: 'Heading 3', desc: 'Small heading', ic: () => <b className="si-h">H3</b>, kind: 'line', val: '### ' },
  ]},
  { group: 'Basics', items: [
    { key: 'bullet', label: 'Bulleted list', desc: 'A simple bullet list', ic: I.list, kind: 'line', val: '- ' },
    { key: 'numbered', label: 'Numbered list', desc: 'An ordered list', ic: I.numbered, kind: 'line', val: '1. ' },
    { key: 'quote', label: 'Quote', desc: 'Capture a quotation', ic: I.quote, kind: 'line', val: '> ' },
    { key: 'image', label: 'Image', desc: 'Upload from your device', ic: I.img, kind: 'upload' },
    { key: 'code', label: 'Code block', desc: 'Monospaced code', ic: I.code, kind: 'block', val: '```\ncode here\n```' },
    { key: 'divider', label: 'Divider', desc: 'Visual separator', ic: I.hr, kind: 'block', val: '---' },
    { key: 'table', label: 'Table', desc: 'Rows and columns', ic: I.table, kind: 'block', val: '| Column | Column |\n| --- | --- |\n| Cell | Cell |' },
  ]},
  { group: 'Embeds', items: [
    { key: 'embed', label: 'Embed link', desc: 'Any URL as a rich card', ic: I.link2, kind: 'embed', ph: 'Paste any link' },
    { key: 'youtube', label: 'YouTube', desc: 'Embed a video', ic: I.youtube, kind: 'embed', ph: 'YouTube URL' },
    { key: 'twitter', label: 'X / Twitter', desc: 'Embed a post', ic: I.x, kind: 'embed', ph: 'x.com link' },
    { key: 'instagram', label: 'Instagram', desc: 'Embed a post', ic: I.instagram, kind: 'embed', ph: 'instagram.com link' },
    { key: 'tiktok', label: 'TikTok', desc: 'Embed a video', ic: I.tiktok, kind: 'embed', ph: 'tiktok.com link' },
    { key: 'github', label: 'GitHub', desc: 'Repo or profile', ic: I.gh, kind: 'embed', ph: 'github.com link' },
    { key: 'telegram', label: 'Telegram', desc: 'Channel or chat', ic: I.telegram, kind: 'embed', ph: 't.me link' },
    { key: 'whatsapp', label: 'WhatsApp', desc: 'Chat link', ic: I.whatsapp, kind: 'embed', ph: 'wa.me link' },
  ]},
];

const SLASH_FLAT = SLASH_GROUPS.flatMap((g) => g.items.map((it) => ({ ...it, group: g.group })));

/* ---------- markdown editor with slash menu, toolbar, image upload ---------- */
export function MarkdownEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);
  const fileRef = useRef(null);
  const [slash, setSlash] = useState(null);
  const [active, setActive] = useState(0);
  const pendingPos = useRef(null);

  const setVal = (next, caret) => {
    onChange(next);
    if (caret != null) requestAnimationFrame(() => {
      const el = ref.current;
      if (el) { el.focus(); el.selectionStart = el.selectionEnd = caret; }
    });
  };

  const wrap = (pre, post = pre) => {
    const el = ref.current;
    if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd;
    const sel = value.slice(s, e) || 'text';
    setVal(value.slice(0, s) + pre + sel + post + value.slice(e), null);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = s + pre.length;
      el.selectionEnd = s + pre.length + sel.length;
    });
  };

  const line = (pre) => {
    const el = ref.current;
    if (!el) return;
    const s = el.selectionStart;
    const ls = value.lastIndexOf('\n', s - 1) + 1;
    setVal(value.slice(0, ls) + pre + value.slice(ls), s + pre.length);
  };

  const block = (txt) => {
    const cur = value.replace(/\s+$/, '');
    const next = (cur ? cur + '\n\n' : '') + txt + '\n\n';
    setVal(next, next.length);
  };

  const handleChange = (e) => {
    const el = e.target;
    const val = el.value;
    onChange(val);
    const caret = el.selectionStart;
    const before = val.slice(0, caret);
    const m = before.match(/(?:^|\s)\/([\w]*)$/);
    if (m) {
      const start = caret - m[1].length - 1;
      const { x, y, lh } = caretXY(el, start);
      setSlash({ start, query: m[1], x, y: y + lh - el.scrollTop });
      setActive(0);
    } else {
      setSlash(null);
    }
  };

  const filtered = slash
    ? SLASH_FLAT.filter((it) => (it.label + ' ' + it.group).toLowerCase().includes(slash.query.toLowerCase()))
    : [];
  useEffect(() => { if (active >= filtered.length) setActive(0); }, [slash, filtered.length]);

  const runItem = (it) => {
    const el = ref.current;
    const caret = el ? el.selectionStart : value.length;
    const head = value.slice(0, slash.start);
    const tail = value.slice(caret);
    if (it.kind === 'line') {
      const next = head + it.val + tail;
      setVal(next, (head + it.val).length);
      setSlash(null);
    } else if (it.kind === 'block') {
      const sep1 = head && !head.endsWith('\n\n') ? (head.endsWith('\n') ? '\n' : '\n\n') : '';
      const ins = sep1 + it.val + '\n\n';
      const next = head + ins + tail;
      setVal(next, (head + ins).length);
      setSlash(null);
    } else if (it.kind === 'upload') {
      const next = head + tail;
      setVal(next, head.length);
      pendingPos.current = head.length;
      setSlash(null);
      fileRef.current && fileRef.current.click();
    } else if (it.kind === 'embed') {
      const url = window.prompt(it.ph + ':');
      const next0 = head + tail;
      if (url && url.trim()) {
        const sep1 = head && !head.endsWith('\n\n') ? (head.endsWith('\n') ? '\n' : '\n\n') : '';
        const ins = sep1 + url.trim() + '\n\n';
        const next = head + ins + tail;
        setVal(next, (head + ins).length);
      } else {
        setVal(next0, head.length);
      }
      setSlash(null);
    }
  };

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const pos = pendingPos.current != null ? pendingPos.current : ref.current ? ref.current.selectionStart : value.length;
    const head = value.slice(0, pos);
    const tail = value.slice(pos);
    const sep = head && !head.endsWith('\n\n') ? (head.endsWith('\n') ? '\n' : '\n\n') : '';
    const ins = sep + '![image](' + url + ')\n\n';
    setVal(head + ins + tail, (head + ins).length);
    e.target.value = '';
    pendingPos.current = null;
  };

  const onKeyDown = (e) => {
    if (!slash || filtered.length === 0) {
      if (e.key === 'Escape') setSlash(null);
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % filtered.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + filtered.length) % filtered.length); }
    else if (e.key === 'Enter') { e.preventDefault(); runItem(filtered[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); setSlash(null); }
  };

  const onPaste = (ev) => {
    const cd = ev.clipboardData || window.clipboardData;
    const item = [...(cd.items || [])].find((i) => i.type && i.type.startsWith('image/'));
    if (item) {
      const f = item.getAsFile();
      if (f) {
        ev.preventDefault();
        pendingPos.current = ref.current ? ref.current.selectionStart : value.length;
        onFile({ target: { files: [f], value: '' } });
        return;
      }
    }
    const txt = cd.getData('text');
    if (txt && URL_RE.test(txt.trim())) { ev.preventDefault(); block(txt.trim()); }
  };

  const onDrop = (ev) => {
    const f = ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) {
      ev.preventDefault();
      pendingPos.current = value.length;
      onFile({ target: { files: [f], value: '' } });
    }
  };

  const groups = [];
  filtered.forEach((it) => {
    let g = groups.find((x) => x.group === it.group);
    if (!g) { g = { group: it.group, items: [] }; groups.push(g); }
    g.items.push(it);
  });
  let runningIdx = -1;

  return (
    <div className="md">
      <div className="md-toolbar">
        <button type="button" onClick={() => line('# ')} title="Big heading">
          <span style={{ fontWeight: 800, fontSize: 16 }}>H1</span>
        </button>
        <button type="button" onClick={() => line('## ')} title="Heading">
          <span style={{ fontWeight: 700, fontSize: 13 }}>H2</span>
        </button>
        <button type="button" onClick={() => wrap('**')} title="Bold">{I.bold()}</button>
        <button type="button" onClick={() => wrap('*')} title="Italic">{I.ital()}</button>
        <button type="button" onClick={() => line('> ')} title="Quote">{I.quote({ width: 15, height: 15 })}</button>
        <button type="button" onClick={() => line('- ')} title="List">{I.list()}</button>
        <button type="button" onClick={() => { pendingPos.current = ref.current ? ref.current.selectionStart : value.length; fileRef.current && fileRef.current.click(); }} title="Upload image">
          {I.img({ width: 15, height: 15 })}
        </button>
        <button type="button" onClick={() => wrap('[', '](url)')} title="Inline link">{I.link()}</button>
        <span className="md-hint">Type <kbd>/</kbd> for commands</span>
      </div>
      <div className="md-area">
        <textarea
          ref={ref}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onDrop={onDrop}
          placeholder={placeholder || 'Write something, or press / for commands'}
        />
        {slash && filtered.length > 0 && (
          <div className="slash-menu" style={(() => {
            const taH = ref.current ? ref.current.clientHeight : 380;
            const menuH = 300;
            const below = slash.y + 8;
            const top = (below + menuH <= taH) ? below : Math.max(4, slash.y - menuH - 6);
            return { left: Math.min(Math.max(8, slash.x), 360), top };
          })()}>
            {groups.map((g) => (
              <div key={g.group} className="slash-group">
                <div className="slash-head">{g.group}</div>
                {g.items.map((it) => {
                  runningIdx++;
                  const idx = runningIdx;
                  return (
                    <button
                      type="button"
                      key={it.key}
                      className={'slash-item' + (idx === active ? ' on' : '')}
                      onMouseEnter={() => setActive(idx)}
                      onMouseDown={(e) => { e.preventDefault(); runItem(it); }}
                    >
                      <span className="si-ic">{it.ic()}</span>
                      <span className="si-txt">
                        <span className="si-label">{it.label}</span>
                        <span className="si-desc">{it.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
    </div>
  );
}
