export default function EvangelMark({ compact=false, className='' }) {
  return <span className={`evangel-mark ${compact?'evangel-mark-compact':''} ${className}`.trim()} aria-label="EVANGEL">
    <svg viewBox="0 0 240 96" aria-hidden="true" focusable="false">
      <defs><linearGradient id="evangelGold" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff3c7"/><stop offset=".48" stopColor="#e7bd67"/><stop offset="1" stopColor="#9b6827"/></linearGradient><radialGradient id="evangelGlow"><stop stopColor="#fff7d6" stopOpacity=".9"/><stop offset="1" stopColor="#e7bd67" stopOpacity="0"/></radialGradient></defs>
      <circle className="evangel-horizon" cx="120" cy="34" r="23" fill="url(#evangelGlow)"/>
      <path className="evangel-book" d="M18 59 Q62 40 114 59 L114 83 Q65 65 18 78 Z" fill="none" stroke="url(#evangelGold)" strokeWidth="3"/>
      <path className="evangel-book" d="M222 59 Q178 40 126 59 L126 83 Q175 65 222 78 Z" fill="none" stroke="url(#evangelGold)" strokeWidth="3"/>
      <path className="evangel-road" d="M116 82 C117 69 118 53 120 34 C122 53 123 69 124 82 Z" fill="url(#evangelGold)"/>
      <path className="evangel-road-edge" d="M77 83 Q98 71 116 60 M163 83 Q142 71 124 60" fill="none" stroke="#f7dfa3" strokeOpacity=".46"/>
    </svg>
    {!compact&&<span className="evangel-wordmark"><b>EVANGEL</b><small>Scripture • Precision • Presence</small></span>}
  </span>;
}