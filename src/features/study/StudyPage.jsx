import { useEffect, useMemo, useState } from 'react';
import { Search, Volume2 } from 'lucide-react';
import { speakText } from '../../services/speech';
import { loadScriptureSource, searchScripture, scriptureSourceNotice } from '../../services/scripture';
import { BIBLE_SOURCES } from '../../data/bibleSources';

const HIGHLIGHT_TYPES = [['Truth','#f0c55d'],['Growth','#62c986'],['Heart','#e981aa'],['Context','#71a7e8']];

export default function StudyPage({ query, onQueryChange, verses: curatedVerses = [], highlights, onHighlightsChange, notify, voiceName }) {
  const [sourceKey, setSourceKey] = useState('web');
  const [corpus, setCorpus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const source=BIBLE_SOURCES[sourceKey];

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');
    loadScriptureSource(sourceKey)
      .then((items) => { if (active) setCorpus(items); })
      .catch(() => { if (active) setLoadError(`${source?.displayName || 'This Scripture source'} could not be loaded on this device.`); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [sourceKey, source?.displayName]);

  const results = useMemo(() => {
    if (!query.trim()) {
      if (sourceKey==='web') return curatedVerses;
      return corpus.slice(0,24);
    }
    return searchScripture(corpus, query, 120);
  }, [corpus, curatedVerses, query, sourceKey]);

  const saveHighlight=(verse,label,color)=>{
    onHighlightsChange([...highlights,{...verse,label,color,sourceKey:verse.sourceKey||sourceKey}]);
    notify(`${label} highlight saved from ${source?.shortName || sourceKey}`);
  };

  return <section className="page">
    <div className="page-title"><div><p className="eyebrow">BIBLE STUDY</p><h2>Highlight with meaning.</h2><p>{scriptureSourceNotice(sourceKey)}</p></div><div className="study-controls"><label className="source-select"><span>Source</span><select value={sourceKey} onChange={e=>setSourceKey(e.target.value)}>{Object.values(BIBLE_SOURCES).map(item=><option key={item.key} value={item.key}>{item.shortName} • {item.language}</option>)}</select></label><div className="search"><Search size={18}/><input value={query} onChange={e=>onQueryChange(e.target.value)} placeholder={`Search ${source.shortName}: reference, name, or phrase...`}/></div></div></div>
    <div className="source-chip-row"><span className="source-chip">{source.displayName}</span><span className="source-chip muted">{source.category.replaceAll('_',' ')}</span><span className="source-chip muted">{source.rights}</span><a className="source-chip link" href={source.officialUrl} target="_blank" rel="noreferrer">Official source</a></div>
    {loading && <div className="empty glass">Loading {source.displayName}…</div>}
    {loadError && <div className="billing-error" role="alert">{loadError}</div>}
    {!loading && query.trim() && !results.length && <div className="empty glass">No matching verses found in {source.shortName}. Try a reference, name, or phrase.</div>}
    {!loading && !query.trim() && sourceKey!=='web' && <div className="empty glass">Showing the opening verses of {source.displayName}. Search any reference, word, or phrase to explore this source.</div>}
    <div className="study-list">{results.map((verse) => <article className="study-row glass" key={`${verse.sourceKey||sourceKey}-${verse.ref}`}><div><small className="verse-source-label">{verse.sourceName || source.displayName}</small><b>{verse.ref}</b><p>{verse.text}</p></div><div className="highlight-row">{HIGHLIGHT_TYPES.map(([label,color]) => <button key={label} style={{'--accent':color}} onClick={() => saveHighlight(verse,label,color)}>{label}</button>)}<button className="speak-icon" onClick={()=>speakText({ text: `${verse.ref}. ${verse.text}`, voiceName })}><Volume2 size={18}/></button></div></article>)}</div>
  </section>;
}