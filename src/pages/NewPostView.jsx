import { useState, useEffect } from 'react'
import { CATEGORIES, ME, cid } from '../data/constants'
import { I } from '../components/Icons'
import { WalletGate } from '../components/WalletGate'
import { MarkdownEditor, renderRich } from '../components/MarkdownEditor'
import { useLighthouse } from '../hooks/useLighthouse'
import { useT } from '../hooks/useT'

const TYPES = [ {t:'Report',cat:'reports'},{t:'Proposal',cat:'projects'},{t:'Event',cat:'events'},{t:'Feedback',cat:'feedback'},{t:'Discussion',cat:'governance'} ];

/* ============================================================
   VIEW: NEW POST (compose page)
   ============================================================ */
export function NewPostView({ connected, onConnect, onPublish, preset }) {
  const { t } = useT()
  const presetType = preset ? (TYPES.find(tp=>tp.t===preset) || TYPES[0]) : TYPES[0];
  const [type, setType] = useState(presetType);
  const [cat, setCat] = useState(presetType.cat);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCity, setEventCity] = useState('');
  const [eventCountry, setEventCountry] = useState('');
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
        eventDate: type.t === 'Event' ? eventDate : undefined,
        eventCity: type.t === 'Event' ? eventCity : undefined,
        eventCountry: type.t === 'Event' ? eventCountry : undefined,
      })
    } catch (e) {
      setPhase('edit')
      alert('Upload failed: ' + e.message)
    }
  }
  const pageTitle = preset === 'Proposal' ? t('newProposal') : preset === 'Event' ? t('newEvent') : t('newPostTitle')
  return (
    <div className="page-wrap compose">
      <a className="back-link" href="#/forum">{I.back()} {t('backToForum')}</a>
      <h1 className="page-title">{pageTitle}</h1>
      <WalletGate connected={connected} onConnect={onConnect} label={t('connectToPublish')}>
        <div className="field">
          <label>{t('typeLabel')}</label>
          <div className="type-row">{TYPES.map(tp=><button key={tp.t} className={type.t===tp.t?'on':''} onClick={()=>pickType(tp)}>{tp.t}</button>)}</div>
        </div>
        <div className="field">
          <label>{t('categoryLabel')}</label>
          <select value={cat} onChange={e=>setCat(e.target.value)}>
            {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>{t('titleLabel')}</label>
          <input type="text" placeholder={t('titlePlaceholder')} value={title} onChange={e=>setTitle(e.target.value)} />
        </div>
        <div className="field">
          <div className="body-head">
            <label style={{marginBottom:0}}>{t('bodyLabel')}</label>
            <div className="wp-tabs">
              <button type="button" className={tab==='write'?'on':''} onClick={()=>setTab('write')}>{t('writeTab')}</button>
              <button type="button" className={tab==='preview'?'on':''} onClick={()=>setTab('preview')}>{t('previewTab')}</button>
            </div>
          </div>
          {tab==='write' ? (
            <>
              <MarkdownEditor value={body} onChange={setBody} placeholder={t('bodyPlaceholder')} />
              {body.trim() && (
                <div className="live-preview-box">
                  <span className="live-preview-label">Vista previa</span>
                  <div className="prose">{renderRich(body)}</div>
                </div>
              )}
            </>
          ) : (
            <div className="prose preview-box">{body.trim() ? renderRich(body) : <p className="empty" style={{textAlign:'left'}}>{t('nothingToPreview')}</p>}</div>
          )}
        </div>
        {type.t === 'Event' && (
          <div className="field event-meta-fields">
            <div className="event-field-row">
              <div>
                <label>{t('eventDate')}</label>
                <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} />
              </div>
              <div>
                <label>{t('eventCity')}</label>
                <input type="text" placeholder={t('eventCityPlaceholder')} value={eventCity} onChange={e => setEventCity(e.target.value)} />
              </div>
              <div>
                <label>{t('eventCountry')}</label>
                <input type="text" placeholder={t('eventCountryPlaceholder')} value={eventCountry} onChange={e => setEventCountry(e.target.value)} />
              </div>
            </div>
          </div>
        )}
        <div className="field">
          <label>{t('evidenceLabel')}</label>
          <div className="ipfs-drop" onClick={() => document.getElementById('evidence-input').click()}>
            <span className="ic">{I.pin()}</span>
            <div>
              <strong>{t('dropFilesLabel')}</strong>
              <span>{fileObjects.length ? fileObjects.map(f => f.name).join(' · ') : t('dropFilesDesc')}</span>
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
          <span className="note">{I.shield()} {t('signedBy')} {ME.name} · {t('storedOnFilecoin')}</span>
          <button className="pill pill-blue" onClick={publish} style={{opacity:canPost?1:.5, padding:'11px 24px'}}>
            {phase==='pinning' ? <span className="publishing"><span className="spin"></span>{t('pinningToIpfs')}</span> : t('publishPost')}
          </button>
        </div>
      </WalletGate>
    </div>
  );
}
