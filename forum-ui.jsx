/* ============================================================
   ORBIT FORUM — shared UI components (exported to window)
   ============================================================ */
const { useState, useEffect, useRef } = React;
const { AV, COLORHEX, CATEGORIES, catOf, ME, AMBASSADORS, PROP_STATUS } = window.ORBIT;

/* ---------- icons ---------- */
const I = {
  up: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 19V5M5 12l7-7 7 7" /></svg>,
  cmt: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" /></svg>,
  search: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>,
  close: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>,
  back: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>,
  plus: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14" /></svg>,
  doc: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>,
  heart: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>,
  reply: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 17l-6-6 6-6" /><path d="M3 11h12a6 6 0 0 1 6 6v0" /></svg>,
  check: (p) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5" /></svg>,
  shield: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2 4 5v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V5z" /></svg>,
  cal: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4.5" width="18" height="17" rx="3" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></svg>,
  gov: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 21h16M5 21V10M19 21V10M3 10l9-6 9 6M9 21v-6h6v6" /></svg>,
  pin: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>,
  bold: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 4h7a4 4 0 0 1 0 8H6zM6 12h8a4 4 0 0 1 0 8H6z" /></svg>,
  ital: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 4h-9M14 20H5M15 4 9 20" /></svg>,
  link: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" /></svg>,
  list: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>,
  bell: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" /></svg>,
  edit: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" /></svg>,
  flag: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" /></svg>,
  ban: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9" /><path d="M5.6 5.6l12.8 12.8" /></svg>,
  grid: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  globe: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" /></svg>,
  gh: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0024 12.5C24 5.87 18.63.5 12 .5z" /></svg>,
  x: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  discord: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M20.317 4.369A19.79 19.79 0 0015.885 3c-.2.358-.43.84-.59 1.222a18.27 18.27 0 00-5.487 0A12.6 12.6 0 009.21 3a19.74 19.74 0 00-4.43 1.369C1.99 8.59 1.225 12.7 1.6 16.75a19.94 19.94 0 006.073 3.07c.49-.668.927-1.377 1.302-2.122a12.9 12.9 0 01-2.05-.984c.172-.126.34-.258.502-.394 3.95 1.84 8.22 1.84 12.122 0 .164.14.332.272.502.394-.654.388-1.345.72-2.052.984.375.745.81 1.453 1.3 2.122a19.9 19.9 0 006.075-3.07c.44-4.69-.752-8.766-3.158-12.381zM8.02 14.331c-1.183 0-2.157-1.085-2.157-2.42 0-1.334.955-2.42 2.157-2.42 1.21 0 2.176 1.095 2.157 2.42 0 1.335-.955 2.42-2.157 2.42zm7.96 0c-1.183 0-2.157-1.085-2.157-2.42 0-1.334.955-2.42 2.157-2.42 1.21 0 2.176 1.095 2.157 2.42 0 1.335-.946 2.42-2.157 2.42z" /></svg>,
  slack: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M5.04 15.17a2.53 2.53 0 1 1-2.52-2.53h2.52zm1.27 0a2.53 2.53 0 0 1 5.06 0v6.3a2.53 2.53 0 0 1-5.06 0zM8.84 5.04a2.53 2.53 0 1 1 2.52-2.52v2.52zm0 1.27a2.53 2.53 0 0 1 0 5.06h-6.3a2.53 2.53 0 0 1 0-5.06zM18.96 8.84a2.53 2.53 0 1 1 2.52 2.52h-2.52zm-1.27 0a2.53 2.53 0 0 1-5.06 0v-6.3a2.53 2.53 0 0 1 5.06 0zM15.17 18.96a2.53 2.53 0 1 1-2.53 2.52v-2.52zm0-1.27a2.53 2.53 0 0 1 0-5.06h6.3a2.53 2.53 0 0 1 0 5.06z" /></svg>,
  telegram: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M21.94 4.3 18.6 20.05c-.25 1.1-.9 1.38-1.83.86l-5.05-3.72-2.44 2.35c-.27.27-.5.5-1 .5l.36-5.13L18.97 5.7c.4-.36-.09-.56-.62-.2L6.5 13.18l-5.06-1.58c-1.1-.34-1.12-1.1.23-1.63L20.52 2.7c.92-.34 1.72.22 1.42 1.6z" /></svg>,
  youtube: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z" /></svg>,
  whatsapp: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M.06 24l1.7-6.2A11.9 11.9 0 0 1 .14 11.9C.14 5.34 5.48 0 12.05 0a11.8 11.8 0 0 1 8.4 3.5 11.8 11.8 0 0 1 3.48 8.4c0 6.57-5.34 11.9-11.9 11.9a12 12 0 0 1-5.7-1.45zm6.6-3.8c1.68.99 3.28 1.58 5.39 1.58 5.46 0 9.9-4.44 9.9-9.9a9.8 9.8 0 0 0-2.9-7 9.8 9.8 0 0 0-7-2.9c-5.46 0-9.9 4.44-9.9 9.9 0 2.22.65 3.88 1.74 5.62l-1 3.66zM17.5 14.3c-.07-.12-.27-.2-.57-.35s-1.76-.87-2.03-.97-.47-.15-.67.15-.77.96-.94 1.16-.35.22-.64.07a8.1 8.1 0 0 1-2.4-1.48 9 9 0 0 1-1.65-2.06c-.17-.3 0-.45.13-.6.13-.13.3-.35.44-.52s.2-.3.3-.5.05-.37-.03-.52-.67-1.6-.92-2.2c-.24-.58-.49-.5-.67-.5l-.57-.02a1.1 1.1 0 0 0-.8.37c-.27.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1 2.1 3.2 5.08 4.5c.7.3 1.26.48 1.7.62.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42s.25-1.27.18-1.4z" /></svg>,
  instagram: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" /></svg>,
  link2: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" /></svg>,
  play: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7z" /></svg>,
  ext: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg>,
  img: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="18" height="18" rx="2.5" /><circle cx="8.5" cy="8.5" r="1.8" /><path d="M21 15l-5-5L5 21" /></svg>,
  code: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>,
  hr: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12h18" /></svg>,
  quote: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M7 7H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h3v3a3 3 0 0 1-3 3 1 1 0 1 0 0 2 5 5 0 0 0 5-5V8a1 1 0 0 0-1-1zm12 0h-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h3v3a3 3 0 0 1-3 3 1 1 0 1 0 0 2 5 5 0 0 0 5-5V8a1 1 0 0 0-1-1z" /></svg>,
  numbered: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 16.5A1.5 1.5 0 1 0 4.5 18H6v.5" /></svg>,
  tiktok: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.2v12.8a2.6 2.6 0 1 1-2.6-2.6c.27 0 .53.04.78.12v-3.3a5.9 5.9 0 0 0-.78-.05A5.84 5.84 0 1 0 15.4 15.8V9.4a7.5 7.5 0 0 0 4.4 1.42V7.6a4.28 4.28 0 0 1-3.2-1.78z" /></svg>,
  table: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /></svg>,
  smile: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01M15 9h.01" /></svg>
};

/* social link icon by key */
function socialIcon(key, props) {
  return ({ github: I.gh, x: I.x, instagram: I.instagram, discord: I.discord, slack: I.slack, telegram: I.telegram, website: I.globe }[key] || I.globe)(props);
}
function socialURL(key, val) {
  if (!val) return null;
  const p = { github: 'https://github.com/', x: 'https://x.com/', instagram: 'https://instagram.com/', telegram: 'https://t.me/', website: val.startsWith('http') ? '' : 'https://' }[key];
  if (p === undefined) return null; // discord/slack = handle, not link
  return p + val.replace(/^@/, '');
}
function SocialLinks({ socials, size = 'md' }) {
  if (!socials) return null;
  const items = O_SOCIALS().filter((s) => socials[s.key]);
  if (items.length === 0) return null;
  return (
    <div className={'socials-row ' + size} style={{ backgroundColor: "rgba(255, 255, 255, 0.76)" }}>
      {items.map((s) => {
        const val = socials[s.key];
        const url = socialURL(s.key, val);
        const handle = s.key === 'website' ? val : (s.prefix ? '@' : '') + val;
        const inner = <><span className={'sc-ic sc-' + s.key}>{socialIcon(s.key)}</span><span className="sl-val" style={{ color: "rgb(0, 0, 0)" }}>{handle}</span></>;
        return url ?
        <a key={s.key} className="social-chip" href={url} target="_blank" rel="noopener" title={s.label}>{inner}</a> :
        <span key={s.key} className="social-chip" title={s.label}>{inner}</span>;
      })}
    </div>);

}
function O_SOCIALS() {return window.ORBIT && window.ORBIT.SOCIALS || [];}

const who = (key) => AMBASSADORS[key] || { name: key, color: 'blue', city: '', role: '' };
const navTo = (hash) => {window.location.hash = hash;};

/* ---------- starfield ---------- */
function Stars({ n = 14 }) {
  const pts = [[30, 30], [90, 60], [150, 25], [220, 50], [270, 35], [60, 120], [130, 150], [200, 130], [260, 160], [40, 170], [110, 90], [180, 75], [240, 110], [290, 140]];
  return (
    <svg className="pc-stars" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {pts.slice(0, n).map((s, i) => <circle key={i} cx={s[0]} cy={s[1]} r={i % 3 === 0 ? 1.4 : 0.9} fill="#fff" opacity={0.45 + i % 3 * 0.16} />)}
    </svg>);

}

/* ---------- vote ---------- */
function Vote({ count, voted, onToggle, row }) {
  return (
    <div className="vote" style={row ? { flexDirection: 'row', gap: 8 } : null}>
      <button className={voted ? 'voted' : ''} onClick={(e) => {e.stopPropagation();e.preventDefault();onToggle();}} aria-label="Upvote"><I.up /></button>
      <span className="n">{count}</span>
    </div>);

}

/* ---------- category badge ---------- */
function CategoryBadge({ cat, soft }) {
  const c = catOf(cat);
  return <span className={'tag ' + (soft ? 'soft' : '')}><span className="dot" style={{ background: c.color }}></span>{c.name}</span>;
}

/* ---------- ambassador avatar ---------- */
function AmbassadorAvatar({ user, size = 26, nft = false, link = true }) {
  const u = typeof user === 'string' ? who(user) : user;
  const img = <img className="av" src={AV[u.color]} alt="" style={{ width: size, height: size, borderRadius: '50%' }} />;
  const node = nft ?
  <span style={{ position: 'relative', display: 'inline-block', lineHeight: 0 }}>{img}
        <span style={{ position: 'absolute', right: -2, bottom: -2, width: size * 0.46, height: size * 0.46, borderRadius: '50%', background: '#10B981', color: '#fff', display: 'grid', placeItems: 'center', border: '2px solid #fff' }}><I.check width={size * 0.26} height={size * 0.26} /></span>
      </span> :
  img;
  if (!link) return node;
  return <a href={'#/profile/' + u.name} onClick={(e) => e.stopPropagation()} style={{ lineHeight: 0 }}>{node}</a>;
}

/* ---------- post card ---------- */
function PostCard({ post, onVote }) {
  const u = who(post.author);
  return (
    <a className="post" href={'#/forum/' + post.cat + '/' + post.id}>
      <Vote count={post.upvotes} voted={post.upvoted} onToggle={() => onVote(post.id)} />
      <div className="post-main">
        <div className="post-tags">
          <span className="tag type">{post.type}</span>
          <CategoryBadge cat={post.cat} soft />
          <span className="cid" title="Pinned to IPFS / Filecoin">◈ {post.cidStr}</span>
        </div>
        <h3 className="pt">{post.title}</h3>
        <p className="excerpt">{post.excerpt}</p>
        <div className="post-meta">
          <span className="who">
            <AmbassadorAvatar user={post.author} link={false} />
            <span className="nm">{u.name}</span>
          </span>
          {u.role && <span className="role">{u.role}</span>}
          <span className="dotsep"></span>
          <span>{u.city}</span>
          <span className="dotsep"></span>
          <span>{post.time} ago</span>
          <span className="dotsep"></span>
          <span className="cmtcount">{I.cmt()} {post.comments.length}</span>
        </div>
      </div>
    </a>);

}

/* ---------- comment with emoji reactions + nested replies ---------- */
const REACTIONS = ['👍', '🚀', '🔥', '❤️', '🎉', '👀', '🙌', '😄'];
function Comment({ c, onReact, onReply, depth = 0 }) {
  const u = who(c.author);
  const [picker, setPicker] = useState(false);
  const [replying, setReplying] = useState(false);
  const [draft, setDraft] = useState('');
  const reactions = c.reactions || {};
  const keys = Object.keys(reactions).filter((k) => reactions[k].count > 0);
  const submit = () => {if (draft.trim()) {onReply(c.id, draft.trim());setDraft('');setReplying(false);}};
  return (
    <div className={'cmt' + (depth ? ' cmt-reply' : '')}>
      <AmbassadorAvatar user={c.author} size={depth ? 30 : 38} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="ch"><span className="nm">{u.name}</span>{u.role && <span className="role">{u.role}</span>}<span className="tm">· {c.time} ago</span></div>
        <p className="ctext">{renderMentions(c.text)}</p>
        {keys.length > 0 &&
        <div className="react-row">
            {keys.map((k) => <button key={k} className={'react-chip' + (reactions[k].mine ? ' mine' : '')} onClick={() => onReact(c.id, k)}><span className="re">{k}</span> {reactions[k].count}</button>)}
          </div>
        }
        <div className="cact">
          <div className="react-wrap" onMouseLeave={() => setPicker(false)}>
            <button className={picker ? 'on' : ''} onClick={() => setPicker((p) => !p)}>{I.smile()} React</button>
            {picker && <div className="emoji-pop">{REACTIONS.map((e) => <button key={e} type="button" onClick={() => {onReact(c.id, e);setPicker(false);}}>{e}</button>)}</div>}
          </div>
          {depth === 0 && <button onClick={() => setReplying((r) => !r)}>{I.reply()} Reply</button>}
        </div>
        {replying &&
        <div className="reply-box">
            <MentionInput autoFocus value={draft} onChange={setDraft} placeholder={'Reply to ' + u.name + '… use @ to mention'}
          onKeyDown={(e) => {if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();}} />
            <div className="rb-row">
              <button className="pill pill-line" onClick={() => {setReplying(false);setDraft('');}}>Cancel</button>
              <button className="pill pill-blue" onClick={submit} style={{ opacity: draft.trim() ? 1 : .5 }}>Reply</button>
            </div>
          </div>
        }
        {c.replies && c.replies.length > 0 &&
        <div className="reply-thread">
            {c.replies.map((r) => <Comment key={r.id} c={r} onReact={onReact} onReply={onReply} depth={depth + 1} />)}
          </div>
        }
      </div>
    </div>);

}

/* ---------- reusable reaction bar (used on posts) ---------- */
function ReactionBar({ reactions, onReact }) {
  const [picker, setPicker] = useState(false);
  const r = reactions || {};
  const keys = Object.keys(r).filter((k) => r[k].count > 0);
  return (
    <div className="post-reacts">
      {keys.map((k) => <button key={k} className={'react-chip' + (r[k].mine ? ' mine' : '')} onClick={() => onReact(k)}><span className="re">{k}</span> {r[k].count}</button>)}
      <div className="react-wrap" onMouseLeave={() => setPicker(false)}>
        <button className={'react-add' + (picker ? ' on' : '')} onClick={() => setPicker((p) => !p)}>{I.smile()} React</button>
        {picker && <div className="emoji-pop">{REACTIONS.map((e) => <button key={e} type="button" onClick={() => {onReact(e);setPicker(false);}}>{e}</button>)}</div>}
      </div>
    </div>);

}

/* ---------- render @mentions as profile links ---------- */
function renderMentions(text) {
  const parts = String(text).split(/(@[a-z0-9_.]+)/gi);
  return parts.map((p, i) => {
    if (/^@[a-z0-9_.]+$/i.test(p)) {
      const raw = p.slice(1);
      const u = AMBASSADORS[raw] || AMBASSADORS[raw + '.fil'];
      if (u) return <a key={i} className="mention" href={'#/profile/' + u.name}>@{u.name}</a>;
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

/* ---------- textarea with @mention autocomplete ---------- */
function MentionInput({ value, onChange, placeholder, onKeyDown, autoFocus }) {
  const ref = useRef(null);
  const [men, setMen] = useState(null);
  const [active, setActive] = useState(0);
  const people = Object.values(AMBASSADORS).filter((u) => u.name !== 'you.fil' && u.role !== 'Core');
  const filtered = men ? people.filter((u) => u.name.toLowerCase().includes(men.query.toLowerCase())).slice(0, 6) : [];
  useEffect(() => {if (active >= filtered.length) setActive(0);}, [men, filtered.length]);
  const handle = (e) => {
    const el = e.target;onChange(el.value);
    const before = el.value.slice(0, el.selectionStart);
    const m = before.match(/(?:^|\s)@([\w.]*)$/);
    if (m) {const start = el.selectionStart - m[1].length - 1;const { x, y, lh } = caretXY(el, start);setMen({ start, query: m[1], x, y: y + lh - el.scrollTop });} else
    setMen(null);
  };
  const pick = (u) => {
    const el = ref.current;const caret = el.selectionStart;
    const head = value.slice(0, men.start),tail = value.slice(caret);
    const ins = '@' + u.name + ' ';const next = head + ins + tail;
    onChange(next);setMen(null);
    requestAnimationFrame(() => {el.focus();el.selectionStart = el.selectionEnd = (head + ins).length;});
  };
  const key = (e) => {
    if (men && filtered.length) {
      if (e.key === 'ArrowDown') {e.preventDefault();setActive((a) => (a + 1) % filtered.length);return;}
      if (e.key === 'ArrowUp') {e.preventDefault();setActive((a) => (a - 1 + filtered.length) % filtered.length);return;}
      if (e.key === 'Enter') {e.preventDefault();pick(filtered[active]);return;}
      if (e.key === 'Escape') {setMen(null);return;}
    }
    if (onKeyDown) onKeyDown(e);
  };
  return (
    <div className="mention-wrap">
      <textarea ref={ref} value={value} onChange={handle} onKeyDown={key} placeholder={placeholder} autoFocus={autoFocus} />
      {men && filtered.length > 0 &&
      <div className="mention-menu" style={{ left: Math.min(Math.max(8, men.x), 280), top: men.y + 6 }}>
          {filtered.map((u, i) =>
        <button type="button" key={u.name} className={'mention-item' + (i === active ? ' on' : '')}
        onMouseEnter={() => setActive(i)} onMouseDown={(e) => {e.preventDefault();pick(u);}}>
              <AmbassadorAvatar user={u.name} size={28} link={false} />
              <span className="mm-txt"><span className="mm-name">{u.name}</span><span className="mm-city">{u.city}</span></span>
            </button>
        )}
        </div>
      }
    </div>);

}

/* ---------- caret pixel position inside a textarea (mirror technique) ---------- */
function caretXY(ta, pos) {
  const div = document.createElement('div');
  const cs = getComputedStyle(ta);
  ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textTransform', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderLeftWidth', 'boxSizing'].forEach((p) => {div.style[p] = cs[p];});
  div.style.position = 'absolute';div.style.visibility = 'hidden';div.style.whiteSpace = 'pre-wrap';div.style.wordWrap = 'break-word';
  div.style.width = ta.clientWidth + 'px';div.style.top = '0';div.style.left = '-9999px';
  div.textContent = ta.value.slice(0, pos);
  const span = document.createElement('span');span.textContent = '\u200b';div.appendChild(span);
  document.body.appendChild(div);
  const x = span.offsetLeft,y = span.offsetTop,lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4;
  document.body.removeChild(div);
  return { x, y, lh };
}

/* ---------- beehiiv-style "/" command menu ---------- */
const SLASH_GROUPS = [
{ group: 'Headings', items: [
  { key: 'h1', label: 'Heading 1', desc: 'Big section title', ic: () => <b className="si-h">H1</b>, kind: 'line', val: '# ' },
  { key: 'h2', label: 'Heading 2', desc: 'Medium heading', ic: () => <b className="si-h">H2</b>, kind: 'line', val: '## ' },
  { key: 'h3', label: 'Heading 3', desc: 'Small heading', ic: () => <b className="si-h">H3</b>, kind: 'line', val: '### ' }]
},
{ group: 'Basics', items: [
  { key: 'bullet', label: 'Bulleted list', desc: 'A simple bullet list', ic: I.list, kind: 'line', val: '- ' },
  { key: 'numbered', label: 'Numbered list', desc: 'An ordered list', ic: I.numbered, kind: 'line', val: '1. ' },
  { key: 'quote', label: 'Quote', desc: 'Capture a quotation', ic: I.quote, kind: 'line', val: '> ' },
  { key: 'image', label: 'Image', desc: 'Upload from your device', ic: I.img, kind: 'upload' },
  { key: 'code', label: 'Code block', desc: 'Monospaced code', ic: I.code, kind: 'block', val: '```\ncode here\n```' },
  { key: 'divider', label: 'Divider', desc: 'Visual separator', ic: I.hr, kind: 'block', val: '---' },
  { key: 'table', label: 'Table', desc: 'Rows and columns', ic: I.table, kind: 'block', val: '| Column | Column |\n| --- | --- |\n| Cell | Cell |' }]
},
{ group: 'Embeds', items: [
  { key: 'embed', label: 'Embed link', desc: 'Any URL as a rich card', ic: I.link2, kind: 'embed', ph: 'Paste any link' },
  { key: 'youtube', label: 'YouTube', desc: 'Embed a video', ic: I.youtube, kind: 'embed', ph: 'YouTube URL' },
  { key: 'twitter', label: 'X / Twitter', desc: 'Embed a post', ic: I.x, kind: 'embed', ph: 'x.com link' },
  { key: 'instagram', label: 'Instagram', desc: 'Embed a post', ic: I.instagram, kind: 'embed', ph: 'instagram.com link' },
  { key: 'tiktok', label: 'TikTok', desc: 'Embed a video', ic: I.tiktok, kind: 'embed', ph: 'tiktok.com link' },
  { key: 'github', label: 'GitHub', desc: 'Repo or profile', ic: I.gh, kind: 'embed', ph: 'github.com link' },
  { key: 'telegram', label: 'Telegram', desc: 'Channel or chat', ic: I.telegram, kind: 'embed', ph: 't.me link' },
  { key: 'whatsapp', label: 'WhatsApp', desc: 'Chat link', ic: I.whatsapp, kind: 'embed', ph: 'wa.me link' }]
}];

const SLASH_FLAT = SLASH_GROUPS.flatMap((g) => g.items.map((it) => ({ ...it, group: g.group })));

/* ---------- markdown editor with slash menu, toolbar, image upload ---------- */
function MarkdownEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);
  const fileRef = useRef(null);
  const [slash, setSlash] = useState(null); // { start, query, x, y }
  const [active, setActive] = useState(0);
  const pendingPos = useRef(null);

  const setVal = (next, caret) => {onChange(next);if (caret != null) requestAnimationFrame(() => {const el = ref.current;if (el) {el.focus();el.selectionStart = el.selectionEnd = caret;}});};

  const wrap = (pre, post = pre) => {
    const el = ref.current;if (!el) return;
    const s = el.selectionStart,e = el.selectionEnd;
    const sel = value.slice(s, e) || 'text';
    setVal(value.slice(0, s) + pre + sel + post + value.slice(e), null);
    requestAnimationFrame(() => {el.focus();el.selectionStart = s + pre.length;el.selectionEnd = s + pre.length + sel.length;});
  };
  const line = (pre) => {const el = ref.current;if (!el) return;const s = el.selectionStart;
    const ls = value.lastIndexOf('\n', s - 1) + 1;setVal(value.slice(0, ls) + pre + value.slice(ls), s + pre.length);};
  const block = (txt) => {const cur = value.replace(/\s+$/, '');const next = (cur ? cur + '\n\n' : '') + txt + '\n\n';setVal(next, next.length);};

  /* detect "/" trigger as the user types */
  const handleChange = (e) => {
    const el = e.target;const val = el.value;onChange(val);
    const caret = el.selectionStart;
    const before = val.slice(0, caret);
    const m = before.match(/(?:^|\s)\/([\w]*)$/);
    if (m) {
      const start = caret - m[1].length - 1;
      const { x, y, lh } = caretXY(el, start);
      setSlash({ start, query: m[1], x, y: y + lh - el.scrollTop });
      setActive(0);
    } else setSlash(null);
  };

  const filtered = slash ? SLASH_FLAT.filter((it) => (it.label + ' ' + it.group).toLowerCase().includes(slash.query.toLowerCase())) : [];
  useEffect(() => {if (active >= filtered.length) setActive(0);}, [slash, filtered.length]);

  const runItem = (it) => {
    const el = ref.current;const caret = el ? el.selectionStart : value.length;
    const head = value.slice(0, slash.start);const tail = value.slice(caret);
    if (it.kind === 'line') {const next = head + it.val + tail;setVal(next, (head + it.val).length);setSlash(null);} else
    if (it.kind === 'block') {const sep1 = head && !head.endsWith('\n\n') ? head.endsWith('\n') ? '\n' : '\n\n' : '';const ins = sep1 + it.val + '\n\n';const next = head + ins + tail;setVal(next, (head + ins).length);setSlash(null);} else
    if (it.kind === 'upload') {const next = head + tail;setVal(next, head.length);pendingPos.current = head.length;setSlash(null);fileRef.current && fileRef.current.click();} else
    if (it.kind === 'embed') {
      const url = window.prompt(it.ph + ':');const next0 = head + tail;
      if (url && url.trim()) {const sep1 = head && !head.endsWith('\n\n') ? head.endsWith('\n') ? '\n' : '\n\n' : '';const ins = sep1 + url.trim() + '\n\n';const next = head + ins + tail;setVal(next, (head + ins).length);} else
      setVal(next0, head.length);
      setSlash(null);
    }
  };

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];if (!f) {return;}
    const url = URL.createObjectURL(f);
    const pos = pendingPos.current != null ? pendingPos.current : ref.current ? ref.current.selectionStart : value.length;
    const head = value.slice(0, pos),tail = value.slice(pos);
    const sep = head && !head.endsWith('\n\n') ? head.endsWith('\n') ? '\n' : '\n\n' : '';
    const ins = sep + '![image](' + url + ')\n\n';
    setVal(head + ins + tail, (head + ins).length);
    e.target.value = '';pendingPos.current = null;
  };

  const onKeyDown = (e) => {
    if (!slash || filtered.length === 0) {
      if (e.key === 'Escape') setSlash(null);
      return;
    }
    if (e.key === 'ArrowDown') {e.preventDefault();setActive((a) => (a + 1) % filtered.length);} else
    if (e.key === 'ArrowUp') {e.preventDefault();setActive((a) => (a - 1 + filtered.length) % filtered.length);} else
    if (e.key === 'Enter') {e.preventDefault();runItem(filtered[active]);} else
    if (e.key === 'Escape') {e.preventDefault();setSlash(null);}
  };

  const onPaste = (ev) => {
    const cd = ev.clipboardData || window.clipboardData;
    const item = [...(cd.items || [])].find((i) => i.type && i.type.startsWith('image/'));
    if (item) {const f = item.getAsFile();if (f) {ev.preventDefault();pendingPos.current = ref.current ? ref.current.selectionStart : value.length;onFile({ target: { files: [f], value: '' } });return;}}
    const txt = cd.getData('text');
    if (txt && URL_RE.test(txt.trim())) {ev.preventDefault();block(txt.trim());}
  };
  const onDrop = (ev) => {
    const f = ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) {ev.preventDefault();pendingPos.current = value.length;onFile({ target: { files: [f], value: '' } });}
  };

  // group filtered items for display
  const groups = [];
  filtered.forEach((it) => {let g = groups.find((x) => x.group === it.group);if (!g) {g = { group: it.group, items: [] };groups.push(g);}g.items.push(it);});
  let runningIdx = -1;

  return (
    <div className="md">
      <div className="md-toolbar">
        <button type="button" onClick={() => line('# ')} title="Big heading"><span style={{ fontWeight: 800, fontSize: 16 }}>H1</span></button>
        <button type="button" onClick={() => line('## ')} title="Heading"><span style={{ fontWeight: 700, fontSize: 13 }}>H2</span></button>
        <button type="button" onClick={() => wrap('**')} title="Bold">{I.bold()}</button>
        <button type="button" onClick={() => wrap('*')} title="Italic">{I.ital()}</button>
        <button type="button" onClick={() => line('> ')} title="Quote">{I.quote({ width: 15, height: 15 })}</button>
        <button type="button" onClick={() => line('- ')} title="List">{I.list()}</button>
        <button type="button" onClick={() => {pendingPos.current = ref.current ? ref.current.selectionStart : value.length;fileRef.current && fileRef.current.click();}} title="Upload image">{I.img({ width: 15, height: 15 })}</button>
        <button type="button" onClick={() => wrap('[', '](url)')} title="Inline link">{I.link()}</button>
        <span className="md-hint">Type <kbd>/</kbd> for commands</span>
      </div>
      <div className="md-area">
        <textarea ref={ref} value={value} onChange={handleChange} onKeyDown={onKeyDown} onPaste={onPaste} onDrop={onDrop} placeholder={placeholder || 'Write something, or press / for commands'} />
        {slash && filtered.length > 0 &&
        <div className="slash-menu" style={(() => {
          const taH = ref.current ? ref.current.clientHeight : 380;
          const menuH = 300;
          const below = slash.y + 8;
          const top = (below + menuH <= taH) ? below : Math.max(4, slash.y - menuH - 6);
          return { left: Math.min(Math.max(8, slash.x), 360), top };
        })()}>
            {groups.map((g) =>
          <div key={g.group} className="slash-group">
                <div className="slash-head">{g.group}</div>
                {g.items.map((it) => {runningIdx++;const idx = runningIdx;return (
                <button type="button" key={it.key} className={'slash-item' + (idx === active ? ' on' : '')}
                onMouseEnter={() => setActive(idx)} onMouseDown={(e) => {e.preventDefault();runItem(it);}}>
                    <span className="si-ic">{it.ic()}</span>
                    <span className="si-txt"><span className="si-label">{it.label}</span><span className="si-desc">{it.desc}</span></span>
                  </button>);
            })}
              </div>
          )}
          </div>
        }
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
    </div>);

}

/* ============================================================
   EMBEDS — paste a link, get a rich card / player
   ============================================================ */
function parseEmbed(url) {
  let u;try {u = new URL(url);} catch (e) {return null;}
  const host = u.hostname.replace(/^www\./, '');
  const path = u.pathname;
  let yt = null;
  if (host === 'youtu.be') yt = path.slice(1);else
  if (host.endsWith('youtube.com')) {
    if (path.startsWith('/watch')) yt = u.searchParams.get('v');else
    if (path.startsWith('/embed/')) yt = path.split('/')[2];else
    if (path.startsWith('/shorts/')) yt = path.split('/')[2];
  }
  if (yt) return { type: 'youtube', id: yt, url };
  if (host === 'github.com') {const seg = path.split('/').filter(Boolean);if (seg[0]) return { type: 'github', owner: seg[0], repo: seg[1], url };}
  if (host === 'x.com' || host === 'twitter.com') {const seg = path.split('/').filter(Boolean);return { type: 'x', user: seg[0], url };}
  if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) {const seg = path.split('/').filter(Boolean);return { type: 'tiktok', user: (seg[0] || '').replace('@', ''), url };}
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
        <iframe src={'https://www.youtube-nocookie.com/embed/' + e.id} title="YouTube video" frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>);

  }
  const card = (icon, brand, title, sub, cls) =>
  <a className={'embed embed-card ' + cls} href={url} target="_blank" rel="noopener">
      <span className="emb-ic">{icon}</span>
      <div className="emb-body"><span className="emb-brand">{brand}</span><span className="emb-title">{title}</span>{sub && <span className="emb-sub">{sub}</span>}</div>
      <span className="emb-ext">{I.ext()}</span>
    </a>;

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
/* rich renderer: markdown + bare-URL lines become embeds */
function renderRich(text) {
  const blocks = String(text).split(/\n{2,}/);
  return blocks.map((b, i) => {
    const t = b.trim();
    if (!t) return null;
    const img = t.match(IMG_RE);
    if (img) return <img key={i} className="post-img" src={img[2]} alt={img[1] || ''} />;
    if (t === '---' || t === '***') return <hr key={i} className="post-hr" />;
    if (t.startsWith('```')) {const code = t.replace(/^```[^\n]*\n?/, '').replace(/```$/, '');return <pre key={i} className="post-code"><code>{code}</code></pre>;}
    if (t.startsWith('|') && t.includes('\n')) {
      const rows = t.split('\n').filter((r) => r.trim());
      const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(rows[0]);const bodyRows = rows.slice(rows[1] && /^[\s|:-]+$/.test(rows[1]) ? 2 : 1);
      return <div key={i} className="post-table-wrap"><table className="post-table"><thead><tr>{head.map((h, j) => <th key={j}>{inlineMD(h)}</th>)}</tr></thead><tbody>{bodyRows.map((r, j) => <tr key={j}>{cells(r).map((c, k) => <td key={k}>{inlineMD(c)}</td>)}</tr>)}</tbody></table></div>;
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

/* render simple markdown to elements */
function renderMD(text) {
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
function inlineMD(s) {
  const parts = [];let rest = s;let key = 0;
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\))/;
  let m;
  while (m = rest.match(re)) {
    if (m.index > 0) parts.push(rest.slice(0, m.index));
    if (m[2]) parts.push(<strong key={key++}>{m[2]}</strong>);else
    if (m[3]) parts.push(<em key={key++}>{m[3]}</em>);else
    if (m[4]) parts.push(<a key={key++} href={m[5]}>{m[4]}</a>);
    rest = rest.slice(m.index + m[0].length);
  }
  if (rest) parts.push(rest);
  return parts;
}

/* ---------- wallet gate ---------- */
function WalletGate({ connected, onConnect, children, label }) {
  if (connected) return children;
  return (
    <div className="gate">
      <span className="gate-ic">{I.shield()}</span>
      <div className="gate-txt"><strong>{label || 'Sign in to take part'}</strong><span>Reading is open. Sign in with your email to post, comment, or vote.</span></div>
      <button className="pill pill-blue" onClick={onConnect}>Sign in</button>
    </div>);

}

/* ---------- navbar ---------- */
function Navbar({ route, connected, onCompose, onConnect, onWallet, onSignOut, unread = 0 }) {
  const [menu, setMenu] = useState(false);
  const [bell, setBell] = useState(false);
  const links = [
  { label: 'Forum', hash: '#/forum', match: 'forum' },
  { label: 'Events', hash: '#/events', match: 'events' },
  { label: 'Proposals', hash: '#/proposals', match: 'proposals' },
  { label: 'Ambassadors', hash: '#/ambassadors', match: 'ambassadors' },
  { label: 'Docs', hash: '#/docs', match: 'docs' }];

  const NOTIF = (window.ORBIT.NOTIFICATIONS || []).slice(0, 4);
  useEffect(() => {const close = () => {setMenu(false);setBell(false);};window.addEventListener('hashchange', close);document.addEventListener('click', close);return () => {window.removeEventListener('hashchange', close);document.removeEventListener('click', close);};}, []);
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="fbrand" href="Orbit.html" title="Back to landing">
          <svg className="logo" viewBox="0 0 256 256" fill="none" aria-hidden="true">
            <ellipse cx="128" cy="128" rx="98" ry="52" transform="rotate(-20 128 128)" stroke="currentColor" strokeWidth="15" />
            <circle cx="128" cy="128" r="33" fill="currentColor" /><circle cx="173" cy="69" r="17" fill="currentColor" />
          </svg>
          <span className="word">Orbit</span>
        </a>
        <nav className="topnav">
          {links.map((l) => <a key={l.hash} href={l.hash} className={route.view.startsWith(l.match) ? 'on' : ''}>{l.label}</a>)}
        </nav>
        <div className="topbar-right">
          <a className="nav-icon" href="#/search" title="Search" aria-label="Search">{I.search()}</a>
          {connected &&
          <div className="nav-pop-wrap" onClick={(e) => e.stopPropagation()}>
              <button className="nav-icon" title="Notifications" onClick={() => {setBell((b) => !b);setMenu(false);}}>
                {I.bell()}{unread > 0 && <span className="nav-dot"></span>}
              </button>
              {bell &&
            <div className="popover notif-pop">
                  <div className="pop-head"><strong>Notifications</strong><a href="#/profile/me/notifications">See all</a></div>
                  {NOTIF.map((n) =>
              <a key={n.id} className={'notif-item' + (n.unread ? ' unread' : '')} href={n.link}>
                      <AmbassadorAvatar user={n.who} size={32} link={false} />
                      <div><span className="ni-text"><b>{n.who}</b> {n.text}</span><span className="ni-time">{n.time} ago</span></div>
                    </a>
              )}
                </div>
            }
            </div>
          }
          <button className="pill pill-solid" onClick={onCompose}>{I.plus()} New post</button>
          {connected ?
          <div className="nav-pop-wrap" onClick={(e) => e.stopPropagation()}>
                <button className="wallet" onClick={() => {setMenu((m) => !m);setBell(false);}} title="Account">
                  <span className="nft">{I.check()} Orbit</span>
                  <span className="addr">{ME.addr}</span>
                  <AmbassadorAvatar user="you.fil" size={26} link={false} />
                </button>
                {menu &&
            <div className="popover menu-pop">
                    <div className="menu-mobile-nav">
                      {links.map((l) => <a key={l.hash} href={l.hash}>{l.label}</a>)}
                      <div className="menu-sep"></div>
                    </div>
                    <a href="#/profile/me">{I.globe()} My profile</a>
                    <a href="#/profile/me/posts">{I.doc()} My posts</a>
                    <a href="#/profile/me/notifications">{I.bell()} Notifications {unread > 0 && <span className="menu-badge">{unread}</span>}</a>
                    <a href="#/profile/me/settings">{I.edit()} Settings</a>
                    <div className="menu-sep"></div>
                    <a href="#/admin">{I.grid()} Admin panel</a>
                    <button className="menu-danger menu-btn" onClick={()=>{ if(onSignOut) onSignOut(); }}>{I.ban()} Sign out</button>
                  </div>
            }
              </div> :
          <button className="pill pill-blue" onClick={onConnect}>Sign in</button>}
        </div>
      </div>
    </header>);

}

Object.assign(window, {
  I, who, navTo, Stars, Vote, CategoryBadge, AmbassadorAvatar, PostCard, Comment,
  MarkdownEditor, renderMD, inlineMD, renderRich, Embed, parseEmbed, WalletGate, Navbar, SocialLinks, socialIcon, socialURL,
  ReactionBar, MentionInput, renderMentions
});