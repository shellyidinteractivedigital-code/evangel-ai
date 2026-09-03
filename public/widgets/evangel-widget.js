class EvangelWidget extends HTMLElement {
  connectedCallback(){
    const ref=this.getAttribute('ref')||'Psalm 23:1';
    const text=this.getAttribute('text')||'Yahweh is my shepherd: I shall lack nothing.';
    const target=this.getAttribute('href')||'https://evangel-ai.com/?page=study';
    this.attachShadow({mode:'open'}).innerHTML=`<style>:host{display:block;font-family:ui-sans-serif,system-ui}.card{box-sizing:border-box;min-height:180px;border-radius:24px;padding:22px;color:#f7f3e8;background:radial-gradient(circle at 82% 12%,rgba(231,189,103,.2),transparent 28%),linear-gradient(180deg,#071426,#02050b);border:1px solid rgba(231,189,103,.3);box-shadow:0 20px 50px #0006}.brand{color:#e7bd67;letter-spacing:.2em;font-size:11px}.ref{font-family:Georgia,serif;font-size:28px;margin:12px 0 8px}.text{line-height:1.55;color:#d5dde7}.actions{display:flex;gap:8px;margin-top:18px}a,button{border-radius:999px;padding:9px 13px;border:1px solid rgba(231,189,103,.3);background:#ffffff0a;color:#fff;text-decoration:none;cursor:pointer}.listen{background:linear-gradient(135deg,#dcae55,#f5db97);color:#07111e;border:0}</style><article class="card"><div class="brand">EVANGEL • VERSE OF THE DAY</div><div class="ref">${escapeHtml(ref)}</div><div class="text">${escapeHtml(text)}</div><div class="actions"><button class="listen">▶ Listen</button><a href="${target}">Open EVANGEL</a></div></article>`;
    this.shadowRoot.querySelector('.listen').addEventListener('click',()=>{if('speechSynthesis'in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(`${ref}. ${text}`));}else{location.href=target;}});
  }
}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
customElements.define('evangel-scripture-widget',EvangelWidget);