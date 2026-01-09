async function loadConfig(){
  const res = await fetch('config.json', {cache:'no-store'});
  return await res.json();
}
async function sha256hex(text){
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}
function ytEmbed(id, title){
  if(!id){
    return `<div class="notice small muted"><strong>Video not yet set.</strong> Add a YouTube ID in <kbd>assessment/config.json</kbd>.</div>`;
  }
  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`;
  return `<div class="video"><iframe title="${title}" src="${src}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
}
function renderFight(f){
  return `
    <div class="card pad" style="margin-top:14px">
      <div class="section-title">
        <h3 style="margin:0">${f.title}</h3>
        <span class="badge">${f.id}</span>
      </div>
      ${ytEmbed(f.youtubeId, f.title)}
      ${f.notes ? `<p class="small muted">${f.notes}</p>` : ``}
    </div>
  `;
}
function renderLevel(level){
  return `
    <section class="section">
      <div class="container">
        <div class="card pad">
          <div class="section-title">
            <h2 style="margin:0">${level.title}</h2>
            <span class="badge">${(level.fights||[]).length} fights</span>
          </div>
          ${level.description ? `<p class="muted">${level.description}</p>` : ``}
          ${(level.fights||[]).map(renderFight).join('')}
        </div>
      </div>
    </section>
  `;
}

async function init(){
  const cfg = await loadConfig();

  const gate = document.querySelector('[data-gate]');
  const app = document.querySelector('[data-app]');
  const form = document.querySelector('[data-pass-form]');
  const input = document.querySelector('[data-pass]');
  const msg = document.querySelector('[data-pass-msg]');

  // Title + note
  const titleEl = document.querySelector('[data-assessment-title]');
  if(titleEl && cfg.assessmentTitle) titleEl.textContent = cfg.assessmentTitle;
  const noteEl = document.querySelector('[data-note]');
  if(noteEl) noteEl.textContent = cfg.assessmentNote || "";

  // Submission block (button + QR)
  const sub = document.querySelector('[data-submission]');
  if(cfg.submission && cfg.submission.url){
    sub.innerHTML = `
      <div class="grid-2" style="align-items:center">
        <div>
          <a class="tag focus-ring" href="${cfg.submission.url}" target="_blank" rel="noopener">Open submission form</a>
          <div class="small muted" style="margin-top:6px">${cfg.submission.text || ""}</div>
        </div>
        <div>
          ${cfg.qrCode && cfg.qrCode.image ? `
            <img src="${cfg.qrCode.image}" alt="${(cfg.qrCode.alt || 'QR code').replace(/"/g,'&quot;')}"
              style="max-width:280px;border-radius:16px;border:1px solid rgba(255,255,255,.10)"/>
          ` : ``}
        </div>
      </div>
    `;
  } else {
    sub.innerHTML = `<div class="notice small"><strong>Submission link not set.</strong> Edit <kbd>assessment/config.json</kbd>.</div>`;
  }

  // Gate behaviour
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const entered = input.value || "";
    const h = await sha256hex((cfg.salt || "") + entered);
    if(h === cfg.hash){
      gate.style.display = "none";
      app.hidden = false;
      input.value = "";
      msg.textContent = "";
      app.scrollIntoView({behavior:'smooth', block:'start'});
    } else {
      msg.textContent = "Incorrect password.";
      input.select();
    }
  });

  // Videos (levels preferred)
  const holder = document.querySelector('[data-videos]');
  if(cfg.levels && Array.isArray(cfg.levels)){
    holder.innerHTML = cfg.levels.map(renderLevel).join('');
  } else if(cfg.videos && Array.isArray(cfg.videos)){
    holder.innerHTML = `
      <section class="section"><div class="container">
        <div class="card pad">
          ${cfg.videos.map(renderFight).join('')}
        </div>
      </div></section>
    `;
  } else {
    holder.innerHTML = `<div class="container"><div class="card pad"><strong>No videos configured.</strong></div></div>`;
  }
}

init().catch(err=>{
  const holder = document.querySelector('[data-videos]');
  if(holder){
    holder.innerHTML = `<div class="container"><div class="card pad"><strong>Error loading assessment.</strong><p class="small muted">${String(err)}</p></div></div>`;
  }
});
