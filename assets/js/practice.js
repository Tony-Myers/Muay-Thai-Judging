async function loadFights(){
  const res = await fetch('data/fights.json', {cache:'no-store'});
  return await res.json();
}
function ytEmbed(id, title){
  if(!id){
    return `<div class="notice small muted"><strong>Video not yet set.</strong> Add a YouTube ID in <kbd>data/fights.json</kbd>.</div>`;
  }
  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`;
  return `<div class="video"><iframe title="${title}" src="${src}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
}
function renderFight(f){
  return `<section class="section"><div class="container"><div class="card pad">
    <div class="section-title"><h2>${f.title}</h2><span class="badge">${f.id}</span></div>
    ${ytEmbed(f.youtubeId, f.title)}
    <p class="small muted">${f.prompt || ''}</p>
    <details style="margin-top:12px"><summary class="focus-ring">Reveal official explanation</summary>
      <ol class="muted">${(f.officialSummary||[]).map(x=>`<li>${x}</li>`).join('')}</ol>
    </details>
  </div></div></section>`;
}
async function init(){
  const fights = await loadFights();
  document.querySelector('[data-fights]').innerHTML = fights.map(renderFight).join('');
}
init().catch(err=>{
  document.querySelector('[data-fights]').innerHTML = `<div class="container"><div class="card pad"><strong>Error loading fights.</strong><p class="small muted">${String(err)}</p></div></div>`;
});
