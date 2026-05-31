import { useState, useEffect } from 'react'
import { CATEGORIES, ME, cid } from '../data/constants'
import { I } from '../components/Icons'
import { WalletGate } from '../components/WalletGate'
import { MarkdownEditor, renderRich } from '../components/MarkdownEditor'
import { useLighthouse } from '../hooks/useLighthouse'

const TYPES = [ {t:'Report',cat:'reports'},{t:'Proposal',cat:'projects'},{t:'Event',cat:'events'},{t:'Feedback',cat:'feedback'},{t:'Discussion',cat:'governance'} ];

/* ============================================================
   VIEW: NEW POST (compose page)
   ============================================================ */
export function NewPostView({ connected, onConnect, onPublish, preset }) {
  const presetType = preset ? (TYPES.find(t=>t.t===preset) || TYPES[0]) : TYPES[0];
  const [type, setType] = useState(presetType);
  const [cat, setCat] = useState(presetType.cat);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [files, setFiles] = useState([]);
  const [phase, setPhase] = useState('edit');
  const { uploadFiles } = useLighthouse()
  const [fileObjects, setFileObjects] = useState([]) // actual File objects
  const [tab, setTab] = useState('write');
  useEffect(()=>{ window.scrollTo(0,0); }, []);
  const canPost = title.trim() && body.trim();
  const pickType = (t) => { setType(t); setCat(t.cat); };
  const publish = async () => {
    if (!canPost || phase === 'pinning') return
    setPhase('pinning')
    try {
      let evidence = []
      let cidStr = undefined
      if (fileObjects.length > 0) {
        const hash = await uploadFiles(fileObjects)
        cidStr = hash
        evidence = fileObjects.map(f => ({ name: f.name, size: hash }))
      }
      onPublish({
        type: type.t, cat, title: title.trim(),
        body: body.trim().split(/\n{2,}/).filter(Boolean),
        evidence,
        cidStr,
      })
    } catch (e) {
      setPhase('edit')
      alert('Upload failed: ' + e.message)
    }
  }
  return (
    <div className="page-wrap compose">
      <a className="back-link" href="#/forum">{I.back()} Back to forum</a>
      <h1 className="page-title">{preset==='Proposal'?'New proposal':preset==='Event'?'New event':'New post'}</h1>
      <WalletGate connected={connected} onConnect={onConnect} label="Connect your wallet to publish">
        <div className="field">
          <label>Type</label>
          <div className="type-row">{TYPES.map(t=><button key={t.t} className={type.t===t.t?'on':''} onClick={()=>pickType(t)}>{t.t}</button>)}</div>
        </div>
        <div className="field">
          <label>Category</label>
          <select value={cat} onChange={e=>setCat(e.target.value)}>
            {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Title</label>
          <input type="text" placeholder="A clear, specific headline" value={title} onChange={e=>setTitle(e.target.value)} />
        </div>
        <div className="field">
          <div className="body-head">
            <label style={{marginBottom:0}}>Body</label>
            <div className="wp-tabs">
              <button type="button" className={tab==='write'?'on':''} onClick={()=>setTab('write')}>Write</button>
              <button type="button" className={tab==='preview'?'on':''} onClick={()=>setTab('preview')}>Preview</button>
            </div>
          </div>
          {tab==='write'
            ? <MarkdownEditor value={body} onChange={setBody} placeholder="Write your post. Use big headings, paste a YouTube / GitHub / WhatsApp / X link to embed it, and separate paragraphs with a blank line." />
            : <div className="prose preview-box">{body.trim() ? renderRich(body) : <p className="empty" style={{textAlign:'left'}}>Nothing to preview yet — write something first.</p>}</div>}
        </div>
        <div className="field">
          <label>Evidence — pinned to IPFS via Lighthouse</label>
          <div className="ipfs-drop" onClick={() => document.getElementById('evidence-input').click()}>
            <span className="ic">{I.pin()}</span>
            <div>
              <strong>Drop files to pin</strong>
              <span>{fileObjects.length ? fileObjects.map(f => f.name).join(' · ') : 'Images, PDFs, datasets — persisted on Filecoin'}</span>
            </div>
          </div>
          <input
            id="evidence-input"
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={e => setFileObjects(Array.from(e.target.files))}
          />
        </div>
        <div className="compose-foot">
          <span className="note">{I.shield()} Signed by {ME.name} · stored on Filecoin</span>
          <button className="pill pill-blue" onClick={publish} style={{opacity:canPost?1:.5, padding:'11px 24px'}}>
            {phase==='pinning' ? <span className="publishing"><span className="spin"></span>Pinning to IPFS…</span> : 'Publish post'}
          </button>
        </div>
      </WalletGate>
    </div>
  );
}
