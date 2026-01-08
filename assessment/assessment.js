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
async function init(){
  const cfg = await loadConfig();
  const gate = document.querySelector('[data-gate]');
  const app = document.querySelector('[data-app]');
  const form = document.querySelector('[data-pass-form]');
  const input = document.querySelector('[data-pass]');
  const msg = document.querySelector('[data-pass-msg]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const entered = input.value || "";
    const h = await sha256hex(cfg.salt + entered);
    if(h === cfg.hash){
      gate.style.display = "none";
      app.hidden = false;
      input.value = "";
      msg.textContent = "";
      document.querySelector('[data-app]').scrollIntoView({behavior:'smooth', block:'start'});
    } else {
      msg.textContent = "Incorrect password.";
      input.select();
    }
  });

  document.querySelector('[data-note]').textContent = cfg.assessmentNote || "";
  const list = document.querySelector('[data-videos]');
  list.innerHTML = (cfg.videos || []).map(v => `
    <section class="section">
      <div class="card pad">
        <div class="section-title">
          <h2>${v.title}</h2>
          <span class="badge">${v.id}</span>
        </div>
        ${ytEmbed(v.youtubeId, v.title)}
        <p class="small muted">${v.notes || ""}</p>
      </div>
    </section>
  `).join('');

  const sub = document.querySelector('[data-submission]');
  if(cfg.submission && cfg.submission.url){
    sub.innerHTML = `<a class="tag focus-ring" href="${cfg.submission.url}">Submit assessment</a><div class="small muted">${cfg.submission.text || ""}</div>`;
  } else {
    sub.innerHTML = `<div class="notice small"><strong>Submission link not set.</strong> Edit <kbd>assessment/config.json</kbd>.</div>`;
  }
}
init().catch(err=>{
  document.querySelector('[data-videos]').innerHTML =
    `<div class="card pad"><strong>Error loading assessment.</strong><p class="small muted">${String(err)}</p></div>`;
});
