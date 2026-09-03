const OPTIONS = {
  speakingMinutes: [[5, '5 minutes'], [10, '10 minutes'], [20, '20 minutes'], [30, '30 minutes'], [45, '45 minutes']],
  style: [['pastoral', 'Pastoral'], ['teaching', 'Teaching'], ['evangelistic', 'Evangelistic'], ['devotional', 'Devotional'], ['story_driven', 'Story driven']],
  theologicalMode: [['text_centered', 'Text centered'], ['baptist', 'Baptist perspective'], ['pentecostal', 'Pentecostal perspective'], ['reformed', 'Reformed perspective'], ['wesleyan', 'Wesleyan perspective'], ['catholic', 'Catholic perspective'], ['orthodox', 'Orthodox perspective']],
  structure: [['three_point', 'Three point'], ['verse_by_verse', 'Verse by verse'], ['narrative', 'Narrative'], ['topical', 'Topical']],
  emotionalDirection: [['hope', 'Hope'], ['comfort', 'Comfort'], ['conviction', 'Conviction'], ['courage', 'Courage'], ['gratitude', 'Gratitude']],
  audience: [['general', 'General congregation'], ['youth', 'Youth'], ['children', 'Children'], ['leaders', 'Leaders'], ['seekers', 'Seekers']],
};

function Field({ label, name, value, onChange }) {
  return <label><span>{label}</span><select value={value} onChange={(event) => onChange(name, name === 'speakingMinutes' ? Number(event.target.value) : event.target.value)}>{OPTIONS[name].map(([id, text]) => <option key={id} value={id}>{text}</option>)}</select></label>;
}

export default function GeneratorInterview({ value, onChange, disabled }) {
  const update = (name, next) => onChange({ ...value, [name]: next });
  return <fieldset className="generator-interview glass" disabled={disabled}>
    <legend>Shape your message</legend>
    <p>Answer a few questions. You can edit every word after generation.</p>
    <div className="generator-fields">
      <Field label="Speaking length" name="speakingMinutes" value={value.speakingMinutes} onChange={update}/>
      <Field label="Style" name="style" value={value.style} onChange={update}/>
      <Field label="Theological lens" name="theologicalMode" value={value.theologicalMode} onChange={update}/>
      <Field label="Structure" name="structure" value={value.structure} onChange={update}/>
      <Field label="Emotional direction" name="emotionalDirection" value={value.emotionalDirection} onChange={update}/>
      <Field label="Audience" name="audience" value={value.audience} onChange={update}/>
    </div>
    <label><span>Theme or special direction</span><input value={value.theme || ''} onChange={(event) => update('theme', event.target.value)} placeholder="Grace, renewal, a personal story..."/></label>
  </fieldset>;
}